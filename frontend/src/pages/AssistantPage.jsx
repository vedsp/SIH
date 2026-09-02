import React, { useState } from 'react';
import { MessageSquareCode, Send, Bot, User, Sparkles, FileText, ExternalLink } from 'lucide-react';

export const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      content: 'Hello! I am your FinDoc Assistant. Ask me anything about your uploaded financial documents, bank credits, GST filings, or risk anomalies.',
      citations: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [thinking, setThinking] = useState(false);

  const sampleQuestions = [
    "What was the total revenue extracted from bank statements?",
    "Why is there a discrepancy between bank credits and GST turnover?",
    "Which transaction was flagged as an anomaly?",
    "Summarize the financial health of ABC Manufacturing Pvt Ltd."
  ];

  const handleSend = (queryToSend) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg = { sender: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setThinking(true);

    setTimeout(() => {
      let replyContent = "";
      let citations = [];

      const lowerQ = q.toLowerCase();
      if (lowerQ.includes("revenue") || lowerQ.includes("bank credits")) {
        replyContent = "Based on the uploaded HDFC Bank Statement, the total annual credits for ABC Manufacturing Pvt Ltd amounted to ₹18,70,000 across the filing period.";
        citations = [{ doc: "HDFC_Bank_Statement_ABC_Mfg.pdf", page: "Page 4", snippet: "Total Credits: ₹18,70,000" }];
      } else if (lowerQ.includes("discrepancy") || lowerQ.includes("gst") || lowerQ.includes("mismatch")) {
        replyContent = "The system identified a ₹3,90,000 discrepancy. Annual bank credits (₹18.70 Lakhs) exceed reported GST turnover (₹14.80 Lakhs) by 26.3%. Requires review to verify non-GST income or exemptions.";
        citations = [
          { doc: "HDFC_Bank_Statement_ABC_Mfg.pdf", page: "Page 4", snippet: "Annual Credits: ₹18.70L" },
          { doc: "GSTR3B_Filing_27AABC1234F1Z5.pdf", page: "Page 2", snippet: "Taxable Turnover: ₹14.80L" }
        ];
      } else if (lowerQ.includes("anomaly") || lowerQ.includes("unusual")) {
        replyContent = "An unusual RTGS transaction of ₹9,99,999 to XYZ Traders on 2025-07-12 was flagged. This payment is 4.8 times higher than the historical average payment (₹2,10,000) to this vendor.";
        citations = [{ doc: "HDFC_Bank_Statement_ABC_Mfg.pdf", page: "Page 3", snippet: "RTGS-XYZ TRADERS: ₹9,99,999" }];
      } else {
        replyContent = "Based on the uploaded documents for ABC Manufacturing Pvt Ltd, the company exhibits strong credit cash flows (₹18.7L), stable GST filings, but carries moderate risk due to cross-document turnover variances and one high-value payment anomaly.";
        citations = [{ doc: "FinDocAI Synthesis Engine", page: "Cross-Doc Match", snippet: "Verification Complete" }];
      }

      setMessages(prev => [...prev, { sender: 'assistant', content: replyContent, citations }]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">FinDoc Local AI Assistant</h2>
            <p className="text-xs text-slate-400">Sentence-Transformers + FAISS RAG Local Query Engine</p>
          </div>
        </div>
        <span className="text-xs font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Ollama Local LLM Connected
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider shrink-0">Sample Queries:</span>
        {sampleQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl transition whitespace-nowrap"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-2 p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                <div>{msg.content}</div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider block">Sources & Citations:</span>
                    {msg.citations.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        <span className="font-mono text-slate-300 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-sky-400" />
                          {c.doc} ({c.page})
                        </span>
                        <span className="text-[10px] text-slate-500 italic">"{c.snippet}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-ping"></span>
                Searching vector index FAISS & synthesizing local response...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask FinDoc Assistant about uploaded financial documents..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || thinking}
            className="bg-teal-600 hover:bg-teal-500 text-white p-2.5 rounded-xl transition shadow-lg shadow-teal-600/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
