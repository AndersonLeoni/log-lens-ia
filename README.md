# 🔍 LogLens Pro | Intelligence Unit CVCCorp

> **Diagnóstico inteligente e automação de logs B2B para redução de MTTR (Mean Time To Repair).**

---

## 🚀 Visão Geral
O **LogLens Pro** é uma plataforma de monitoramento e auditoria desenvolvida especificamente para o time de **APOIO B2B da CVCCorp**. Através de IA Generativa (**Gemini 2.5 Flash**), transformamos logs complexos em XML e JSON em relatórios executivos legíveis, permitindo decisões rápidas e precisas.

## 💡 O Problema
No ecossistema de turismo, a análise manual de falhas de inventário, erros de emissão ou quedas de serviço consome tempo valioso dos analistas. Logs extensos dificultam a identificação imediata de dados críticos como **Nome do Passageiro (PAX)**, **ID da Reserva** e **Causa Raiz** do erro.

## ✨ Solução e Diferenciais
* **Análise Semântica:** Identifica falhas de negócio e técnicas com precisão cirúrgica.
* **Visão de Negócio:** Extração automática de dados de reserva (Locator, PAX, Datas e Valores).
* **UX Internacional:** Interface centralizada, responsiva e de alto impacto visual desenvolvida com React e Tailwind CSS.
* **Next-Step Intelligence:** A IA não apenas relata o erro, mas sugere a próxima ação para o suporte.

## 🛡️ Arquitetura de Segurança (Zero-Trust)
Pensando na segurança das credenciais da CVCCorp, o sistema implementa um **Vault Local**:
* **LocalStorage Vault:** As chaves de API nunca são expostas no código-fonte público.
* **Isolamento de Credenciais:** Cada analista utiliza sua própria chave, armazenada de forma persistente e segura apenas em seu navegador.
* **Fallback Protegido:** Suporte a variáveis de ambiente (`.env`) para desenvolvimento local controlado.

## 🛠️ Stack Tecnológica
* **Core:** React.js + Vite.
* **Styling:** Tailwind CSS v4 (Modern CSS Engine).
* **Animations:** Framer Motion (Transições de nível executivo).
* **AI Engine:** Google Gemini 2.5 Flash API.
* **Icons:** Lucide React.

## 📈 Impacto Esperado
1.  **Redução de 70%** no tempo de triagem de incidentes técnicos.
2.  **Padronização** dos logs de erro enviados para as equipes de desenvolvimento.
3.  **Melhoria no SLA** de atendimento aos parceiros B2B da CVCCorp.

---
**Desenvolvido por:** [Anderson Leoni](https://github.com/andersonleoni)  
*Analista Líder - APOIO B2B | CVCCorp*
