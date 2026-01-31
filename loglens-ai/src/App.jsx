import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, Upload, CheckCircle, FileText, Loader2, 
  ShieldCheck, Zap, BarChart3, Settings, X, Copy, Layout, PenTool, ImagePlus, 
  BookOpen, Search, PhoneCall, UserPlus
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeLog } from './services/gemini';

function App() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('loglens_key') || "");
  
  // ANALYTICS STATES
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState("");

  // JIRA STATES
  const [jiraInput, setJiraInput] = useState("");
  const textareaRef = useRef(null); 

  // WIKI STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWiki, setSelectedWiki] = useState(null);

  // MOCK DATA: Base de Conhecimento (Pode ser movido para um JSON externo)
  const wikiData = [
    { id: 1, category: 'Crise', title: 'Contatos Sala de Crise', content: '### 🚨 Acionamento de Emergência\n\n| Time | Contato | Canal |\n| :--- | :--- | :--- |\n| **Infra** | ramal 4455 | Teams |\n| **DBA** | ramal 1122 | WhatsApp |\n| **Dev Ops** | senior.oncall@cvc.com | E-mail |' },
    { id: 2, category: 'Onboarding', title: 'Primeiros Passos B2B', content: '### 🚀 Bem-vindo ao APOIO B2B\n\n1. Configure seu acesso ao JIRA.\n2. Solicite permissão no repositório LogLens.\n3. Leia o guia de boas práticas de atendimento.' },
    { id: 3, category: 'Técnico', title: 'Erro de Disponibilidade XML', content: '### 🏨 Erros de Hotelaria\n\nQuando o log retornar `<Error Code="INVENT-01">`, significa que o inventário expirou durante a sessão de checkout. Sugerir nova busca imediata.' }
  ];

  const filteredWiki = wikiData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text, type = "análise") => {
    navigator.clipboard.writeText(text);
    alert(`${type.toUpperCase()} copiada!`);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        e.preventDefault();
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageMarkdown = `\n![Print](${event.target.result})\n`;
          const start = textareaRef.current.selectionStart;
          const end = textareaRef.current.selectionEnd;
          setJiraInput(jiraInput.substring(0, start) + imageMarkdown + jiraInput.substring(end));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const run = async () => {
    if (!fileContent) return;
    setLoading(true);
    try {
      const res = await analyzeLog(fileContent);
      setAnalysis(res);
    } catch (error) { setAnalysis(`### ❌ Erro\n${error.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center p-6">
      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Header Consolidado */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/40"><ShieldCheck className="text-white" size={28} /></div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase">LogLens Pro</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">APOIO B2B CVCCORP</p>
            </div>
          </div>

          <nav className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
            {[
              {id: 'analytics', icon: <Layout size={14}/>, label: 'ANALYTICS'},
              {id: 'jira', icon: <PenTool size={14}/>, label: 'JIRA'},
              {id: 'wiki', icon: <BookOpen size={14}/>, label: 'WIKI'}
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
            <button onClick={() => setShowSettings(true)} className="p-2 text-slate-500 hover:text-white ml-2 border-l border-slate-800"><Settings size={18} /></button>
          </nav>
        </header>

        <main className="min-h-[600px]">
          {/* TAB 1 & 2 MANTIDAS (Conforme lógica anterior corrigida) */}
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
                   <p className="text-xs font-bold text-slate-400 truncate w-full">{fileName || "Anexar Log"}</p>
                 </div>
                 <button onClick={run} disabled={loading || !fileContent} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 py-4 rounded-xl text-white font-black text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                   {loading ? <Loader2 className="animate-spin" /> : <Zap size={16} />} RUN DIAGNOSTICS
                 </button>
               </section>
               <section className="lg:col-span-8 h-full">
                 {analysis ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[32px] shadow-3xl overflow-hidden min-h-[500px] flex flex-col">
                     <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                       <span className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2"><CheckCircle className="text-blue-600" size={16}/> Executive Analysis</span>
                       <button onClick={() => copyToClipboard(analysis)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-blue-50 transition-all">COPIAR</button>
                     </div>
                     <div className="p-10 text-slate-800 prose prose-slate max-w-none"><ReactMarkdown>{analysis}</ReactMarkdown></div>
                   </motion.div>
                 ) : <div className="h-[500px] border-2 border-dashed border-slate-800/30 rounded-[32px] flex items-center justify-center text-slate-600 font-black text-xs uppercase opacity-20">Aguardando Log...</div>}
               </section>
            </div>
          )}

          {activeTab === 'jira' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
              <textarea ref={textareaRef} onPaste={handlePaste} value={jiraInput} onChange={(e) => setJiraInput(e.target.value)} placeholder="Editor JIRA com suporte a prints (Ctrl+V)..." className="bg-slate-900/50 border border-white/5 rounded-[32px] p-8 text-sm font-mono text-blue-300 outline-none focus:border-blue-500/50 resize-none shadow-2xl" />
              <div className="bg-white rounded-[32px] overflow-hidden shadow-3xl flex flex-col">
                <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                  <span className="text-slate-900 font-black text-xs uppercase tracking-widest">JIRA Preview</span>
                  <button onClick={() => copyToClipboard(jiraInput, "JIRA")} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-lg">COPIAR PARA O JIRA</button>
                </div>
                <div className="p-8 overflow-y-auto prose prose-slate max-w-none text-slate-800">
                  <ReactMarkdown urlTransform={(url) => url.startsWith("data:") ? url : url} components={{ img: ({node, ...props}) => (<img {...props} className="rounded-xl shadow-lg border border-slate-200 max-w-full h-auto" />) }}>{jiraInput}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: WIKI / KNOWLEDGE BASE (NOVA) */}
          {activeTab === 'wiki' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
              {/* Barra Lateral de Busca */}
              <section className="lg:col-span-4 flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar na Wiki..."
                    className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all text-xs font-bold"
                  />
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-2">
                  {filteredWiki.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => setSelectedWiki(item)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedWiki?.id === item.id ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800'}`}
                    >
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedWiki?.id === item.id ? 'text-blue-200' : 'text-slate-500'}`}>{item.category}</p>
                      <p className="text-sm font-bold text-white truncate">{item.title}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Visualizador da Wiki */}
              <section className="lg:col-span-8 bg-white rounded-[32px] shadow-3xl overflow-hidden flex flex-col">
                {selectedWiki ? (
                  <div className="flex flex-col h-full">
                    <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                      <span className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2"><BookOpen size={16} className="text-blue-600"/> {selectedWiki.category}</span>
                      <div className="flex gap-2">
                        {selectedWiki.category === 'Crise' && <PhoneCall size={14} className="text-red-500 animate-pulse" />}
                        {selectedWiki.category === 'Onboarding' && <UserPlus size={14} className="text-emerald-500" />}
                      </div>
                    </div>
                    <div className="p-12 overflow-y-auto text-slate-800 prose prose-slate max-w-none">
                      <ReactMarkdown>{selectedWiki.content}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-20 p-12 text-center">
                    <BookOpen size={80} className="mb-4" />
                    <p className="text-xl font-black uppercase tracking-widest">Base de Conhecimento</p>
                    <p className="text-xs mt-2">Selecione um documento à esquerda para visualizar.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </main>
      </div>

      {/* MODAL SETTINGS (Vantagem de manter a chave privada) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-slate-900 border border-white/10 p-10 rounded-[40px] max-w-md w-full shadow-3xl text-center">
              <h3 className="text-white font-black text-2xl tracking-tighter uppercase mb-6">API Vault</h3>
              <input type="password" value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="Sua Gemini Key privada..." className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-6 text-white text-sm outline-none focus:border-blue-500 transition-all text-center" />
              <div className="flex gap-4">
                <button onClick={() => setShowSettings(false)} className="flex-1 py-3 text-slate-500 font-bold uppercase text-[10px]">Cancelar</button>
                <button onClick={() => { localStorage.setItem('loglens_key', tempKey); setShowSettings(false); }} className="flex-1 bg-blue-600 py-4 rounded-xl text-white font-black text-[10px] tracking-widest">Salvar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;