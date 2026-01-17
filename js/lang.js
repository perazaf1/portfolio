let currentLang = localStorage.getItem("lang") ||
  (navigator.language.startsWith("fr") ? "fr" : "en");

async function loadLang() {
  const res = await fetch("/data/lang.json");
  const translations = await res.json();

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const keys = el.dataset.i18n.split(".");
    let text = translations[currentLang];

    keys.forEach(k => text = text?.[k]);
    if (text) el.textContent = text;
  });

  const btn = document.getElementById("lang-switch");
  if (btn) btn.textContent = currentLang === "fr" ? "EN" : "FR";
}

document.addEventListener("click", e => {
  if (e.target.id === "lang-switch") {
    currentLang = currentLang === "fr" ? "en" : "fr";
    localStorage.setItem("lang", currentLang);
    loadLang();
  }
});

window.addEventListener("load", loadLang);
