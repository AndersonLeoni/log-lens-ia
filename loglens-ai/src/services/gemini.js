import { GoogleGenerativeAI } from "@google/generative-ai";

// Substitua pela sua chave que vamos gerar no Google AI Studio
const API_KEY = "AIzaSyC6FRvxzPvvjYdIKclJ6EP7zHk6PYo7Bvg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeLog = async (logContent) => {
  try {
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Você é um especialista em analise de erros, com especialidade em entendimento de logs que contem conteúdo de produtos de viagem destinados a CVCCorp. 
      Analise o conteúdo abaixo (pode ser XML ou JSON).
      
      REGRAS:
      1. Se houver erro (Ex: <Error>, "status": "error", etc), identifique o motivo técnico e explique de forma simples, estruturando bem a resposta (apontando possiveis falhas de serviço ou de código), além de estruturar dados de negocio, como nome do pax, data e hora de emissão e o que mais achar pertinente e completo.
      2. Se for um log de sucesso, extraia: dados pertinentes que valem a pensa ser mencionados, como reserva confirmada com sucesso, id de reserva, valores importantes, etc.
      3. Responda em Markdown estruturado com títulos claros e segmentados.
      
      CONTEÚDO DO LOG:
      ${logContent}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro na análise:", error);
    return "Erro ao processar o log com a IA.";
  }
};