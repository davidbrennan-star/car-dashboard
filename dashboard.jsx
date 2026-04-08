import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const ALL_DATA = [
  { month:"July",      views:161205, cars:67.40, clicks:885,  leads:67,  avgTime:10.93 },
  { month:"August",    views:173164, cars:72.51, clicks:1142, leads:144, avgTime:11.14 },
  { month:"September", views:170445, cars:58.74, clicks:1172, leads:106, avgTime:11.74 },
  { month:"October",   views:126161, cars:63.91, clicks:1329, leads:92,  avgTime:11.44 },
  { month:"November",  views:159721, cars:62.19, clicks:1165, leads:88,  avgTime:11.19 },
  { month:"December",  views:133621, cars:56.43, clicks:1072, leads:58,  avgTime:10.86 },
  { month:"January",   views:224165, cars:61.09, clicks:1433, leads:142, avgTime:10.95 },
  { month:"February",  views:230442, cars:63.64, clicks:1400, leads:189, avgTime:10.81 },
];

const METRICS = [
  { key:"views",   label:"Views",            color:"#378ADD", fmt: v => v.toLocaleString() },
  { key:"clicks",  label:"Fullscreen clicks", color:"#7F77DD", fmt: v => v.toLocaleString() },
  { key:"leads",   label:"Leads",            color:"#1D9E75", fmt: v => v.toString() },
  { key:"avgTime", label:"Avg. view time",   color:"#EF9F27", fmt: v => v.toFixed(2)+"m" },
];

const MONTHS = ALL_DATA.map(d => d.month);
const SHORT = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

const totals = {};
METRICS.forEach(m => { totals[m.key] = ALL_DATA.reduce((s,d) => s + d[m.key], 0); });
const avgAvgTime = totals.avgTime / ALL_DATA.length;

function pct(val, total) { return ((val / total) * 100).toFixed(1); }

const TT = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-md)", padding:"8px 12px", fontSize:12 }}>
      <div style={{ fontWeight:500, color:"var(--color-text-primary)" }}>{p.name}</div>
      <div style={{ color: p.payload.color, marginTop:2 }}>{p.payload.fmtVal} <span style={{color:"var(--color-text-secondary)"}}>({p.value.toFixed(1)}%)</span></div>
    </div>
  );
};

