import { useState, useEffect, useRef } from "react";

const CARD_THEMES = [
  { gradFrom:"#fff8e1",gradTo:"#ffe0b2",border:"#e65100",text:"#4a1c00",tag:"#bf360c" },
  { gradFrom:"#e8f5e9",gradTo:"#c8e6c9",border:"#2e7d32",text:"#1b4a1e",tag:"#1b5e20" },
  { gradFrom:"#fce4ec",gradTo:"#f8bbd9",border:"#c2185b",text:"#4a0019",tag:"#880e4f" },
  { gradFrom:"#e3f2fd",gradTo:"#bbdefb",border:"#1565c0",text:"#0a2472",tag:"#0d47a1" },
  { gradFrom:"#fff9c4",gradTo:"#fff176",border:"#f9a825",text:"#4e2d00",tag:"#e65100" },
  { gradFrom:"#e0f7fa",gradTo:"#b2ebf2",border:"#00838f",text:"#002f33",tag:"#006064" },
];

const QUICK_PICKS = [
  { label:"🤕 Headache",    q:"headache" },
  { label:"🤧 Cold & Flu",  q:"cold and flu" },
  { label:"🔥 Sore Throat", q:"sore throat" },
  { label:"😴 Insomnia",    q:"insomnia" },
  { label:"🤢 Nausea",      q:"nausea" },
  { label:"✨ Acne",         q:"acne" },
  { label:"💪 Muscle Pain", q:"muscle pain" },
  { label:"🌿 Indigestion", q:"indigestion" },
];

const BG_VEGGIES = [
  { emoji:"🥦",  size:52, x:4,  y:6,  speed:0.022, dur:4.2, delay:0    },
  { emoji:"🫑",  size:58, x:86, y:4,  speed:0.018, dur:5.1, delay:0.4  },
  { emoji:"🥕",  size:38, x:14, y:78, speed:0.030, dur:3.6, delay:0.8  },
  { emoji:"🥬",  size:62, x:90, y:58, speed:0.015, dur:6.0, delay:0.2  },
  { emoji:"🧄",  size:34, x:48, y:2,  speed:0.028, dur:3.9, delay:1.0  },
  { emoji:"🌶️", size:32, x:76, y:82, speed:0.035, dur:3.1, delay:0.6  },
  { emoji:"🍋",  size:46, x:28, y:88, speed:0.025, dur:4.7, delay:1.4  },
  { emoji:"🫚",  size:30, x:92, y:28, speed:0.040, dur:2.9, delay:0.9  },
  { emoji:"🥒",  size:44, x:6,  y:44, speed:0.020, dur:5.3, delay:0.3  },
  { emoji:"🍅",  size:48, x:62, y:90, speed:0.026, dur:4.4, delay:1.2  },
  { emoji:"🌾",  size:40, x:80, y:14, speed:0.016, dur:6.5, delay:0.5  },
  { emoji:"🧅",  size:36, x:38, y:94, speed:0.032, dur:3.4, delay:1.6  },
  { emoji:"🥑",  size:50, x:18, y:30, speed:0.024, dur:4.9, delay:0.7  },
  { emoji:"🌻",  size:56, x:54, y:12, speed:0.014, dur:7.0, delay:0.1  },
  { emoji:"🫛",  size:38, x:70, y:50, speed:0.029, dur:3.8, delay:1.3  },
  { emoji:"🌿",  size:42, x:2,  y:88, speed:0.021, dur:5.6, delay:1.8  },
];

