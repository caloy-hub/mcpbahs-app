// ============================================================
//  App.jsx — COMPLETE FINAL VERSION
//  Maria Cristina P. Belcar Agricultural High School
//  School ID: 304342 | S.Y. 2026–2027
//  Dept. of Education · Region XI · Division of Davao City
//  Theme: Agricultural greens + DepEd colors + harvest gold
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ─── THEME ────────────────────────────────────────────────
const T = {
  // Backgrounds
  bg:         "#f0f7ee",
  bgCard:     "#ffffff",
  bgPanel:    "#e8f5e2",
  // Greens
  green1:     "#1b4d1f",
  green2:     "#2d6a30",
  green3:     "#3a8c3f",
  green4:     "#4caf50",
  greenLight: "#81c784",
  // DepEd + Harvest
  yellow:     "#f5c800",
  yellowDark: "#e6a800",
  blue:       "#003082",
  red:        "#c62828",
  // Text
  white:      "#ffffff",
  gray:       "#6a7c6a",
  border:     "#b8dab840",
  text:       "#1b3a1e",
  textMuted:  "#4a7a4e",
};

const css = `
  *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',sans-serif;}
  body{background:#f0f7ee;color:#1b3a1e;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#3a8c3f;border-radius:4px;}
  input,select,textarea{
    background:#e8f5e2;color:#1b3a1e;border:1px solid #b8dab8;
    border-radius:8px;padding:10px 14px;width:100%;outline:none;font-size:14px;
  }
  input:focus,select:focus,textarea:focus{border-color:#4caf50;box-shadow:0 0 0 2px #4caf5020;}
  button{cursor:pointer;border:none;border-radius:8px;font-weight:600;transition:all .2s;}
  @keyframes spin{to{transform:rotate(360deg)}}
`;

// ─── HELPERS ──────────────────────────────────────────────
const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : null;
const remark = g => {
  if (!g) return { r:"N/A", c:T.gray };
  if (g >= 90) return { r:"Outstanding", c:"#2e7d32" };
  if (g >= 85) return { r:"Very Satisfactory", c:"#388e3c" };
  if (g >= 80) return { r:"Satisfactory", c:"#e6a800" };
  if (g >= 75) return { r:"Fairly Satisfactory", c:"#ff9800" };
  return { r:"Did Not Meet Expectations", c:T.red };
};

// ─── EDGE FUNCTION CALLER ────────────────────────────────
const edgeCall = async (fnName, body) => {
  const { data:{ session } } = await supabase.auth.getSession();
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${fnName}`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    }
  );
  return res.json();
};

// ─── UI PRIMITIVES ───────────────────────────────────────
const Card = ({ children, style={} }) => (
  <div style={{
    background:T.bgCard, borderRadius:12, padding:16,
    border:`1px solid #c8e6c9`, boxShadow:"0 2px 8px #00000010",
    ...style
  }}>{children}</div>
);

const Btn = ({ children, onClick, color=T.green3, style={}, disabled=false }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background:disabled?"#ccc":color,
    color:color===T.yellow?"#1b3a1e":T.white,
    padding:"10px 16px", fontSize:13,
    boxShadow:disabled?"none":"0 2px 6px #00000020",
    ...style, opacity:disabled?.6:1
  }}>{children}</button>
);

const Badge = ({ text, color }) => (
  <span style={{
    background:color+"22", color, border:`1px solid ${color}55`,
    borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700
  }}>{text}</span>
);

const Toast = ({ msg }) => msg ? (
  <div style={{
    position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
    background:msg.startsWith("✅")?T.green2
      :msg.startsWith("🗑️")?"#5d4037"
      :msg.startsWith("⏳")?T.blue:"#b71c1c",
    color:"#fff", padding:"10px 20px", borderRadius:20,
    fontSize:13, fontWeight:700, zIndex:999,
    boxShadow:"0 4px 20px #0008", whiteSpace:"nowrap"
  }}>{msg}</div>
) : null;

const Spinner = () => (
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"center",
    height:"100vh", background:T.bg, flexDirection:"column", gap:16
  }}>
    <div style={{
      width:48, height:48,
      border:`4px solid #c8e6c9`,
      borderTop:`4px solid ${T.green3}`,
      borderRadius:"50%", animation:"spin 1s linear infinite"
    }}/>
    <div style={{color:T.textMuted, fontSize:14, fontWeight:600}}>Loading...</div>
  </div>
);

