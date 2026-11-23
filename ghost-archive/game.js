/* ============================================================
   鬼故有跡 · GAME ENGINE v0.8
   - 修復計時器卡死：rAF 迴圈永遠重新排程；resume 要 startLoop
   - 每晚不同平面圖、建築愈來愈大（5 → 8 → 9 個房間）
   - 鬼飄忽不定：忽快忽慢、停滯、倒退；遊蕩鬼會換房間
   - 混雜聲音：腳步／翻紙／打字／嘆息，遠疏近密、由細到大
   - 同一時間多隻鬼：wander / invade / atdoor（門窗）
   - 保安室桌面只有一個「界」按鈕：護住整間房間（-2% 電 / 10 秒 / 擋一次）
   - 監控與電腦是左右兩側面板：可同時開著、各自開關；關掉即收起並露出該側主場景
   ============================================================ */
const $ = id => document.getElementById(id);
const SAVE_KEY = 'ghostArchivePrototype_v8';
const NIGHT_SECONDS = 360;
const WARN_SECONDS = 8, RESP_SECONDS = 10;
const WARD_DURATION = 10, WARD_COST = 2;
const DOOR_WINDOW = 7;            // 鬼到門窗後，玩家有多少秒回主場景佈結界
const BASE_DRAIN = 10 / 60;       // 每小時 10%

/* 每晚不同地形圖：房間數逐夜增加，最後一格永遠是保安室。
   viewBox 也逐夜放大，令平面圖看起來是一間更大的建築。 */
const FLOORPLANS = {
  1:{ viewBox:'0 0 300 250', cells:[
    {x:10,y:10,w:85,h:60},{x:110,y:10,w:85,h:60},{x:210,y:10,w:80,h:60},
    {x:10,y:85,w:130,h:60},{x:150,y:85,w:140,h:60},
    {x:95,y:170,w:110,h:60} ]},
  2:{ viewBox:'0 0 360 300', cells:[
    {x:10,y:10,w:105,h:55},{x:125,y:10,w:105,h:55},{x:240,y:10,w:110,h:55},
    {x:10,y:75,w:105,h:55},{x:125,y:75,w:105,h:55},{x:240,y:75,w:110,h:55},
    {x:10,y:140,w:105,h:55},{x:125,y:140,w:225,h:55},
    {x:95,y:215,w:170,h:60} ]},
  3:{ viewBox:'0 0 400 320', cells:[
    {x:10,y:10,w:115,h:52},{x:135,y:10,w:115,h:52},{x:260,y:10,w:130,h:52},
    {x:10,y:72,w:115,h:52},{x:135,y:72,w:115,h:52},{x:260,y:72,w:130,h:52},
    {x:10,y:134,w:115,h:52},{x:135,y:134,w:115,h:52},{x:260,y:134,w:130,h:52},
    {x:110,y:210,w:180,h:55} ]}
};
function layout(){ return FLOORPLANS[S.night] || FLOORPLANS[1]; }
function securityIndex(){ return layout().cells.length - 1; }

let S = null, rafId = null, lastTick = 0;
let soundCtx = null, ambient = null, SOUND_SCALE = 1, ghostSfxTimer = 0, ghostSfxRef = null;