function MiniPie({ metric, selectedIdx, onSelect }) {
  const pieData = ALL_DATA.map((d, i) => ({
    name: SHORT[i],
    value: parseFloat(((d[metric.key] / (metric.key === "avgTime" ? ALL_DATA.length : 1)) / (metric.key === "avgTime" ? avgAvgTime : totals[metric.key]) * 100).toFixed(2)),
    rawValue: d[metric.key],
    fmtVal: metric.fmt(d[metric.key]),
    color: i === selectedIdx ? metric.color : metric.color + "55",
    idx: i,
  }));

  // recalc as share of total
  const pieData2 = ALL_DATA.map((d, i) => {
    const total = metric.key === "avgTime" ? ALL_DATA.reduce((s,x)=>s+x.avgTime,0) : totals[metric.key];
    return {
      name: SHORT[i],
      value: parseFloat((d[metric.key] / total * 100).toFixed(2)),
      rawValue: d[metric.key],
      fmtVal: metric.fmt(d[metric.key]),
      color: i === selectedIdx ? metric.color : metric.color + "44",
      idx: i,
    };
  });

  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1rem" }}>
      <div style={{ fontSize:12, fontWeight:500, color:"var(--color-text-secondary)", marginBottom:4 }}>{metric.label}</div>
      <div style={{ fontSize:18, fontWeight:500, color:"var(--color-text-primary)", marginBottom:2 }}>
        {metric.fmt(ALL_DATA[selectedIdx][metric.key])}
      </div>
      <div style={{ fontSize:11, color: metric.color, marginBottom:8 }}>
        {pct(ALL_DATA[selectedIdx][metric.key], metric.key === "avgTime" ? ALL_DATA.reduce((s,x)=>s+x.avgTime,0) : totals[metric.key])}% of period total
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie
            data={pieData2}
            cx="50%" cy="50%"
            innerRadius={38} outerRadius={58}
            dataKey="value"
            startAngle={90} endAngle={-270}
            onClick={(_, idx) => onSelect(idx)}
            style={{ cursor:"pointer" }}
          >
            {pieData2.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke={i === selectedIdx ? metric.color : "none"} strokeWidth={i === selectedIdx ? 2 : 0} />
            ))}
          </Pie>
          <Tooltip content={<TT />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"4px 8px", marginTop:4 }}>
        {SHORT.map((s,i) => (
          <span key={i} onClick={() => onSelect(i)} style={{
            fontSize:10, cursor:"pointer", padding:"2px 6px",
            borderRadius:"var(--border-radius-md)",
            background: i === selectedIdx ? metric.color+"22" : "transparent",
            color: i === selectedIdx ? metric.color : "var(--color-text-secondary)",
            fontWeight: i === selectedIdx ? 500 : 400,
            border: i === selectedIdx ? `0.5px solid ${metric.color}` : "0.5px solid transparent"
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedIdx, setSelectedIdx] = useState(7);

  const cur = ALL_DATA[selectedIdx];
  const prev = selectedIdx > 0 ? ALL_DATA[selectedIdx - 1] : null;

  const delta = (key) => {
    if (!prev) return null;
    const d = cur[key] - prev[key];
    const p = (d / prev[key] * 100).toFixed(1);
    return { d, p, up: d >= 0 };
  };

  return (
    <div style={{ padding:"1.5rem 1rem", fontFamily:"var(--font-sans)", color:"var(--color-text-primary)" }}>
      <h2 style={{ margin:"0 0 4px", fontSize:18, fontWeight:500 }}>Car listings dashboard</h2>
      <div style={{ fontSize:13, color:"var(--color-text-secondary)", marginBottom:"1.25rem" }}>Click a month segment or label on any chart to drilldown</div>

      {/* Month selector */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1.5rem" }}>
        {MONTHS.map((m,i) => (
          <button key={i} onClick={() => setSelectedIdx(i)} style={{
            padding:"5px 12px", borderRadius:"var(--border-radius-md)", fontSize:12,
            border: i === selectedIdx ? "0.5px solid var(--color-border-primary)" : "0.5px solid var(--color-border-tertiary)",
            background: i === selectedIdx ? "var(--color-background-secondary)" : "transparent",
            color:"var(--color-text-primary)", cursor:"pointer", fontWeight: i === selectedIdx ? 500 : 400
          }}>{SHORT[i]}</button>
        ))}
      </div>

      {/* Month summary bar */}
      <div style={{ background:"var(--color-background-secondary)", borderRadius:"var(--border-radius-lg)", padding:"1rem 1.25rem", marginBottom:"1.5rem" }}>
        <div style={{ fontSize:15, fontWeight:500, marginBottom:10 }}>{cur.month} {cur.month === "January" || cur.month === "February" ? "2026" : "2025"}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {METRICS.map(m => {
            const chg = delta(m.key);
            return (
              <div key={m.key} style={{ flex:1, minWidth:100 }}>
                <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginBottom:2 }}>{m.label}</div>
                <div style={{ fontSize:17, fontWeight:500 }}>{m.fmt(cur[m.key])}</div>
                {chg && (
                  <div style={{ fontSize:11, color: chg.up ? "#1D9E75" : "#D85A30", marginTop:2 }}>
                    {chg.up ? "▲" : "▼"} {Math.abs(chg.p)}% vs {SHORT[selectedIdx-1]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie charts grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
        {METRICS.map(m => (
          <MiniPie key={m.key} metric={m} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
        ))}
      </div>

      <div style={{ fontSize:11, color:"var(--color-text-secondary)", marginTop:12, textAlign:"center" }}>
        Each pie shows share of the full Jul–Feb period. Highlighted segment = selected month.
      </div>
    </div>
  );
}
