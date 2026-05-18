import { useState, useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────

const CARD_THEMES = [
  { gradFrom:"#fff8e1", gradTo:"#ffe0b2", border:"#e65100", text:"#4a1c00", tag:"#bf360c" },
  { gradFrom:"#e8f5e9", gradTo:"#c8e6c9", border:"#2e7d32", text:"#1b4a1e", tag:"#1b5e20" },
  { gradFrom:"#fce4ec", gradTo:"#f8bbd9", border:"#c2185b", text:"#4a0019", tag:"#880e4f" },
  { gradFrom:"#e3f2fd", gradTo:"#bbdefb", border:"#1565c0", text:"#0a2472", tag:"#0d47a1" },
  { gradFrom:"#fff9c4", gradTo:"#fff176", border:"#f9a825", text:"#4e2d00", tag:"#e65100" },
  { gradFrom:"#e0f7fa", gradTo:"#b2ebf2", border:"#00838f", text:"#002f33", tag:"#006064" },
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

const CATEGORIES = [
  { id:"cold-flu",  label:"Cold & Flu",      emoji:"🍋", desc:"Boost immunity & fight infections", grad:["#fffde7","#fff9c4"], accent:"#f9a825", text:"#4e2800" },
  { id:"sleep",     label:"Sleep & Stress",   emoji:"🌙", desc:"Calm your mind & sleep deeply",     grad:["#ede7f6","#d1c4e9"], accent:"#7b1fa2", text:"#2e0054" },
  { id:"skin",      label:"Skin & Beauty",    emoji:"🌸", desc:"Glow naturally from within",        grad:["#fce4ec","#f8bbd9"], accent:"#c2185b", text:"#560027" },
  { id:"digestion", label:"Digestion",         emoji:"🌱", desc:"Soothe your gut naturally",         grad:["#e8f5e9","#c8e6c9"], accent:"#2e7d32", text:"#1b5e20" },
  { id:"pain",      label:"Pain Relief",       emoji:"💆", desc:"Natural pain management",           grad:["#e3f2fd","#bbdefb"], accent:"#1565c0", text:"#0d47a1" },
  { id:"immunity",  label:"Immunity",          emoji:"🧄", desc:"Strengthen your defenses",         grad:["#f9fbe7","#dce775"], accent:"#558b2f", text:"#33691e" },
  { id:"hair",      label:"Hair & Scalp",      emoji:"✨", desc:"Nourish from root to tip",         grad:["#f3e5f5","#e1bee7"], accent:"#6a1b9a", text:"#4a148c" },
  { id:"energy",    label:"Energy & Vitality", emoji:"⚡", desc:"Natural energy & vitality",        grad:["#fff3e0","#ffcc80"], accent:"#e65100", text:"#4e2700" },
];

const BG_VEGGIES = [
  { emoji:"🥦",  size:52, x:4,  y:6,  speed:0.022, dur:4.2, delay:0   },
  { emoji:"🫑",  size:58, x:86, y:4,  speed:0.018, dur:5.1, delay:0.4 },
  { emoji:"🥕",  size:38, x:14, y:78, speed:0.030, dur:3.6, delay:0.8 },
  { emoji:"🥬",  size:62, x:90, y:58, speed:0.015, dur:6.0, delay:0.2 },
  { emoji:"🧄",  size:34, x:48, y:2,  speed:0.028, dur:3.9, delay:1.0 },
  { emoji:"🌶️", size:32, x:76, y:82, speed:0.035, dur:3.1, delay:0.6 },
  { emoji:"🍋",  size:46, x:28, y:88, speed:0.025, dur:4.7, delay:1.4 },
  { emoji:"🫚",  size:30, x:92, y:28, speed:0.040, dur:2.9, delay:0.9 },
  { emoji:"🥒",  size:44, x:6,  y:44, speed:0.020, dur:5.3, delay:0.3 },
  { emoji:"🍅",  size:48, x:62, y:90, speed:0.026, dur:4.4, delay:1.2 },
  { emoji:"🌾",  size:40, x:80, y:14, speed:0.016, dur:6.5, delay:0.5 },
  { emoji:"🧅",  size:36, x:38, y:94, speed:0.032, dur:3.4, delay:1.6 },
  { emoji:"🥑",  size:50, x:18, y:30, speed:0.024, dur:4.9, delay:0.7 },
  { emoji:"🌻",  size:56, x:54, y:12, speed:0.014, dur:7.0, delay:0.1 },
  { emoji:"🫛",  size:38, x:70, y:50, speed:0.029, dur:3.8, delay:1.3 },
  { emoji:"🌿",  size:42, x:2,  y:88, speed:0.021, dur:5.6, delay:1.8 },
];

// ── Shared RemedyCard (top-level, stable reference) ────────────────────────

function RemedyCard({ remedy, themeIdx, isFav, onToggleFav }) {
  const t     = CARD_THEMES[themeIdx % CARD_THEMES.length];
  const faved = isFav(remedy.id);
  return (
    <div className="hc-card" style={{ animationDelay:`${themeIdx * 0.1}s` }}>
      <div className="hc-card-inner"
        style={{ background:`linear-gradient(140deg,${t.gradFrom},${t.gradTo})`, borderColor:`${t.border}30`, "--ac":t.border, "--sh":`${t.border}28` }}>

        <button className="hc-heart"
          style={{ background: faved ? "#ff4081" : "rgba(255,255,255,0.85)" }}
          onClick={() => onToggleFav(remedy)}>
          {faved ? "❤️" : "🤍"}
        </button>

        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:18 }}>
          <div className="hc-emoji-box" style={{ width:68, height:68, fontSize:38 }}>{remedy.emoji}</div>
          <div style={{ flex:1, paddingRight:32 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", color:t.text, fontSize:19, fontWeight:700, lineHeight:1.2, marginBottom:2 }}>{remedy.name}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", color:t.tag, fontSize:13, marginBottom:8, opacity:0.85 }}>{remedy.tagline}</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              <span style={{ background:`${t.border}18`, color:t.text, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:800 }}>⏱ {remedy.time}</span>
              <span style={{ background:`${t.border}18`, color:t.text, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:800 }}>💪 {remedy.difficulty}</span>
              {remedy.condition && <span style={{ background:`${t.border}18`, color:t.text, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:800 }}>🎯 {remedy.condition}</span>}
            </div>
          </div>
        </div>

        <p style={{ color:t.tag, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:2, margin:"0 0 8px" }}>🧴 Ingredients</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
          {(remedy.ingredients || []).map((ing, j) => (
            <span key={j} className="hc-ing" style={{ background:`${t.border}12`, borderColor:`${t.border}32`, color:t.text }}>{ing}</span>
          ))}
        </div>

        <p style={{ color:t.tag, fontSize:10, fontWeight:900, textTransform:"uppercase", letterSpacing:2, margin:"0 0 7px" }}>📋 Instructions</p>
        <p style={{ color:t.text, fontSize:13, lineHeight:1.75, marginBottom:14, opacity:0.88 }}>{remedy.instructions}</p>

        <div style={{ background:`${t.border}10`, border:`1px solid ${t.border}22`, borderRadius:12, padding:"10px 14px", display:"flex", gap:8, alignItems:"flex-start" }}>
          <span style={{ fontSize:16, flexShrink:0 }}>✨</span>
          <span style={{ color:t.text, fontSize:12, fontWeight:700, lineHeight:1.5 }}>{remedy.benefit}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function HomeCureApp() {

  const [view,        setView]        = useState("home");
  const [query,       setQuery]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [remedies,    setRemedies]    = useState(null);
  const [srchError,   setSrchError]   = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [catRemedies, setCatRemedies] = useState(null);
  const [catLoading,  setCatLoading]  = useState(false);
  const [catError,    setCatError]    = useState(false);
  const [favorites,   setFavorites]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("hc_favs") || "[]"); }
    catch { return []; }
  });
  const [mouse,   setMouse]   = useState({ x:0.5, y:0.5 });
  const [hovered, setHovered] = useState(null);

  const rafRef       = useRef(null);
  const targetMouse  = useRef({ x:0.5, y:0.5 });
  const currentMouse = useRef({ x:0.5, y:0.5 });

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("hc_favs", JSON.stringify(favorites));
  }, [favorites]);

  // Mouse parallax (only updates veggie layer, doesn't affect main content)
  useEffect(() => {
    const onMove = (e) => {
      targetMouse.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      const t = targetMouse.current, c = currentMouse.current;
      currentMouse.current = { x: c.x + (t.x - c.x) * 0.06, y: c.y + (t.y - c.y) * 0.06 };
      setMouse({ ...currentMouse.current });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, []);

  // Helpers
  const isFav      = (id) => favorites.some(f => f.id === id);
  const toggleFav  = (remedy) => setFavorites(prev =>
    isFav(remedy.id) ? prev.filter(f => f.id !== remedy.id) : [...prev, remedy]
  );

  // API call
  const callAPI = async (messages) => {
    const res = await fetch("/.netlify/functions/remedies", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ model:"claude-haiku-4-5-20251001", max_tokens:1200, messages })
    });
    const data = await res.json();
    const raw  = data.content.map(i => i.text || "").join("");
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  };

  // Search
  const fetchRemedies = async (overrideQuery) => {
    const q = (overrideQuery || query).trim();
    if (!q) return;
    setLoading(true); setSrchError(""); setRemedies(null);
    try {
      const parsed = await callAPI([{
        role:"user",
        content:`You are a warm home remedies herbalist. For the condition: "${q}", provide 4 effective natural home remedies. Return ONLY a valid JSON object, NO markdown. Structure: {"condition":"name","disclaimer":"brief one-sentence disclaimer","remedies":[{"name":"remedy name","emoji":"single emoji","tagline":"5-7 word poetic tagline","ingredients":["ingredient 1","ingredient 2","ingredient 3"],"instructions":"clear 2-3 sentence how-to","benefit":"key healing benefit","difficulty":"Easy","time":"e.g. 5 mins"}]}`
      }]);
      parsed.remedies = parsed.remedies.map((r, i) => ({ ...r, id:`s_${Date.now()}_${i}` }));
      setRemedies(parsed);
    } catch {
      setSrchError("Couldn't reach nature's pantry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Category fetch
  const fetchCategoryRemedies = async (cat) => {
    setSelectedCat(cat); setView("cat-detail");
    setCatLoading(true); setCatRemedies(null); setCatError(false);
    try {
      const parsed = await callAPI([{
        role:"user",
        content:`You are a home remedies herbalist. Provide 6 natural home remedies for the health category "${cat.label}". Return ONLY a valid JSON object, NO markdown. Structure: {"remedies":[{"name":"name","emoji":"emoji","tagline":"5-7 word tagline","condition":"specific condition","ingredients":["item 1","item 2","item 3"],"instructions":"clear 2-3 sentence how-to","benefit":"key healing benefit","difficulty":"Easy or Medium","time":"prep time"}]}`
      }]);
      setCatRemedies(parsed.remedies.map((r, i) => ({ ...r, id:`c_${cat.id}_${Date.now()}_${i}` })));
    } catch {
      setCatError(true);
    } finally {
      setCatLoading(false);
    }
  };

  const favCount = favorites.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{overflow-x:hidden}
        .hc-root{
          min-height:100vh;font-family:'Nunito',sans-serif;
          background-color:#7a4f2d;
          background-image:
            repeating-linear-gradient(89deg,transparent 0px,transparent 60px,rgba(0,0,0,0.04) 60px,rgba(0,0,0,0.04) 62px,transparent 62px,transparent 130px,rgba(255,255,255,0.025) 130px,rgba(255,255,255,0.025) 132px,transparent 132px,transparent 200px,rgba(0,0,0,0.03) 200px,rgba(0,0,0,0.03) 201px),
            repeating-linear-gradient(180deg,transparent 0px,transparent 80px,rgba(0,0,0,0.06) 80px,rgba(0,0,0,0.06) 82px,transparent 82px,transparent 180px,rgba(0,0,0,0.03) 180px,rgba(0,0,0,0.03) 181px),
            linear-gradient(168deg,#c49a6c 0%,#a0724a 12%,#7a4f2d 28%,#6b3f20 42%,#7c5030 55%,#9a6840 68%,#7a4f2d 80%,#5c3318 92%,#7a4822 100%);
        }
        .hc-root::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
          background:radial-gradient(ellipse at 50% 0%,rgba(230,180,100,0.18) 0%,transparent 60%),
                     radial-gradient(ellipse at 20% 100%,rgba(80,30,10,0.35) 0%,transparent 50%),
                     radial-gradient(ellipse at 80% 100%,rgba(60,20,5,0.3) 0%,transparent 50%);}

        /* Veggie layer — BEHIND everything */
        .hc-veggie{position:fixed;pointer-events:none;z-index:0;transform-origin:center;
          filter:drop-shadow(2px 4px 6px rgba(50,20,5,0.25));will-change:transform;}

        @keyframes vfloat0{0%,100%{transform:translateY(0px) rotate(-4deg)}50%{transform:translateY(-14px) rotate(4deg)}}
        @keyframes vfloat1{0%,100%{transform:translateY(0px) rotate(6deg)}50%{transform:translateY(-10px) rotate(-5deg)}}
        @keyframes vfloat2{0%,100%{transform:translateY(0px) rotate(-2deg)}50%{transform:translateY(-18px) rotate(6deg)}}
        @keyframes vfloat3{0%,100%{transform:translateY(0px) rotate(8deg)}50%{transform:translateY(-8px) rotate(-8deg)}}
        @keyframes leafSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(34px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes heroIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes btnPulse{0%,100%{box-shadow:0 6px 24px rgba(214,141,52,0.4)}50%{box-shadow:0 6px 36px rgba(214,141,52,0.7)}}

        .hc-hero{animation:heroIn 0.9s ease both}
        .hc-card{animation:cardIn 0.52s ease both}

        .hc-card-inner{
          border-radius:24px;padding:26px;border:1.5px solid;position:relative;overflow:hidden;
          box-shadow:0 8px 32px rgba(0,0,0,0.2),0 2px 8px rgba(0,0,0,0.1);}
        .hc-card-inner::before{content:'';position:absolute;top:-28px;right:-28px;width:110px;height:110px;
          border-radius:50%;background:var(--ac);opacity:0.1;pointer-events:none;}

        .hc-heart{position:absolute;top:12px;right:12px;border:none;border-radius:50%;
          width:34px;height:34px;cursor:pointer;font-size:15px;display:flex;align-items:center;
          justify-content:center;transition:all 0.2s;z-index:2;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
        .hc-heart:hover{transform:scale(1.18)}

        .hc-emoji-box{border-radius:18px;background:rgba(255,255,255,0.92);display:flex;
          align-items:center;justify-content:center;flex-shrink:0;transition:transform 0.3s;
          box-shadow:0 4px 16px var(--sh);}
        .hc-card-inner:hover .hc-emoji-box{transform:scale(1.1) rotate(6deg)}

        .hc-ing{font-size:12px;font-weight:700;padding:4px 12px;border-radius:18px;
          border:1.5px solid;display:inline-block;transition:transform 0.2s;}
        .hc-ing:hover{transform:scale(1.06)}

        .hc-title{font-family:'Playfair Display',serif;font-size:clamp(44px,7vw,76px);
          color:#fdf3e3;letter-spacing:-2px;line-height:1;
          text-shadow:0 3px 0 rgba(80,30,5,0.5),0 6px 24px rgba(0,0,0,0.4);}
        .hc-title em{color:#f4c25a;font-style:italic;}

        .hc-tagline{color:#f0d9b5;font-size:13px;font-weight:700;letter-spacing:5px;
          text-transform:uppercase;margin-top:10px;text-shadow:0 1px 4px rgba(0,0,0,0.4);}

        .hc-input{flex:1;min-width:240px;padding:16px 24px;font-size:15px;
          font-family:'Nunito',sans-serif;font-weight:600;
          border:2px solid rgba(255,235,180,0.35);border-radius:60px;
          background:rgba(255,248,230,0.14);color:#fff8e7;
          backdrop-filter:blur(14px);transition:all 0.3s;outline:none;}
        .hc-input::placeholder{color:rgba(255,235,180,0.5)}
        .hc-input:focus{border-color:rgba(244,194,90,0.8);background:rgba(255,248,230,0.22);
          box-shadow:0 0 0 4px rgba(244,194,90,0.18);}

        .hc-btn{padding:16px 30px;background:linear-gradient(135deg,#e8a228,#d4721a);
          color:#fff8e7;border:none;border-radius:60px;font-size:15px;font-weight:900;
          font-family:'Nunito',sans-serif;cursor:pointer;transition:all 0.25s;white-space:nowrap;
          animation:btnPulse 3s ease-in-out infinite;text-shadow:0 1px 3px rgba(0,0,0,0.3);}
        .hc-btn:hover:not(:disabled){transform:scale(1.06) translateY(-2px);filter:brightness(1.1)}
        .hc-btn:active:not(:disabled){transform:scale(0.97)}
        .hc-btn:disabled{opacity:0.65;cursor:not-allowed;animation:none}

        .hc-qbtn{background:rgba(255,245,210,0.1);border:1.5px solid rgba(255,235,170,0.22);
          border-radius:24px;padding:6px 15px;color:#f5dfa0;font-size:12px;
          font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .hc-qbtn:hover{background:rgba(244,194,90,0.2);border-color:#f4c25a;color:#fff8e7}

        .hc-loader-text{color:#f0d9b5;font-size:16px;font-weight:700;margin-top:16px;
          background:linear-gradient(90deg,#f0d9b5,#f4c25a,#e07830,#f0d9b5);
          background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
          animation:shimmer 2.2s linear infinite;}

        .hc-results-title{font-family:'Playfair Display',serif;color:#fdf3e3;
          font-size:clamp(19px,4vw,28px);text-align:center;margin-bottom:10px;
          text-shadow:0 2px 12px rgba(0,0,0,0.4);}

        .hc-disclaimer{display:inline-block;background:rgba(244,194,90,0.14);
          border:1px solid rgba(244,194,90,0.28);border-radius:30px;padding:6px 18px;
          color:#f5dfa0;font-size:12px;font-weight:600;margin-bottom:22px;}

        .hc-back{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);
          border-radius:22px;padding:7px 16px;color:rgba(255,255,255,0.65);
          font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;font-size:12px;
          margin-bottom:22px;transition:all 0.2s;}
        .hc-back:hover{background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.9)}

        .hc-nav{position:sticky;top:0;z-index:100;background:rgba(5,12,7,0.93);
          backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.07);
          padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:58px;gap:8px;}

        .hc-error{max-width:480px;margin:16px auto;padding:16px 22px;
          background:rgba(200,50,50,0.15);border:1px solid rgba(200,50,50,0.3);
          border-radius:18px;color:#ffcdd2;text-align:center;font-weight:600;}

        .hc-cat-card{border-radius:20px;padding:20px 16px;cursor:pointer;text-align:center;
          border:1px solid;transition:transform 0.2s,box-shadow 0.2s;}
        .hc-cat-card:hover{transform:translateY(-5px);}

        button:focus{outline:none}
        input:focus{outline:none}
      `}</style>

      <div className="hc-root">

        {/* ── Veggie background (pointer-events:none so it never blocks clicks) ── */}
        {BG_VEGGIES.map((v, i) => (
          <div key={i} className="hc-veggie"
            style={{
              left:`${v.x}%`, top:`${v.y}%`, fontSize:v.size, opacity:0.26,
              animation:`vfloat${i % 4} ${v.dur}s ease-in-out infinite`,
              animationDelay:`${v.delay}s`,
              transform:`translate(${(mouse.x-0.5)*v.speed*-120}px,${(mouse.y-0.5)*v.speed*-120}px)`,
            }}>
            {v.emoji}
          </div>
        ))}

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <nav className="hc-nav">
          <div onClick={() => setView("home")}
            style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }}>
            <span style={{ fontSize:24 }}>🌿</span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#fdf3e3", fontWeight:700 }}>
              Home <em style={{ color:"#f4c25a" }}>Cure</em>
            </span>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[
              { label:"🏠 Home",       v:"home" },
              { label:"📂 Categories", v:"categories" },
              { label:`❤️ Favorites${favCount > 0 ? ` (${favCount})` : ""}`, v:"favorites" },
            ].map(nav => {
              const active = view === nav.v || (view === "cat-detail" && nav.v === "categories");
              return (
                <button key={nav.v} onClick={() => setView(nav.v)}
                  style={{ background: active ? "rgba(244,194,90,0.18)" : "transparent",
                    border: active ? "1px solid rgba(244,194,90,0.4)" : "1px solid transparent",
                    borderRadius:20, padding:"6px 14px",
                    color: active ? "#f4c25a" : "rgba(255,255,255,0.6)",
                    fontSize:12, fontFamily:"'Nunito',sans-serif", fontWeight:700,
                    cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                  {nav.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════════════
            HOME VIEW
        ════════════════════════════════════════════════════════════ */}
        {view === "home" && (
          <div>
            {/* Hero */}
            <div style={{ textAlign:"center", padding:"52px 20px 30px" }}>
              <div className="hc-hero">
                <div style={{ fontSize:56, marginBottom:6, filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>🌿</div>
                <h1 className="hc-title">Home <em>Cure</em></h1>
                <p className="hc-tagline">Kitchen Remedies · Nature's Wisdom</p>
                <div style={{ maxWidth:600, margin:"28px auto 0", display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
                  <input className="hc-input" value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && fetchRemedies()}
                    placeholder="What ails you? headache, cold, sore throat…"/>
                  <button className="hc-btn" onClick={() => fetchRemedies()} disabled={loading}>
                    {loading ? "✨ Searching…" : "🔍 Find Remedies"}
                  </button>
                </div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginTop:13 }}>
                  {QUICK_PICKS.map(p => (
                    <button key={p.q} className="hc-qbtn"
                      onClick={() => { setQuery(p.q); fetchRemedies(p.q); }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:54, display:"inline-block", animation:"leafSpin 1.8s linear infinite", filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>🌿</div>
                <p className="hc-loader-text">Searching nature's pantry for you…</p>
              </div>
            )}

            {/* Error */}
            {srchError && <div className="hc-error">🌿 {srchError}</div>}

            {/* Results */}
            {remedies && !loading && (
              <div style={{ maxWidth:940, margin:"0 auto", padding:"0 20px 40px" }}>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <h2 className="hc-results-title">
                    Remedies for <em style={{ color:"#f4c25a", fontStyle:"italic" }}>{remedies.condition}</em>
                  </h2>
                  {remedies.disclaimer && <p className="hc-disclaimer">⚕️ {remedies.disclaimer}</p>}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))", gap:18 }}>
                  {(remedies.remedies || []).map((r, i) => (
                    <RemedyCard key={r.id} remedy={r} themeIdx={i} isFav={isFav} onToggleFav={toggleFav}/>
                  ))}
                </div>
              </div>
            )}

            {/* Landing feature cards */}
            {!loading && !remedies && !srchError && (
              <div style={{ textAlign:"center", padding:"10px 20px 50px" }}>
                <p style={{ color:"rgba(255,240,200,0.45)", fontSize:14, fontWeight:600, marginBottom:28 }}>
                  Type your ailment or pick one above to get started
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:16, justifyContent:"center" }}>
                  {[
                    { icon:"🌿", text:"Natural kitchen ingredients" },
                    { icon:"⚡", text:"Fast AI-powered lookup" },
                    { icon:"📖", text:"Step-by-step instructions" },
                    { icon:"❤️", text:"Time-tested wisdom" },
                  ].map((f, i) => (
                    <div key={i} style={{ background:"rgba(255,245,210,0.09)", border:"1px solid rgba(255,235,170,0.15)", borderRadius:18, padding:"22px 18px", width:155, textAlign:"center" }}>
                      <div style={{ fontSize:34, marginBottom:10 }}>{f.icon}</div>
                      <div style={{ color:"rgba(255,240,200,0.7)", fontSize:12, fontWeight:600, lineHeight:1.4 }}>{f.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ textAlign:"center", color:"rgba(255,240,200,0.28)", fontSize:12, paddingBottom:30 }}>
              🌿 Always consult a healthcare professional for serious conditions
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            CATEGORIES VIEW
        ════════════════════════════════════════════════════════════ */}
        {view === "categories" && (
          <div style={{ maxWidth:940, margin:"0 auto", padding:"34px 20px 60px" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fdf3e3", fontSize:28, marginBottom:4 }}>📂 Browse by Category</h2>
            <p style={{ color:"rgba(255,240,200,0.4)", fontWeight:600, marginBottom:26, fontSize:13 }}>
              Pick a health focus to get AI-powered natural remedies
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} className="hc-cat-card"
                  style={{ background:`linear-gradient(140deg,${cat.grad[0]},${cat.grad[1]})`, borderColor:`${cat.accent}22` }}
                  onClick={() => fetchCategoryRemedies(cat)}>
                  <div style={{ fontSize:36, marginBottom:10 }}>{cat.emoji}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", color:cat.text, fontSize:15, fontWeight:700, marginBottom:4 }}>{cat.label}</div>
                  <div style={{ color:cat.accent, fontSize:11, fontWeight:600, lineHeight:1.4 }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            CATEGORY DETAIL VIEW
        ════════════════════════════════════════════════════════════ */}
        {view === "cat-detail" && (
          <div style={{ maxWidth:940, margin:"0 auto", padding:"28px 20px 60px" }}>
            <button className="hc-back" onClick={() => setView("categories")}>← All Categories</button>

            {selectedCat && (
              <div style={{ marginBottom:22 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                  <span style={{ fontSize:42 }}>{selectedCat.emoji}</span>
                  <div>
                    <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fdf3e3", fontSize:26, marginBottom:2 }}>{selectedCat.label}</h2>
                    <p style={{ color:"rgba(255,240,200,0.4)", fontSize:13, fontWeight:600 }}>{selectedCat.desc}</p>
                  </div>
                </div>
                {/* Category switcher tabs */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => fetchCategoryRemedies(cat)}
                      style={{ background: selectedCat.id===cat.id ? "#f4c25a" : "rgba(255,255,255,0.07)",
                        border:"1.5px solid",
                        borderColor: selectedCat.id===cat.id ? "#f4c25a" : "rgba(255,255,255,0.12)",
                        borderRadius:22, padding:"5px 13px",
                        color: selectedCat.id===cat.id ? "#2a1500" : "#d4f0da",
                        fontSize:11, fontFamily:"'Nunito',sans-serif", fontWeight:700,
                        cursor:"pointer", transition:"all 0.2s" }}>
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {catLoading && (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:54, display:"inline-block", animation:"leafSpin 1.8s linear infinite", filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}>🌿</div>
                <p className="hc-loader-text">Loading {selectedCat?.label} remedies…</p>
              </div>
            )}

            {catError && (
              <p style={{ textAlign:"center", color:"#ef9a9a", fontWeight:700, padding:"30px 0" }}>
                Something went wrong. Please try again.
              </p>
            )}

            {catRemedies && !catLoading && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))", gap:18 }}>
                {catRemedies.map((r, i) => (
                  <RemedyCard key={r.id} remedy={r} themeIdx={i} isFav={isFav} onToggleFav={toggleFav}/>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            FAVORITES VIEW
        ════════════════════════════════════════════════════════════ */}
        {view === "favorites" && (
          <div style={{ maxWidth:940, margin:"0 auto", padding:"34px 20px 60px" }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fdf3e3", fontSize:28, marginBottom:4 }}>❤️ My Favorites</h2>
            <p style={{ color:"rgba(255,240,200,0.4)", fontWeight:600, marginBottom:26, fontSize:13 }}>
              {favCount > 0 ? `${favCount} saved ${favCount === 1 ? "remedy" : "remedies"}` : "Your saved remedies appear here"}
            </p>

            {favCount === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:64, marginBottom:14 }}>🤍</div>
                <p style={{ color:"rgba(255,240,200,0.45)", fontSize:16, fontWeight:700, marginBottom:8 }}>No favorites saved yet!</p>
                <p style={{ color:"rgba(255,240,200,0.28)", fontSize:13, marginBottom:24 }}>Tap the ❤️ heart on any remedy card to save it here.</p>
                <button onClick={() => setView("categories")}
                  style={{ background:"#f4c25a", color:"#2a1500", border:"none", borderRadius:30, padding:"11px 24px", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>
                  📂 Browse Categories
                </button>
              </div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))", gap:18 }}>
                  {favorites.map((r, i) => (
                    <RemedyCard key={r.id} remedy={r} themeIdx={i} isFav={isFav} onToggleFav={toggleFav}/>
                  ))}
                </div>
                <div style={{ textAlign:"center", marginTop:30 }}>
                  <button
                    onClick={() => { if (window.confirm("Clear all favorites?")) setFavorites([]); }}
                    style={{ background:"rgba(255,80,80,0.15)", border:"1px solid rgba(255,80,80,0.3)", borderRadius:24, padding:"8px 20px", color:"#ffcdd2", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                    🗑 Clear All Favorites
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
}
