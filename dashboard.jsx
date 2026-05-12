import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ORANGE = "#E8510A";
const TEAL = "#0BA187";
const DARK = "#111";

const allMonths = [
  { m:"Apr 25", views:161205, hours:110.7, avgTime:80, clicks:885,  shares:326, leads:67  },
  { m:"May 25", views:173164, hours:117.2, avgTime:80, clicks:1142, shares:329, leads:78  },
  { m:"Jun 25", views:170445, hours:112.2, avgTime:80, clicks:1172, shares:368, leads:104 },
  { m:"Jul 25", views:126161, hours:115.7, avgTime:80, clicks:1329, shares:366, leads:116 },
  { m:"Aug 25", views:159721, hours:103.9, avgTime:80, clicks:1165, shares:275, leads:63  },
  { m:"Sep 25", views:133621, hours:92.7,  avgTime:80, clicks:1072, shares:324, leads:61  },
  { m:"Oct 25", views:224165, hours:85.3,  avgTime:80, clicks:1433, shares:230, leads:57  },
  { m:"Nov 25", views:230442, hours:116.4, avgTime:80, clicks:1400, shares:287, leads:68  },
  { m:"Dec 25", views:230000, hours:113.7, avgTime:80, clicks:1785, shares:365, leads:66  },
  { m:"Jan 26", views:11405,  hours:109.7, avgTime:80, clicks:1793, shares:387, leads:76  },
  { m:"Feb 26", views:11405,  hours:109.7, avgTime:80, clicks:1785, shares:359, leads:78  },
  { m:"Mar 26", views:11405,  hours:114.1, avgTime:80, clicks:1769, shares:377, leads:81  },
  { m:"Apr 26", views:12047,  hours:114,   avgTime:80, clicks:1769, shares:377, leads:81  },
];

const heatViews = {
  days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  rows: [
    { label:"Morning", sub:"6AM–12PM", data:[390,375,476,417,333,486,503] },
    { label:"Afternoon", sub:"12PM–6PM", data:[640,587,680,657,440,561,572] },
    { label:"Evening", sub:"6PM–12AM", data:[597,600,727,652,516,574,606] },
    { label:"Night", sub:"12AM–6AM", data:[92,93,120,103,69,86,95] },
  ]
};

const heatLeads = {
  days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  rows: [
    { label:"Morning", sub:"6AM–12PM", data:[2,2,5,0,4,9,3] },
    { label:"Afternoon", sub:"12PM–6PM", data:[2,7,5,6,1,10,3] },
    { label:"Evening", sub:"6PM–12AM", data:[4,0,6,3,1,3,0] },
    { label:"Night", sub:"12AM–6AM", data:[0,1,1,2,0,1,0] },
  ]
};

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1a1a1a", border:`0.5px solid ${ORANGE}55`, borderRadius:6, padding:"8px 12px", fontSize:12, color:"#fff" }}>
      <div style={{ fontWeight:500, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color }}>{p.name}: <b>{typeof p.value==="number"&&p.value>999?p.value.toLocaleString():p.value}</b></div>)}
    </div>
  );
};

