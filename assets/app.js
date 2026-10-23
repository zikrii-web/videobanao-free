/* VideoBanao Free — site chrome: theme + EN/HI language toggle */
(function(){
"use strict";
var STR = {
en:{home:"Home",editor:"Editor",tools:"AI Tools",templates:"Templates",guide:"Guide",about:"About",contact:"Contact",
hero_h1:"Free AI Video Maker — <span class='grad-text'>No Watermark, No Sign-up</span>",
hero_p:"Make stunning videos for YouTube Shorts, Reels and WhatsApp — right in your phone browser. Add photos, text, animation and music, then download your video. 100% free, forever.",
b_free:"100% Free",b_nowm:"No Watermark",b_nosign:"No Sign-up",b_browser:"Runs in Browser",
pfor:"Perfect for",nosign_line:"No sign-up — completely free, use it without creating an account",
ed_title:"Video Editor",ratio:"Video size",audio:"Music / Audio",audio_none:"No music (silent video)",
add_audio:"Add your music file",play:"▶ Preview",pause:"⏸ Pause",export:"⬇ Export Video (WebM)",exporting:"Rendering… please wait",
tpl_title:"Start from a Template",tpl_sub:"One tap — scenes, text and colours are filled for you. Change anything you like.",
feat_title:"Everything a video maker needs",how_title:"How it works",faq_title:"Common questions",
s_scene:"Scene",s_add:"＋ Add scene",s_bg:"Background",s_bgt_image:"My photo",s_bgt_gradient:"Animated gradient",s_bgt_solid:"Solid colour",
s_upload:"Upload photo",s_grad:"Gradient style",s_color:"Colour",s_head:"Headline text",s_sub:"Subtext (small line)",
s_dur:"Duration (seconds)",s_font:"Font",s_size:"Text size",s_tcolor:"Text colour",s_bold:"Bold text",
s_anim:"Text animation",s_kb:"Photo motion (Ken Burns)",s_trans:"Transition to next scene",
a_fade:"Fade in",a_slide:"Slide up",a_zoom:"Zoom in",a_type:"Typewriter",a_none:"None",
kb_in:"Zoom in",kb_out:"Zoom out",kb_left:"Pan left",kb_right:"Pan right",kb_none:"Still",
tr_fade:"Fade",tr_slide:"Slide",tr_none:"Cut (none)",
f_serif:"Serif (classic)",f_sans:"Sans (clean)",f_poppins:"Poppins (modern)",f_hindi:"Noto Sans (Hindi)",f_impact:"Impact (bold poster)",f_mono:"Mono (typewriter)",
prev:"← Prev",next:"Next →",del:"Delete scene",scene_of:"Scene",
msg_ready:"Ready. Add scenes and press Preview.",msg_need:"Add at least one scene first.",
msg_exporting:"Rendering your video… keep this tab open.",msg_done:"Done! Your video is ready — tap Download.",
msg_dl:"⬇ Download my video",msg_audio:"Music added:",msg_noaudio:"Silent video (no music)",
guide_h:"Best Free AI Video Tools — Guide",foot_tag:"AI video tools directory + free online editor — every AI video maker in one place. No sign-up, no app to install.",
f_links:"Pages",f_tools:"Create",rights:"VideoBanao Free — made for creators in India."},
hi:{home:"होम",editor:"एडिटर",tools:"AI टूल्स",templates:"टेम्पलेट",guide:"गाइड",about:"हमारे बारे में",contact:"संपर्क",
hero_h1:"Free AI Video Maker — <span class='grad-text'>बिना Watermark, बिना Sign-up</span>",
hero_p:"YouTube Shorts, Reels और WhatsApp के लिए शानदार वीडियो — सीधे अपने फोन के ब्राउज़र में बनाओ। फोटो, टेक्स्ट, एनिमेशन और म्यूज़िक जोड़ो, फिर वीडियो डाउनलोड करो। 100% फ्री, हमेशा।",
b_free:"100% फ्री",b_nowm:"No Watermark नहीं",b_nosign:"Sign-up नहीं",b_browser:"ब्राउज़र में चलता है",
pfor:"Perfect for",nosign_line:"No sign-up — bilkul free, bina account banaye use karein",
ed_title:"वीडियो एडिटर",ratio:"वीडियो साइज़",audio:"म्यूज़िक / ऑडियो",audio_none:"म्यूज़िक नहीं (साइलेंट वीडियो)",
add_audio:"अपना म्यूज़िक जोड़ो",play:"▶ प्रीव्यू देखो",pause:"⏸ रोको",export:"⬇ वीडियो Export करो (WebM)",exporting:"बन रहा है… कृपया रुको",
tpl_title:"टेम्पलेट से शुरू करो",tpl_sub:"एक टैप — सीन, टेक्स्ट और रंग अपने-आप भर जाएंगे। बाद में कुछ भी बदल सकते हो।",
feat_title:"वीडियो बनाने की हर चीज़, एक जगह",how_title:"कैसे काम करता है",faq_title:"आम सवाल",
s_scene:"सीन",s_add:"＋ सीन जोड़ो",s_bg:"बैकग्राउंड",s_bgt_image:"मेरी फोटो",s_bgt_gradient:"एनिमेटेड ग्रेडिएंट",s_bgt_solid:"सॉलिड रंग",
s_upload:"फोटो अपलोड करो",s_grad:"ग्रेडिएंट स्टाइल",s_color:"रंग",s_head:"बड़ा टेक्स्ट (Headline)",s_sub:"छोटा टेक्स्ट (Subtext)",
s_dur:"समय (सेकंड)",s_font:"फॉन्ट",s_size:"टेक्स्ट साइज़",s_tcolor:"टेक्स्ट का रंग",s_bold:"मोटा टेक्स्ट (Bold)",
s_anim:"टेक्स्ट एनिमेशन",s_kb:"फोटो मोशन (Ken Burns)",s_trans:"अगले सीन में बदलाव (Transition)",
a_fade:"Fade in (धीरे दिखे)",a_slide:"Slide up (नीचे से आए)",a_zoom:"Zoom in (बड़ा हो)",a_type:"Typewriter (टाइप हो)",a_none:"कोई नहीं",
kb_in:"Zoom in",kb_out:"Zoom out",kb_left:"बाएं सरके",kb_right:"दाएं सरके",kb_none:"स्थिर (Still)",
tr_fade:"Fade",tr_slide:"Slide",tr_none:"सीधा कट (कोई नहीं)",
f_serif:"Serif (क्लासिक)",f_sans:"Sans (साफ़)",f_poppins:"Poppins (मॉडर्न)",f_hindi:"Noto Sans (हिंदी)",f_impact:"Impact (पोस्टर स्टाइल)",f_mono:"Mono (टाइपराइटर)",
prev:"← पिछला",next:"अगला →",del:"सीन हटाओ",scene_of:"सीन",
msg_ready:"तैयार है। सीन जोड़ो और प्रीव्यू दबाओ।",msg_need:"पहले कम से कम एक सीन जोड़ो।",
msg_exporting:"तुम्हारा वीडियो बन रहा है… ये टैब खुला रखो।",msg_done:"हो गया! तुम्हारा वीडियो तैयार है — Download दबाओ।",
msg_dl:"⬇ मेरा वीडियो Download करो",msg_audio:"म्यूज़िक जुड़ गया:",msg_noaudio:"साइलेंट वीडियो (म्यूज़िक नहीं)",
guide_h:"Best Free AI Video Tools — गाइड",foot_tag:"AI video tools directory + फ्री ऑनलाइन एडिटर — सारे AI video maker एक जगह। न sign-up, न कोई ऐप।",
f_links:"पेज",f_tools:"बनाओ",rights:"VideoBanao Free — भारत के क्रिएटर्स के लिए बनाया गया।"}
};
var lang = localStorage.getItem("vb-lang") || "hi";
function apply(){
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-i18n]").forEach(function(el){
    var k = el.getAttribute("data-i18n");
    if(STR[lang][k] !== undefined) el.innerHTML = STR[lang][k];
  });
  var lb = document.getElementById("langBtn");
  if(lb) lb.textContent = lang === "hi" ? "EN" : "हिंदी";
  window.VB_LANG = lang; window.VB_STR = STR[lang];
  document.dispatchEvent(new CustomEvent("vb-lang"));
}
window.VB_setLang = function(l){ lang = l; localStorage.setItem("vb-lang", l); apply(); };
window.VB_STR = STR[lang]; window.VB_LANG = lang;
document.addEventListener("DOMContentLoaded", function(){
  apply();
  var lb = document.getElementById("langBtn");
  if(lb) lb.addEventListener("click", function(){ window.VB_setLang(lang === "hi" ? "en" : "hi"); });
  var tb = document.getElementById("themeBtn");
  var theme = localStorage.getItem("vb-theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  if(tb) tb.textContent = theme === "dark" ? "☀️" : "🌙";
  if(tb) tb.addEventListener("click", function(){
    theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vb-theme", theme);
    tb.textContent = theme === "dark" ? "☀️" : "🌙";
  });
});
})();