/* ============ state ============ */
function freshState(difficulty, audio, resumed) {
  const s = {
    difficulty, audio,
    night: resumed ? resumed.night : 1,
    gameSeconds: 0,
    battery: 100,
    monitorOn: false, computerOn: false,
    view: 'room',                       // 'room' | 'work'
    ward: null,                         // { timer } — 桌上唯一結界，護住整間保安室
    ghosts: [],                         // 同時可有多隻
    ghostSeq: 0,
    selectedRoom: -1,
    completed: new Set(resumed ? resumed.completed : []),
    unlockedDocs: new Set(resumed ? resumed.unlockedDocs : []),
    blocked: 0, totalIntrusions: 0, intrusionsSpawned: 0,
    phase: 'calm', phaseTimer: 0, phaseDur: 25,
    netEdges: new Set(), netSel: null,
    textBonuses: 0, reportDoneNights: new Set(resumed ? resumed.reportDoneNights : []),
    currentTab: 'report', activeDoc: null, pendingEvidence: null,
    mapLayer: 0, selectedRegion: null, evidenceChoice: null,
    paused: false, nightFinished: false, boostNotified: false,
    tutorial: false, tutorialStep: 0, tutorialLocs: new Set(),
    deaths: 0, endingSeen: null
  };
  const night = NIGHTS[s.night-1];
  s.totalIntrusions = night ? night.intrusions : 8;
  return s;
}
function loadSave() { try { const r = localStorage.getItem(SAVE_KEY); return r ? JSON.parse(r) : null; } catch(e){ return null; } }
function persist(extra) {
  const data = Object.assign({
    night: S.night, completed: [...S.completed], unlockedDocs: [...S.unlockedDocs],
    reportDoneNights: [...S.reportDoneNights], difficulty: S.difficulty, audio: S.audio,
    endingSeen: S.endingSeen, deaths: S.deaths
  }, extra || {});
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  refreshContinue();
}
function refreshContinue() {
  const btn = $('btn-continue'), sv = loadSave();
  btn.disabled = !sv;
  btn.querySelector('span').textContent = sv ? `從第 ${['一','二','三'][Math.min((sv.night||1)-1,2)]} 夜開始` : '沒有存檔';
}
function show(id) { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function toast(msg, type) {
  const t = $('toast'); t.textContent = msg; t.className = 'toast show' + (type ? ' '+type : '');
  clearTimeout(t._t); t._t = setTimeout(()=>t.classList.remove('show'), 2600);
}
function calmDuration() {
  return [0, 25 + Math.random()*5, 16 + Math.random()*5, 10 + Math.random()*5][S.night] || 20;
}

/* ============ AUDIO ============ */
function ensureAudio() {
  if (!S || !S.audio) return;
  if (!soundCtx) { try { soundCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){} }
  if (soundCtx && soundCtx.state === 'suspended') soundCtx.resume();
}
function tone(freq, dur, type, vol, when) {
  if (!soundCtx || !S.audio) return;
  const t = when || soundCtx.currentTime;
  const o = soundCtx.createOscillator(), g = soundCtx.createGain();
  o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(Math.max(0.0001,vol*SOUND_SCALE), t+0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.connect(g).connect(soundCtx.destination); o.start(t); o.stop(t+dur+0.02);
}
function noise(dur, vol, filterFreq, when) {
  if (!soundCtx || !S.audio) return;
  const t = when || soundCtx.currentTime, n = Math.floor(soundCtx.sampleRate*dur);
  const buf = soundCtx.createBuffer(1, n, soundCtx.sampleRate), d = buf.getChannelData(0);
  for(let i=0;i<n;i++) d[i] = Math.random()*2-1;
  const src = soundCtx.createBufferSource(); src.buffer = buf;
  const f = soundCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=filterFreq||900; f.Q.value=0.8;
  const g = soundCtx.createGain(); g.gain.setValueAtTime(Math.max(0.0001,vol*SOUND_SCALE), t); g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  src.connect(f).connect(g).connect(soundCtx.destination); src.start(t);
}
function loopNoise(filterFreq) {
  const len = soundCtx.sampleRate*2;
  const buf = soundCtx.createBuffer(1, len, soundCtx.sampleRate), d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  const src = soundCtx.createBufferSource(); src.buffer=buf; src.loop=true;
  const f = soundCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=filterFreq; f.Q.value=1.2;
  src.connect(f); return {src, f};
}
const SFX = {
  war(strong){ const v=strong?0.10:0.05,t=soundCtx?soundCtx.currentTime:0;
    for(let i=0;i<(strong?4:2);i++){ tone(70,v,'sine',v,t+i*0.28); noise(0.06,v*0.5,180,t+i*0.28); }
    if(strong) noise(0.4,0.05,2600,t+0.9); },
  plague(strong){ const v=strong?0.08:0.04,t=soundCtx?soundCtx.currentTime:0;
    for(let i=0;i<2;i++){ tone(880,0.12,'sine',v,t+i*0.45); tone(440,0.18,'sine',v*0.6,t+i*0.45+0.02); }
    if(strong) noise(0.25,0.05,600,t+0.8); },
  institution(strong){ const v=strong?0.06:0.03,t=soundCtx?soundCtx.currentTime:0;
    for(let i=0;i<(strong?7:4);i++) noise(0.03,v,1800,t+i*0.15);
    noise(0.3,v*0.7,1200,t+0.9); tone(160,0.15,'square',v*0.5,t+1.1); },
  unclaimed(strong){ const v=strong?0.04:0.02,t=soundCtx?soundCtx.currentTime:0;
    noise(1.4,v,320,t); noise(0.5,v*0.8,2200,t+0.3); },
  /* 四種貼身聲音：腳步、翻紙、打字、嘆息。遠時稀疏細碎，近時密集大聲。 */
  step(strong){ const v=strong?0.10:0.045,t=soundCtx?soundCtx.currentTime:0;
    for(let i=0;i<2;i++){ tone(62+i*11,0.10,'sine',v,t+i*0.17); noise(0.05,v*0.6,240,t+i*0.17); } },
  paper(strong){ const v=strong?0.085:0.04,t=soundCtx?soundCtx.currentTime:0;
    noise(0.16,v,3200,t); noise(0.11,v*0.75,2500,t+0.13); noise(0.07,v*0.5,3900,t+0.26); },
  type(strong){ const v=strong?0.07:0.035,t=soundCtx?soundCtx.currentTime:0;
    for(let i=0;i<(strong?7:4);i++){ noise(0.022,v,2600,t+i*(0.11+Math.random()*0.06)); tone(1150,0.015,'square',v*0.35,t+i*0.13); } },
  sigh(strong){ const v=strong?0.075:0.032,t=soundCtx?soundCtx.currentTime:0;
    noise(0.75,v,520,t); tone(205,0.6,'sine',v*0.45,t+0.05); tone(168,0.45,'sine',v*0.3,t+0.3); },
  ward(){ const t=soundCtx?soundCtx.currentTime:0; tone(520,0.10,'triangle',0.07,t); tone(780,0.16,'sine',0.05,t+0.06); noise(0.14,0.04,2400,t); },
  block(){ const t=soundCtx?soundCtx.currentTime:0; tone(520,0.09,'triangle',0.09,t); noise(0.12,0.05,3000,t); tone(780,0.14,'sine',0.05,t+0.05); },
  good(){ const t=soundCtx?soundCtx.currentTime:0; tone(660,0.16,'sine',0.06,t); tone(990,0.22,'sine',0.05,t+0.1); },
  bad(){ const t=soundCtx?soundCtx.currentTime:0; tone(180,0.4,'sawtooth',0.09,t); },
  startle(){ const t=soundCtx?soundCtx.currentTime:0; noise(0.5,0.11,4200,t); tone(1400,0.35,'sawtooth',0.1,t); tone(190,0.5,'square',0.07,t+0.05); },
  death(){ const t=soundCtx?soundCtx.currentTime:0; tone(1600,0.5,'sawtooth',0.14,t); tone(220,0.9,'square',0.1,t); noise(0.7,0.12,3400,t); }
};
function playGhost(type, strong){ if(SFX[type]) SFX[type](strong); }
function playNarrationCue(){
  if(!S || !S.audio || !soundCtx) return;
  const t=soundCtx.currentTime;
  noise(0.06,0.03,1100,t); tone(320,0.09,'sine',0.012,t+0.03);
  noise(0.05,0.02,750,t+0.15); tone(260,0.08,'sine',0.01,t+0.18);
}
function startGhostAmbient(type) {
  if (!soundCtx || !S.audio) return;
  stopGhostAmbient();
  const t = soundCtx.currentTime;
  const g = soundCtx.createGain(); g.gain.setValueAtTime(0.0001, t); g.connect(soundCtx.destination);
  const nodes = [];
  const freq = {war:62, plague:190, institution:105, unclaimed:48}[type] || 80;
  const o = soundCtx.createOscillator(); o.type = type==='institution'?'square':'sine';
  o.frequency.setValueAtTime(freq, t); o.connect(g); o.start(t); nodes.push(o);
  const ln = loopNoise(type==='plague'?700:type==='unclaimed'?300:1400);
  ln.src.connect(g); ln.src.start(t); nodes.push(ln.src);
  ambient = {g, nodes};
}
function updateGhostAmbient(level) {
  if (!ambient || !soundCtx) return;
  ambient.g.gain.setTargetAtTime(0.004 + level*0.075, soundCtx.currentTime, 0.12);
}
function stopGhostAmbient() {
  if (!ambient || !soundCtx) return;
  const t = soundCtx.currentTime, nodes = ambient.nodes;
  ambient.g.gain.setTargetAtTime(0.0001, t, 0.06);
  setTimeout(()=>nodes.forEach(n=>{ try{n.stop()}catch(e){} }), 350);
  ambient = null;
}

/* ============ left/right panels over the room ============ */
function syncDeviceUI() {
  $('btn-cam-toggle').textContent = S.monitorOn ? '關' : '開';
  $('btn-comp-toggle').textContent = S.computerOn ? '關' : '開';
  $('btn-cam-toggle').classList.toggle('on', S.monitorOn);
  $('btn-comp-toggle').classList.toggle('on', S.computerOn);
  $('monitor-panel').classList.toggle('collapsed', !S.monitorOn);
  $('computer-panel').classList.toggle('collapsed', !S.computerOn);
  $('monitor-panel').classList.toggle('on', S.monitorOn);
  $('cf-cam-status').textContent = S.monitorOn
    ? '監控開啟 · 耗電 ×1.3／兩側同開 ×1.5'
    : '監控關閉 · 面板收起，主場景左邊露出 · 不耗電';
  $('cf-cam-status').classList.toggle('on', S.monitorOn);
}
function setView() {
  S.view = 'room';
  $('room-view').classList.add('active');
  syncDeviceUI(); renderViewport(); refreshAlerts(); renderRoomThreat();
}
function openMonitor() {
  if (!S.monitorOn) {
    S.monitorOn = true; syncDeviceUI(); renderViewport(); renderMonitor();
    SFX.good(); toast('左側監控面板已展開');
  }
  tutorialAction('cam-on');
}
function openComputer() {
  if (!S.computerOn) {
    S.computerOn = true; syncDeviceUI(); renderMonitor();
    SFX.good(); toast('右側電腦面板已展開');
  }
  tutorialAction('comp-on');
}
function goNewGame(){ ensureAudio(); show('screen-setup'); }
function clearNightState() {
  S.ghosts = []; S.ward = null; ghostSfxRef = null;
  stopGhostAmbient(); SOUND_SCALE = 1; ghostSfxTimer = 0;
  const sc=$('room-scene'); if(sc) sc.classList.remove('startle');
  const wf=$('ward-field'); if(wf) wf.setAttribute('opacity','0');
  renderWardUI();
}
function startTutorial() {
  S.tutorial = true; S.tutorialStep = 0;
  S.night = 1; S.gameSeconds = 0; S.battery = 100;
  S.monitorOn = false; S.computerOn = false; S.view='room';
  clearNightState(); S.selectedRoom = -1;
  S.tutorialLocs = new Set();
  S.phase = 'calm';
  S.currentTab = 'report'; S.activeDoc = null; S.pendingEvidence = null;
  S.mapLayer = 0; S.selectedRegion = null; S.evidenceChoice = null; S.boostNotified = false;
  S.netEdges = new Set(); S.netSel = null;
  NIGHTS[0].docs.forEach(d=>S.unlockedDocs.add(d.id));
  const tp=$('tut-panel'); tp.style.left=''; tp.style.top=''; tp.style.bottom=''; tp.style.transform='';
  $('hud-night').textContent = '教程夜 · 港島總覽';
  setView('room'); renderAll(); renderTutorialStep();
  show('screen-game');
  $('screen-tutorial').classList.add('active');
  startLoop();
}
function skipTutorial() {
  $('screen-tutorial').classList.remove('active');
  S.tutorial = false; S.tutorialStep = 0; clearNightState();
  SFX.good(); toast('已跳過教程 · 直接開始第一夜','ok');
  startNight(1);
}
function startNight(n) {
  S.tutorial = false;
  $('screen-tutorial').classList.remove('active');
  S.night = n;
  const night = NIGHTS[n-1];
  S.gameSeconds = 0; S.battery = 100;
  S.monitorOn = false; S.computerOn = false; S.view='room';
  clearNightState(); S.selectedRoom = -1;
  S.blocked = 0; S.totalIntrusions = night.intrusions; S.intrusionsSpawned = 0;
  S.phase = 'calm'; S.phaseTimer = 0; S.phaseDur = calmDuration();
  S.netEdges = new Set(); S.netSel = null;
  S.currentTab = 'report'; S.activeDoc = null; S.pendingEvidence = null;
  S.mapLayer = 0; S.selectedRegion = null; S.evidenceChoice = null; S.boostNotified = false;
  S.paused = false; S.nightFinished = false;
  night.docs.forEach(d=>S.unlockedDocs.add(d.id));
  persist();
  $('hud-night').textContent = `第${['一','二','三'][n-1]}夜 · ${night.name}`;
  setView('room'); renderAll();
  show('screen-game'); startLoop();
}
function renderAll(){ renderTabs(); renderMonitor(); renderWardUI(); renderFloorplan(); renderViewport(); renderRoomThreat(); syncDeviceUI(); updateHUD(); }
function startLoop(){ cancelAnimationFrame(rafId); lastTick = performance.now(); rafId = requestAnimationFrame(tick); }
function stopLoop(){ cancelAnimationFrame(rafId); rafId = null; }

/* ============ main loop — always reschedules (fixes frozen timer) ============ */
function tick(now) {
  if (!rafId) return;                       // stopLoop() 明確停止
  const active = S && !S.paused && $('screen-game').classList.contains('active');
  if (!active) { lastTick = now; rafId = requestAnimationFrame(tick); return; }
  const dt = Math.min((now-lastTick)/1000, 0.1); lastTick = now;

  if (!S.tutorial) {
    S.gameSeconds += dt;
    if (S.gameSeconds >= NIGHT_SECONDS) { stopLoop(); endNight(); return; }
  }

  S.phaseTimer += dt;
  if (!S.tutorial && S.difficulty !== 'noghost') {
    if (S.phase==='calm' && S.phaseTimer >= S.phaseDur) {
      if (S.intrusionsSpawned < S.totalIntrusions) spawnWave();
      else S.phaseTimer = 0;
    }
    else if (S.phase==='warning' && S.phaseTimer >= WARN_SECONDS) setPhase('response');
    else if (S.phase==='response' && S.phaseTimer >= RESP_SECONDS) { setPhase('calm'); S.phaseDur = calmDuration(); }
  }

  updateGhosts(dt);
  updateSound(dt);

  if (S.ward) {
    S.ward.timer = Math.max(0, S.ward.timer - dt);
    if (S.ward.timer === 0) { S.ward = null; toast('結界消散了'); }
    renderWardUI();
  }

  const mult = (S.monitorOn && S.computerOn) ? 1.5 : ((S.monitorOn || S.computerOn) ? 1.3 : 1);
  const drain = BASE_DRAIN * mult;
  if (S.battery > 0) S.battery = Math.max(0, S.battery - dt*drain);
  else S.battery = Math.min(100, S.battery + dt*0.5);

  updateHUD();
  rafId = requestAnimationFrame(tick);
}

/* ============ ghost waves ============ */
function setPhase(p) {
  S.phase = p; S.phaseTimer = 0;
  const pill = $('phase-pill'), hint = $('phase-hint'), gh = $('hud-ghosts');
  pill.className = 'phase-pill';
  const counts = ghostCounts();
  gh.textContent = `鬼 ${S.ghosts.length}${counts.atdoor?` · ${counts.atdoor} 在門窗`:counts.invade?` · ${counts.invade} 接近`:''}`;
  gh.style.display = S.ghosts.length ? '' : 'none';
  if (p==='calm') { pill.textContent='平靜期'; hint.textContent='安心做研究，鬼在遠處徘徊。'; }
  else if (p==='warning') { pill.classList.add('warn'); hint.textContent='聲音由小變大——開監控找紅點。'; }
  else if (p==='response') { pill.classList.add('response'); hint.textContent='鬼正逐房間接近——留意門窗！'; }
  refreshAlerts();
}
function ghostCounts(){
  const c={wander:0,invade:0,atdoor:0};
  S.ghosts.forEach(g=>c[g.mode]++);
  return c;
}
function makePath(start){
  const rooms=NIGHTS[S.night-1].rooms;
  return rooms.slice(start).concat(['保安室']);   // 嚴格相鄰
}
function spawnGhost(mode, forcedType) {
  const types=NIGHTS[S.night-1].ghosts;
  const type=forcedType || types[Math.floor(Math.random()*types.length)];
  const rooms=NIGHTS[S.night-1].rooms;
  const start=Math.floor(Math.random()*rooms.length);
  const boosted=S.reportDoneNights.has(S.night);
  const g={
    id:++S.ghostSeq, type, mode,
    path: mode==='invade'?makePath(start):[rooms[start]],
    roomIdx:0, progress:0,
    speed:GHOSTS[type].speed*(boosted?1.4:1), boosted,
    pace:1, jitterTimer:0.3+Math.random()*0.6,   // 忽快忽慢／停滯／倒退
    hopTimer:2+Math.random()*4,                  // 遊蕩鬼換房間
    wanderTimer: 9 + Math.random()*14,
    spot: type==='plague'||type==='unclaimed' ? 'window' : 'door',
    doorTimer: DOOR_WINDOW, startled:false
  };
  S.ghosts.push(g);
  if (boosted && !S.boostNotified){ S.boostNotified=true; toast('報告完成——但它們沒有消失，反而更快了','warn'); }
  return g;
}
function spawnWave() {
  S.intrusionsSpawned++;
  const n=1 + Math.floor(Math.random()*(S.night>=3?3:2));   // 1–2 / 1–3 隻同時
  for(let i=0;i<n;i++) spawnGhost(i===0 ? 'invade' : (Math.random()<0.65?'wander':'invade'));
  setPhase('warning');
  const inv=S.ghosts.find(g=>g.mode==='invade');
  if (inv) { startGhostAmbient(inv.type); playGhost(inv.type,false); }
  renderFloorplan(); renderViewport(); renderRoomThreat();
  toast(`偵測到 ${n} 個入侵來源`,'warn');
}
function updateGhosts(dt) {
  if (!S.ghosts.length) return;
  let changed=false, most=null;
  const rooms=NIGHTS[S.night-1].rooms;
  for (const g of S.ghosts) {
    if (g.mode==='wander') {
      g.progress = 0.25 + Math.sin(performance.now()/900 + g.id)*0.15;
      // 飄忽：遊蕩鬼會突然換房間，不只留在原格
      g.hopTimer -= dt;
      if (g.hopTimer<=0) {
        g.hopTimer = 2.5+Math.random()*4.5;
        if (Math.random()<0.6 && rooms.length>1) {
          g.path=[rooms[Math.floor(Math.random()*rooms.length)]]; changed=true;
        }
      }
      g.wanderTimer -= dt;
      if (g.wanderTimer<=0) {
        g.mode='invade';
        const ri=Math.max(0,rooms.indexOf(g.path[0]));
        g.path=makePath(ri); g.roomIdx=0; g.progress=0; changed=true;
      }
    } else if (g.mode==='invade') {
      // 步伐每隔一小段就重抽：急行／慢行／停滯／倒退，位置不再線性
      g.jitterTimer -= dt;
      if (g.jitterTimer<=0) {
        g.jitterTimer = 0.4+Math.random()*0.9;
        const r=Math.random();
        if (r<0.10) g.pace = -0.45-Math.random()*0.45;        // 倒退
        else if (r<0.26) g.pace = 0.05+Math.random()*0.25;    // 停滯
        else g.pace = 0.75+Math.random()*1.7;                 // 急行
      }
      const step = dt/RESP_SECONDS * g.speed * g.pace
        * (S.difficulty==='study'?0.5:1)
        * Math.max(0.55,1-S.textBonuses*0.12);
      g.progress = Math.max(0, Math.min(1, g.progress+step));
      const ni=Math.min(g.path.length-1, Math.floor(g.progress*(g.path.length-1)+0.0001));
      if (ni!==g.roomIdx) { g.roomIdx=ni; changed=true; }
      if (g.progress>=1) { g.mode='atdoor'; g.roomIdx=g.path.length-1; g.progress=1; g.doorTimer=DOOR_WINDOW; changed=true; }
    } else if (g.mode==='atdoor') {
      g.doorTimer -= dt;
      if (!g.startled) { g.startled=true; triggerStartle(g); }
      if (S.ward) { blockGhost(g); changed=true; continue; }
      if (g.doorTimer<=0) { die(g); return; }
    }
    if (!most || threatLevel(g)>threatLevel(most)) most=g;
  }
  S.ghosts=S.ghosts.filter(g=>g.mode!=='blocked');
  if (changed) { renderFloorplan(); renderViewport(); renderRoomThreat(); }
  if (most) ghostSfxRef=most; else ghostSfxRef=null;
  if (!S.ghosts.length) { stopGhostAmbient(); SOUND_SCALE=1; }
  setPhase(S.phase);
}
function threatLevel(g){
  if (g.mode==='wander') return 0.08;
  if (g.mode==='atdoor') return 1;
  return 0.15 + Math.min(1,g.progress)*0.7;
}
function updateSound(dt) {
  if (!S.ghosts.length) { SOUND_SCALE=1; return; }
  const g=ghostSfxRef && S.ghosts.includes(ghostSfxRef) ? ghostSfxRef : S.ghosts[0];
  const lv=threatLevel(g);
  // 遠時近乎聽不見，近時明顯大聲
  SOUND_SCALE=0.22 + lv*1.3;
  updateGhostAmbient(lv);
  ghostSfxTimer += dt;
  // 稀疏 → 密集：間隔由約 2.6 秒縮到 0.45 秒，門窗前更密
  const interval = g.mode==='wander' ? 2.4+Math.random()*1.4
                 : g.mode==='atdoor' ? 0.35+Math.random()*0.3
                 : Math.max(0.45, 2.6-lv*2.2)*(0.8+Math.random()*0.5);
  if (ghostSfxTimer>=interval) {
    ghostSfxTimer=0;
    const mix=GHOSTS[g.type].mix || ['step','sigh'];
    const texture=mix[Math.floor(Math.random()*mix.length)];
    if (SFX[texture]) SFX[texture](g.mode!=='wander' && lv>0.55);
    // 偶爾混入該鬼的標誌聲，保留「每種鬼有獨特聲音」
    if (Math.random()<0.22 && SFX[g.type]) SFX[g.type](lv>0.6);
  }
}
function triggerStartle(g) {
  SFX.startle();
  const sc=$('room-scene');
  if(sc){ sc.classList.remove('startle'); void sc.offsetWidth; sc.classList.add('startle'); }
  toast(g.spot==='window'
    ? '窗上出現影子——關掉右側電腦面板就看見，然後按桌上的「界」！'
    : '門外有東西——關掉左側監控面板就看見，然後按桌上的「界」！','err');
  refreshAlerts();
}
function blockGhost(g) {
  g.mode='blocked'; S.blocked++; SFX.block(); S.ward=null;
  toast(`結界擋下了${GHOSTS[g.type].name}`,'ok');
}
function die(g) {
  stopLoop(); clearNightState(); S.deaths++; persist();
  SFX.death();
  const note = DEATH_NOTES[S.deaths % DEATH_NOTES.length];
  $('death-title').textContent = note.title;
  $('death-desc').textContent = note.body;
  $('death-quote').textContent = note.quote;
  $('jumpscare-word').textContent = '入侵成功';
  if (S.difficulty === 'standard') {
    // 先顯示死亡畫面的容器，但暫時隱藏文字面板，讓圓形 jumpscare 真正看得見
    $('screen-death').classList.add('scaring');
    show('screen-death');
    $('jumpscare').classList.remove('hide');
    setTimeout(()=>{
      $('jumpscare').classList.add('hide');
      $('screen-death').classList.remove('scaring');
    }, 950);
  } else {
    $('jumpscare').classList.add('hide');
    $('screen-death').classList.remove('scaring');
    setTimeout(()=>show('screen-death'), 400);
  }
}
function refreshAlerts() {
  const g=S.ghosts.find(x=>x.mode==='atdoor');
  const ra=$('room-alert'); if(!ra) return;
  ra.classList.toggle('hidden', !g);
  if(g) ra.textContent = g.spot==='window'
    ? '⚠ 窗上有影子——關掉右側電腦面板露出窗邊，再按桌上「界」！'
    : '⚠ 門外有東西——關掉左側監控面板露出門邊，再按桌上「界」！';
}

/* ============ ward — one desk button, protects the whole security room ============ */
function placeWard() {
  if (S.battery < WARD_COST) { toast('電量不足，無法生成結界','warn'); return; }
  S.battery = Math.max(0, S.battery - WARD_COST);
  S.ward = { timer: WARD_DURATION };
  SFX.ward(); renderWardUI(); renderRoomThreat(); updateHUD();
  toast(`桌上結界已生成 · 護住整間保安室 · -${WARD_COST}% 電 · ${WARD_DURATION} 秒`,'ok');
  tutorialAction('ward');
}
function renderWardUI() {
  const on=!!S.ward;
  $('cf-defense-info').textContent = on
    ? `結界生效中 · 護住整間保安室 · 剩 ${Math.ceil(S.ward.timer)} 秒`
    : '桌上「界」= 唯一結界 · 護住整室 · -2% 電';
  renderRoomThreat();
}
function renderRoomThreat() {
  const btn=$('desk-ward-button'); if(!btn) return;
  const anyThreat=S.ghosts.some(g=>g.mode==='atdoor');
  const doorThreat=S.ghosts.some(g=>g.mode==='atdoor'&&g.spot==='door');
  const winThreat=S.ghosts.some(g=>g.mode==='atdoor'&&g.spot==='window');
  btn.classList.toggle('threat',anyThreat && !S.ward);
  btn.classList.toggle('warded',!!S.ward);
  const dg=$('door-ghost'), wg=$('window-ghost'), wf=$('ward-field');
  if(dg) dg.setAttribute('opacity', doorThreat?'1':'0');
  if(wg) wg.setAttribute('opacity', winThreat?'1':'0');
  if(wf) wf.setAttribute('opacity', S.ward?'.8':'0');
}

/* ============ camera / floorplan ============ */
function toggleMonitor() {
  S.monitorOn = !S.monitorOn;
  syncDeviceUI(); renderFloorplan(); renderViewport(); renderMonitor();
  toast(S.monitorOn ? '左側監控展開 · 電量下降中' : '左側監控收起 · 主場景左邊露出 · 不耗電', S.monitorOn ? 'warn' : '');
  tutorialAction(S.monitorOn ? 'cam-on' : 'cam-off');
}
function toggleComputer() {
  S.computerOn = !S.computerOn;
  syncDeviceUI(); renderMonitor();
  const mult=(S.monitorOn&&S.computerOn)?'×1.5':(S.computerOn?'×1.3':'');
  toast(S.computerOn ? `右側電腦展開 · 耗電 ${mult}` : '右側電腦收起 · 主場景右邊露出 · 監控不受影響');
  tutorialAction(S.computerOn ? 'comp-on' : 'comp-off');
}
function ghostRoom(g){
  const name=g.path[Math.min(g.roomIdx,g.path.length-1)];
  return name==='保安室'?securityIndex():Math.max(0,NIGHTS[S.night-1].rooms.indexOf(name));
}
function renderFloorplan() {
  const svg = document.querySelector('#floorplan svg'); if(!svg) return;
  const rooms = NIGHTS[S.night-1].rooms, cells = layout().cells, sec = securityIndex();
  svg.setAttribute('viewBox', layout().viewBox);
  const fs = S.night===3 ? 10 : 9;
  let html = '';
  cells.forEach((p,i)=>{
    const isSec=i===sec, label=isSec?'保安室':(rooms[i]||`房間 ${i+1}`);
    html += `<g class="fp-room ${isSec?'security':''} ${S.selectedRoom===i?'selected':''}" data-room="${i}">
      <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3"/>
      <text x="${p.x+p.w/2}" y="${p.y+p.h/2+4}" font-size="${fs}">${label}</text></g>`;
  });
  S.ghosts.forEach(g=>{
    if(g.mode==='blocked') return;
    const ri=ghostRoom(g), p=cells[ri]; if(!p) return;
    const color=g.mode==='atdoor'?'#ff6b6b':(g.mode==='invade'?'#cf5a52':'#8a9fae');
    html+=`<g class="fp-ghost ${S.monitorOn?'on':''}"><circle cx="${p.x+p.w/2}" cy="${p.y+p.h/2}" r="${g.mode==='wander'?9:13}" fill="${color}"/></g>`;
    if(g.mode==='invade' && g.roomIdx<g.path.length-1){
      const nn=g.path[g.roomIdx+1], ni=nn==='保安室'?sec:rooms.indexOf(nn);
      if(ni>=0 && cells[ni]){const q=cells[ni];html+=`<g class="fp-next"><rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="3"/></g>`;}
    }
  });
  svg.innerHTML = html;
  svg.querySelectorAll('.fp-room').forEach(el=>el.addEventListener('click',()=>selectRoom(+el.dataset.room)));
}
function renderViewport() {
  const label=$('cv-label'), fig=$('cv-figure'); if(!label||!fig) return;
  if(!S.monitorOn){ label.textContent='監控關閉 · 點右上「開 / 關」才會看到影像'; label.className='cv-label'; fig.style.opacity='0'; return; }
  if(S.selectedRoom<0){ label.textContent='點平面圖上的房間 · 才會出現該房間的影像'; label.className='cv-label'; fig.style.opacity='0'; return; }
  const room=S.selectedRoom===securityIndex()?'保安室':NIGHTS[S.night-1].rooms[S.selectedRoom];
  const here=S.ghosts.filter(g=>g.mode!=='blocked'&&ghostRoom(g)===S.selectedRoom);
  const lead=here.sort((a,b)=>threatLevel(b)-threatLevel(a))[0];
  label.textContent=`CAM · ${room}`+(lead?` · ⚠ 異動（${here.length}）`:'');
  label.className='cv-label'+(lead?' live':'');
  if(lead){
    const p=Math.min(1,lead.progress);
    fig.style.transform=`translate(-50%,-50%) scale(${(0.5+p*1.6).toFixed(2)})`;
    fig.style.opacity=String(0.3+p*0.6);
    fig.style.background=`radial-gradient(ellipse at 50% 35%, ${GHOSTS[lead.type].color}cc, rgba(40,45,55,.4) 55%, transparent 75%)`;
  } else { fig.style.opacity='0'; fig.style.transform='scale(0)'; }
}
function selectRoom(i) {
  S.selectedRoom=i;
  if(S.monitorOn) S.battery=Math.max(0,S.battery-0.4);
  renderFloorplan(); renderViewport(); updateHUD();
  tutorialAction('room');
}
function glitchMonitor(){ const b=$('monitor-body'); b.classList.remove('glitch'); void b.offsetWidth; b.classList.add('glitch'); }

/* ============ HUD ============ */
function updateHUD() {
  const gh = 12 + Math.floor(S.gameSeconds/60);
  const mins = Math.floor((S.gameSeconds%60)/60*60);
  const disp = gh===12?'12':String(gh-12);
  $('hud-time').textContent = S.tutorial ? '教程' : `${disp}:${String(mins).padStart(2,'0')} AM`;
  $('battery-fill').style.width = S.battery+'%';
  $('battery-fill').classList.toggle('low', S.battery<25);
  $('battery-num').textContent = Math.round(S.battery)+'%';
  $('battery-num').style.color = S.battery<25?'var(--red)':'var(--green)';
  $('room-power-fill').style.width = S.battery+'%';
  $('room-power-fill').classList.toggle('low', S.battery<25);
  $('room-power-num').textContent = Math.round(S.battery)+'%';
  const mult = (S.monitorOn && S.computerOn) ? 1.5 : ((S.monitorOn || S.computerOn) ? 1.3 : 1);
  const drains=[]; if(S.monitorOn)drains.push('監控'); if(S.computerOn)drains.push('電腦');
  $('room-usage').textContent = drains.length ? drains.join('+')+' ×'+mult : '— ×1.0';
  $('hud-progress').textContent = `報告 ${completedThisNight().length}/6`;
  const c=ghostCounts(), ghEl=$('hud-ghosts');
  ghEl.textContent=`鬼 ${S.ghosts.length}${c.atdoor?` · ${c.atdoor} 在門窗`:c.invade?` · ${c.invade} 接近`:''}`;
  ghEl.style.display=S.ghosts.length?'':'none';
}
function completedThisNight(){
  const night=NIGHTS[S.night-1]; if(!night) return [];
  const ids=[]; night.report.forEach(col=>col.steps.forEach(st=>ids.push(st.id)));
  return ids.filter(id=>S.completed.has(id));
}

/* ============ research rendering ============ */
function renderTabs(){ document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active', t.dataset.tab===S.currentTab)); }
function renderMonitor() {
  const body=$('monitor-body'); if(!body) return;
  if (!S.computerOn) { body.innerHTML='<div class="mb-h">電腦已關閉</div><p>點右上「開 / 關」重新開啟。關閉時不耗電。</p>'; return; }
  if (S.battery<=0) { body.innerHTML='<div class="mb-h">電量不足</div><p>畫面關閉。等待電量回復。</p>'; return; }
  const night=NIGHTS[S.night-1]; if(!night){ body.innerHTML='<p>無資料。</p>'; return; }
  switch(S.currentTab){
    case 'report': renderReport(body,night); break;
    case 'files': renderFiles(body,night); break;
    case 'map': renderMap(body,night); break;
    case 'text': renderText(body,night); break;
    case 'network': renderNetwork(body,night); break;
  }
  setStatus(`系統就緒 · ${S.currentTab} · 已完成 ${completedThisNight().length}/6`);
}
function setStatus(t){ $('monitor-status').textContent=t; }

function docLinks(doc){
  if(!doc.links || !doc.links.length) return '';
  return `<div class="doc-links"><span>回查出處</span>${doc.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join('')}</div>`;
}
function renderFiles(body,night) {
  if (S.activeDoc) {
    const doc=night.docs.find(d=>d.id===S.activeDoc);
    body.innerHTML=`<div class="back-link" id="doc-back">‹ 返回檔案列表</div>
      <div class="doc-reader"><h4>${doc.title}</h4><div class="docdate">${doc.date} · 來源類型：${doc.source} · 證據狀態：${doc.status}</div>${doc.body}${docLinks(doc)}</div>`;
    $('doc-back').onclick=()=>{ S.activeDoc=null; renderMonitor(); };
    body.querySelectorAll('.kw').forEach(k=>k.onclick=()=>onKeyword(k.dataset.kw));
    return;
  }
  body.innerHTML=`<div class="mb-h">檔案列表 · 第${['一','二','三'][S.night-1]}夜</div>
    <div class="mb-sub">${night.objective}</div>
    <div class="doc-list">${night.docs.map(d=>`<div class="doc-item" data-id="${d.id}"><span class="status">${d.status}</span><div class="dt">${d.title}</div><div class="dm">${d.date} · ${d.source}</div></div>`).join('')}</div>`;
  body.querySelectorAll('.doc-item').forEach(it=>it.onclick=()=>{
    S.activeDoc=it.dataset.id; renderMonitor(); tutorialAction('doc');
  });
}
function onKeyword(kw) {
  const night=NIGHTS[S.night-1];
  const step=night.report.flatMap(c=>c.steps).find(s=>s.type==='text'&&s.target===kw);
  if(step && !S.completed.has(step.id) && step.evidence){
    S.pendingEvidence=step.id; showEvidencePanel(step,kw,night);
  } else toast(`已標記關鍵詞：${kw}`);
  document.querySelectorAll(`.kw[data-kw="${kw}"]`).forEach(k=>k.classList.add('found'));
  tutorialAction('keyword');
}
function showEvidencePanel(step,kw,night) {
  const body=$('monitor-body'); if(!body) return;
  const old=$('evidence-panel'); if(old) old.remove();
  const w=night.textAnalysis.words.find(x=>x.w===kw);
  const ctx=w ? w.ctx[0] : `在檔案中找到「${kw}」。回想它出現在哪一分來源。`;
  const panel=document.createElement('div');
  panel.className='evidence-panel'; panel.id='evidence-panel';
  panel.innerHTML=`<span class="ep-close" id="ep-close">✕</span>
    <div class="ep-head">證據判讀 ·「${kw}」<small>選對來源才完成任務</small></div>
    <div class="ep-quote">${ctx}</div>
    <div class="ep-q">這段話屬於哪一種來源層級？</div>
    <div class="ep-opts">${step.evidence.options.map(o=>`<button class="ep-opt" data-choice="${o}">${o}</button>`).join('')}</div>
    <div class="ep-feedback" id="ep-feedback"></div>`;
  body.prepend(panel);
  $('ep-close').onclick=()=>{ S.pendingEvidence=null; panel.remove(); };
  panel.querySelectorAll('.ep-opt').forEach(b=>b.onclick=()=>classifyEvidence(step,b));
}
function classifyEvidence(step,btn){
  const fb=$('ep-feedback');
  if(btn.dataset.choice===step.evidence.answer){
    btn.classList.add('correct'); SFX.good();
    fb.textContent='✓ 判斷正確。'+step.evidence.hint;
    S.pendingEvidence=null;
    setTimeout(()=>{ const p=$('evidence-panel'); if(p) p.remove(); completeTask(step.id,'文本步驟完成：證據層級判斷正確'); },900);
  } else {
    btn.classList.add('wrong'); SFX.bad();
    fb.className='ep-feedback err';
    fb.textContent='✕ 不對。再想一次：誰在說這句話？是原始來源，還是後來的人轉述？';
  }
}
function renderReport(body,night) {
  const done=completedThisNight().length;
  let html=`<div class="mb-h">調查報告 · 第${['一','二','三'][S.night-1]}夜</div>
    <div class="report-obj"><strong>調查目標：</strong>${night.objective}<br><strong>完成後你會發現：</strong>${night.learning}</div>
    <div class="report-grid">`;
  night.report.forEach((col,ci)=>{
    html+=`<div class="report-col"><h4>結論 ${ci+1}<br>${col.title}</h4>`;
    col.steps.forEach(st=>{
      const ok=S.completed.has(st.id), typeLabel=st.type==='network'?'網絡步驟':st.type==='map'?'地圖步驟':'文本步驟';
      html+=`<div class="step ${ok?'done':''}"><div class="step-type ${st.type}">${typeLabel}</div>
        <div class="step-desc">${st.desc}</div><div class="step-status">${ok?'✓ 已完成':'○ 待完成 — 到對應分頁操作'}</div></div>`;
    });
    html+='</div>';
  });
  html+=`</div><div class="mb-sub" style="margin-top:14px">進度 ${done}/6 · 完成整份報告後鬼怪會加速——你仍須繼續防守。</div>`;
  body.innerHTML=html;
}
function renderMap(body,night) {
  if (S.tutorial && !night.map) {
    const layers=['歷史航拍','今日屋邨','資料支持範圍'];
    const targets=TUTORIAL_LOCATIONS.filter(r=>r.target);
    const gotTargets=targets.filter(r=>S.tutorialLocs.has(r.id)).length;
    let html=`<div class="mb-h">QGIS 示意圖 · 教程夜：港島總覽</div>
      <div class="tut-target-hint">接下來三晚的任務目標：<strong>${targets.map(r=>r.name).join(' · ')}</strong><br>已認 ${gotTargets} / 3（點地圖上的大圓點）</div>
      <div class="layer-switch">${layers.map((l,i)=>`<button class="layer-btn ${i===S.mapLayer?'active':''}" data-li="${i}">${l}</button>`).join('')}</div>
      <div class="map-canvas"><svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet"><rect width="600" height="380" fill="#08120d"/>
      <path d="M60 60 Q200 20 340 80 T560 120 L540 300 Q360 350 180 320 T60 240 Z" fill="#12221c" stroke="#2c5642"/>`;
    TUTORIAL_LOCATIONS.forEach(r=>{
      const px=r.x*0.8+10, py=r.y*0.7+10, got=S.tutorialLocs.has(r.id);
      html+=`<g class="map-region tut-loc ${r.target?'target':''} ${got?'selected':''}" data-tut="${r.id}"><circle cx="${px}" cy="${py}" r="${got?15:(r.target?13:8)}"/><text x="${px}" y="${py+4}">${r.name}</text></g>`;
    });
    html+='</svg></div>';
    html+=`<div class="map-hint">任務地圖：先點三個目標。其他地點是港島鬼故例子，點了可看檔案卡。</div>`;
    if(S.tutorialLocs.size){
      html+='<div class="tut-cards">';
      TUTORIAL_LOCATIONS.filter(r=>S.tutorialLocs.has(r.id)).forEach(r=>{
        html+=`<div class="tut-card ${r.target?'is-target':''}"><strong>${r.name}</strong><span>${r.night} · ${r.era}</span><p>${r.rumor}</p><small>來源：${r.src} · 恐懼：${r.fear}</small></div>`;
      });
      html+='</div>';
    }
    body.innerHTML=html;
    body.querySelectorAll('.layer-btn[data-li]').forEach(b=>b.onclick=()=>{ S.mapLayer=+b.dataset.li; renderMonitor(); });
    body.querySelectorAll('.tut-loc').forEach(g=>g.onclick=()=>{
      S.tutorialLocs.add(g.dataset.tut); SFX.good(); renderMonitor();
      if(targets.every(r=>S.tutorialLocs.has(r.id))) tutorialAction('maploc');
      else if(!TUTORIAL_LOCATIONS.find(r=>r.id===g.dataset.tut).target) toast('這是港島其他鬼故例子 · 三個大圓點才是任務目標');
    });
    return;
  }
  if(!night.map){ body.innerHTML=`<div class="mb-h">地圖</div><p>本夜沒有地圖任務。第三夜的地圖資料可在檔案庫查閱。</p>`; return; }
  const mapCfg = night.map;
  const layers=mapCfg.layers;
  let html=`<div class="mb-h">QGIS 示意的圖 · ${night.name}</div>
    <div class="layer-switch">${layers.map((l,i)=>`<button class="layer-btn ${i===S.mapLayer?'active':''}" data-li="${i}">${l}</button>`).join('')}</div>
    <div class="map-canvas"><svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet"><rect width="600" height="380" fill="#08120d"/>`;
  if(S.mapLayer===0) html+=`<path d="M60 60 Q200 20 340 80 T560 120 L540 300 Q360 350 180 320 T60 240 Z" fill="#12221c" stroke="#2c5642"/><text x="300" y="200" fill="#3f6b55" font-size="14" text-anchor="middle">歷史地形（原型示意）</text>`;
  else if(S.mapLayer===1) html+=`<path d="M60 60 Q200 20 340 80 T560 120 L540 300 Q360 350 180 320 T60 240 Z" fill="#101d18" stroke="#2c5642"/><text x="300" y="200" fill="#3f6b55" font-size="14" text-anchor="middle">今日屋邨（原型示意）</text>`;
  else html+=`<path d="M60 60 Q200 20 340 80 T560 120 L540 300 Q360 350 180 320 T60 240 Z" fill="#0d1c22" stroke="#2c4b56"/><text x="300" y="200" fill="#3a5c6a" font-size="14" text-anchor="middle">資料支持範圍（原型示意）</text>`;
  mapCfg.regions.forEach(r=>{
    const x=r.x*560+20, y=r.y*340+20;
    html+=`<g class="map-region ${S.selectedRegion===r.id?'selected':''}" data-rid="${r.id}"><rect x="${x-52}" y="${y-20}" width="104" height="40" rx="3"/><text x="${x}" y="${y+4}">${r.label}</text></g>`;
  });
  html+='</svg></div>';
  if(night.report[1].steps[0].type==='map'){
    html+=`<div class="mb-sub" style="margin-top:14px">證據支持到哪裡？</div>
      <div class="layer-switch">${['整個屋邨','部分地段','資料仍不足'].map(v=>`<button class="layer-btn ${S.evidenceChoice===v?'active':''}" data-ev="${v}">${v}</button>`).join('')}</div>
      <button class="task-action" id="check-evidence">看地圖證據</button>`;
  }
  html+=`<div class="map-hint">提示：先切換圖層，再點選地塊。這是原型示意圖，非正式 QGIS 輸出。</div>`;
  body.innerHTML=html;
  body.querySelectorAll('.layer-btn[data-li]').forEach(b=>b.onclick=()=>{ S.mapLayer=+b.dataset.li; renderMonitor(); });
  body.querySelectorAll('.map-region').forEach(g=>g.onclick=()=>{
    S.selectedRegion=g.dataset.rid;
    const t1=night.report[0].steps[0];
    if(t1 && t1.type==='map' && t1.target===S.selectedRegion && !S.completed.has(t1.id)) completeTask(t1.id,'地圖步驟完成：已圈出範圍');
    else { renderMonitor(); toast('已圈選；再對照圖層與口述。'); }
  });
  body.querySelectorAll('.layer-btn[data-ev]').forEach(b=>b.onclick=()=>{ S.evidenceChoice=b.dataset.ev; renderMonitor(); });
  const ce=$('check-evidence'); if(ce) ce.onclick=()=>{
    const t2=night.report[1].steps[0];
    if(S.evidenceChoice===t2.target && !S.completed.has(t2.id)) completeTask(t2.id,'地圖步驟完成：證據權衡');
    else toast('再對照文獻、地貌與回憶各自能支持多少。','warn');
  };
}
function renderText(body,night) {
  const ta=night.textAnalysis, max=Math.max(...ta.words.map(w=>w.n));
  let html=`<div class="mb-h">文本分析 · 詞頻與上下文</div>
    <div class="mb-sub">Voyant 式詞頻／VOSviewer 式聚類（原型示意）· 電腦開著就耗電</div>
    <div class="freq-list">${ta.words.map(w=>`<div class="freq-row" data-w="${w.w}"><span class="fw">${w.w}</span><div class="freq-bar" style="width:${(w.n/max)*180}px"></div><span class="fc">${w.n}</span></div>`).join('')}</div>
    <div class="cluster-view">${ta.clusters.map(c=>`<div class="cluster-bubble" style="width:${Math.sqrt(c.size)*9}px;height:${Math.sqrt(c.size)*9}px" data-ct="${c.target}"><div>${c.name}<br><small>${c.words}</small></div></div>`).join('')}</div>
    <div id="ctx-area"></div>`;
  body.innerHTML=html;
  body.querySelectorAll('.freq-row').forEach(r=>r.onclick=()=>{
    const w=ta.words.find(x=>x.w===r.dataset.w), area=$('ctx-area');
    area.innerHTML=`<div class="context-box"><div class="ctx-h">「${w.w}」的上下文 · ${w.n} 次</div>${w.ctx.map(c=>`<p>· ${c}</p>`).join('')}</div>`;
    area.querySelectorAll('.kw').forEach(k=>k.onclick=()=>onKeyword(k.dataset.kw));
    tutorialAction('word');
  });
  body.querySelectorAll('.cluster-bubble').forEach(b=>b.onclick=()=>{
    const w=ta.words.find(x=>x.w===b.dataset.ct); if(!w) return;
    const area=$('ctx-area');
    area.innerHTML=`<div class="context-box"><div class="ctx-h">詞群聚焦 ·「${w.w}」</div>${w.ctx.map(c=>`<p>· ${c}</p>`).join('')}<button class="task-action" data-kwt="${w.w}">標記此步驟完成</button></div>`;
    area.querySelectorAll('.kw').forEach(k=>k.onclick=()=>onKeyword(k.dataset.kw));
    area.querySelector('[data-kwt]').onclick=e=>onKeyword(e.target.dataset.kwt);
    tutorialAction('word');
  });
}
function renderNetwork(body,night) {
  const net=night.network;
  let html=`<div class="mb-h">關係網絡 · Gephi 式連線</div>
    <div class="net-toolbar"><button class="layer-btn" id="net-clear">清除連線</button><span class="nt-hint">按兩個節點連線 · 正確連線完成任務 · 電腦開著就耗電</span></div>
    <div class="net-canvas"><svg id="net-svg" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid meet"><g id="net-edges"></g><g id="net-nodes"></g></svg></div>`;
  body.innerHTML=html; drawNetwork(net);
  $('net-clear').onclick=()=>{ S.netEdges=new Set(); S.netSel=null; drawNetwork(net); toast('已清除連線'); };
}
function drawNetwork(net) {
  const eg=$('net-edges'), ng=$('net-nodes'); if(!eg||!ng) return;
  eg.innerHTML=''; ng.innerHTML='';
  const pos=id=>{ const n=net.nodes.find(x=>x.id===id); return {x:n.x*600, y:n.y*380}; };
  const groups=Object.entries(net.targets);
  S.netEdges.forEach(key=>{
    const [a,b]=key.split('|'), p1=pos(a), p2=pos(b);
    const correct=groups.some(g=>g[1].some(pair=>(pair[0]===a&&pair[1]===b)||(pair[0]===b&&pair[1]===a)));
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',p1.x);line.setAttribute('y1',p1.y);line.setAttribute('x2',p2.x);line.setAttribute('y2',p2.y);
    line.setAttribute('class','net-edge '+(correct?'correct':'wrong')); eg.appendChild(line);
  });
  net.nodes.forEach(n=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','net-node'+(S.netSel===n.id?' sel':'')); g.setAttribute('data-group',n.group); g.dataset.id=n.id;
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',n.x*600);c.setAttribute('cy',n.y*380);c.setAttribute('r',22);
    const t=document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',n.x*600);t.setAttribute('y',n.y*380+30); t.textContent=n.label;
    g.appendChild(c);g.appendChild(t); ng.appendChild(g);
    g.onclick=()=>onNodeClick(n.id,net);
  });
}
function onNodeClick(id,net) {
  if(S.netSel===null){ S.netSel=id; drawNetwork(net); setStatus(`已選「${net.nodes.find(n=>n.id===id).label}」— 再按另一節點連線`); return; }
  if(S.netSel===id){ S.netSel=null; drawNetwork(net); return; }
  const a=S.netSel, b=id; S.netSel=null;
  const key=[a,b].sort().join('|');
  if(!S.netEdges.has(key)) {
    S.netEdges.add(key);
    Object.entries(net.targets).forEach(([tid,pairs])=>{
      if(S.completed.has(tid)) return;
      if(pairs.every(p=>S.netEdges.has([p[0],p[1]].sort().join('|')))) completeTask(tid,'關係網絡完成');
    });
    tutorialAction('connect');
  }
  drawNetwork(net);
}
function completeTask(id,msg) {
  if(S.completed.has(id)) return;
  S.completed.add(id); SFX.good(); toast(msg||'任務完成','ok');
  const night=NIGHTS[S.night-1];
  const isNetwork=night.report.flatMap(c=>c.steps).some(s=>s.id===id&&s.type==='network');
  if(isNetwork){ S.battery=Math.min(100,S.battery+15); }
  else S.textBonuses++;
  if(completedThisNight().length===6 && !S.reportDoneNights.has(S.night)){
    S.reportDoneNights.add(S.night);
    toast('整份報告完成！鬼怪速度提升——繼續防守','ok');
  }
  persist(); updateHUD(); renderMonitor();
}

/* ============ tutorial ============ */
function renderTutorialStep() {
  const st = TUTORIAL_STEPS[S.tutorialStep]; if(!st) return;
  $('tut-step-count').textContent = `步驟 ${S.tutorialStep+1} / ${TUTORIAL_STEPS.length}`;
  $('tut-step-title').textContent = st.title;
  $('tut-step-body').innerHTML = st.body;
  $('tut-step-action').textContent = st.action || '';
  $('tut-prev').disabled = S.tutorialStep===0;
  $('tut-next').textContent = S.tutorialStep===TUTORIAL_STEPS.length-1 ? '開始第一夜 →' : '下一步';
  const nar=$('tut-narration');
  if(st.narration){ $('tut-narration-text').textContent=st.narration; nar.classList.remove('hidden'); playNarrationCue(); }
  else nar.classList.add('hidden');
}
function tutorialAction(key) {
  if(!S.tutorial) return;
  const st = TUTORIAL_STEPS[S.tutorialStep];
  if(st && st.wait===key){
    SFX.good(); toast('正確！');
    if(S.tutorialStep < TUTORIAL_STEPS.length-1){ S.tutorialStep++; renderTutorialStep(); }
  }
}
function tutorialNext() {
  const st = TUTORIAL_STEPS[S.tutorialStep];
  if(st.wait!=='next'){ toast('請先完成面板提示的操作','warn'); return; }
  if(S.tutorialStep >= TUTORIAL_STEPS.length-1){ SFX.good(); startNight(1); return; }
  S.tutorialStep++; SFX.good(); renderTutorialStep();
}
function tutorialPrev(){ if(S.tutorialStep>0){ S.tutorialStep--; renderTutorialStep(); } }

/* ============ night end / ending ============ */
function endNight() {
  clearNightState(); S.nightFinished=true;
  const done=completedThisNight().length, total=S.completed.size, night=NIGHTS[S.night-1];
  $('stat-ghosts').textContent=`${S.blocked} / ${S.totalIntrusions}`;
  $('stat-tasks').textContent=`${done} / 6`;
  $('stat-total').textContent=`${total} / 18`;
  $('summary-title').textContent=`第${['一','二','三'][S.night-1]}夜 · ${night.name} · 結算`;
  $('summary-report').innerHTML=`<div class="sr-title">本夜評語</div>${night.summaryLine}<br><br><span class="muted">死亡次數不影響結局。未完成的結論可在檔案庫查看來源，但任務進度不會補回。</span>`;
  persist({ night: Math.min(S.night+1,4) });
  show('screen-summary');
}
function summaryNext(){ if(S.night>=3) showEndingSetup(); else startNight(S.night+1); }
let selectedEnding=null;
function showEndingSetup() {
  const total=S.completed.size, full=total>=18;
  selectedEnding=null;
  $('ending-eyebrow').textContent = full?'終局 · 全部結論完成':`終局 · 任務進度 ${total}/18`;
  $('ending-title').textContent='選擇';
  $('ending-body').innerHTML = full
    ? '你已完成全部 18 個任務，可以選擇如何對待這些故事。'
    : `三晚總任務進度未達 100%（${total}/18），只能進入結局 A「驅除」。<br><span class="eb-note">未完成的結論會在畫面提示。</span>`;
  $('ending-choice').classList.remove('hidden'); $('btn-ending-confirm').classList.add('hidden');
  const b=$('ending-b'); b.classList.toggle('locked',!full);
  b.querySelector('span').textContent = full?'承認這些人曾經存在，留下可查證的紀錄。':'需要 18/18 任務完成才能選擇。';
  document.querySelectorAll('.ending-card').forEach(c=>{
    c.classList.remove('selected');
    c.onclick=()=>{
      if(c.classList.contains('locked')){ toast('需要先完成全部 18 個任務','warn'); return; }
      document.querySelectorAll('.ending-card').forEach(x=>x.classList.remove('selected'));
      c.classList.add('selected'); selectedEnding=c.dataset.ending;
      $('btn-ending-confirm').classList.remove('hidden');
    };
  });
  show('screen-ending');
}
function confirmEnding() {
  if(!selectedEnding) return;
  const e=ENDINGS[selectedEnding]; S.endingSeen=selectedEnding; persist();
  $('ending-eyebrow').textContent='終局'; $('ending-title').textContent=e.title;
  $('ending-body').innerHTML=e.body + (selectedEnding==='A' && S.completed.size<18 ? `<br><span class="eb-note">未完成：${18-S.completed.size} 個任務。那些故事再次沒有人記錄。</span>`:'');
  $('ending-choice').classList.add('hidden'); $('btn-ending-confirm').classList.add('hidden'); SFX.good();
}

/* ============ database ============ */
function initDatabase() {
  const list=$('db-list'); list.innerHTML='';
  NIGHTS.forEach(n=>n.docs.forEach(d=>{
    const it=document.createElement('div'); it.className='db-item'; it.dataset.id=d.id;
    it.innerHTML=`${d.title}<small>第${n.id}夜 · ${d.source} · ${d.status}</small>`;
    it.onclick=()=>openDbDoc(d,n); list.appendChild(it);
  }));
  $('db-main').innerHTML='<div class="db-empty">選擇左側檔案以閱讀。</div>';
}
function openDbDoc(d,n) {
  document.querySelectorAll('.db-item').forEach(x=>x.classList.toggle('selected',x.dataset.id===d.id));
  $('db-main').innerHTML=`<div class="db-doc"><h2>${d.title}</h2>
    <div class="dbmeta">第${['一','二','三'][n.id-1]}夜 · ${d.date}<br>來源類型：${d.source} · 證據狀態：${d.status}</div>
    ${d.body}${docLinks(d)}<div class="db-evidence">證據狀態：${d.status}</div>
    <div class="db-warn">資料說明：本檔案按《港島鬼故三案研究小冊子》與《港島鬼故事地圖資料彙編》的短引、年代錨點及來源編號整理。直接引文保留原有語言，分析與情境重構另外標示。仍待核的版次、時間碼、款項與範圍一律標「待查」，不當作定論。</div></div>`;
}

/* ============ bindings ============ */
function bind() {
  $('btn-new').onclick=goNewGame;
  $('btn-continue').onclick=()=>{
    const sv=loadSave(); if(!sv) return; ensureAudio();
    S=freshState(sv.difficulty,sv.audio,sv);
    if(S.night>3) showEndingSetup(); else startNight(S.night);
  };
  $('btn-database').onclick=()=>{ initDatabase(); show('screen-database'); };
  $('btn-about').onclick=()=>show('screen-about');
  $('btn-about-home').onclick=()=>show('screen-home');
  $('btn-db-home').onclick=()=>show('screen-home');

  document.querySelectorAll('.diff-card').forEach(c=>c.onclick=()=>{
    document.querySelectorAll('.diff-card').forEach(x=>x.classList.remove('selected'));
    c.classList.add('selected');
  });
  $('btn-setup-back').onclick=()=>show('screen-home');
  $('btn-setup-start').onclick=()=>{
    const diff=document.querySelector('.diff-card.selected').dataset.diff;
    const audio=$('opt-audio').checked;
    const skip=$('opt-skip-tut').checked;
    localStorage.removeItem(SAVE_KEY);
    S=freshState(diff,audio,null); ensureAudio();
    if(skip){ toast('已跳過教程 · 直接開始第一夜','ok'); startNight(1); }
    else startTutorial();
  };

  $('room-monitor').addEventListener('click',openMonitor);
  $('room-computer').addEventListener('click',openComputer);
  $('btn-room-cam').onclick=openMonitor;
  $('btn-room-comp').onclick=openComputer;
  $('btn-cam-toggle').onclick=toggleMonitor;
  $('btn-comp-toggle').onclick=toggleComputer;
  // 結界只有桌上一個按鈕，護住整間保安室
  $('desk-ward-button').addEventListener('click',placeWard);

  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{
    S.currentTab=t.dataset.tab; renderTabs(); renderMonitor();
    tutorialAction(`tab:${S.currentTab}`);
  });

  $('tut-next').onclick=tutorialNext;
  $('tut-prev').onclick=tutorialPrev;
  $('btn-tut-skip').onclick=skipTutorial;
  $('btn-tut-min').onclick=()=>{
    const p=$('tut-panel'), min=p.classList.toggle('minimized');
    $('btn-tut-min').textContent = min ? '＋ 展開' : '－ 收起';
  };
  (function(){
    const panel=$('tut-panel'), handle=$('tut-drag');
    let dragging=false, ox=0, oy=0;
    handle.addEventListener('pointerdown',e=>{
      dragging=true;
      const r=panel.getBoundingClientRect();
      panel.style.transform='none'; panel.style.left=r.left+'px'; panel.style.top=r.top+'px'; panel.style.bottom='auto';
      ox=e.clientX-r.left; oy=e.clientY-r.top;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove',e=>{
      if(!dragging) return;
      panel.style.left=Math.max(0,Math.min(window.innerWidth-panel.offsetWidth,e.clientX-ox))+'px';
      panel.style.top=Math.max(0,Math.min(window.innerHeight-panel.offsetHeight,e.clientY-oy))+'px';
    });
    handle.addEventListener('pointerup',()=>{dragging=false;});
  })();

  $('btn-pause').onclick=()=>{ S.paused=true; show('screen-pause'); };
  $('btn-resume').onclick=()=>{ S.paused=false; show('screen-game'); startLoop(); };   // 修復：必須重新啟動迴圈
  $('btn-pause-home').onclick=()=>{ stopLoop(); show('screen-home'); refreshContinue(); };
  $('btn-death-retry').onclick=()=>{
    const night=NIGHTS[S.night-1];
    night.report.forEach(col=>col.steps.forEach(st=>S.completed.delete(st.id)));
    S.reportDoneNights.delete(S.night); S.textBonuses=0;
    persist(); startNight(S.night);
  };
  $('btn-death-home').onclick=()=>{ stopLoop(); persist(); show('screen-home'); refreshContinue(); };
  $('btn-summary-next').onclick=summaryNext;
  $('btn-ending-confirm').onclick=confirmEnding;
  $('btn-ending-home').onclick=()=>{ show('screen-home'); refreshContinue(); };
}
document.addEventListener('DOMContentLoaded',()=>{ bind(); refreshContinue(); });
