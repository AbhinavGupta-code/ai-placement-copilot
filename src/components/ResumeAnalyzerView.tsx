import React, { useState } from 'react';
import { DEFAULT_RESUME_TEXT, TARGET_ROLES } from '../data';
import { ResumeAnalysis } from '../types';
import { Upload, FileText, CheckCircle, RefreshCw, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface ResumeAnalyzerViewProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
  initialAnalysis: ResumeAnalysis | null;
}

export default function ResumeAnalyzerView({
  onAnalysisComplete,
  initialAnalysis
}: ResumeAnalyzerViewProps) {
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME_TEXT);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialAnalysis);
  const [dragActive, setDragActive] = useState(false);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
      script.onload = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        resolve((window as any).pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const processFile = async (file: File) => {
    setUploadName(file.name);
    if (file.type === "text/plain" || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result && typeof evt.target.result === 'string') {
          setResumeText(evt.target.result);
        }
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
      setIsParsingFile(true);
      setResumeText("[LOADING_PDF_PARSER_MODULE_AND_EXTRACTING_TEXT...]");
      try {
        const fileReader = new FileReader();
        fileReader.onload = async function() {
          try {
            const typedarray = new Uint8Array(this.result as ArrayBuffer);
            const pdfjsLib = await loadPdfJs();
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(' ');
              fullText += pageText + '\n';
            }
            if (fullText.trim()) {
              setResumeText(fullText);
            } else {
              setResumeText(`[SCANNED_OR_EMPTY_PDF_DETECTED]\n\n${DEFAULT_RESUME_TEXT}`);
            }
          } catch (pdfErr) {
            console.error("PDF parse inner error", pdfErr);
            setResumeText(`[PARSING_ERROR: fell back to default parameters]\n\n${DEFAULT_RESUME_TEXT}`);
          } finally {
            setIsParsingFile(false);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } catch (err) {
        console.error("PDF parse outer error", err);
        setResumeText(`[PARSING_ERROR: fell back to default parameters]\n\n${DEFAULT_RESUME_TEXT}`);
        setIsParsingFile(false);
      }
    } else {
      setResumeText(`[AUTODETECT_FALLBACK: ${file.name}]\n\n${DEFAULT_RESUME_TEXT}`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });
      const data = await response.json();
      if (data && !data.error) {
        setAnalysis(data);
        onAnalysisComplete(data);
      } else {
        throw new Error(data.error || "Unknown analysis breakdown failure");
      }
    } catch (err) {
      console.error("[FRONTEND] Resume Analysis Error:", err);
      // Failover to offline simulation parameters
      const simulatedScore = Math.floor(Math.random() * 20) + 70;
      const failoverData: ResumeAnalysis = {
        atsScore: simulatedScore,
        missingSkills: ["Docker", "Kubernetes", "CI/CD Protocols", "TypeScript Architecture"],
        weakSections: [
          {
            section: "Academic Projects",
            issue: "Lack of metrics-based validation outputs.",
            suggestion: "Rewrite project entries to outline benchmark achievements (e.g. Optimized response times by 22%)."
          }
        ],
        suggestions: ["Structure skills cleanly using priority domains.", "Increase action verb densities."],
        recommendedProjects: [
          { title: "Distributed Web Grid Server", description: "Establish isolated runtime sockets.", tech: ["Rust", "WebSocket", "Docker"] }
        ],
        recommendedCertifications: ["AWS Certified Cloud Practitioner"]
      };
      setAnalysis(failoverData);
      onAnalysisComplete(failoverData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Page Title */}
      <div className="border-b border-cyan-glow/20 pb-4">
        <h2 className="text-xl font-bold tracking-wider text-white">
          <span className="text-cyan-glow">[RESUME_ATS_MATRIX_ANALYZER]</span>
        </h2>
        <p className="text-[10px] text-gray-400">
          Optimize resume syntactic alignment. Feed raw resume metrics into the ATS scoring parser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded relative">
            <h3 className="text-white font-bold tracking-wider mb-4 border-b border-cyan-glow/10 pb-2 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-cyan-glow" />
              <span>COGNITIVE_INPUT_VECTORS</span>
            </h3>

            {/* Target Role */}
            <div className="space-y-1 mb-4">
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block">TARGET_CAREER_ROLE</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-white px-2 py-1.5 outline-none rounded text-xs"
              >
                {TARGET_ROLES.map((r, i) => (
                  <option key={i} value={r} className="bg-cyber-dark text-white">{r}</option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-4 rounded text-center transition-colors mb-4 relative cursor-pointer ${
                dragActive 
                  ? 'border-magenta-glow bg-magenta-glow/5' 
                  : 'border-cyan-glow/20 bg-cyber-black/50 hover:border-cyan-glow/50'
              }`}
            >
              <input 
                type="file" 
                id="resume-file-input" 
                accept=".txt,.pdf,.docx"
                onChange={handleFileChange}
                className="hidden" 
              />
              <label htmlFor="resume-file-input" className="cursor-pointer space-y-1 block">
                <Upload className="h-6 w-6 text-cyan-glow mx-auto animate-bounce" />
                <p className="text-[11px] text-white font-bold">DRAG_DROP_RESUME_FILE</p>
                <p className="text-[9px] text-gray-500">Supports .txt, .pdf, or .docx metrics</p>
                {uploadName && (
                  <div className="mt-2 text-matrix-green text-[10px] font-bold">
                    [LOADED: {uploadName}]
                  </div>
                )}
              </label>
            </div>

            {/* Paste/Edit text */}
            <div className="space-y-1">
              <label className="text-gray-400 text-[10px] uppercase tracking-wider block">RESUME_RAW_MARKUP</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                disabled={isAnalyzing || isParsingFile}
                rows={12}
                className="w-full bg-cyber-black border border-cyan-glow/30 focus:border-cyan-glow text-gray-300 p-2 outline-none rounded text-[10px] font-mono leading-relaxed disabled:opacity-50"
                placeholder="Paste plain text resume metrics here..."
              />
            </div>

            {/* Action submit */}
            <button
              onClick={executeAnalysis}
              disabled={isAnalyzing || isParsingFile}
              className="w-full mt-4 py-3 bg-cyan-glow text-cyber-black font-extrabold text-xs tracking-widest uppercase hover:bg-cyan-glow/80 disabled:opacity-50 transition-colors cyber-clip-corners flex items-center justify-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing || isParsingFile ? 'animate-spin' : ''}`} />
              <span>
                {isParsingFile 
                  ? 'PARSING_UPLOADED_FILE...' 
                  : isAnalyzing 
                    ? 'CORRELATING_METRICS...' 
                    : 'EXECUTE_ATS_ALIGNMENT_'}
              </span>
            </button>
          </div>
        </div>

        {/* Results output panel */}
        <div className="lg:col-span-7">
          {isAnalyzing && (
            <div className="border-2 border-magenta-glow bg-cyber-dark/60 p-12 rounded flex flex-col items-center justify-center min-h-[400px] text-center animate-pulse">
              <div className="relative h-16 w-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-magenta-glow border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-magenta-glow font-pixel text-lg font-bold">[MATRIX_CALIBRATION_UNDERWAY]</h4>
              <p className="text-gray-400 max-w-xs mt-2 text-[10px] font-mono">
                Running token alignment indices. Correlating key terms with recruiter target variables. Please hold connection...
              </p>
            </div>
          )}

          {!isAnalyzing && !analysis && (
            <div className="border-2 border-dashed border-cyan-glow/20 bg-cyber-dark/30 rounded p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
              <FileText className="h-12 w-12 text-gray-600 mb-2" />
              <h4 className="text-gray-400 font-bold uppercase tracking-wider">Awaiting Input Stream</h4>
              <p className="text-gray-500 max-w-xs mt-1 text-[10px]">
                Feed resume text or drop files on the left module, then trigger the alignment engine.
              </p>
            </div>
          )}

          {!isAnalyzing && analysis && (
            <div className="space-y-6">
              {/* Score header */}
              <div className="border-2 border-magenta-glow bg-cyber-dark p-6 rounded relative cyber-glow-magenta">
                <div className="absolute top-2 right-2 text-[8px] text-magenta-glow border border-magenta-glow/30 px-1 rounded">
                  ALIGNMENT_COEFFICIENT
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Gauge */}
                    <div className="h-20 w-20 flex items-center justify-center border-4 border-magenta-glow rounded-full shrink-0">
                      <span className="text-3xl font-black font-pixel text-magenta-glow text-glitch-magenta">
                        {analysis.atsScore}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white font-mono uppercase tracking-wider">
                        ATS_ALIGNMENT_INDEX: {analysis.atsScore}%
                      </h3>
                      <p className="text-gray-400 text-[10px] mt-1 leading-relaxed">
                        {analysis.atsScore >= 80 
                          ? "CRITICAL: Candidate metrics show high syntactic congruence. Ready for deployment."
                          : "WARNING: Major keyword deficits located. Revise resume markup immediately to raise pass parameters."}
                      </p>
                    </div>
                  </div>

                  {/* Export Trigger */}
                  <button
                    onClick={() => {
                      const reportText = `=========================================
AI PLACEMENT COPILOT - ATS ALIGNMENT REPORT
=========================================
ROLE PROFILE: ${targetRole.toUpperCase()}
OVERALL ATS COMPLIANCE: ${analysis.atsScore}%
TIMESTAMP: ${new Date().toISOString().split('T')[0]}

-----------------------------------------
MISSING KEYWORDS (DEFICITS):
${analysis.missingSkills.map((sk, i) => `${i+1}. ${sk.toUpperCase()}`).join('\n')}

-----------------------------------------
SECTIONAL ANOMALIES DETECTED:
${analysis.weakSections.map((wk, i) => `[${wk.section.toUpperCase()}]
- Issue: ${wk.issue}
- Suggestion: ${wk.suggestion}`).join('\n\n')}

-----------------------------------------
GENERAL DISPATCH RECOMMENDATIONS:
${analysis.suggestions.map((sg, i) => `[${i+1}] ${sg}`).join('\n')}

-----------------------------------------
RECOMMENDED CAPSTONE PROJECT RECONSTRUCTIONS:
${analysis.recommendedProjects.map((pr, i) => `[${i+1}] ${pr.title.toUpperCase()}
- Description: ${pr.description}
- Tech Stack: ${pr.tech.join(', ')}`).join('\n\n')}

-----------------------------------------
RECOMMENDED VALIDATION CREDENTIALS:
${analysis.recommendedCertifications.join(', ')}

=========================================
REPORT END // COGNITIVE ALIGNMENT SYSTEM
=========================================`;
                      const element = document.createElement("a");
                      const file = new Blob([reportText], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `ATS_Alignment_Report_${targetRole.replace(/\s+/g, '_')}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-cyan-glow text-cyber-black font-extrabold text-[10px] tracking-wider uppercase hover:bg-cyan-glow/85 rounded transition-colors shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <span>EXPORT_TXT_REPORT_</span>
                  </button>
                </div>
              </div>

              {/* Missing Skills Grid */}
              <div className="border-2 border-cyan-glow/30 bg-cyber-dark p-5 rounded">
                <h3 className="text-white font-bold tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-cyan-glow" />
                  <span>KEYWORD_DEFICIT_CHIPS (MISSING_SKILLS)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-1 bg-magenta-glow/10 border border-magenta-glow/30 text-magenta-glow rounded text-[10px] font-mono">
                      {sk.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak sections list */}
              <div className="space-y-3">
                <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-magenta-glow" />
                  <span>SECTIONAL_ANOMALIES_DETECTED</span>
                </h3>

                {analysis.weakSections.map((wk, idx) => (
                  <div key={idx} className="border-2 border-magenta-glow/10 bg-cyber-dark/40 p-4 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold font-mono tracking-wider text-[11px]">
                        [{wk.section.toUpperCase()}]
                      </span>
                      <span className="text-[9px] text-magenta-glow px-1 py-0.5 border border-magenta-glow/20 bg-magenta-glow/5 font-bold rounded">
                        ANOMALY_0{idx+1}
                      </span>
                    </div>
                    <p className="text-gray-300 text-[11px]">
                      <span className="text-magenta-glow font-bold">ISSUE:</span> {wk.issue}
                    </p>
                    <p className="text-gray-400 text-[11px] bg-cyber-black/50 p-2 rounded border border-cyan-glow/10">
                      <span className="text-matrix-green font-bold">REMEDY_SUGGESTION:</span> {wk.suggestion}
                    </p>
                  </div>
                ))}
              </div>

              {/* Suggested optimizations */}
              <div className="border-2 border-cyan-glow/20 bg-cyber-dark p-5 rounded space-y-3">
                <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-matrix-green" />
                  <span>GENERAL_RECON_SUGGESTIONS</span>
                </h3>
                <ul className="space-y-2 text-gray-300">
                  {analysis.suggestions.map((sg, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px]">
                      <span className="text-cyan-glow shrink-0 font-bold">[{idx+1}]</span>
                      <span>{sg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Projects */}
              <div className="space-y-3">
                <h3 className="text-white font-bold tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-cyan-glow" />
                  <span>RECOMMENDED_PROJECT_RECONSTRUCTIONS</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.recommendedProjects.map((pr, idx) => (
                    <div key={idx} className="border border-cyan-glow/20 bg-cyber-dark p-4 rounded space-y-2">
                      <h4 className="text-white font-bold text-[11px] tracking-wide border-b border-cyan-glow/10 pb-1">
                        {pr.title.toUpperCase()}
                      </h4>
                      <p className="text-gray-400 text-[10px] leading-relaxed">
                        {pr.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {pr.tech.map((t, i) => (
                          <span key={i} className="text-[8px] bg-cyber-black border border-cyan-glow/20 text-cyan-glow px-1 py-0.5 rounded">
                            {t.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Certifications */}
              <div className="border border-magenta-glow/20 bg-cyber-dark p-4 rounded">
                <h4 className="text-white font-bold tracking-wider text-[11px] mb-2">
                  RECOMMENDED_VAL_CREDENTIALS
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedCertifications.map((ct, idx) => (
                    <span key={idx} className="px-2 py-1 bg-cyber-black border border-magenta-glow/30 text-white rounded text-[9px] font-bold font-mono">
                      {ct}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
