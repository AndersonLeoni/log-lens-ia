import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, Upload, CheckCircle, FileText, 
  Loader2, ShieldCheck, Zap, BarChart3, Settings, X 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeLog } from './services/gemini';

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Estados do Vault (Segurança)
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('loglens_key') || "");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setFileContent(event.target.result);
    reader.readAsText(file);
    setAnalysis(""); 
  };

  const saveKey = () => {
    localStorage.setItem('loglens_key', tempKey);
    setShowSettings(false);
    // Pequeno feedback visual antes de recarregar se necessário
    alert("Chave de segurança salva com sucesso no navegador.");
  };

  const run = async () => {
    if (!fileContent) return;
    setLoading(true);
    try {
      const res = await analyzeLog(fileContent);
      setAnalysis(res);
    } catch (error) {
      setAnalysis(`### ❌ Erro de Configuração\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Layout Centralizado Absoluto
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      
      {/* Background Decorativo (Glow) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Header Profissional */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/5 pb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-2xl">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-white">
                LOGLENS <span className="text-blue-500">PRO</span>
              </h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                CVCCorp Intelligence Unit
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right pr-4 border-r border-slate-800">
              <p className="text-[10px] text-slate-500 font-bold uppercase">System Engine</p>
              <p className="text-xs font-mono text-emerald-400">Gemini 2.5 Flash Active</p>
            </div>
            {/* Botão da Engrenagem (Vault) */}
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-slate-900/50 p-3 rounded-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-xl"
              title="Configurar Chave API"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Painel de Comando (Esquerda) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] shadow-2xl flex-grow flex flex-col">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Zap size={16} className="text-blue-500" /> Data Source
              </h3>
              
              <div className="group relative border-2 border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer flex-grow mb-8 text-center">
                <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="bg-slate-800 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-xl">
                  <Upload className="text-slate-400 group-hover:text-blue-400" />
                </div>
                <p className="text-sm font-bold text-slate-300">
                  {fileName ? fileName : "Upload Log Data"}
                </p>
                <p className="text-[10px] text-slate-600 mt-2 uppercase">XML / JSON suportados</p>
              </div>
              
              <button 
                onClick={run} 
                disabled={loading || !fileContent} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-20 py-5 rounded-2xl text-white font-black text-xs tracking-[0.2em] shadow-2xl shadow-blue-900/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BarChart3 size={18} />}
                {loading ? "ANALYST IS THINKING..." : "EXECUTE ANALYTICS"}
              </button>
            </div>
          </motion.div>

          {/* Relatório Executivo (Direita) */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] shadow-3xl overflow-hidden min-h-[600px] flex flex-col">
                  <div className="bg-slate-50 px-10 py-6 border-b border-slate-200 flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                      <CheckCircle className="text-white" size={18} />
                    </div>
                    <h2 className="text-slate-900 font-black text-lg uppercase tracking-tighter">Executive Analysis Report</h2>
                  </div>
                  <div className="p-10 md:p-14 overflow-y-auto max-h-[700px]">
                    <article className="prose prose-slate max-w-none 
                      prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter
                      prose-strong:text-blue-700 prose-strong:font-bold
                      prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4 prose-td:text-sm">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </article>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] border-2 border-dashed border-slate-800/50 rounded-[40px] flex flex-col items-center justify-center text-slate-700 p-12 text-center">
                  <FileSearch size={100} className="mb-6 opacity-5" />
                  <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Ready for stream</h3>
                  <p className="max-w-xs mt-4 text-sm font-medium">Insira um log da API B2B para iniciar o diagnóstico automatizado de alta precisão.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
          Analista Lead: Anderson Leoni • &copy; 2026 CVCCORP Global Analytics
        </footer>
      </div>

      {/* Modal de Configurações (Vault) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-3xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-white font-black text-2xl tracking-tighter uppercase">API Vault</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Para sua segurança, a chave de API é salva localmente no navegador e nunca é enviada ao repositório público do GitHub.
              </p>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 ml-1">Gemini API Key</label>
              <input 
                type="password" 
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste your key here..."
                className="w-full bg-slate-800 border border-slate-700 p-5 rounded-2xl mb-8 text-white focus:border-blue-500 outline-none font-mono text-sm transition-all"
              />
              <button 
                onClick={saveKey}
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
              >
                SAVE CREDENTIALS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;