export default function HomeCureApp() {
  const [query, setQuery]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [remedies, setRemedies] = useState(null);
  const [error, setError]       = useState("");
  const [mouse, setMouse]       = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered]   = useState(null);
  const rafRef                  = useRef(null);
  const targetMouse             = useRef({ x: 0.5, y: 0.5 });
  const currentMouse            = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      const t = targetMouse.current, c = currentMouse.current;
      currentMouse.current = { x: c.x + (t.x - c.x) * 0.06, y: c.y + (t.y - c.y) * 0.06 };
      setMouse({ ...currentMouse.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const fetchRemedies = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;
    setLoading(true); setError(""); setRemedies(null);
    try {
      const res = await fetch("/.netlify/functions/remedies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a warm, knowledgeable home remedies herbalist. For the condition: "${q}", provide 4 effective natural home remedies. Return ONLY a valid JSON object with NO markdown or backticks. Structure: {"condition":"condition name","disclaimer":"brief one-sentence disclaimer","remedies":[{"name":"remedy name","emoji":"single most relevant emoji","tagline":"5-7 word poetic tagline","ingredients":["ingredient 1","ingredient 2","ingredient 3"],"instructions":"clear 2-3 sentence how-to","benefit":"key healing benefit in one sentence","difficulty":"Easy","time":"e.g. 5 mins"}]}`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(i => i.text || "").join("");
      setRemedies(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setError("Couldn't reach nature's pantry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{overflow-x:hidden}
        .hc-root{
          min-height:100vh;font-family:'Nunito',sans-serif;
          position:relative;overflow:hidden;padding-bottom:80px;
          background-color:#7a4f2d;
          background-image:
            repeating-linear-gradient(89deg,transparent 0px,transparent 60px,rgba(0,0,0,0.04) 60px,rgba(0,0,0,0.04) 62px,transparent 62px,transparent 130px,rgba(255,255,255,0.025) 130px,rgba(255,255,255,0.025) 132px,transparent 132px,transparent 200px,rgba(0,0,0,0.03) 200px,rgba(0,0,0,0.03) 201px),
            repeating-linear-gradient(180deg,transparent 0px,transparent 80px,rgba(0,0,0,0.06) 80px,rgba(0,0,0,0.06) 82px,transparent 82px,transparent 180px,rgba(0,0,0,0.03) 180px,rgba(0,0,0,0.03) 181px),
            linear-gradient(168deg,#c49a6c 0%,#a0724a 12%,#7a4f2d 28%,#6b3f20 42%,#7c5030 55%,#9a6840 68%,#7a4f2d 80%,#5c3318 92%,#7a4822 100%);
        }
        .hc-root::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(230,180,100,0.18) 0%,transparent 60%),radial-gradient(ellipse at 20% 100%,rgba(80,30,10,0.35) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(60,20,5,0.3) 0%,transparent 50%);pointer-events:none;z-index:0;}
        .hc-veggie{position:fixed;pointer-events:auto;z-index:1;transform-origin:center;filter:drop-shadow(2px 4px 6px rgba(50,20,5,0.25));will-change:transform;}
        .hc-veggie.popped{filter:drop-shadow(3px 6px 12px rgba(50,20,5,0.4)) brightness(1.15);}
        @keyframes vfloat0{0%,100%{transform:translateY(0px) rotate(-4deg)}50%{transform:translateY(-14px) rotate(4deg)}}
        @keyframes vfloat1{0%,100%{transform:translateY(0px) rotate(6deg)}50%{transform:translateY(-10px) rotate(-5deg)}}
        @keyframes vfloat2{0%,100%{transform:translateY(0px) rotate(-2deg)}50%{transform:translateY(-18px) rotate(6deg)}}
        @keyframes vfloat3{0%,100%{transform:translateY(0px) rotate(8deg)}50%{transform:translateY(-8px) rotate(-8deg)}}
        @keyframes leafSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(38px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes heroIn{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes btnPulse{0%,100%{box-shadow:0 6px 24px rgba(214,141,52,0.4)}50%{box-shadow:0 6px 36px rgba(214,141,52,0.7)}}
        .hc-hero{animation:heroIn 0.9s ease both}
        .hc-card{animation:cardIn 0.55s ease both}
        .hc-title{font-family:'Playfair Display',serif;font-size:clamp(46px,7vw,80px);color:#fdf3e3;letter-spacing:-2px;line-height:1;text-shadow:0 3px 0 rgba(80,30,5,0.5),0 6px 24px rgba(0,0,0,0.4);}
        .hc-title em{color:#f4c25a;font-style:italic;}
        .hc-tagline{color:#f0d9b5;font-size:13px;font-weight:700;letter-spacing:5px;text-transform:uppercase;margin-top:10px;text-shadow:0 1px 4px rgba(0,0,0,0.4);}
        .hc-input{flex:1;min-width:260px;padding:17px 26px;font-size:15px;font-family:'Nunito',sans-serif;font-weight:600;border:2px solid rgba(255,235,180,0.35);border-radius:60px;background:rgba(255,248,230,0.15);color:#fff8e7;backdrop-filter:blur(14px);transition:all 0.3s;outline:none;}
        .hc-input::placeholder{color:rgba(255,235,180,0.55)}
        .hc-input:focus{border-color:rgba(244,194,90,0.8);background:rgba(255,248,230,0.22);box-shadow:0 0 0 4px rgba(244,194,90,0.2);}
        .hc-btn{padding:17px 32px;background:linear-gradient(135deg,#e8a228,#d4721a);color:#fff8e7;border:none;border-radius:60px;font-size:15px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;transition:all 0.25s;white-space:nowrap;animation:btnPulse 3s ease-in-out infinite;text-shadow:0 1px 3px rgba(0,0,0,0.3);}
        .hc-btn:hover:not(:disabled){transform:scale(1.06) translateY(-2px);filter:brightness(1.1)}
        .hc-btn:active:not(:disabled){transform:scale(0.97)}
        .hc-btn:disabled{opacity:0.65;cursor:not-allowed;animation:none}
        .hc-qbtn{background:rgba(255,245,210,0.1);border:1.5px solid rgba(255,235,170,0.25);border-radius:24px;padding:6px 15px;color:#f5dfa0;font-size:12px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .hc-qbtn:hover{background:rgba(244,194,90,0.2);border-color:#f4c25a;color:#fff8e7}
        .hc-loader-text{color:#f0d9b5;font-size:17px;font-weight:700;margin-top:18px;background:linear-gradient(90deg,#f0d9b5,#f4c25a,#e07830,#f0d9b5);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 2.2s linear infinite;}
        .hc-results-title{font-family:'Playfair Display',serif;color:#fdf3e3;font-size:clamp(20px,4vw,30px);text-align:center;margin-bottom:10px;text-shadow:0 2px 12px rgba(0,0,0,0.4);}
        .hc-disclaimer{display:inline-block;background:rgba(244,194,90,0.15);border:1px solid rgba(244,194,90,0.3);border-radius:30px;padding:7px 20px;color:#f5dfa0;font-size:12px;font-weight:600;text-align:center;margin-bottom:26px;}
        .hc-card-inner{border-radius:24px;padding:26px;border:1.5px solid;position:relative;overflow:hidden;cursor:default;}
        .hc-card-inner::before{content:'';position:absolute;top:-28px;right:-28px;width:110px;height:110px;border-radius:50%;background:var(--ac);opacity:0.1;pointer-events:none;}
        .hc-emoji-box{border-radius:18px;background:rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.3s;box-shadow:0 4px 16px var(--sh);}
        .hc-card-inner:hover .hc-emoji-box{transform:scale(1.1) rotate(6deg)}
        .hc-ing{font-size:12px;font-weight:700;padding:4px 12px;border-radius:18px;border:1.5px solid;transition:transform 0.2s;display:inline-block;cursor:default;}
        .hc-ing:hover{transform:scale(1.06)}
        .hc-feature-card{background:rgba(255,245,210,0.09);border:1px solid rgba(255,235,170,0.15);border-radius:18px;padding:22px 18px;width:155px;text-align:center;}
        .hc-footer{text-align:center;margin-top:56px;color:rgba(255,240,200,0.35);font-size:12px;position:relative;z-index:2;}
        .hc-error{max-width:480px;margin:16px auto;padding:18px 24px;background:rgba(200,50,50,0.15);border:1px solid rgba(200,50,50,0.3);border-radius:18px;color:#ffcdd2;text-align:center;font-weight:600;position:relative;z-index:2;}
      `}</style>

      <div className="hc-root">

        {/* Interactive Vegetable Background */}
        {BG_VEGGIES.map((v, i) => {
          const px = (mouse.x - 0.5) * v.speed * -120;
          const py = (mouse.y - 0.5) * v.speed * -120;
          return (
            <div
              key={i}
              className={`hc-veggie${hovered === i ? " popped" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                left: `${v.x}%`, top: `${v.y}%`,
                fontSize: v.size,
                opacity: hovered === i ? 0.55 : 0.28,
                animation: `vfloat${i % 4} ${v.dur}s ease-in-out infinite`,
                animationDelay: `${v.delay}s`,
                transform: `translate(${px}px, ${py}px)`,
                transition: "opacity 0.3s, transform 0.05s linear",
              }}
            >
              {v.emoji}
            </div>
          );
        })}

        {/* Hero */}
        <div style={{ textAlign:"center", padding:"60px 20px 36px", position:"relative", zIndex:2 }}>
          <div className="hc-hero">
            <div style={{ fontSize:60, marginBottom:8, filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>🌿</div>
            <h1 className="hc-title">Home <em>Cure</em></h1>
            <p className="hc-tagline">Kitchen Remedies · Nature's Wisdom</p>
            <div style={{ maxWidth:600, margin:"30px auto 0", display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
              <input
                className="hc-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchRemedies()}
                placeholder="What ails you? headache, cold, sore throat…"
              />
              <button className="hc-btn" onClick={() => fetchRemedies()} disabled={loading}>
                {loading ? "✨ Searching…" : "🔍 Find Remedies"}
              </button>
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginTop:14 }}>
              {QUICK_PICKS.map(p => (
                <button key={p.q} className="hc-qbtn" onClick={() => { setQuery(p.q); fetchRemedies(p.q); }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:"center", padding:"64px 20px", position:"relative", zIndex:2 }}>
            <div style={{ fontSize:58, display:"inline-block", animation:"leafSpin 1.8s linear infinite", filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>🌿</div>
            <p className="hc-loader-text">Searching nature's pantry for you…</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="hc-error">🌿 {error}</div>}

        {/* Results */}
        {remedies && !loading && (
          <div style={{ maxWidth:940, margin:"0 auto", padding:"0 20px", position:"relative", zIndex:2 }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <h2 className="hc-results-title">
                Home remedies for{" "}
                <em style={{ color:"#f4c25a", fontFamily:"'Playfair Display',serif", fontStyle:"italic" }}>
                  {remedies.condition}
                </em>
              </h2>
              <p className="hc-disclaimer">⚕️ {remedies.disclaimer}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))", gap:20 }}>
              {(remedies.remedies || []).map((r, i) => {
                const t = CARD_THEMES[i % CARD_THEMES.length];
                return (
                  <div key={i} className="hc-card" style={{ animationDelay:`${i * 0.12}s` }}>
                    <div className="hc-card-inner" style={{ background:`linear-gradient(140deg,${t.gradFrom},${t.gradTo})`, borderColor:`${t.border}30`, "--ac":t.border, "--sh":`${t.border}28`, boxShadow:"0 8px 32px rgba(0,0,0,0.2),0 2px 8px rgba(0,0,0,0.1)" }}>
                      <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:18 }}>
                        <div className="hc-emoji-box" style={{ width:68, height:68, fontSize:38 }}>{r.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", color:t.text, fontSize:20, fontWeight:700, lineHeight:1.2, marginBottom:2 }}>{r.name}</div>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", color:t.tag, fontSize:13, marginBottom:8, opacity:0.85 }}>{r.tagline}</div>
                          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                            <span style={{ background:`${t.border}18`, color:t.text, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:800 }}>⏱ {r.time}</span>
                            <span style={{ background:`${t.border}18`, color:t.text, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:800 }}>💪 {r.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <p style={{ color:t.tag, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:2, margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}>🧴 Ingredients</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
                        {(r.ingredients || []).map((ing, j) => (
                          <span key={j} className="hc-ing" style={{ background:`${t.border}12`, borderColor:`${t.border}32`, color:t.text }}>{ing}</span>
                        ))}
                      </div>
                      <p style={{ color:t.tag, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:2, margin:"0 0 7px", display:"flex", alignItems:"center", gap:5 }}>📋 Instructions</p>
                      <p style={{ color:t.text, fontSize:13, lineHeight:1.75, marginBottom:14, opacity:0.88 }}>{r.instructions}</p>
                      <div style={{ background:`${t.border}10`, border:`1px solid ${t.border}22`, borderRadius:12, padding:"10px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>✨</span>
                        <span style={{ color:t.text, fontSize:12, fontWeight:700, lineHeight:1.5 }}>{r.benefit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Landing state */}
        {!loading && !remedies && !error && (
          <div style={{ textAlign:"center", padding:"44px 20px", position:"relative", zIndex:2 }}>
            <p style={{ color:"rgba(255,240,200,0.5)", fontSize:15, fontWeight:600 }}>
              Type your ailment or pick one above to get started
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center", marginTop:36 }}>
              {[
                { icon:"🌿", text:"Natural kitchen ingredients" },
                { icon:"⚡", text:"Fast AI-powered lookup" },
                { icon:"📖", text:"Step-by-step instructions" },
                { icon:"❤️", text:"Time-tested wisdom" },
              ].map((f, i) => (
                <div key={i} className="hc-feature-card">
                  <div style={{ fontSize:34, marginBottom:10 }}>{f.icon}</div>
                  <div style={{ color:"rgba(255,240,200,0.7)", fontSize:12, fontWeight:600, lineHeight:1.4 }}>{f.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hc-footer">
          🌿 Powered by nature's wisdom · Always consult a healthcare professional for serious conditions
        </div>
      </div>
    </>
  );
}
