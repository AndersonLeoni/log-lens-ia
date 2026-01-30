import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * LogLens Pro Engine - Optimized for CVCCorp B2B Support
 * Tech Lead: Anderson Leoni
 */
export const analyzeLog = async (logContent) => {
  // 1. Tenta pegar do cofre local (Prioridade para sua chave privada)
  // 2. Tenta pegar do .env (Facilidade para desenvolvimento)
  const savedKey = localStorage.getItem('loglens_key');
  const API_KEY = savedKey || import.meta.env.VITE_GEMINI_KEY;

  if (!API_KEY) {
    throw new Error("Chave de API não configurada. Por favor, insira uma chave válida.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    // Modelo Flash 2.5 (Configurado como 2.0-flash-exp para estabilidade em 2026)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" }); 

    const prompt = `
      Você é um especialista em análise de erros, com especialidade em entendimento de logs que contêm conteúdo de produtos de viagem destinados à CVCCorp.
      Analise o conteúdo abaixo (XML ou JSON) e gere um relatório de alta precisão.

      REGRAS DE OURO:
      1. DIAGNÓSTICO TÉCNICO: Se houver erro (Ex: <Error>, "status": "error", "severity": "critical"), identifique o motivo técnico exato. Explique de forma simples se a falha é de serviço (timeout, indisponibilidade) ou de dados (CPF inválido, campo faltante).
      2. DADOS DE NEGÓCIO: Extraia e estruture em tabelas: Nome do PAX, ID da Reserva (Locator), Data/Hora do evento e valores monetários se houver.
      3. LOG DE SUCESSO: Se for sucesso, confirme a transação e destaque os IDs de confirmação e detalhes do produto (Hotel, Voo, etc).
      4. PRÓXIMA AÇÃO (NEXT STEP): Sugira o que o analista de suporte deve fazer (ex: "Entrar em contato com o fornecedor X", "Solicitar correção de documento ao cliente").

      ESTRUTURA DE RESPOSTA:
      Responda em Markdown profissional, com títulos segmentados e um resumo executivo no topo.

      CONTEÚDO DO LOG:
      ${logContent}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Erro na análise técnica:", error);
    
    // Tratamento de erro específico para chave vazada (403)
    if (error.message.includes("403")) {
      return "### ⚠️ Chave de API Bloqueada\nSua chave foi detectada como exposta. Por favor, use o ícone de engrenagem para inserir uma nova chave privada.";
    }
    
    return `### ❌ Erro de Processamento\n${error.message}`;
  }
};