// ─── SCHOOL HEADER ───────────────────────────────────────
const SchoolHeader = ({ small=false }) => (
  <div style={{
    padding: small?"10px 12px":"20px 16px",
    background:`linear-gradient(160deg,#0d2e10 0%,#1b4d1f 30%,#2d6a30 65%,#3a6b20 100%)`,
    borderBottom:`4px solid ${T.yellow}`,
    boxShadow:"0 4px 12px #0005",
    position:"relative", overflow:"hidden",
  }}>
    {/* Dot pattern overlay */}
    <div style={{
      position:"absolute", inset:0, opacity:0.04,
      backgroundImage:`radial-gradient(circle,#ffffff 1px,transparent 1px)`,
      backgroundSize:"20px 20px", pointerEvents:"none",
    }}/>
    {/* DepEd tricolor top stripe */}
    <div style={{
      position:"absolute", top:0, left:0, right:0, height:4,
      background:"linear-gradient(90deg,#003082 33%,#ce1126 33%,#ce1126 66%,#f5c800 66%)",
    }}/>
    <div style={{
      display:"flex", alignItems:"center",
      justifyContent:"center", gap:12,
      position:"relative", zIndex:1,
      marginTop: small?2:6,
    }}>
      {/* Agricultural SVG Logo */}
      <div style={{
        width:small?44:64, height:small?44:64,
        borderRadius:"50%",
        border:`3px solid ${T.yellow}`,
        boxShadow:"0 2px 12px #0006",
        flexShrink:0, overflow:"hidden",
        background:"linear-gradient(160deg,#1b4d1f,#2d6a30)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <svg width={small?36:52} height={small?36:52} viewBox="0 0 100 100">
          {/* Sun */}
          <circle cx="50" cy="26" r="13" fill="#f5c800"/>
          <line x1="50" y1="7"  x2="50" y2="2"  stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="45" x2="50" y2="50" stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="31" y1="26" x2="26" y2="26" stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="69" y1="26" x2="74" y2="26" stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="37" y1="13" x2="33" y2="9"  stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="63" y1="13" x2="67" y2="9"  stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="37" y1="39" x2="33" y2="43" stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          <line x1="63" y1="39" x2="67" y2="43" stroke="#f5c800" strokeWidth="3" strokeLinecap="round"/>
          {/* Rice stalk left */}
          <line x1="25" y1="95" x2="25" y2="55" stroke="#81c784" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="25" cy="55" rx="5" ry="8" fill="#4caf50" transform="rotate(-15 25 55)"/>
          <ellipse cx="21" cy="63" rx="4" ry="7" fill="#66bb6a" transform="rotate(-25 21 63)"/>
          <ellipse cx="29" cy="63" rx="4" ry="7" fill="#66bb6a" transform="rotate(15 29 63)"/>
          <ellipse cx="23" cy="72" rx="4" ry="7" fill="#81c784" transform="rotate(-20 23 72)"/>
          <ellipse cx="27" cy="72" rx="4" ry="7" fill="#81c784" transform="rotate(10 27 72)"/>
          {/* Rice stalk right */}
          <line x1="75" y1="95" x2="75" y2="55" stroke="#81c784" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="75" cy="55" rx="5" ry="8" fill="#4caf50" transform="rotate(15 75 55)"/>
          <ellipse cx="71" cy="63" rx="4" ry="7" fill="#66bb6a" transform="rotate(-15 71 63)"/>
          <ellipse cx="79" cy="63" rx="4" ry="7" fill="#66bb6a" transform="rotate(25 79 63)"/>
          <ellipse cx="73" cy="72" rx="4" ry="7" fill="#81c784" transform="rotate(-10 73 72)"/>
          <ellipse cx="77" cy="72" rx="4" ry="7" fill="#81c784" transform="rotate(20 77 72)"/>
          {/* Center tree */}
          <line x1="50" y1="95" x2="50" y2="58" stroke="#2d6a30" strokeWidth="3" strokeLinecap="round"/>
          <ellipse cx="50" cy="54" rx="10" ry="12" fill="#3a8c3f"/>
          <ellipse cx="50" cy="48" rx="7"  ry="9"  fill="#4caf50"/>
          {/* Base banner */}
          <rect x="18" y="88" width="64" height="8" rx="4" fill="#f5c800"/>
          <rect x="24" y="84" width="52" height="6" rx="3" fill="#e6a800"/>
        </svg>
      </div>
      {/* Text */}
      <div style={{textAlign:"left"}}>
        <div style={{fontSize:small?9:11,color:"#a5d6a7",fontWeight:600,letterSpacing:.5,lineHeight:1.5}}>
          Department of Education · Region XI · Division of Davao City
        </div>
        <div style={{fontSize:small?13:17,fontWeight:900,color:"#ffffff",lineHeight:1.2,textShadow:"0 1px 4px #0006"}}>
          Maria Cristina P. Belcar
        </div>
        <div style={{fontSize:small?13:17,fontWeight:900,color:T.yellow,lineHeight:1.2,textShadow:"0 1px 4px #0006"}}>
          Agricultural High School
        </div>
        <div style={{fontSize:small?9:11,color:"#a5d6a7",marginTop:3,display:"flex",gap:8,alignItems:"center"}}>
          <span>School ID: 304342</span>
          <span style={{color:T.yellow}}>·</span>
          <span>S.Y. 2026–2027</span>
        </div>
      </div>
    </div>
    {/* Bottom grass strip */}
    <div style={{
      position:"absolute", bottom:0, left:0, right:0, height:small?3:5,
      background:"linear-gradient(90deg,#2d6a30,#4caf50,#f5c800,#4caf50,#2d6a30)",
      opacity:0.7,
    }}/>
  </div>
);

// ─── TOPBAR ──────────────────────────────────────────────
const TopBar = ({ name, sub, onLogout }) => (
  <div style={{
    background:T.bgCard, padding:"10px 16px",
    display:"flex", justifyContent:"space-between", alignItems:"center",
    borderBottom:`2px solid #c8e6c9`, boxShadow:"0 2px 6px #00000010"
  }}>
    <div>
      <div style={{fontWeight:700, fontSize:14, color:T.green1}}>{name}</div>
      <div style={{fontSize:11, color:T.textMuted}}>{sub}</div>
    </div>
    <Btn onClick={onLogout} color={T.red} style={{padding:"6px 12px", fontSize:12}}>Logout</Btn>
  </div>
);

// ─── BOTTOM NAV ──────────────────────────────────────────
const BottomNav = ({ tabs, active, setActive }) => (
  <div style={{
    position:"fixed", bottom:0, left:0, right:0,
    background:T.bgCard, borderTop:`2px solid #c8e6c9`,
    display:"flex", zIndex:100, boxShadow:"0 -2px 8px #00000015"
  }}>
    {tabs.map(([ic,lb,tb]) => (
      <button key={tb} onClick={()=>setActive(tb)} style={{
        flex:1, padding:"10px 2px", background:"transparent",
        border:"none", cursor:"pointer",
        color:active===tb?T.green2:T.gray,
        display:"flex", flexDirection:"column",
        alignItems:"center", fontSize:9,
        fontWeight:active===tb?700:400, gap:2,
        borderTop:active===tb?`2px solid ${T.green3}`:"2px solid transparent",
      }}>
        <span style={{fontSize:18}}>{ic}</span>{lb}
      </button>
    ))}
  </div>
);

// ─── RESET PASSWORD MODAL ────────────────────────────────
const ResetPasswordModal = ({ user, onConfirm, onClose }) => {
  const [newPass, setNewPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const strength = newPass.length===0?0:newPass.length<6?1:newPass.length<9?2:newPass.length<12?3:4;
  const strengthLabel = ["","Too short","Weak","Good","Strong"][strength];
  const strengthColor = [T.gray,T.red,"#ff9800",T.yellow,T.green4][strength];
  return (
    <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <Card style={{width:"100%",maxWidth:360}}>
        <div style={{fontSize:16,fontWeight:800,color:T.green1,marginBottom:4}}>🔑 Reset Password</div>
        <div style={{fontSize:12,color:T.textMuted,marginBottom:16}}>
          Resetting password for: <strong style={{color:T.green1}}>{user.name}</strong><br/>
          <span style={{background:T.green4+"22",color:T.green2,borderRadius:20,
            padding:"1px 8px",fontSize:11,fontWeight:700,textTransform:"capitalize"}}>{user.role}</span>
        </div>
        <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>
          New Password <span style={{color:T.red}}>*</span>
        </label>
        <div style={{position:"relative",marginBottom:8}}>
          <input type={showPass?"text":"password"} value={newPass}
            onChange={e=>setNewPass(e.target.value)} placeholder="Minimum 6 characters"
            onKeyDown={e=>e.key==="Enter"&&onConfirm(newPass)} style={{paddingRight:44}}/>
          <button onClick={()=>setShowPass(p=>!p)} style={{
            position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
            background:"none",border:"none",cursor:"pointer",fontSize:16,color:T.textMuted,padding:4
          }}>{showPass?"🙈":"👁️"}</button>
        </div>
        {newPass.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14}}>
            {[1,2,3,4].map(i=>(
              <div key={i} style={{flex:1,height:4,borderRadius:2,
                background:strength>=i?strengthColor:"#e0e0e0",transition:"background .2s"}}/>
            ))}
            <span style={{fontSize:11,color:strengthColor,flexShrink:0}}>{strengthLabel}</span>
          </div>
        )}
        {newPass.length===0&&<div style={{marginBottom:14}}/>}
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>onConfirm(newPass)} disabled={newPass.length<6} style={{flex:1}}>🔑 Reset</Btn>
          <Btn onClick={onClose} color="#e0e0e0" style={{flex:1,color:T.text}}>Cancel</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── LOGIN ───────────────────────────────────────────────
const Login = () => {
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    setErr(""); setLoading(true);
    try {
      let email = id;
      if (role==="student") {
        const { data, error } = await supabase.from("profiles").select("email")
          .eq("student_no",id).eq("role","student").single();
        if (error||!data) { setErr("Student number not found."); setLoading(false); return; }
        email = data.email;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password:pass });
      if (error) setErr(error.message);
    } catch { setErr("Login failed. Please try again."); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,#e8f5e2 0%,#f0f7ee 50%,#e1f0e1 100%)`,
      display:"flex",flexDirection:"column"}}>
      <SchoolHeader/>
      <div style={{flex:1,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",padding:20}}>
        <Card style={{width:"100%",maxWidth:400,boxShadow:"0 8px 32px #00000015"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:22,fontWeight:800,color:T.green1}}>Welcome</div>
            <div style={{fontSize:12,color:T.textMuted}}>School Year 2026–2027</div>
          </div>
          {/* Role tabs */}
          <div style={{display:"flex",gap:4,marginBottom:18,
            background:T.bgPanel,borderRadius:8,padding:4}}>
            {["student","teacher","admin"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{
                flex:1,padding:"8px 4px",borderRadius:6,fontSize:12,fontWeight:700,
                background:role===r?T.green3:"transparent",
                color:role===r?T.white:T.textMuted,
                border:"none",cursor:"pointer",textTransform:"capitalize"
              }}>{r}</button>
            ))}
          </div>
          <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>
            {role==="student"?"Student Number":"Email Address"}
          </label>
          <input value={id} onChange={e=>setId(e.target.value)}
            placeholder={role==="student"?"e.g. 2024-0001":"e.g. user@mcpbahs.edu.ph"}
            onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{marginBottom:12}}/>
          <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Password</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
            placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&doLogin()}
            style={{marginBottom:16}}/>
          {err&&<div style={{color:T.red,fontSize:12,marginBottom:10,
            background:T.red+"15",padding:"8px 12px",borderRadius:6}}>{err}</div>}
          <Btn onClick={doLogin} disabled={loading} style={{width:"100%",padding:"12px",fontSize:15}}>
            {loading?"Logging in...":"🔐 Login"}
          </Btn>
          {/* DepEd color bar */}
          <div style={{display:"flex",height:4,borderRadius:4,overflow:"hidden",marginTop:16}}>
            <div style={{flex:1,background:T.blue}}/>
            <div style={{flex:1,background:T.red}}/>
            <div style={{flex:1,background:T.yellow}}/>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── STUDENT DASHBOARD ───────────────────────────────────
