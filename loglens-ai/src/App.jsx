import React, { useState, useRef } from 'react'; // useRef adicionado
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, Upload, CheckCircle, FileText, Loader2, 
  ShieldCheck, Zap, BarChart3, Settings, X, Copy, Layout, PenTool, ImagePlus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeLog } from './services/gemini';

function App() {
  // --- ESTADOS GERAIS ---
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('loglens_key') || "");
  
  // --- ESTADOS ANALYTICS ---
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  // --- ESTADOS JIRA COMPOSER ---
  const [jiraInput, setJiraInput] = useState("");
  // Referência para saber onde o cursor está na área de texto
  const textareaRef = useRef(null); 

  // --- FUNÇÕES AUXILIARES ---
  const copyToClipboard = (text, type = "análise") => {
    navigator.clipboard.writeText(text);
    alert(`${type.toUpperCase()} copiada para a área de transferência!`);
  };

  // --- FUNÇÃO MÁGICA: COLAR IMAGEM ---
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        e.preventDefault(); // Impede de colar o nome do arquivo
        const blob = item.getAsFile();
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // Pega a imagem convertida em texto Base64
          const base64Image = event.target.result;
          // Monta o markdown da imagem
          const imageMarkdown = `\n![Print de Evidência](${base64Image})\n`;
          
          // Insere exatamente onde o cursor está
          const textarea = textareaRef.current;
          const startPos = textarea.selectionStart;
          const endPos = textarea.selectionEnd;
          
          const newText = 
            jiraInput.substring(0, startPos) + 
            imageMarkdown + 
            jiraInput.substring(endPos);
            
          setJiraInput(newText);
        };
        reader.readAsDataURL(blob); // Inicia a conversão
      }
    }
  };

  const run = async () => {
    if (!fileContent) return;
    setLoading(true);
    try {
      const res = await analyzeLog(fileContent);
      setAnalysis(res);
    } catch (error) {
      setAnalysis(`### ❌ Erro\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center p-6 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Header Profissional */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/40">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">LOGLENS PRO</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">APOIO B2B CVCCORP Intelligence</p>
            </div>
          </div>

          {/* Navegação por Abas */}
          <nav className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <Layout size={14} /> AI ANALYTICS
            </button>
            <button onClick={() => setActiveTab('jira')} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'jira' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              <PenTool size={14} /> JIRA COMPOSER
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500 hover:text-white transition-colors ml-2 border-l border-slate-800"><Settings size={18} /></button>
          </nav>
        </header>

        <main>
          {/* ABA 1: ANALYTICS (MANTIDA IGUAL) */}
          {activeTab === 'analytics' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
             <section className="lg:col-span-4 bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] shadow-2xl">
               <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Upload size={14}/> Input</h3>
               <div className="relative border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all cursor-pointer mb-6">
                 <input type="file" onChange={(e) => {
                   const file = e.target.files[0];
                   setFileName(file?.name || "");
                   const reader = new FileReader();
                   reader.onload = (ev) => setFileContent(ev.target.result);
                   reader.readAsText(file);
                 }} className="absolute inset-0 opacity-0 cursor-pointer" />
                 <FileText className="mx-auto text-slate-600 mb-3" />
                 <p className="text-xs font-bold text-slate-400">{fileName || "Anexar Log"}</p>
               </div>
               <button onClick={run} disabled={loading || !fileContent} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 py-4 rounded-xl text-white font-black text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                 {loading ? <Loader2 className="animate-spin" /> : <Zap size={16} />} RUN DIAGNOSTICS
               </button>
             </section>

             <section className="lg:col-span-8">
               {analysis ? (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[32px] shadow-3xl overflow-hidden min-h-[500px] flex flex-col">
                   <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                     <span className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2"><CheckCircle className="text-blue-600" size={16}/> Report Ready</span>
                     <button onClick={() => copyToClipboard(analysis)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-all">
                       <Copy size={14} /> COPIAR RELATÓRIO
                     </button>
                   </div>
                   <div className="p-10 text-slate-800 prose prose-slate max-w-none prose-table:border prose-th:bg-slate-50">
                     <ReactMarkdown>{analysis}</ReactMarkdown>
                   </div>
                 </motion.div>
               ) : (
                 <div className="h-[500px] border-2 border-dashed border-slate-800/30 rounded-[32px] flex flex-col items-center justify-center text-slate-600">
                   <FileSearch size={60} className="mb-4 opacity-10" />
                   <p className="text-sm font-bold opacity-30 uppercase tracking-[0.3em]">Aguardando Fluxo de Dados</p>
                 </div>
               )}
             </section>
           </div>
          )}

          {/* ABA 2: JIRA COMPOSER (COM SUPORTE A IMAGEM) */}
          {activeTab === 'jira' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[650px]">
              {/* Lado Esquerdo: Editor */}
              <div className="flex flex-col bg-slate-900/40 border border-white/5 rounded-[32px] p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <PenTool size={14} /> Editor Técnico
                  </h3>
                  <div className="flex gap-2 items-center">
                    {/* Dica visual para o usuário */}
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mr-2 bg-slate-800/50 px-2 py-1 rounded">
                      <ImagePlus size={10} /> CTRL+V para Prints
                    </span>
                    <button onClick={() => setJiraInput(jiraInput + "\n{code:sql}\n\n{code}")} className="bg-slate-800 hover:bg-blue-600 px-3 py-1 rounded text-[10px] font-bold transition-all">SQL</button>
                    <button onClick={() => setJiraInput(jiraInput + "\n{code:json}\n\n{code}")} className="bg-slate-800 hover:bg-blue-600 px-3 py-1 rounded text-[10px] font-bold transition-all">JSON</button>
                  </div>
                </div>
                <textarea 
                  ref={textareaRef} // Conecta a referência
                  onPaste={handlePaste} // Conecta a função de colar imagem
                  value={jiraInput}
                  onChange={(e) => setJiraInput(e.target.value)}
                  placeholder="Escreva sua análise técnica aqui... Cole prints diretamente com Ctrl+V."
                  className="flex-grow bg-slate-950/50 border border-white/5 rounded-2xl p-6 text-sm font-mono text-blue-300 outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner selection:bg-blue-500/30"
                />
              </div>

              {/* Lado Direito: Preview com Suporte a Imagem */}
              <div className="flex flex-col bg-white rounded-[32px] overflow-hidden shadow-3xl">
                <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                  <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest">JIRA Preview</h3>
                  <button onClick={() => copyToClipboard(jiraInput, "resposta JIRA")} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg">
                    <Copy size={14} /> COPIAR PARA O JIRA
                  </button>
                </div>
                <div className="p-8 overflow-y-auto flex-grow prose prose-slate max-w-none text-slate-800 prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200">
                  <ReactMarkdown>{jiraInput}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </main>

        <footer className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
          Analista Lead: Anderson Leoni • APOIO B2B CVCCORP
        </footer>
      </div>

      {/* Modal Vault (Mantido igual) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-black text-xl uppercase tracking-tighter">API Vault</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white"><X /></button>
              </div>
              <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="Insira sua Gemini Key..." className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6 text-white text-sm outline-none focus:border-blue-500 transition-all" />
              <button onClick={() => { localStorage.setItem('loglens_key', tempKey); setShowSettings(false); }} className="w-full bg-blue-600 py-4 rounded-xl text-white font-black text-xs tracking-widest shadow-xl">SALVAR CREDENCIAIS</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;