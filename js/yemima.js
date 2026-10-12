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

  btn.addEventListener("click", function () {
    if (loading) return;
    loading = true;
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.querySelector(".yemima-label").textContent = "Memuat…";
    track("yemima_open", { page: location.pathname });
    loadCss();

    import(CDN + "chat.bundle.es.js").then(function (mod) {
      mod.createChat({
        webhookUrl: CHAT_URL,
        target: "#yemima-chat",
        mode: "window",
        loadPreviousSession: false,
        showWelcomeScreen: false,
        enableStreaming: false,
        metadata: { halaman: location.pathname, sumber: sumber() },
        initialMessages: [
          "Hai Kak! 👋 Aku Yemima, asisten virtual (AI) Ingat Sehat. Infoku bersifat umum dan bukan pengganti saran dokter ya.",
          "Aku bisa bantu pilih produk atau paket 4Life, jelasin cara belanja, sampai Member Loyalitas. Mau tanya apa hari ini?"
        ],
        i18n: {
          en: {
            title: "Yemima",
            subtitle: "Asisten AI Ingat Sehat · biasanya membalas dalam hitungan detik",
            footer: "",
            getStarted: "Mulai chat",
            inputPlaceholder: "Tulis pertanyaan Kakak…",
            closeButtonTooltip: "Tutup"
          }
        }
      });
      btn.hidden = true;
      // Buka jendela chat langsung, tanpa klik kedua.
      var tries = 0;
      (function bukaJendela() {
        var toggle = document.querySelector("#yemima-chat .chat-window-toggle");
        if (toggle) { toggle.click(); return; }
        if (++tries < 40) setTimeout(bukaJendela, 50);
      })();
    }).catch(function () {
      track("yemima_error", { page: location.pathname });
      gagal();
    });
  });
})();
