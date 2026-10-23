/* VideoBanao Free — site chrome: theme + EN/HI language toggle (directory v2, no editor) */
(function(){
"use strict";
var STR = {
en:{home:"Home",tools:"AI Tools",guide:"Guide",about:"About",contact:"Contact",
nosign_line:"No sign-up — browse the full directory free, without creating an account",
pfor:"Perfect for",
foot_tag:"AI video generation tools directory — every AI video maker in one place. No sign-up.",
f_links:"Pages",f_cats:"Top Categories",rights:"VideoBanao Free — made for creators in India."},
hi:{home:"होम",tools:"AI Tools",guide:"गाइड",about:"हमारे बारे में",contact:"संपर्क",
nosign_line:"No sign-up — bilkul free, bina account banaye poori directory dekho",
pfor:"Perfect for",
foot_tag:"AI video generation tools directory — saare AI video banane wale tools ek jagah. No sign-up.",
f_links:"Pages",f_cats:"Top Categories",rights:"VideoBanao Free — भारत के क्रिएटर्स के लिए बनाया गया।"}
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
