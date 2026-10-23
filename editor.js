/* VideoBanao Free — editor engine (scenes, canvas renderer, preview, WebM export) */
(function(){
"use strict";
var S = function(){ return window.VB_STR || {}; };
var pv = document.getElementById("preview");
var pctx = pv.getContext("2d");
var SIZES = {"9:16":[720,1280],"16:9":[1280,720],"1:1":[960,960]};
var FONTS = {
  poppins:"Poppins,'Noto Sans Devanagari',sans-serif",
  hindi:"'Noto Sans Devanagari',Poppins,sans-serif",
  serif:"Georgia,'Times New Roman',serif",
  sans:"Arial,Helvetica,sans-serif",
  impact:"'Arial Black',Arial,sans-serif",
  mono:"'Courier New',monospace"
};
var GRADS = [
  ["#7c5cff","#00c2ff"],["#ff512f","#dd2476"],["#11998e","#38ef7d"],["#fc4a1a","#f7b733"],
  ["#8e2de2","#4a00e0"],["#0f2027","#2c5364"],["#ff9966","#ff5e62"],["#396afc","#2948ff"],
  ["#232526","#414345"],["#ee0979","#ff6a00"]
];
var TR = 0.5; /* transition seconds */

function defScene(){ return {
  bgType:"gradient", grad:0, solid:"#5b2ee5", img:null,
  headline:"", subtext:"", duration:4, font:"poppins", size:1,
  color:"#ffffff", bold:true, anim:"fade", kb:"in", trans:"fade"
};}
var scenes = [], sel = 0, aspect = "9:16";
var audioBuffer = null, audioName = "", audioURL = "";
var playing = false, pvOffset = 0, pvStart = 0, rafId = null, exporting = false;

function totalDur(){ return scenes.reduce(function(a,s){return a+s.duration;},0); }
function $(id){ return document.getElementById(id); }

/* ---------- drawing ---------- */
function ease(p){ return 1-Math.pow(1-p,3); }
function wrap(ctx,text,maxW){
  var words = String(text||"").split(/\s+/).filter(Boolean), lines=[], line="";
  for(var i=0;i<words.length;i++){
    var test = line ? line+" "+words[i] : words[i];
    if(ctx.measureText(test).width > maxW && line){ lines.push(line); line = words[i]; }
    else line = test;
  }
  if(line) lines.push(line);
  return lines;
}
function drawBG(ctx,W,H,s,t,gt){
  if(s.bgType === "image" && s.img && s.img.complete && s.img.naturalWidth){
    var img = s.img, p = s.duration ? t/s.duration : 0;
    var cover = Math.max(W/img.naturalWidth, H/img.naturalHeight);
    var extra = 1.16, z = extra, ox = 0, oy = 0;
    if(s.kb === "in"){ z = 1 + 0.16*p; }
    else if(s.kb === "out"){ z = 1.16 - 0.16*p; }
    else if(s.kb === "left"){ z = extra; ox = (0.5-p) * W * 0.10; }
    else if(s.kb === "right"){ z = extra; ox = (p-0.5) * W * 0.10; }
    else if(s.kb === "none"){ z = 1.02; }
    var dw = img.naturalWidth*cover*z, dh = img.naturalHeight*cover*z;
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
    ctx.drawImage(img, (W-dw)/2 + ox, (H-dh)/2 + oy, dw, dh);
    ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.fillRect(0,0,W,H);
    return;
  }
  if(s.bgType === "solid"){
    ctx.fillStyle = s.solid; ctx.fillRect(0,0,W,H);
  } else {
    var g = GRADS[s.grad % GRADS.length];
    var ang = gt*0.25, x0 = W/2 + Math.cos(ang)*W*0.35, y0 = H/2 + Math.sin(ang*0.8)*H*0.3;
    var lg = ctx.createLinearGradient(x0, y0, W-x0, H-y0);
    lg.addColorStop(0, g[0]); lg.addColorStop(1, g[1]);
    ctx.fillStyle = lg; ctx.fillRect(0,0,W,H);
  }
  /* gentle moving glow = animated background */
  ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = "#ffffff";
  var r = Math.max(W,H)*0.28;
  var gx = W*(0.25 + 0.12*Math.sin(gt*0.5)), gy = H*(0.3 + 0.1*Math.cos(gt*0.4));
  ctx.beginPath(); ctx.arc(gx, gy, r, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(W-gx, H-gy, r*0.7, 0, 7); ctx.fill();
  ctx.restore();
}
function drawText(ctx,W,H,s,t){
  var head = s.headline || "", sub = s.subtext || "";
  if(!head && !sub) return;
  var pIn = Math.min(1, t/0.75), a = 1, dy = 0, sc = 1;
  if(s.anim === "fade") a = pIn;
  else if(s.anim === "slide"){ dy = (1-ease(pIn)) * H*0.06; a = Math.min(1, pIn*1.4); }
  else if(s.anim === "zoom"){ sc = 0.65 + 0.35*ease(pIn); a = pIn; }
  else if(s.anim === "type"){
    var tf = Math.min(1, t / Math.max(0.6, s.duration*0.55));
    var hc = Math.floor(head.length * Math.min(1, tf*1.6));
    head = head.slice(0, hc);
    var sfrac = Math.max(0, (tf - 0.55) / 0.45);
    sub = sub.slice(0, Math.floor(sub.length * Math.min(1, sfrac)));
  }
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(W/2, H*0.46 + dy);
  ctx.scale(sc, sc);
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = Math.max(6, W*0.012); ctx.shadowOffsetY = 3;
  ctx.fillStyle = s.color;
  var hs = W * 0.088 * (s.size || 1);
  ctx.font = (s.bold ? "800 " : "600 ") + hs + "px " + (FONTS[s.font] || FONTS.poppins);
  var lines = wrap(ctx, head, W*0.88), lh = hs*1.18, totalH = lines.length*lh;
  lines.forEach(function(ln,i){ ctx.fillText(ln, 0, -totalH/2 + lh*(i+0.5)); });
  if(sub){
    var ss = hs*0.44;
    ctx.font = "600 " + ss + "px " + (FONTS[s.font] || FONTS.poppins);
    ctx.globalAlpha = a*0.92;
    var slines = wrap(ctx, sub, W*0.88);
    slines.forEach(function(ln,i){ ctx.fillText(ln, 0, totalH/2 + ss*1.1 + ss*1.25*i); });
  }
  ctx.restore();
}
function drawScene(ctx,W,H,s,t,gt){ drawBG(ctx,W,H,s,t,gt); drawText(ctx,W,H,s,t); }
function drawFrame(ctx,W,H,gt){
  ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
  if(!scenes.length) return;
  var acc = 0, idx = 0, lt = 0;
  for(var i=0;i<scenes.length;i++){
    if(gt < acc + scenes[i].duration || i === scenes.length-1){ idx = i; lt = gt - acc; break; }
    acc += scenes[i].duration;
  }
  lt = Math.max(0, Math.min(lt, scenes[idx].duration));
  var cur = scenes[idx], nxt = scenes[idx+1];
  if(nxt && lt > cur.duration - TR && cur.trans !== "none"){
    var a = (lt - (cur.duration - TR)) / TR, nt = lt - (cur.duration - TR);
    if(cur.trans === "fade"){
      drawScene(ctx,W,H,cur,lt,gt);
      ctx.save(); ctx.globalAlpha = a; drawScene(ctx,W,H,nxt,nt,gt+nt); ctx.restore();
    } else if(cur.trans === "slide"){
      ctx.save(); ctx.translate(-a*W, 0); drawScene(ctx,W,H,cur,lt,gt); ctx.restore();
      ctx.save(); ctx.translate((1-a)*W, 0); drawScene(ctx,W,H,nxt,nt,gt+nt); ctx.restore();
    } else drawScene(ctx,W,H,cur,lt,gt);
  } else drawScene(ctx,W,H,cur,lt,gt);
}

/* ---------- preview ---------- */
function setAspect(a){
  aspect = a; var wh = SIZES[a];
  pv.width = wh[0]; pv.height = wh[1];
  pv.style.aspectRatio = wh[0] + " / " + wh[1];
  pv.style.width = a === "9:16" ? "min(320px, 86vw)" : (a === "1:1" ? "min(400px, 92vw)" : "min(560px, 94vw)");
  document.querySelectorAll("#ratioSeg button").forEach(function(b){
    b.classList.toggle("on", b.getAttribute("data-r") === a);
  });
  drawFrame(pctx, pv.width, pv.height, 0.6);
}
function loop(){
  if(!playing) return;
  var el = pvOffset + (performance.now() - pvStart)/1000;
  var tot = totalDur();
  if(el >= tot){ el = 0; pvOffset = 0; pvStart = performance.now(); syncAudio(0); }
  drawFrame(pctx, pv.width, pv.height, el);
  var idx = 0, acc = 0;
  for(var i=0;i<scenes.length;i++){ if(el < acc + scenes[i].duration){ idx = i; break; } acc += scenes[i].duration; if(i===scenes.length-1) idx=i; }
  $("pvTime").textContent = el.toFixed(1) + "s / " + tot.toFixed(0) + "s • " + (S().s_scene || "Scene") + " " + (idx+1);
  rafId = requestAnimationFrame(loop);
}
function syncAudio(t){
  var au = $("bgAudio");
  if(!au || !audioURL) return;
  try{ au.currentTime = t; }catch(e){}
}
function playPause(){
  if(!scenes.length){ setStatus(S().msg_need, "err"); return; }
  playing = !playing;
  var au = $("bgAudio");
  if(playing){
    pvStart = performance.now();
    if(au && audioURL){ au.play().catch(function(){}); }
    loop();
  } else {
    pvOffset += (performance.now() - pvStart)/1000;
    if(au) au.pause();
    cancelAnimationFrame(rafId);
  }
  $("playBtn").innerHTML = playing ? (S().pause || "Pause") : (S().play || "Preview");
}
function setStatus(msg, cls){
  var el = $("status"); el.textContent = msg || ""; el.className = "status" + (cls ? " " + cls : "");
}

/* ---------- filmstrip + scene panel ---------- */
function renderStrip(){
  var strip = $("filmstrip"); strip.innerHTML = "";
  scenes.forEach(function(s, i){
    var d = document.createElement("div");
    d.className = "film" + (i === sel ? " on" : "");
    var c = document.createElement("canvas"); c.width = 148; c.height = 112;
    drawScene(c.getContext("2d"), 148, 112, s, Math.min(0.9, s.duration/2), 0.6);
    d.appendChild(c);
    var sp = document.createElement("span"); sp.textContent = (i+1) + " • " + s.duration + "s";
    d.appendChild(sp);
    d.addEventListener("click", function(){ sel = i; renderStrip(); renderPanel(); drawFrame(pctx, pv.width, pv.height, startOf(i)+0.05); });
    strip.appendChild(d);
  });
  var add = document.createElement("div");
  add.className = "film add"; add.textContent = "＋";
  add.title = S().s_add || "Add scene";
  add.addEventListener("click", function(){
    scenes.push(defScene()); sel = scenes.length-1;
    renderStrip(); renderPanel(); setStatus("");
  });
  strip.appendChild(add);
}
function startOf(i){ var a=0; for(var j=0;j<i;j++) a+=scenes[j].duration; return a; }
function opt(v, cur, label){ return "<option value='" + v + "'" + (v===cur ? " selected" : "") + ">" + label + "</option>"; }
function renderPanel(){
  var s = scenes[sel], st = S();
  if(!s){ $("panel").innerHTML = "<p class='note'>" + (st.msg_need || "") + "</p>"; return; }
  var gradSw = GRADS.map(function(g, i){
    return "<button type='button' class='sw" + (i===s.grad ? " on" : "") + "' data-grad='" + i + "' style='background:linear-gradient(120deg," + g[0] + "," + g[1] + ")' aria-label='gradient " + (i+1) + "'></button>";
  }).join("");
  $("panel").innerHTML =
  "<fieldset><legend>" + (st.s_scene || "Scene") + " " + (sel+1) + " / " + scenes.length + "</legend>" +
  "<label class='fl'>" + st.s_bg + "</label><select id='p_bgtype'>" +
    opt("image", s.bgType, st.s_bgt_image) + opt("gradient", s.bgType, st.s_bgt_gradient) + opt("solid", s.bgType, st.s_bgt_solid) + "</select>" +
  "<div id='p_imgwrap' class='" + (s.bgType==="image" ? "" : "hidden") + "'><label class='fl'>" + st.s_upload + "</label><input type='file' id='p_img' accept='image/*'></div>" +
  "<div id='p_gradwrap' class='" + (s.bgType==="gradient" ? "" : "hidden") + "'><label class='fl'>" + st.s_grad + "</label><div class='swatches'>" + gradSw + "</div></div>" +
  "<div id='p_solidwrap' class='" + (s.bgType==="solid" ? "" : "hidden") + "'><label class='fl'>" + st.s_color + "</label><input type='color' id='p_solid' value='" + s.solid + "'></div>" +
  "<label class='fl'>" + st.s_head + "</label><input type='text' id='p_head' value='" + esc(s.headline) + "' placeholder='Be Kind Always'>" +
  "<label class='fl'>" + st.s_sub + "</label><input type='text' id='p_sub' value='" + esc(s.subtext) + "' placeholder='Small acts, big hearts'>" +
  "<label class='fl'>" + st.s_dur + ": <b id='p_durv'>" + s.duration + "s</b></label><input type='range' id='p_dur' min='2' max='8' step='1' value='" + s.duration + "'>" +
  "</fieldset>" +
  "<fieldset><legend>Text Style</legend>" +
  "<label class='fl'>" + st.s_font + "</label><select id='p_font'>" +
    opt("poppins", s.font, st.f_poppins) + opt("hindi", s.font, st.f_hindi) + opt("serif", s.font, st.f_serif) +
    opt("sans", s.font, st.f_sans) + opt("impact", s.font, st.f_impact) + opt("mono", s.font, st.f_mono) + "</select>" +
  "<div class='row'><div><label class='fl'>" + st.s_size + "</label><input type='range' id='p_size' min='0.6' max='1.6' step='0.05' value='" + s.size + "'></div>" +
  "<div><label class='fl'>" + st.s_tcolor + "</label><input type='color' id='p_color' value='" + s.color + "'></div></div>" +
  "<label class='check'><input type='checkbox' id='p_bold'" + (s.bold ? " checked" : "") + "> " + st.s_bold + "</label>" +
  "<label class='fl'>" + st.s_anim + "</label><select id='p_anim'>" +
    opt("fade", s.anim, st.a_fade) + opt("slide", s.anim, st.a_slide) + opt("zoom", s.anim, st.a_zoom) +
    opt("type", s.anim, st.a_type) + opt("none", s.anim, st.a_none) + "</select>" +
  "</fieldset>" +
  "<fieldset><legend>Motion</legend>" +
  "<label class='fl'>" + st.s_kb + "</label><select id='p_kb'>" +
    opt("in", s.kb, st.kb_in) + opt("out", s.kb, st.kb_out) + opt("left", s.kb, st.kb_left) +
    opt("right", s.kb, st.kb_right) + opt("none", s.kb, st.kb_none) + "</select>" +
  "<label class='fl'>" + st.s_trans + "</label><select id='p_trans'>" +
    opt("fade", s.trans, st.tr_fade) + opt("slide", s.trans, st.tr_slide) + opt("none", s.trans, st.tr_none) + "</select>" +
  "</fieldset>" +
  "<div class='scene-nav'><button type='button' class='btn ghost sm' id='p_prev'>" + st.prev + "</button>" +
  "<button type='button' class='btn ghost sm' id='p_next'>" + st.next + "</button>" +
  "<button type='button' class='btn danger sm' id='p_del'>" + st.del + "</button></div>";
  bindPanel();
}
function esc(t){ return String(t||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
function upd(fn){ return function(e){ fn(e); renderStrip(); if(!playing) drawFrame(pctx, pv.width, pv.height, startOf(sel)+0.4); }; }
function bindPanel(){
  var s = scenes[sel]; if(!s) return;
  $("p_bgtype").addEventListener("change", upd(function(e){
    s.bgType = e.target.value;
    $("p_imgwrap").classList.toggle("hidden", s.bgType !== "image");
    $("p_gradwrap").classList.toggle("hidden", s.bgType !== "gradient");
    $("p_solidwrap").classList.toggle("hidden", s.bgType !== "solid");
  }));
  $("p_img").addEventListener("change", function(e){
    var f = e.target.files[0]; if(!f) return;
    var url = URL.createObjectURL(f), im = new Image();
    im.onload = function(){ s.img = im; renderStrip(); drawFrame(pctx, pv.width, pv.height, startOf(sel)+0.4); };
    im.src = url;
  });
  document.querySelectorAll("[data-grad]").forEach(function(b){
    b.addEventListener("click", upd(function(){ s.grad = +b.getAttribute("data-grad"); renderPanel(); }));
  });
  $("p_solid").addEventListener("input", upd(function(e){ s.solid = e.target.value; }));
  $("p_head").addEventListener("input", upd(function(e){ s.headline = e.target.value; }));
  $("p_sub").addEventListener("input", upd(function(e){ s.subtext = e.target.value; }));
  $("p_dur").addEventListener("input", upd(function(e){ s.duration = +e.target.value; $("p_durv").textContent = s.duration + "s"; }));
  $("p_font").addEventListener("change", upd(function(e){ s.font = e.target.value; }));
  $("p_size").addEventListener("input", upd(function(e){ s.size = +e.target.value; }));
  $("p_color").addEventListener("input", upd(function(e){ s.color = e.target.value; }));
  $("p_bold").addEventListener("change", upd(function(e){ s.bold = e.target.checked; }));
  $("p_anim").addEventListener("change", upd(function(e){ s.anim = e.target.value; }));
  $("p_kb").addEventListener("change", upd(function(e){ s.kb = e.target.value; }));
  $("p_trans").addEventListener("change", upd(function(e){ s.trans = e.target.value; }));
  $("p_prev").addEventListener("click", function(){ if(sel > 0){ sel--; renderStrip(); renderPanel(); } });
  $("p_next").addEventListener("click", function(){
    if(sel < scenes.length-1){ sel++; } else { scenes.push(defScene()); sel = scenes.length-1; }
    renderStrip(); renderPanel();
  });
  $("p_del").addEventListener("click", function(){
    scenes.splice(sel, 1); if(sel >= scenes.length) sel = Math.max(0, scenes.length-1);
    renderStrip(); renderPanel(); if(!playing) drawFrame(pctx, pv.width, pv.height, 0.4);
  });
}

/* ---------- templates ---------- */
function sc(o){ var d = defScene(); for(var k in o) d[k] = o[k]; return d; }
var TEMPLATES = {
  motivation:{ aspect:"9:16", scenes:[
    sc({grad:0, headline:"Never Give Up", subtext:"Har din ek nayi shuruaat hai", anim:"fade", duration:4}),
    sc({grad:4, headline:"Be Kind Always", subtext:"Chhoti si neki, badi khushi", anim:"slide", duration:4}),
    sc({grad:2, headline:"Keep Going", subtext:"Safalta unki hai jo rukte nahi", anim:"zoom", duration:4}) ]},
  product:{ aspect:"9:16", scenes:[
    sc({grad:1, headline:"New Product!", subtext:"Dhamakedaar launch offer", anim:"zoom", duration:3}),
    sc({grad:3, headline:"Best Quality", subtext:"Premium material, honest price", anim:"slide", duration:4}),
    sc({grad:7, headline:"Order Now", subtext:"Limited stock — jaldi karo!", anim:"fade", duration:3}) ]},
  diwali:{ aspect:"9:16", scenes:[
    sc({grad:6, headline:"Happy Diwali!", subtext:"Aapko aur parivaar ko shubhkamnaye", anim:"zoom", duration:4}),
    sc({grad:3, headline:"Khushiyon ka Tyohar", subtext:"Diye jalao, dil milao", anim:"fade", duration:4}),
    sc({grad:1, headline:"Shubh Deepavali", subtext:"Samriddhi aur sehat ki kamna", anim:"type", duration:4}) ]},
  birthday:{ aspect:"1:1", scenes:[
    sc({grad:9, headline:"Happy Birthday!", subtext:"Janamdin ki dher saari shubhkamnaye", anim:"zoom", duration:4}),
    sc({grad:0, headline:"Party Time", subtext:"Cake, dost aur dher saari masti", anim:"slide", duration:3}),
    sc({grad:4, headline:"Stay Blessed", subtext:"Har khwahish poori ho", anim:"fade", duration:4}) ]},
  slideshow:{ aspect:"16:9", scenes:[
    sc({bgType:"image", grad:2, headline:"My Memories", subtext:"Apni photos yaha lagao", anim:"fade", kb:"in", duration:4}),
    sc({bgType:"image", grad:0, headline:"Beautiful Moments", subtext:"Har photo ek kahani", anim:"fade", kb:"out", duration:4}),
    sc({bgType:"image", grad:5, headline:"The End", subtext:"Dhanyavaad!", anim:"fade", kb:"left", duration:3}) ]},
  business:{ aspect:"16:9", scenes:[
    sc({grad:5, headline:"Your Business Name", subtext:"Quality service, sahi daam", anim:"fade", duration:3}),
    sc({grad:7, headline:"Our Services", subtext:"Fast delivery • Trusted work", anim:"slide", duration:4}),
    sc({grad:2, headline:"Call Now", subtext:"Aaj hi sampark karo", anim:"zoom", duration:3}) ]}
};
function applyTemplate(key){
  var t = TEMPLATES[key]; if(!t) return;
  scenes = t.scenes.map(function(o){ var d = defScene(); for(var k in o) d[k] = o[k]; return d; });
  sel = 0; setAspect(t.aspect);
  renderStrip(); renderPanel();
  drawFrame(pctx, pv.width, pv.height, 0.4);
  document.getElementById("editor").scrollIntoView({behavior:"smooth"});
}

/* ---------- audio ---------- */
function initAudio(){
  $("audioFile").addEventListener("change", function(e){
    var f = e.target.files[0]; if(!f) return;
    if(audioURL) URL.revokeObjectURL(audioURL);
    audioURL = URL.createObjectURL(f); audioName = f.name;
    var au = $("bgAudio"); au.src = audioURL;
    var AC = window.AudioContext || window.webkitAudioContext;
    if(AC){
      var ac = new AC();
      f.arrayBuffer().then(function(buf){ return ac.decodeAudioData(buf); }).then(function(decoded){
        audioBuffer = decoded;
        $("audioInfo").textContent = (S().msg_audio || "Music:") + " " + audioName;
      }).catch(function(){ audioBuffer = null; });
    }
    $("audioInfo").textContent = (S().msg_audio || "Music:") + " " + audioName;
  });
  $("audioClear").addEventListener("click", function(){
    audioBuffer = null; audioName = ""; if(audioURL) URL.revokeObjectURL(audioURL); audioURL = "";
    $("bgAudio").removeAttribute("src"); $("audioFile").value = "";
    $("audioInfo").textContent = S().msg_noaudio || "No music";
  });
}

/* ---------- export (WebM via canvas + MediaRecorder) ---------- */
function pickMime(){
  var cands = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];
  for(var i=0;i<cands.length;i++) if(window.MediaRecorder && MediaRecorder.isTypeSupported(cands[i])) return cands[i];
  return "";
}
function exportVideo(){
  if(exporting) return;
  if(!scenes.length){ setStatus(S().msg_need, "err"); return; }
  if(!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream){
    setStatus("WebM export is not supported in this browser. Try Chrome.", "err"); return;
  }
  exporting = true;
  $("exportBtn").disabled = true; $("playBtn").disabled = true;
  if(playing) playPause();
  setStatus(S().msg_exporting || "Rendering…");
  $("dlWrap").classList.add("hidden");
  var prog = $("prog"); prog.classList.remove("hidden"); prog.value = 0;
  var wh = SIZES[aspect], W = wh[0], H = wh[1], tot = totalDur();
  var oc = document.createElement("canvas"); oc.width = W; oc.height = H;
  var octx = oc.getContext("2d");
  var stream = oc.captureStream(30);
  var tracks = stream.getVideoTracks().slice();
  var actx = null, asrc = null;
  if(audioBuffer){
    var AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
    var dest = actx.createMediaStreamDestination();
    asrc = actx.createBufferSource(); asrc.buffer = audioBuffer;
    asrc.loop = audioBuffer.duration < tot;
    asrc.connect(dest); tracks.push(dest.stream.getAudioTracks()[0]);
  }
  var rec = new MediaRecorder(new MediaStream(tracks), {mimeType: pickMime(), videoBitsPerSecond: 6000000});
  var chunks = [];
  rec.ondataavailable = function(e){ if(e.data && e.data.size) chunks.push(e.data); };
  rec.onstop = function(){
    exporting = false;
    $("exportBtn").disabled = false; $("playBtn").disabled = false;
    prog.classList.add("hidden");
    if(actx) actx.close();
    var blob = new Blob(chunks, {type: "video/webm"});
    var url = URL.createObjectURL(blob);
    var a = $("dlBtn"); a.href = url;
    $("dlWrap").classList.remove("hidden");
    setStatus(S().msg_done || "Done!", "ok");
  };
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){ startRec(); });
  } else startRec();
  function startRec(){
    rec.start(200);
    if(asrc){ actx.resume(); asrc.start(0); }
    var t0 = performance.now();
    (function step(){
      var el = (performance.now() - t0)/1000;
      drawFrame(octx, W, H, Math.min(el, tot - 0.001));
      prog.value = Math.min(100, el/tot*100);
      if(el < tot) requestAnimationFrame(step);
      else { if(asrc){ try{ asrc.stop(); }catch(e){} } setTimeout(function(){ rec.stop(); }, 120); }
    })();
  }
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function(){
  scenes = TEMPLATES.motivation.scenes.map(function(o){ var d = defScene(); for(var k in o) d[k] = o[k]; return d; });
  setAspect("9:16");
  renderStrip(); renderPanel(); initAudio();
  setStatus(S().msg_ready || "Ready.");
  $("playBtn").addEventListener("click", playPause);
  $("exportBtn").addEventListener("click", exportVideo);
  document.querySelectorAll("#ratioSeg button").forEach(function(b){
    b.addEventListener("click", function(){ setAspect(b.getAttribute("data-r")); });
  });
  document.querySelectorAll("[data-tpl]").forEach(function(el){
    el.addEventListener("click", function(){ applyTemplate(el.getAttribute("data-tpl")); });
  });
  document.addEventListener("vb-lang", function(){ renderStrip(); renderPanel(); setStatus(S().msg_ready || "Ready."); });
});
})();
