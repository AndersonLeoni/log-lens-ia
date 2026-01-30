import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, Upload, CheckCircle, ShieldCheck, Zap, BarChart3, Globe, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeLog } from './services/gemini';

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setFileContent(event.target.result);
    reader.readAsText(file);
  };

  const run = async () => {
    if (!fileContent) return;
    setLoading(true);
    const res = await analyzeLog(fileContent);
    setAnalysis(res);
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4">
      {/* Container Principal Centralizado */}
      <div className="w-full max-w-6xl relative z-10">
        
        {/* Header Corporativo */}
        <header className="text-center mb-16 space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-2 mb-4">
            <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-blue-500/20 uppercase">
              CVC Corp Intelligence Unit
            </span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
            LOGLENS <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">PRO</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Sistema de Auditoria e Diagnóstico de Logs B2B. <br/>
            <span className="text-slate-600">Eficiência operacional através de IA Generativa.</span>
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Coluna de Ação (Esquerda) */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 flex">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] shadow-2xl w-full flex flex-col">
              <h3 className="text-white font-bold flex items-center gap-2 mb-8">
                <Zap size={18} className="text-blue-500" /> Data Stream
              </h3>

              <div className="group relative border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer flex-grow">
                <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="bg-slate-800 p-5 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-slate-400 group-hover:text-blue-400" />
                </div>
                <p className="text-sm font-bold text-slate-300 text-center truncate w-full px-2">
                  {fileName || "Carregar Log"}
                </p>
              </div>

              <button 
                onClick={run}
                disabled={loading || !fileContent}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-20 py-5 rounded-2xl text-white font-black text-sm tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-blue-500/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BarChart3 size={18} />}
                {loading ? "PROCESSING..." : "GERAR RELATÓRIO"}
              </button>
            </div>
          </motion.div>

          {/* Coluna de Resultados (Direita) */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 flex">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div key="report" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[40px] shadow-3xl overflow-hidden w-full flex flex-col">
                  <div className="bg-slate-50 px-10 py-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-xl">
                        <ShieldCheck className="text-white" size={20} />
                      </div>
                      <h2 className="text-slate-900 font-black text-xl tracking-tighter">EXECUTIVE ANALYSIS</h2>
                    </div>
                  </div>
                  <div className="p-12 overflow-y-auto max-h-[600px] text-slate-800">
                    <article className="prose prose-slate max-w-none 
                      prose-headings:text-slate-900 prose-headings:font-black
                      prose-strong:text-blue-700 prose-strong:font-bold
                      prose-table:border prose-table:rounded-xl prose-th:bg-slate-50">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </article>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full border-2 border-dashed border-slate-800/40 rounded-[40px] flex flex-col items-center justify-center text-slate-700 text-center p-12">
                  <Globe size={80} className="mb-6 opacity-5" />
                  <p className="text-lg font-bold">Aguardando entrada de dados...</p>
                  <p className="text-xs uppercase tracking-widest mt-2 opacity-50">Global Support Unit - CVCCorp</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="mt-20 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.5em]">
          Analista Lead: Anderson Leoni • &copy; 2026 CVCCORP
        </footer>
      </div>
    </div>
  );
}

export default App;