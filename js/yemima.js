/* Yemima - asisten chat AI Ingat Sehat.
   Widget @n8n/chat (1,7 MB) baru dimuat saat tombol diklik, supaya halaman tetap ringan. */
(function () {
  var CHAT_URL = "https://n8n-n0ft.srv1964287.hstgr.cloud/webhook/b410d7da-bee1-4f46-84b1-e408069709c7/chat";
  var CDN = "https://cdn.jsdelivr.net/npm/@n8n/chat@1.39.2/dist/";

  var btn = document.querySelector(".yemima-launch");
  if (!btn) return;
  var loading = false;

  function track(event, params) {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  }

  function sumber() {
    try { return sessionStorage.getItem("is_sumber") || "langsung"; } catch (e) { return "langsung"; }
  }

  function loadCss() {
    if (document.getElementById("yemima-css")) return;
    var link = document.createElement("link");
    link.id = "yemima-css";
    link.rel = "stylesheet";
    link.href = CDN + "style.css";
    document.head.appendChild(link);
  }

  function gagal() {
    loading = false;
    btn.disabled = false;
    btn.classList.remove("is-loading");
    btn.querySelector(".yemima-label").textContent = "Tanya Yemima";
    window.open(btn.getAttribute("data-wa"), "_blank", "noopener");
  }

  var loaded = false;

  function jendelaTerbuka() {
    var win = document.querySelector("#yemima-chat .chat-window");
    return !!(win && win.offsetParent !== null);
  }

  var tombolTutup = null;
  function tampilkanTombolTutup() {
    if (tombolTutup) { tombolTutup.hidden = false; return; }
    var wrapper = document.querySelector("#yemima-chat .chat-window-wrapper");
    if (!wrapper) return;
    tombolTutup = document.createElement("button");
    tombolTutup.type = "button";
    tombolTutup.className = "yemima-close";
    tombolTutup.setAttribute("aria-label", "Tutup chat Yemima");
    tombolTutup.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    tombolTutup.addEventListener("click", function () {
      var toggle = document.querySelector("#yemima-chat .chat-window-toggle");
      if (toggle && jendelaTerbuka()) toggle.click();
      tombolTutup.hidden = true;
    });
    wrapper.appendChild(tombolTutup);
  }

  function bukaJendela() {
    var tries = 0;
    (function coba() {
      var toggle = document.querySelector("#yemima-chat .chat-window-toggle");
      if (toggle) {
        if (!jendelaTerbuka()) toggle.click();
        tampilkanTombolTutup();
        return;
      }
      if (++tries < 40) setTimeout(coba, 50);
    })();
  }

  var SAPA = "Hai Kak! 👋 Aku Yemima, asisten virtual (AI) Ingat Sehat. Infoku bersifat umum dan bukan pengganti saran dokter ya.";
  var PESAN = {
    biasa: [SAPA, "Aku bisa bantu pilih produk atau paket 4Life, jelasin cara belanja, sampai Member Loyalitas. Mau tanya apa hari ini?"],
    finder: [SAPA, "Aku bantu pilihkan lewat 3 pertanyaan singkat ya. Pertama: produknya untuk siapa? Saya sendiri, pasangan/keluarga, atau orang tua?"]
  };

  // mode: "biasa" (tombol Yemima) atau "finder" (tombol "Bantu pilihkan" di halaman produk)
  function buka(mode) {
    if (loaded) { bukaJendela(); return; }
    if (loading) return;
    loading = true;
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.querySelector(".yemima-label").textContent = "Memuat…";
    track("yemima_open", { page: location.pathname, mode: mode });
    loadCss();

    import(CDN + "chat.bundle.es.js").then(function (mod) {
      mod.createChat({
        webhookUrl: CHAT_URL,
        target: "#yemima-chat",
        mode: "window",
        loadPreviousSession: false,
        showWelcomeScreen: false,
        enableStreaming: false,
        metadata: { halaman: location.pathname, sumber: sumber(), mode: mode },
        initialMessages: PESAN[mode] || PESAN.biasa,
        i18n: {
          en: {
            title: "Yemima",
            subtitle: "Asisten AI Ingat Sehat",
            footer: "",
            getStarted: "Mulai chat",
            inputPlaceholder: "Tulis pertanyaan Kakak…",
            closeButtonTooltip: "Tutup"
          }
        }
      });
      loaded = true;
      loading = false;
      btn.disabled = false;
      btn.classList.remove("is-loading");
      btn.querySelector(".yemima-label").textContent = "Tanya Yemima";
      // Header biru disembunyikan begitu Kakak mulai chat, supaya ruang pesan lebih luas.
      var wadah = document.getElementById("yemima-chat");
      var pantau = new MutationObserver(function () {
        if (wadah.querySelector(".chat-message-from-user")) {
          wadah.classList.add("is-chatting");
          pantau.disconnect();
        }
      });
      pantau.observe(wadah, { childList: true, subtree: true });
      bukaJendela();
    }).catch(function () {
      track("yemima_error", { page: location.pathname });
      gagal();
    });
  }

  btn.addEventListener("click", function () { buka("biasa"); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-yemima]"), function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      buka(el.getAttribute("data-yemima") || "biasa");
    });
  });
})();
