import { useState, useEffect } from "react";

const ENTRY_COLORS = ["#1D9E75","#378ADD","#EF9F27","#D4537E","#7F77DD","#D85A30"];

// Default macro split percentages (of total calories)
const DEFAULT_PCT = { prot: 25, carb: 50, fat: 25 };
// Calories per gram
const KCAL_PER_G = { prot: 4, carb: 4, fat: 9 };

function pctToGrams(pct, goalKcal, key) {
  return Math.round((goalKcal * (pct / 100)) / KCAL_PER_G[key]);
}

export default function CalorieTracker() {
  const [entries, setEntries] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [goal, setGoal] = useState(2000);
  const [form, setForm] = useState({ name: "", cals: "", prot: "", carb: "", fat: "" });
  const [today, setToday] = useState("");

  // Percentage-based macro targets — stores the % of total calories
  const [macroPct, setMacroPct] = useState({ prot: 25, carb: 50, fat: 25 });
  const [showCustomTargets, setShowCustomTargets] = useState(false);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
  }, []);

  const totalCals = entries.reduce((s, e) => s + e.cals, 0);
  const totalProt = entries.reduce((s, e) => s + e.prot, 0);
  const totalCarb = entries.reduce((s, e) => s + e.carb, 0);
  const totalFat  = entries.reduce((s, e) => s + e.fat,  0);
  const pct       = goal > 0 ? Math.min(totalCals / goal, 1) : 0;
  const isOver    = totalCals > goal;

  const targets = {
    prot: pctToGrams(macroPct.prot, goal, "prot"),
    carb: pctToGrams(macroPct.carb, goal, "carb"),
    fat:  pctToGrams(macroPct.fat,  goal, "fat"),
  };

  const totalPct = macroPct.prot + macroPct.carb + macroPct.fat;
  const isCustom = macroPct.prot !== DEFAULT_PCT.prot || macroPct.carb !== DEFAULT_PCT.carb || macroPct.fat !== DEFAULT_PCT.fat;

  const barColor = isOver ? "#E24B4A" : pct >= 0.8 ? "#1D9E75" : "#378ADD";

  function handlePctChange(key, val) {
    const num = Math.max(0, Math.min(100, parseFloat(val) || 0));
    setMacroPct(prev => ({ ...prev, [key]: num }));
  }

  function resetPct() {
    setMacroPct({ ...DEFAULT_PCT });
  }

  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addEntry() {
    const name = form.name.trim();
    const cals = parseFloat(form.cals) || 0;
    if (!name || cals <= 0) return;
    setEntries([...entries, {
      id: nextId, name, cals,
      prot: parseFloat(form.prot) || 0,
      carb: parseFloat(form.carb) || 0,
      fat:  parseFloat(form.fat)  || 0,
      color: ENTRY_COLORS[nextId % ENTRY_COLORS.length],
    }]);
    setNextId(nextId + 1);
    setForm({ name: "", cals: "", prot: "", carb: "", fat: "" });
  }

  function removeEntry(id) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  const inputStyle = {
    fontSize: 14,
    padding: "8px 11px",
    border: "3px solid #111",
    borderRadius: 0,
    background: "#f5f5f5",
    color: "#111",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    outline: "none",
  };

  const card = {
    background: "rgba(255,255,255,0.92)",
    border: "3px solid #111",
    boxShadow: "6px 6px 0px #111",
    borderRadius: 0,
  };

  const btnStyle = {
    background: "#111",
    color: "#fff",
    border: "3px solid #111",
    borderRadius: 0,
    padding: "9px 20px",
    fontSize: 14,
    fontFamily: "inherit",
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "4px 4px 0px #555",
    display: "flex",
    alignItems: "center",
    gap: 7,
    transition: "none",
    whiteSpace: "nowrap",
  };

  const macros = [
    { key: "prot", label: "PROTEIN", value: totalProt, target: targets.prot, pct: macroPct.prot, color: "#378ADD" },
    { key: "carb", label: "CARBS",   value: totalCarb, target: targets.carb, pct: macroPct.carb, color: "#EF9F27" },
    { key: "fat",  label: "FAT",     value: totalFat,  target: targets.fat,  pct: macroPct.fat,  color: "#D4537E" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/Title_Animation.gif')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      imageRendering: "pixelated",
    }}>
      <div style={{ minHeight: "100vh", background: "rgba(255,255,255,0.45)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 26px", fontFamily: "inherit", zoom: 1.3 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: 25, fontWeight: 700, margin: 0, letterSpacing: 1 }}>DAILY LOG</h1>
              <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 4, letterSpacing: 1 }}>{today.toUpperCase()}</p>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#111", background: "rgba(255,255,255,0.9)", border: "3px solid #111", boxShadow: "3px 3px 0 #111", padding: "5px 13px", letterSpacing: 1 }}>
              {Math.round(pct * 100)}% OF GOAL
            </div>
          </div>

          {/* Progress card */}
          <div style={{ ...card, padding: "1.3rem", marginBottom: "1.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 11 }}>
              <div>
                <span style={{ fontSize: 34, fontWeight: 700 }}>{Math.round(totalCals)}</span>
                <span style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginLeft: 7 }}>/ {Math.round(goal)} KCAL</span>
              </div>
              <span style={{ fontSize: 12, color: isOver ? "#E24B4A" : "rgba(0,0,0,0.4)", letterSpacing: 1 }}>
                {isOver ? `+${Math.round(totalCals - goal)} OVER` : `${Math.round(goal - totalCals)} REMAINING`}
              </span>
            </div>
            <div style={{ height: 17, background: "#ddd", border: "3px solid #111", boxShadow: "3px 3px 0 #111", overflow: "hidden" }}>
              <div style={{ width: `${Math.round(pct * 100)}%`, height: "100%", background: barColor, transition: "width 0.4s ease, background 0.3s" }} />
            </div>
          </div>

          {/* Macro strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 13, marginBottom: "0.7rem" }}>
            {macros.map((m) => {
              const consumed = Math.round(m.value);
              const targetG  = m.target;
              const pctOfTarget = targetG > 0 ? Math.min(Math.round((m.value / targetG) * 100), 999) : 0;
              const remaining = targetG - consumed;
              const isOverMacro = consumed > targetG;

              return (
                <div key={m.label} style={{ ...card, padding: "13px 15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em" }}>{m.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: m.color, letterSpacing: "0.04em" }}>{m.pct}% OF KCAL</div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 5, background: "rgba(0,0,0,0.12)", margin: "7px 0", border: "2px solid #111", overflow: "hidden" }}>
                    <div style={{
                      width: `${Math.min(pctOfTarget, 100)}%`,
                      height: "100%",
                      background: isOverMacro ? "#E24B4A" : m.color,
                      transition: "width 0.4s ease",
                    }} />
                  </div>

                  {/* Consumed */}
                  <div style={{ fontSize: 19, fontWeight: 700 }}>
                    {consumed}<span style={{ fontSize: 11, fontWeight: 400, color: "rgba(0,0,0,0.4)", marginLeft: 2 }}>G</span>
                  </div>

                  <div style={{ borderTop: "1.5px solid rgba(0,0,0,0.1)", margin: "8px 0" }} />

                  {/* Stats row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "rgba(0,0,0,0.35)", letterSpacing: "0.06em", marginBottom: 2 }}>TARGET</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.65)" }}>{targetG}G</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: "rgba(0,0,0,0.35)", letterSpacing: "0.06em", marginBottom: 2 }}>{isOverMacro ? "OVER" : "LEFT"}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isOverMacro ? "#E24B4A" : "rgba(0,0,0,0.65)" }}>
                        {isOverMacro ? `+${Math.abs(remaining)}G` : `${remaining}G`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color: "rgba(0,0,0,0.35)", letterSpacing: "0.06em", marginBottom: 2 }}>OF GOAL</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isOverMacro ? "#E24B4A" : pctOfTarget >= 80 ? "#1D9E75" : m.color }}>
                        {pctOfTarget}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Targets toggle row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.3rem", paddingLeft: 4 }}>
            <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", letterSpacing: "0.06em" }}>
              {isCustom ? "USING CUSTOM MACRO SPLIT" : "DEFAULT SPLIT: 25% PROTEIN · 50% CARBS · 25% FAT"}
            </div>
            <button
              onClick={() => setShowCustomTargets(!showCustomTargets)}
              style={{
                background: showCustomTargets ? "#111" : "rgba(255,255,255,0.9)",
                color: showCustomTargets ? "#fff" : "#111",
                border: "2px solid #111",
                borderRadius: 0,
                padding: "4px 11px",
                fontSize: 10,
                fontFamily: "inherit",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.07em",
                boxShadow: "2px 2px 0 #111",
              }}
            >
              {showCustomTargets ? "▲ HIDE" : "▼ SET MACRO SPLIT"}
            </button>
          </div>

          {/* Custom targets panel */}
          {showCustomTargets && (
            <div style={{ ...card, padding: "1.2rem", marginBottom: "1.3rem" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.45)", letterSpacing: "0.1em", marginBottom: 4 }}>
                MACRO SPLIT
                <span style={{ fontWeight: 400, color: "rgba(0,0,0,0.3)", marginLeft: 8 }}>% OF DAILY CALORIES</span>
              </div>

              {/* Total indicator */}
              <div style={{
                fontSize: 10,
                marginBottom: 14,
                color: totalPct === 100 ? "#1D9E75" : "#E24B4A",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}>
                TOTAL: {totalPct}%{totalPct !== 100 ? ` — SHOULD EQUAL 100%` : " ✓"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
                {[
                  { key: "prot", label: "PROTEIN %", color: "#378ADD", grams: targets.prot },
                  { key: "carb", label: "CARBS %",   color: "#EF9F27", grams: targets.carb },
                  { key: "fat",  label: "FAT %",     color: "#D4537E", grams: targets.fat  },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, color: f.color, display: "block", marginBottom: 5, letterSpacing: "0.06em", fontWeight: 700 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      <input
                        style={{ ...inputStyle, paddingRight: 30 }}
                        type="number" min="0" max="100"
                        value={macroPct[f.key]}
                        onChange={(e) => handlePctChange(f.key, e.target.value)}
                      />
                      <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "rgba(0,0,0,0.35)", pointerEvents: "none" }}>%</span>
                    </div>
                    {/* Show resulting grams */}
                    <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 4, letterSpacing: "0.04em" }}>
                      = {f.grams}G at {goal} KCAL goal
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={resetPct}
                  style={{ ...btnStyle, background: "#fff", color: "#111", boxShadow: "3px 3px 0 #111", fontSize: 11, padding: "6px 14px" }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "none"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0 #111"; }}
                >
                  RESET TO DEFAULT
                </button>
              </div>
            </div>
          )}

          {/* Add food form */}
          <div style={{ ...card, padding: "1.3rem", marginBottom: "1.3rem" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.45)", letterSpacing: "0.1em", marginBottom: 12 }}>
              ADD FOOD
            </div>

            <input
              style={{ ...inputStyle, marginBottom: 9, fontSize: 15 }}
              name="name" value={form.name}
              placeholder="FOOD NAME..."
              onChange={handleForm}
              onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("calInput").focus(); }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, marginBottom: 15 }}>
              {[
                { label: "CALORIES", name: "cals", placeholder: "KCAL", id: "calInput" },
                { label: "PROTEIN G", name: "prot", placeholder: "0" },
                { label: "CARBS G",   name: "carb", placeholder: "0" },
                { label: "FAT G",     name: "fat",  placeholder: "0" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", display: "block", marginBottom: 5, letterSpacing: "0.06em" }}>{f.label}</label>
                  <input
                    id={f.id}
                    style={inputStyle}
                    type="number" min="0"
                    name={f.name} value={form[f.name]} placeholder={f.placeholder}
                    onChange={handleForm}
                    onKeyDown={(e) => { if (e.key === "Enter" && f.name === "fat") addEntry(); }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "2px solid #111" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <label style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", letterSpacing: 1 }}>GOAL</label>
                <input
                  style={{ ...inputStyle, width: 88 }}
                  type="number" min="0" value={goal}
                  onChange={(e) => setGoal(parseFloat(e.target.value) || 0)}
                />
                <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", letterSpacing: 1 }}>KCAL/DAY</span>
              </div>
              <button
                onClick={addEntry}
                style={btnStyle}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translate(4px,4px)"; e.currentTarget.style.boxShadow = "none"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px #555"; }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
                ADD ENTRY
              </button>
            </div>
          </div>

          {/* Food log */}
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ padding: "13px 21px", borderBottom: "3px solid #111", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#111" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>FOOD LOG</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 1 }}>{entries.length} ITEM{entries.length !== 1 ? "S" : ""}</span>
            </div>

            {entries.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "rgba(0,0,0,0.3)", fontSize: 12, letterSpacing: 1 }}>
                NO ENTRIES YET
              </div>
            ) : (
              entries.map((entry, i) => {
                const macroLabels = [];
                if (entry.prot) macroLabels.push(`${entry.prot}G PROTEIN`);
                if (entry.carb) macroLabels.push(`${entry.carb}G CARBS`);
                if (entry.fat)  macroLabels.push(`${entry.fat}G FAT`);
                return (
                  <div
                    key={entry.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 21px", borderBottom: i < entries.length - 1 ? "2px solid #ddd" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.9)" : "rgba(245,245,245,0.9)" }}
                  >
                    <div style={{ width: 10, height: 10, background: entry.color, border: "2px solid #111", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: 0.5 }}>{entry.name.toUpperCase()}</div>
                      {macroLabels.length > 0 && (
                        <div style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginTop: 2, letterSpacing: 0.5 }}>{macroLabels.join(" · ")}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, letterSpacing: 1 }}>{Math.round(entry.cals)} KCAL</div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      style={{ background: "#fff", border: "2px solid #111", color: "#111", borderRadius: 0, width: 27, height: 27, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 #111", fontFamily: "inherit" }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "none"; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "2px 2px 0 #111"; }}
                    >
                      ×
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}