const StudentDashboard = ({ profile, onLogout }) => {
  const [tab, setTab] = useState("grades");
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [apptForm, setApptForm] = useState({teacherId:"",date:"",time:"",reason:""});
  const [apptMsg, setApptMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [sR,gR,tR,aR] = await Promise.all([
      supabase.from("subjects").select("*").eq("grade_level",profile.grade_level),
      supabase.from("grades").select("*").eq("student_id",profile.id),
      supabase.from("profiles").select("id,name").eq("role","teacher"),
      supabase.from("appointments").select("*").eq("student_id",profile.id),
    ]);
    if (sR.data) setSubjects(sR.data);
    if (gR.data) setGrades(gR.data);
    if (tR.data) setTeachers(tR.data);
    if (aR.data) setAppointments(aR.data);
    setLoading(false);
  }, [profile.id, profile.grade_level]);

  useEffect(() => {
    fetchData();
    const ch = supabase.channel("grades-student")
      .on("postgres_changes",{event:"*",schema:"public",table:"grades",
        filter:`student_id=eq.${profile.id}`},()=>fetchData())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [fetchData, profile.id]);

  const getG = (subId,term) => grades.find(g=>g.subject_id===subId&&g.term===term)?.grade||null;
  const getFinal = subId => avg([1,2,3].map(t=>getG(subId,t)).filter(Boolean));
  const overallAvg = avg(subjects.map(s=>getFinal(s.id)).filter(Boolean));

  const submitAppt = async () => {
    if (!apptForm.teacherId||!apptForm.date||!apptForm.time||!apptForm.reason) {
      setApptMsg("❌ Please fill all fields."); return;
    }
    const teacher = teachers.find(t=>t.id===apptForm.teacherId);
    const { error } = await supabase.from("appointments").insert({
      student_id:profile.id, student_name:profile.name,
      teacher_id:apptForm.teacherId, teacher_name:teacher?.name||"",
      date:apptForm.date, time:apptForm.time,
      reason:apptForm.reason, status:"Pending",
    });
    if (error) { setApptMsg("❌ "+error.message); return; }
    setApptMsg("✅ Appointment submitted!");
    setApptForm({teacherId:"",date:"",time:"",reason:""});
    fetchData();
    setTimeout(()=>setApptMsg(""),3000);
  };

  if (loading) return <Spinner/>;

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SchoolHeader small/>
      <TopBar name={profile.name}
        sub={`Grade ${profile.grade_level} – ${profile.section} · ${profile.student_no}`}
        onLogout={onLogout}/>
      <div style={{flex:1,overflowY:"auto",padding:14,paddingBottom:72}}>

        {tab==="profile" && (
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>👤 Student Profile</div>
            <Card style={{marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Full Name",profile.name],["Student No.",profile.student_no],
                  ["Grade Level","Grade "+profile.grade_level],["Section",profile.section||"—"],
                  ["Gender",profile.gender||"—"],["Birthday",profile.birthday||"—"],
                ].map(([k,v])=>(
                  <div key={k}>
                    <div style={{fontSize:11,color:T.textMuted}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10}}>
                <div style={{fontSize:11,color:T.textMuted}}>Address</div>
                <div style={{fontSize:13,fontWeight:600,color:T.text}}>{profile.address||"—"}</div>
              </div>
            </Card>
            <Card style={{textAlign:"center"}}>
              <div style={{fontSize:12,color:T.textMuted}}>General Average</div>
              <div style={{fontSize:42,fontWeight:900,color:T.green2}}>{overallAvg||"—"}</div>
              {overallAvg&&<Badge text={remark(overallAvg).r} color={remark(overallAvg).c}/>}
            </Card>
          </div>
        )}

        {tab==="grades" && (
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>
              📊 Grades — S.Y. 2026–2027
            </div>
            <Card style={{textAlign:"center",marginBottom:10}}>
              <div style={{fontSize:11,color:T.textMuted}}>General Average</div>
              <div style={{fontSize:38,fontWeight:900,color:T.green2}}>{overallAvg||"—"}</div>
              {overallAvg&&<Badge text={remark(overallAvg).r} color={remark(overallAvg).c}/>}
            </Card>
            <Card style={{padding:0,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{background:T.green1}}>
                    <th style={{padding:"10px 8px",textAlign:"left",color:T.yellow}}>Subject</th>
                    <th style={{padding:"10px 6px",textAlign:"center",color:T.white}}>Q1</th>
                    <th style={{padding:"10px 6px",textAlign:"center",color:T.white}}>Q2</th>
                    <th style={{padding:"10px 6px",textAlign:"center",color:T.white}}>Q3</th>
                    <th style={{padding:"10px 6px",textAlign:"center",color:T.yellow}}>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length===0&&(
                    <tr><td colSpan={5} style={{textAlign:"center",padding:20,color:T.gray}}>
                      No subjects found.
                    </td></tr>
                  )}
                  {subjects.map((s,i)=>{
                    const fin=getFinal(s.id);
                    const {r:rem,c}=remark(fin);
                    const teacher=teachers.find(t=>t.id===s.teacher_id);
                    return (
                      <tr key={s.id} style={{
                        background:i%2===0?T.bgCard:"#f1f8f1",
                        borderBottom:`1px solid #e0f0e0`
                      }}>
                        <td style={{padding:"8px"}}>
                          <div style={{fontWeight:600,color:T.text}}>{s.name}</div>
                          <div style={{fontSize:10,color:T.textMuted}}>{teacher?.name||"Unassigned"}</div>
                        </td>
                        {[1,2,3].map(t=>{
                          const g=getG(s.id,t);
                          return <td key={t} style={{textAlign:"center",padding:"8px 4px",
                            color:g?remark(g).c:T.gray,fontWeight:g?700:400}}>{g||"—"}</td>;
                        })}
                        <td style={{textAlign:"center",padding:"8px 4px"}}>
                          <div style={{fontWeight:900,color:c,fontSize:14}}>{fin||"—"}</div>
                          <div style={{fontSize:9,color:c}}>{fin?rem:""}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {tab==="appointment" && (
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>
              📅 Book Appointment
            </div>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>
                Request Parent-Teacher Conference
              </div>
              <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Select Teacher</label>
              <select value={apptForm.teacherId} style={{marginBottom:10}}
                onChange={e=>setApptForm(p=>({...p,teacherId:e.target.value}))}>
                <option value="">-- Choose Teacher --</option>
                {teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div>
                  <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Date</label>
                  <input type="date" value={apptForm.date} onChange={e=>setApptForm(p=>({...p,date:e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Time</label>
                  <input type="time" value={apptForm.time} onChange={e=>setApptForm(p=>({...p,time:e.target.value}))}/>
                </div>
              </div>
              <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Reason / Purpose</label>
              <textarea rows={3} value={apptForm.reason} style={{marginBottom:12}}
                onChange={e=>setApptForm(p=>({...p,reason:e.target.value}))}
                placeholder="e.g. Discuss academic performance in Q1..."/>
              {apptMsg&&<div style={{fontSize:12,marginBottom:10,padding:"8px 12px",borderRadius:6,
                background:apptMsg.startsWith("✅")?"#e8f5e9":"#ffebee",
                color:apptMsg.startsWith("✅")?T.green2:T.red}}>{apptMsg}</div>}
              <Btn onClick={submitAppt} style={{width:"100%"}}>📩 Submit Request</Btn>
            </Card>
            <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:8}}>My Appointments</div>
            {appointments.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:20}}>No appointments yet.</div></Card>
              :appointments.map(a=>(
                <Card key={a.id} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.text}}>{a.teacher_name}</div>
                    <Badge text={a.status}
                      color={a.status==="Pending"?T.yellow:a.status==="Approved"?T.green4:T.red}/>
                  </div>
                  <div style={{fontSize:12,color:T.textMuted}}>📅 {a.date} at {a.time}</div>
                  <div style={{fontSize:12,marginTop:4,color:T.text}}>{a.reason}</div>
                </Card>
              ))
            }
          </div>
        )}
      </div>
      <BottomNav
        tabs={[["👤","Profile","profile"],["📊","Grades","grades"],["📅","Appt","appointment"]]}
        active={tab} setActive={setTab}/>
    </div>
  );
};

// ─── TEACHER DASHBOARD ───────────────────────────────────
const TeacherDashboard = ({ profile, onLogout }) => {
  const [tab, setTab] = useState("encode");
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selSubject, setSelSubject] = useState("");
  const [selTerm, setSelTerm] = useState(1);
  const [localGrades, setLocalGrades] = useState({});
  const [dbGrades, setDbGrades] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const notify = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [sR,aR] = await Promise.all([
      supabase.from("subjects").select("*").eq("teacher_id",profile.id),
      supabase.from("appointments").select("*").eq("teacher_id",profile.id),
    ]);
    if (sR.data) setSubjects(sR.data);
    if (aR.data) setAppointments(aR.data);
    setLoading(false);
  }, [profile.id]);

  useEffect(()=>{ fetchData(); },[fetchData]);

  useEffect(()=>{
    if (!selSubject) return;
    const sub = subjects.find(s=>s.id===selSubject);
    if (!sub) return;
    (async()=>{
      const [stuR,gR] = await Promise.all([
        supabase.from("profiles").select("*").eq("role","student").eq("grade_level",sub.grade_level),
        supabase.from("grades").select("*").eq("subject_id",selSubject).eq("term",selTerm),
      ]);
      if (stuR.data) setStudents(stuR.data);
      if (gR.data) setDbGrades(gR.data);
    })();
  },[selSubject,selTerm,subjects]);

  const getGradeVal = studentId => {
    const key = `${studentId}-${selSubject}-${selTerm}`;
    if (localGrades[key]!==undefined) return localGrades[key];
    return dbGrades.find(g=>g.student_id===studentId)?.grade||"";
  };

  const saveGrades = async () => {
    const upserts = students
      .filter(s=>localGrades[`${s.id}-${selSubject}-${selTerm}`]!==undefined)
      .map(s=>({
        student_id:s.id, subject_id:selSubject, term:selTerm,
        grade:parseFloat(localGrades[`${s.id}-${selSubject}-${selTerm}`])||0,
        encoded_by:profile.id,
      }));
    if (!upserts.length) { notify("⚠️ No changes to save."); return; }
    const { error } = await supabase.from("grades")
      .upsert(upserts,{onConflict:"student_id,subject_id,term"});
    if (error) { notify("❌ "+error.message); return; }
    setLocalGrades({});
    notify("✅ Grades saved and synced!");
    const { data } = await supabase.from("grades").select("*")
      .eq("subject_id",selSubject).eq("term",selTerm);
    if (data) setDbGrades(data);
  };

  const updateApptStatus = async (id, status) => {
    const { error } = await supabase.from("appointments").update({status}).eq("id",id);
    if (error) { notify("❌ "+error.message); return; }
    setAppointments(p=>p.map(a=>a.id===id?{...a,status}:a));
    notify(`✅ Appointment ${status}!`);
  };

  if (loading) return <Spinner/>;

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SchoolHeader small/>
      <TopBar name={profile.name} sub="Teacher Panel" onLogout={onLogout}/>
      <Toast msg={toast}/>
      <div style={{flex:1,overflowY:"auto",padding:14,paddingBottom:72}}>

        {tab==="encode" && (
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>✏️ Encode Grades</div>
            <Card style={{marginBottom:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Subject</label>
                  <select value={selSubject} onChange={e=>setSelSubject(e.target.value)}>
                    <option value="">-- Select --</option>
                    {subjects.map(s=><option key={s.id} value={s.id}>{s.name} (Gr.{s.grade_level})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,color:T.textMuted,display:"block",marginBottom:4}}>Term</label>
                  <select value={selTerm} onChange={e=>setSelTerm(parseInt(e.target.value))}>
                    <option value={1}>Term 1</option>
                    <option value={2}>Term 2</option>
                    <option value={3}>Term 3</option>
                  </select>
                </div>
              </div>
            </Card>
            {selSubject?(
              <Card>
                <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>
                  {subjects.find(s=>s.id===selSubject)?.name} — Q{selTerm}
                </div>
                {students.length===0
                  ?<div style={{textAlign:"center",color:T.gray,padding:20}}>No students found.</div>
                  :students.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,
                      padding:"8px 0",borderBottom:`1px solid #e0f0e0`}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div>
                        <div style={{fontSize:11,color:T.textMuted}}>{s.student_no}</div>
                      </div>
                      <input type="number" min="0" max="100" style={{width:72,textAlign:"center"}}
                        value={getGradeVal(s.id)}
                        onChange={e=>setLocalGrades(p=>({
                          ...p,[`${s.id}-${selSubject}-${selTerm}`]:e.target.value
                        }))}
                        placeholder="0–100"/>
                    </div>
                  ))
                }
                <Btn onClick={saveGrades} style={{width:"100%",marginTop:12}}>💾 Save Grades</Btn>
              </Card>
            ):(
              <Card>
                <div style={{textAlign:"center",color:T.gray,padding:20}}>
                  Select a subject to begin encoding.
                </div>
              </Card>
            )}
          </div>
        )}

        {tab==="appointments" && (
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>📅 Appointments</div>
            {appointments.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:20}}>No appointments.</div></Card>
              :appointments.map(a=>(
                <Card key={a.id} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontWeight:700,color:T.text}}>{a.student_name}</div>
                    <Badge text={a.status}
                      color={a.status==="Pending"?T.yellow:a.status==="Approved"?T.green4:T.red}/>
                  </div>
                  <div style={{fontSize:12,color:T.textMuted}}>📅 {a.date} at {a.time}</div>
                  <div style={{fontSize:12,marginTop:4,color:T.text}}>{a.reason}</div>
                  {a.status==="Pending"&&(
                    <div style={{display:"flex",gap:8,marginTop:8}}>
                      <Btn color={T.green3} style={{flex:1,padding:"7px",fontSize:12}}
                        onClick={()=>updateApptStatus(a.id,"Approved")}>✅ Approve</Btn>
                      <Btn color={T.red} style={{flex:1,padding:"7px",fontSize:12}}
                        onClick={()=>updateApptStatus(a.id,"Declined")}>❌ Decline</Btn>
                    </div>
                  )}
                </Card>
              ))
            }
          </div>
        )}
      </div>
      <BottomNav
        tabs={[["✏️","Encode","encode"],["📅","Appts","appointments"]]}
        active={tab} setActive={setTab}/>
    </div>
  );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────
