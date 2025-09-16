// src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { coachReply } from "../coach";
import { addLog } from "../storage";

export default function ChatWindow({ onNewLog }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey, I’m your gentle coach 💬 Tell me how you’re doing today." }
  ]);
  const [input, setInput] = useState("");
  const [awaitMood, setAwaitMood] = useState(false);
  const [note, setNote] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");

    // fake AI reply
    const reply = coachReply(text);
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", text: reply }, { role:"assistant", text:"On a scale of 1–10, how’s your mood right now?" }]);
      setAwaitMood(true);
    }, 300);
  };

  const submitMood = (mood) => {
    const n = note.trim();
    const all = addLog({ mood, note: n });
    onNewLog?.(all);
    setMessages(m => [
      ...m,
      { role:"user", text:`Mood: ${mood}${n ? ` • Note: ${n}`:""}` },
      { role:"assistant", text: "Noted. Proud of you for checking in. 🌟" }
    ]);
    setNote("");
    setAwaitMood(false);
  };

  return (
    <div className="card" style={{ display:"grid", gap:12 }}>
      <div style={{ height: 380, overflowY: "auto", padding: 6, border:"1px solid #e2e8f0", borderRadius:12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin:"10px 0", display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start" }}>
            <div className="badge" style={{ background: m.role==="user" ? "#DCFCE7" : "#E2E8F0" }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {!awaitMood && (
        <div className="gap">
          <input
            className="input"
            placeholder="Type how you feel…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button className="button" onClick={send}>Send</button>
        </div>
      )}

      {awaitMood && (
        <div style={{ borderTop:"1px dashed #cbd5e1", paddingTop:10 }}>
          <div className="small">Pick your mood (1=low, 10=great)</div>
          <div className="gap" style={{ flexWrap:"wrap" }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button key={n} className="button" style={{ background:"#64748b" }} onClick={() => submitMood(n)}>{n}</button>
            ))}
          </div>
          <input
            className="input"
            style={{ marginTop:8 }}
            placeholder="Optional note (what influenced your mood?)"
            value={note}
            onChange={e => setNote(e.target.value)}
            onKeyDown={e => e.key === "Enter" && note.trim() && submitMood("— pick a number above —")}
          />
        </div>
      )}
    </div>
  );
}
