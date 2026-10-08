/* Hidup Sehat Bersama - script bersama untuk semua halaman */
(function () {
  // 1. Catat klik tombol WhatsApp ke GA4 / Meta Pixel (jalan otomatis kalau tracking sudah dipasang)
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!link) return;
    var label = (link.textContent || "").trim() || "WhatsApp";
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", { method: "whatsapp", link_text: label, page: location.pathname });
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", { method: "whatsapp" });
    }
  });

  // 2. Form "Kirim Pesan" di footer: buka WhatsApp dengan pesan yang sudah terisi
  var forms = document.querySelectorAll(".wa-form");
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = (form.querySelector('[name="nama"]').value || "").trim();
      var pesan = (form.querySelector('[name="pesan"]').value || "").trim();
      var teks = "Halo, saya " + nama + ". " + pesan;
      var nomor = form.getAttribute("data-wa");
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { method: "whatsapp_form", page: location.pathname });
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { method: "whatsapp_form" });
      }
      window.open("https://wa.me/" + nomor + "?text=" + encodeURIComponent(teks), "_blank", "noopener");
    });
  });

  // 3. Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }
})();