const AdminDashboard = ({ profile, onLogout }) => {
  const [tab, setTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [editGrade, setEditGrade] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [filterGL, setFilterGL] = useState("all");

  const [nStudent, setNStudent] = useState({
    name:"",student_no:"",grade_level:7,section:"",
    gender:"Male",birthday:"",address:"",email:"",password:""
  });
  const [nTeacher, setNTeacher] = useState({name:"",email:"",password:""});
  const [nSubject, setNSubject] = useState({name:"",grade_level:7,teacher_id:""});
  const [nGrade, setNGrade] = useState({student_id:"",subject_id:"",term:1,grade:""});

  const notify = m => { setToast(m); setTimeout(()=>setToast(""),2500); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [sR,tR,subR,gR,aR] = await Promise.all([
      supabase.from("profiles").select("*").eq("role","student").order("name"),
      supabase.from("profiles").select("*").eq("role","teacher").order("name"),
      supabase.from("subjects").select("*").order("grade_level"),
      supabase.from("grades").select("*"),
      supabase.from("appointments").select("*").order("created_at",{ascending:false}),
    ]);
    if (sR.data) setStudents(sR.data);
    if (tR.data) setTeachers(tR.data);
    if (subR.data) setSubjects(subR.data);
    if (gR.data) setGrades(gR.data);
    if (aR.data) setAppointments(aR.data);
    setLoading(false);
  }, []);

  useEffect(()=>{ fetchAll(); },[fetchAll]);

  const addStudent = async () => {
    if (!nStudent.name||!nStudent.student_no||!nStudent.email||!nStudent.password) {
      notify("❌ Name, student no., email and password required."); return;
    }
    notify("⏳ Creating student...");
    const result = await edgeCall("create-user",{
      role:"student", email:nStudent.email, password:nStudent.password,
      name:nStudent.name, student_no:nStudent.student_no,
      grade_level:parseInt(nStudent.grade_level), section:nStudent.section,
      gender:nStudent.gender, birthday:nStudent.birthday||null, address:nStudent.address,
    });
    if (result.error) { notify("❌ "+result.error); return; }
    setNStudent({name:"",student_no:"",grade_level:7,section:"",
      gender:"Male",birthday:"",address:"",email:"",password:""});
    notify("✅ Student added!"); fetchAll();
  };

  const delStudent = async id => {
    if (!window.confirm("Delete this student? All grades and appointments will also be removed.")) return;
    notify("⏳ Deleting student...");
    const result = await edgeCall("delete-user",{userId:id,role:"student"});
    if (result.error) { notify("❌ "+result.error); return; }
    notify("🗑️ Student deleted."); fetchAll();
  };

  const addTeacher = async () => {
    if (!nTeacher.name||!nTeacher.email||!nTeacher.password) {
      notify("❌ Name, email and password required."); return;
    }
    notify("⏳ Creating teacher...");
    const result = await edgeCall("create-user",{
      role:"teacher", email:nTeacher.email, password:nTeacher.password, name:nTeacher.name,
    });
    if (result.error) { notify("❌ "+result.error); return; }
    setNTeacher({name:"",email:"",password:""});
    notify("✅ Teacher added!"); fetchAll();
  };

  const delTeacher = async id => {
    if (!window.confirm("Delete this teacher? They will be unassigned from all subjects.")) return;
    notify("⏳ Deleting teacher...");
    const result = await edgeCall("delete-user",{userId:id,role:"teacher"});
    if (result.error) { notify("❌ "+result.error); return; }
    notify("🗑️ Teacher deleted."); fetchAll();
  };

  const handleResetPassword = async newPassword => {
    if (!newPassword||newPassword.length<6) { notify("❌ Min 6 characters."); return; }
    notify("⏳ Resetting password...");
    const result = await edgeCall("reset-password",{userId:resetModal.userId,newPassword});
    if (result.error) { notify("❌ "+result.error); return; }
    notify(`✅ Password reset for ${resetModal.name}!`);
    setResetModal(null);
  };

  const addSubject = async () => {
    if (!nSubject.name) { notify("❌ Subject name required."); return; }
    const { error } = await supabase.from("subjects").insert({
      name:nSubject.name, grade_level:parseInt(nSubject.grade_level),
      teacher_id:nSubject.teacher_id||null,
    });
    if (error) { notify("❌ "+error.message); return; }
    setNSubject({name:"",grade_level:7,teacher_id:""});
    notify("✅ Subject added!"); fetchAll();
  };

  const delSubject = async id => {
    await supabase.from("grades").delete().eq("subject_id",id);
    await supabase.from("subjects").delete().eq("id",id);
    notify("🗑️ Subject deleted."); fetchAll();
  };

  const reassignTeacher = async (subId, teacherId) => {
    await supabase.from("subjects").update({teacher_id:teacherId||null}).eq("id",subId);
    notify("✅ Teacher reassigned!"); fetchAll();
  };

  const saveGrade = async () => {
    if (!nGrade.student_id||!nGrade.subject_id||!nGrade.grade) {
      notify("❌ Fill all fields."); return;
    }
    const { error } = await supabase.from("grades").upsert({
      student_id:nGrade.student_id, subject_id:nGrade.subject_id,
      term:parseInt(nGrade.term), grade:parseFloat(nGrade.grade), encoded_by:profile.id,
    },{onConflict:"student_id,subject_id,term"});
    if (error) { notify("❌ "+error.message); return; }
    setNGrade({student_id:"",subject_id:"",term:1,grade:""});
    notify("✅ Grade saved!"); fetchAll();
  };

  const saveEditGrade = async () => {
    const { error } = await supabase.from("grades")
      .update({grade:parseFloat(editGrade.grade)})
      .eq("student_id",editGrade.student_id)
      .eq("subject_id",editGrade.subject_id)
      .eq("term",editGrade.term);
    if (error) { notify("❌ "+error.message); return; }
    setEditGrade(null); notify("✅ Grade updated!"); fetchAll();
  };

  const delGrade = async (studentId,subjectId,term) => {
    await supabase.from("grades").delete()
      .eq("student_id",studentId).eq("subject_id",subjectId).eq("term",term);
    notify("🗑️ Grade deleted."); fetchAll();
  };

  const updateApptStatus = async (id, status) => {
    await supabase.from("appointments").update({status}).eq("id",id);
    notify(`✅ Appointment ${status}.`); fetchAll();
  };

  const delAppt = async id => {
    await supabase.from("appointments").delete().eq("id",id);
    notify("🗑️ Appointment deleted."); fetchAll();
  };

  const stats = [
    {label:"Students",value:students.length,icon:"🎓",color:T.green2},
    {label:"Teachers",value:teachers.length,icon:"👨‍🏫",color:T.blue},
    {label:"Subjects",value:subjects.length,icon:"📚",color:T.yellowDark},
    {label:"Appointments",value:appointments.length,icon:"📅",color:"#7b1fa2"},
  ];

  const filteredStudents = filterGL==="all"
    ?students:students.filter(s=>s.grade_level===parseInt(filterGL));

  if (loading) return <Spinner/>;

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <SchoolHeader small/>
      <TopBar name="Admin Panel" sub={profile.name} onLogout={onLogout}/>
      <Toast msg={toast}/>

      {/* Reset Password Modal */}
      {resetModal&&(
        <ResetPasswordModal user={resetModal}
          onConfirm={handleResetPassword} onClose={()=>setResetModal(null)}/>
      )}

      {/* Edit Grade Modal */}
      {editGrade&&(
        <div style={{position:"fixed",inset:0,background:"#00000066",zIndex:200,
          display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <Card style={{width:"100%",maxWidth:360}}>
            <div style={{fontSize:14,fontWeight:700,color:T.green1,marginBottom:12}}>✏️ Edit Grade</div>
            <div style={{fontSize:12,color:T.textMuted,marginBottom:8}}>
              Student: {students.find(s=>s.id===editGrade.student_id)?.name}<br/>
              Subject: {subjects.find(s=>s.id===editGrade.subject_id)?.name} · Q{editGrade.term}
            </div>
            <input type="number" min="0" max="100" value={editGrade.grade}
              onChange={e=>setEditGrade(p=>({...p,grade:e.target.value}))} style={{marginBottom:12}}/>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={saveEditGrade} style={{flex:1}}>💾 Save</Btn>
              <Btn onClick={()=>setEditGrade(null)} color="#e0e0e0"
                style={{flex:1,color:T.text}}>Cancel</Btn>
            </div>
          </Card>
        </div>
      )}

      <div style={{flex:1,overflowY:"auto",padding:14,paddingBottom:72}}>

        {tab==="overview"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:12}}>
              🏫 Overview — S.Y. 2026–2027
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {stats.map(s=>(
                <Card key={s.label} style={{textAlign:"center",padding:14}}>
                  <div style={{fontSize:26}}>{s.icon}</div>
                  <div style={{fontSize:32,fontWeight:900,color:s.color}}>{s.value}</div>
                  <div style={{fontSize:11,color:T.textMuted}}>{s.label}</div>
                </Card>
              ))}
            </div>
            {/* DepEd color banner */}
            <Card style={{padding:12,marginBottom:10}}>
              <div style={{display:"flex",height:8,borderRadius:6,overflow:"hidden",marginBottom:10}}>
                <div style={{flex:1,background:T.blue}}/>
                <div style={{flex:1,background:T.red}}/>
                <div style={{flex:1,background:T.yellow}}/>
              </div>
              <div style={{fontSize:12,color:T.textMuted,textAlign:"center",fontWeight:600}}>
                Department of Education · Region XI · Division of Davao City
              </div>
            </Card>
          </div>
        )}

        {tab==="students"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>🎓 Manage Students</div>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>➕ Add Student</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <input placeholder="Full Name *" value={nStudent.name}
                  onChange={e=>setNStudent(p=>({...p,name:e.target.value}))}/>
                <input placeholder="Student No. *" value={nStudent.student_no}
                  onChange={e=>setNStudent(p=>({...p,student_no:e.target.value}))}/>
                <select value={nStudent.grade_level}
                  onChange={e=>setNStudent(p=>({...p,grade_level:e.target.value}))}>
                  {[7,8,9,10].map(g=><option key={g} value={g}>Grade {g}</option>)}
                </select>
                <input placeholder="Section" value={nStudent.section}
                  onChange={e=>setNStudent(p=>({...p,section:e.target.value}))}/>
                <select value={nStudent.gender}
                  onChange={e=>setNStudent(p=>({...p,gender:e.target.value}))}>
                  <option>Male</option><option>Female</option>
                </select>
                <input type="date" value={nStudent.birthday}
                  onChange={e=>setNStudent(p=>({...p,birthday:e.target.value}))}/>
                <input placeholder="Email *" value={nStudent.email}
                  onChange={e=>setNStudent(p=>({...p,email:e.target.value}))}/>
                <input type="password" placeholder="Password *" value={nStudent.password}
                  onChange={e=>setNStudent(p=>({...p,password:e.target.value}))}/>
              </div>
              <input placeholder="Address" value={nStudent.address}
                onChange={e=>setNStudent(p=>({...p,address:e.target.value}))} style={{marginBottom:10}}/>
              <Btn onClick={addStudent} style={{width:"100%"}}>➕ Add Student</Btn>
            </Card>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["all",7,8,9,10].map(g=>(
                <button key={g} onClick={()=>setFilterGL(String(g))} style={{
                  padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700,
                  border:`1px solid ${filterGL===String(g)?T.green3:"#c8e6c9"}`,
                  cursor:"pointer",
                  background:filterGL===String(g)?T.green3:T.bgCard,
                  color:filterGL===String(g)?T.white:T.textMuted
                }}>{g==="all"?"All":"Gr."+g}</button>
              ))}
            </div>
            {filteredStudents.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:16}}>No students found.</div></Card>
              :filteredStudents.map(s=>(
                <Card key={s.id} style={{marginBottom:8,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:T.text}}>{s.name}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>
                        {s.student_no} · Grade {s.grade_level} – {s.section}
                      </div>
                      <div style={{fontSize:11,color:T.textMuted}}>{s.email}</div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <Btn color={T.blue} style={{padding:"6px 10px",fontSize:12}}
                        onClick={()=>setResetModal({userId:s.id,name:s.name,role:"student"})}>🔑</Btn>
                      <Btn color={T.red} style={{padding:"6px 10px",fontSize:12}}
                        onClick={()=>delStudent(s.id)}>🗑️</Btn>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab==="teachers"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>👨‍🏫 Manage Teachers</div>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>➕ Add Teacher</div>
              <div style={{display:"grid",gap:8,marginBottom:8}}>
                <input placeholder="Full Name *" value={nTeacher.name}
                  onChange={e=>setNTeacher(p=>({...p,name:e.target.value}))}/>
                <input placeholder="Email *" value={nTeacher.email}
                  onChange={e=>setNTeacher(p=>({...p,email:e.target.value}))}/>
                <input type="password" placeholder="Password *" value={nTeacher.password}
                  onChange={e=>setNTeacher(p=>({...p,password:e.target.value}))}/>
              </div>
              <Btn onClick={addTeacher} style={{width:"100%"}}>➕ Add Teacher</Btn>
            </Card>
            {teachers.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:16}}>No teachers yet.</div></Card>
              :teachers.map(t=>(
                <Card key={t.id} style={{marginBottom:8,padding:"10px 14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:T.text}}>{t.name}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>{t.email}</div>
                      <div style={{fontSize:11,color:T.textMuted}}>
                        {subjects.filter(s=>s.teacher_id===t.id).map(s=>s.name).join(", ")||"No subjects assigned"}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <Btn color={T.blue} style={{padding:"6px 10px",fontSize:12}}
                        onClick={()=>setResetModal({userId:t.id,name:t.name,role:"teacher"})}>🔑</Btn>
                      <Btn color={T.red} style={{padding:"6px 10px",fontSize:12}}
                        onClick={()=>delTeacher(t.id)}>🗑️</Btn>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {tab==="subjects"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>📚 Manage Subjects</div>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>➕ Add Subject</div>
              <div style={{display:"grid",gap:8,marginBottom:8}}>
                <input placeholder="Subject Name *" value={nSubject.name}
                  onChange={e=>setNSubject(p=>({...p,name:e.target.value}))}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <select value={nSubject.grade_level}
                    onChange={e=>setNSubject(p=>({...p,grade_level:e.target.value}))}>
                    {[7,8,9,10].map(g=><option key={g} value={g}>Grade {g}</option>)}
                  </select>
                  <select value={nSubject.teacher_id}
                    onChange={e=>setNSubject(p=>({...p,teacher_id:e.target.value}))}>
                    <option value="">-- Teacher (opt) --</option>
                    {teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <Btn onClick={addSubject} style={{width:"100%"}}>➕ Add Subject</Btn>
            </Card>
            {[7,8,9,10].map(gl=>{
              const subs=subjects.filter(s=>s.grade_level===gl);
              if (!subs.length) return null;
              return (
                <div key={gl} style={{marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.green2,marginBottom:6,
                    background:"#e8f5e9",padding:"4px 10px",borderRadius:6,
                    borderLeft:`3px solid ${T.green3}`}}>
                    Grade {gl}
                  </div>
                  {subs.map(s=>(
                    <Card key={s.id} style={{marginBottom:6,padding:"10px 12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",marginBottom:6}}>
                        <div style={{fontWeight:700,fontSize:13,color:T.text}}>{s.name}</div>
                        <Btn color={T.red} style={{padding:"5px 10px",fontSize:11}}
                          onClick={()=>delSubject(s.id)}>🗑️</Btn>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:11,color:T.textMuted,flexShrink:0}}>Teacher:</div>
                        <select value={s.teacher_id||""}
                          onChange={e=>reassignTeacher(s.id,e.target.value)}
                          style={{fontSize:12,padding:"5px 8px"}}>
                          <option value="">-- Unassigned --</option>
                          {teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {tab==="grades"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>📝 Manage Grades</div>
            <Card style={{marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:10}}>➕ Add / Update Grade</div>
              <div style={{display:"grid",gap:8,marginBottom:8}}>
                <select value={nGrade.student_id}
                  onChange={e=>setNGrade(p=>({...p,student_id:e.target.value}))}>
                  <option value="">-- Select Student --</option>
                  {students.map(s=><option key={s.id} value={s.id}>{s.name} ({s.student_no})</option>)}
                </select>
                <select value={nGrade.subject_id}
                  onChange={e=>setNGrade(p=>({...p,subject_id:e.target.value}))}>
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s=><option key={s.id} value={s.id}>{s.name} (Gr.{s.grade_level})</option>)}
                </select>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <select value={nGrade.term} onChange={e=>setNGrade(p=>({...p,term:e.target.value}))}>
                    <option value={1}>Term 1</option>
                    <option value={2}>Term 2</option>
                    <option value={3}>Term 3</option>
                  </select>
                  <input type="number" min="0" max="100" placeholder="Grade *"
                    value={nGrade.grade} onChange={e=>setNGrade(p=>({...p,grade:e.target.value}))}/>
                </div>
              </div>
              <Btn onClick={saveGrade} style={{width:"100%"}}>💾 Save Grade</Btn>
            </Card>
            <div style={{fontSize:13,fontWeight:700,color:T.green2,marginBottom:8}}>All Records</div>
            {grades.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:16}}>No grades yet.</div></Card>
              :grades.map(g=>{
                const stu=students.find(s=>s.id===g.student_id);
                const sub=subjects.find(s=>s.id===g.subject_id);
                if (!stu||!sub) return null;
                return (
                  <Card key={`${g.student_id}-${g.subject_id}-${g.term}`}
                    style={{marginBottom:6,padding:"8px 12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:T.text}}>{stu.name}</div>
                        <div style={{fontSize:11,color:T.textMuted}}>{sub.name} · Q{g.term}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:18,fontWeight:900,color:remark(g.grade).c}}>{g.grade}</span>
                        <Btn color={T.blue} style={{padding:"5px 8px",fontSize:11}}
                          onClick={()=>setEditGrade({...g})}>✏️</Btn>
                        <Btn color={T.red} style={{padding:"5px 8px",fontSize:11}}
                          onClick={()=>delGrade(g.student_id,g.subject_id,g.term)}>🗑️</Btn>
                      </div>
                    </div>
                  </Card>
                );
              })
            }
          </div>
        )}

        {tab==="appointments"&&(
          <div>
            <div style={{fontSize:15,fontWeight:700,color:T.green1,marginBottom:10}}>📅 All Appointments</div>
            {appointments.length===0
              ?<Card><div style={{textAlign:"center",color:T.gray,padding:20}}>No appointments.</div></Card>
              :appointments.map(a=>(
                <Card key={a.id} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.text}}>{a.student_name}</div>
                    <Badge text={a.status}
                      color={a.status==="Pending"?T.yellow:a.status==="Approved"?T.green4:T.red}/>
                  </div>
                  <div style={{fontSize:12,color:T.textMuted}}>Teacher: {a.teacher_name}</div>
                  <div style={{fontSize:12,color:T.textMuted}}>📅 {a.date} at {a.time}</div>
                  <div style={{fontSize:12,marginTop:4,color:T.text}}>{a.reason}</div>
                  <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                    {a.status==="Pending"&&<>
                      <Btn color={T.green3} style={{padding:"5px 12px",fontSize:11}}
                        onClick={()=>updateApptStatus(a.id,"Approved")}>✅ Approve</Btn>
                      <Btn color={T.red} style={{padding:"5px 12px",fontSize:11}}
                        onClick={()=>updateApptStatus(a.id,"Declined")}>❌ Decline</Btn>
                    </>}
                    <Btn color="#795548" style={{padding:"5px 12px",fontSize:11}}
                      onClick={()=>delAppt(a.id)}>🗑️ Delete</Btn>
                  </div>
                </Card>
              ))
            }
          </div>
        )}
      </div>

      <BottomNav
        tabs={[
          ["📊","Overview","overview"],["🎓","Students","students"],
          ["👨‍🏫","Teachers","teachers"],["📚","Subjects","subjects"],
          ["📝","Grades","grades"],["📅","Appts","appointments"],
        ]}
        active={tab} setActive={setTab}/>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({data:{session}})=>setSession(session));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    supabase.from("profiles").select("*").eq("id",session.user.id).single()
      .then(({data})=>{ setProfile(data); setLoading(false); });
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <>
      <style>{css}</style>
      {loading
        ?<Spinner/>
        :!session||!profile
          ?<Login/>
          :profile.role==="student"
            ?<StudentDashboard profile={profile} onLogout={handleLogout}/>
            :profile.role==="teacher"
              ?<TeacherDashboard profile={profile} onLogout={handleLogout}/>
              :<AdminDashboard profile={profile} onLogout={handleLogout}/>
      }
    </>
  );
}