function Heatmap({ data, color }) {
  const max = Math.max(...data.rows.flatMap(r=>r.data));
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:3, fontSize:11 }}>
        <thead>
          <tr>
            <th style={{ width:90, textAlign:"left", color:"#888", fontWeight:400, paddingBottom:4 }}></th>
            {data.days.map(d=><th key={d} style={{ color:"#888", fontWeight:400, paddingBottom:4 }}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r,ri)=>(
            <tr key={ri}>
              <td style={{ paddingRight:8, lineHeight:1.3 }}>
                <div style={{ fontSize:11, color:"#ccc" }}>{r.label}</div>
                <div style={{ fontSize:10, color:"#666" }}>{r.sub}</div>
              </td>
              {r.data.map((v,ci)=>{
                const intensity = v/max;
                const bg = color==="orange"
                  ? `rgba(232,81,10,${0.08+intensity*0.82})`
                  : `rgba(11,161,135,${0.08+intensity*0.82})`;
                return (
                  <td key={ci} style={{ padding:"10px 4px", textAlign:"center", background:bg, borderRadius:4, fontWeight:500, color:intensity>0.45?"#fff":"#aaa", fontSize:11 }}>{v}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MONTH_OPTIONS = ["Show all", ...allMonths.map(m=>m.m)];

export default function Dashboard() {
  const [filter, setFilter] = useState("Show all");

  const filtered = useMemo(() => {
    if (filter === "Show all") return allMonths;
    const idx = allMonths.findIndex(m=>m.m===filter);
    return idx >= 0 ? allMonths.slice(0, idx+1) : allMonths;
  }, [filter]);

  const latest = filtered[filtered.length-1];
  const totalViews = filtered.reduce((s,d)=>s+d.views,0);
  const avgViews = Math.round(totalViews/filtered.length);
  const avgTime = "80%";
  const totalHours = filtered.reduce((s,d)=>s+d.hours,0).toFixed(0);
  const totalClicks = filtered.reduce((s,d)=>s+d.clicks,0);

  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", color:"#fff", fontFamily:"system-ui, sans-serif", padding:"1.5rem 1.25rem" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:ORANGE, borderRadius:6, padding:"4px 10px", fontSize:13, fontWeight:700, color:"#fff", letterSpacing:1 }}>PHYRON</div>
          <div>
            <div style={{ fontSize:16, fontWeight:600 }}>Rinta Jouppi</div>
            <div style={{ fontSize:12, color:"#777" }}>Campaign Report · Apr 2025 – Apr 2026</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12 }}>
          <span style={{ color:"#777" }}>Filter by month</span>
          <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ background:"#1a1a1a", color:"#fff", border:"0.5px solid #333", borderRadius:6, padding:"5px 10px", fontSize:12 }}>
            {MONTH_OPTIONS.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:"1.75rem" }}>
        {[
          { label:"Total video views", value:totalViews.toLocaleString(), sub:"All time in range" },
          { label:"Avg monthly views", value:avgViews.toLocaleString(), sub:"Per month average" },
          { label:"Avg view time", value:avgTime, sub:"↑ Consistent all year" },
          { label:"Hours watched", value:totalHours+"h", sub:"Total viewing time" },
          { label:"Fullscreen clicks", value:totalClicks.toLocaleString(), sub:"Active engagement" },
        ].map(({label,value,sub})=>(
          <div key={label} style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem", borderTop:`2px solid ${ORANGE}` }}>
            <div style={{ fontSize:11, color:"#777", marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:600, color:"#fff" }}>{value}</div>
            <div style={{ fontSize:10, color:TEAL, marginTop:3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        {[
          { title:"Video views per month", sub:"Monthly Phyron video views", key:"views", color:ORANGE, fmt:v=>v>=1000?(v/1000).toFixed(0)+"k":v },
          { title:"Hours of video watched", sub:"Total viewing time in hours", key:"hours", color:TEAL, fmt:v=>v.toFixed(0) },
        ].map(({title,sub,key,color,fmt})=>(
          <div key={key} style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem" }}>
            <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{title}</div>
            <div style={{ fontSize:11, color:"#666", marginBottom:10 }}>{sub}</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={filtered} margin={{top:0,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="m" tick={{fontSize:9,fill:"#666"}} />
                <YAxis tickFormatter={fmt} tick={{fontSize:9,fill:"#666"}} />
                <Tooltip content={<TT />} />
                <Bar dataKey={key} name={title} fill={color} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Charts row 2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        {[
          { title:"Average view time", sub:"Percentage of video watched per view", key:"avgTime", color:"#EF9F27" },
          { title:"Fullscreen clicks per month", sub:"Viewers actively choosing to go fullscreen", key:"clicks", color:ORANGE },
        ].map(({title,sub,key,color})=>(
          <div key={key} style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem" }}>
            <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{title}</div>
            <div style={{ fontSize:11, color:"#666", marginBottom:10 }}>{sub}</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={filtered} margin={{top:0,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="m" tick={{fontSize:9,fill:"#666"}} />
                <YAxis tick={{fontSize:9,fill:"#666"}} />
                <Tooltip content={<TT />} />
                <Line type="monotone" dataKey={key} name={title} stroke={color} strokeWidth={2} dot={{r:2,fill:color}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Share clicks */}
      <div style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem", marginBottom:12 }}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>Share clicks per month</div>
        <div style={{ fontSize:11, color:"#666", marginBottom:10 }}>Videos shared by viewers</div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={filtered} margin={{top:0,right:4,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="m" tick={{fontSize:9,fill:"#666"}} />
            <YAxis tick={{fontSize:9,fill:"#666"}} />
            <Tooltip content={<TT />} />
            <Bar dataKey="shares" name="Share clicks" fill="#7F77DD" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmaps */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem" }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>When people watch</div>
          <div style={{ fontSize:11, color:"#666", marginBottom:10 }}>Views by time of day — Apr 2026</div>
          <Heatmap data={heatViews} color="orange" />
        </div>
        <div style={{ background:"#1a1a1a", border:"0.5px solid #2a2a2a", borderRadius:10, padding:"1rem" }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>When leads come in</div>
          <div style={{ fontSize:11, color:"#666", marginBottom:10 }}>Leads by time of day — Apr 2026</div>
          <Heatmap data={heatLeads} color="teal" />
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign:"center", fontSize:11, color:"#444", marginTop:"1.5rem", borderTop:"0.5px solid #1e1e1e", paddingTop:"1rem" }}>
        <div>Data sourced from Phyron monthly campaign report · April 2026</div>
        <div style={{ marginTop:4, color:ORANGE }}>Powered by Phyron</div>
      </div>

    </div>
  );
}
