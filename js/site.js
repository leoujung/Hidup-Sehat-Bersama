/* Ingat Sehat - script bersama untuk semua halaman */
(function () {
  function track(event, params) {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  }

  // 1. Catat klik tombol WhatsApp ke GA4 / Meta Pixel (jalan otomatis kalau tracking sudah dipasang)
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!link) return;
    var label = (link.textContent || "").trim() || "WhatsApp";
    track("generate_lead", { method: "whatsapp", link_text: label, page: location.pathname, mitra: KODE_MITRA || "-" });
    if (typeof window.fbq === "function") {
      window.fbq("track", "Contact", { method: "whatsapp" });
    }
  });

  // 1b. Catat klik ke toko online resmi 4Life
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest('a[href*="4life.com"]') : null;
    if (!link) return;
    track("klik_toko_resmi", { produk: link.getAttribute("data-produk") || "umum", page: location.pathname });
  });

  // 2. Sumber kunjungan (UTM / referrer), disimpan selama sesi supaya tidak hilang saat pindah halaman
  function sumberKunjungan() {
    var key = "is_sumber";
    try {
      var saved = sessionStorage.getItem(key);
      if (saved) return saved;
    } catch (err) { /* storage diblokir: lanjut tanpa simpan */ }
    var q = new URLSearchParams(location.search);
    var parts = [];
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) {
      if (q.get(k)) parts.push(k.replace("utm_", "") + "=" + q.get(k));
    });
    var sumber = parts.join(" | ");
    if (!sumber && document.referrer) {
      try {
        var host = new URL(document.referrer).hostname;
        if (host && host !== location.hostname) sumber = "referral=" + host;
      } catch (err) { /* referrer tidak valid */ }
    }
    sumber = sumber || "langsung";
    try { sessionStorage.setItem(key, sumber); } catch (err) { /* abaikan */ }
    return sumber;
  }
  var SUMBER = sumberKunjungan();

  // 2b. Link mitra: ?mitra=kode membuat semua tombol WhatsApp mengarah ke nomor mitra itu.
  //     Nomor diambil dari n8n (Data Table privat), tidak pernah disimpan di kode website ini.
  //     Gagal atau kode tidak dikenal = tombol tetap ke nomor Leo.
  var NOMOR_LEO = "6287718227922";
  var MITRA_API = "https://n8n-n0ft.srv1964287.hstgr.cloud/webhook/ingatsehat-mitra?kode=";
  var waMitra = null;

  function bacaMitra() {
    var q = (new URLSearchParams(location.search).get("mitra") || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
    try {
      if (q) { localStorage.setItem("is_mitra", JSON.stringify({ kode: q, t: Date.now() })); return q; }
      var s = JSON.parse(localStorage.getItem("is_mitra") || "null");
      if (s && s.kode && Date.now() - s.t < 30 * 864e5) return s.kode; // berlaku 30 hari
    } catch (err) { /* storage diblokir: pakai kode dari URL saja */ }
    return q;
  }

  function keMitra(nilai) {
    if (!waMitra || !nilai) return nilai;
    if (nilai === NOMOR_LEO) return waMitra;
    return nilai.split("wa.me/" + NOMOR_LEO).join("wa.me/" + waMitra);
  }

  function terapkanMitra() {
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="wa.me/' + NOMOR_LEO + '"]'), function (a) {
      a.setAttribute("href", keMitra(a.getAttribute("href")));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-wa]"), function (el) {
      el.setAttribute("data-wa", keMitra(el.getAttribute("data-wa")));
    });
  }

  // Tombol yang dibuat belakangan (misalnya hasil Cek 7 Pilar) diganti tepat saat diklik.
  document.addEventListener("click", function (e) {
    if (!waMitra || !e.target.closest) return;
    var a = e.target.closest('a[href*="wa.me/' + NOMOR_LEO + '"]');
    if (a) a.setAttribute("href", keMitra(a.getAttribute("href")));
  }, true);

  var KODE_MITRA = bacaMitra();
  if (KODE_MITRA) {
    if (SUMBER.indexOf("mitra=") < 0) {
      SUMBER += " | mitra=" + KODE_MITRA;
      try { sessionStorage.setItem("is_sumber", SUMBER); } catch (err) { /* abaikan */ }
    }
    var simpan = null;
    try { simpan = JSON.parse(sessionStorage.getItem("is_mitra_wa") || "null"); } catch (err) { /* abaikan */ }
    if (simpan && simpan.kode === KODE_MITRA) {
      waMitra = simpan.wa;
      terapkanMitra();
    } else if (typeof fetch === "function") {
      fetch(MITRA_API + encodeURIComponent(KODE_MITRA))
        .then(function (res) { return res.ok ? res.json() : {}; })
        .then(function (j) {
          if (!j || !j.ok || !/^62\d{8,13}$/.test(String(j.wa))) return;
          waMitra = String(j.wa);
          try { sessionStorage.setItem("is_mitra_wa", JSON.stringify({ kode: KODE_MITRA, wa: waMitra })); } catch (err) { /* abaikan */ }
          terapkanMitra();
          track("mitra_link", { kode: KODE_MITRA, page: location.pathname });
        })
        .catch(function () { /* tetap ke nomor Leo */ });
    }
  }

  // 3. Formulir lead: kirim ke n8n (Google Sheets + Telegram), fallback ke WhatsApp kalau gagal
  var LABEL_MINAT = { tanya: "konsultasi produk", beli: "membeli produk", member: "info Member Loyalitas", mitra: "info peluang bisnis 4Life" };

  function normalWA(v) {
    var wa = String(v || "").replace(/[^0-9]/g, "");
    if (wa.indexOf("0") === 0) wa = "62" + wa.slice(1);
    else if (wa.indexOf("8") === 0) wa = "62" + wa;
    return wa;
  }

  function setError(input, msg) {
    var field = input.closest(".lead-field");
    var old = field.querySelector(".field-error");
    if (old) old.remove();
    if (msg) {
      var p = document.createElement("p");
      p.className = "field-error";
      p.id = input.id + "-err";
      p.textContent = msg;
      field.appendChild(p);
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", p.id);
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function waLink(nomor, nama, minat, pesan) {
    var teks = "Halo, saya " + nama + ". Saya tertarik " + (LABEL_MINAT[minat] || LABEL_MINAT.tanya) + "." + (pesan ? " " + pesan : "");
    return "https://wa.me/" + nomor + "?text=" + encodeURIComponent(teks);
  }

  function tampilSelesai(form, nama, link, berhasil) {
    var box = document.createElement("div");
    box.className = "lead-done";
    box.setAttribute("tabindex", "-1");
    var icon = document.createElement("i");
    icon.className = "fas " + (berhasil ? "fa-check-circle" : "fa-comment-dots") + " done-icon";
    icon.setAttribute("aria-hidden", "true");
    var h = document.createElement("h3");
    h.textContent = berhasil ? "Terima kasih, " + nama + "!" : "Maaf, formulir sedang bermasalah";
    var p = document.createElement("p");
    p.textContent = berhasil
      ? "Kami akan menghubungi Anda lewat WhatsApp secepatnya. Mau lebih cepat? Chat kami sekarang."
      : "Pesan Anda belum terkirim. Silakan lanjutkan lewat WhatsApp, pesannya sudah kami siapkan.";
    var a = document.createElement("a");
    a.className = "btn btn--wa";
    a.href = link;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i> ';
    a.appendChild(document.createTextNode(berhasil ? "Chat sekarang" : "Lanjut ke WhatsApp"));
    box.appendChild(icon); box.appendChild(h); box.appendChild(p); box.appendChild(a);
    form.replaceWith(box);
    box.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".lead-form"), function (form) {
    var inNama = form.querySelector('[name="nama"]');
    var inWA = form.querySelector('[name="whatsapp"]');
    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector(".lead-status");
    var started = false;

    form.addEventListener("input", function (e) {
      if (!started) { started = true; track("form_start", { form_id: "lead", page: location.pathname }); }
      if (e.target.getAttribute("aria-invalid")) setError(e.target, "");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = inNama.value.trim();
      var wa = normalWA(inWA.value);
      var checked = form.querySelector('[name="minat"]:checked');
      var minat = checked ? checked.value : "tanya";
      var pesan = form.querySelector('[name="pesan"]').value.trim();

      var ok = true;
      if (!nama) { setError(inNama, "Nama wajib diisi."); ok = false; } else setError(inNama, "");
      if (!/^62\d{8,13}$/.test(wa)) { setError(inWA, "Masukkan nomor WhatsApp yang valid, contoh 0812-3456-7890."); ok = false; } else setError(inWA, "");
      if (!ok) { (form.querySelector('[aria-invalid="true"]') || inNama).focus(); return; }

      var link = waLink(form.getAttribute("data-wa"), nama, minat, pesan);
      var data = new URLSearchParams();
      data.set("nama", nama);
      data.set("whatsapp", wa);
      data.set("minat", minat);
      data.set("pesan", pesan);
      data.set("halaman", location.pathname);
      data.set("sumber", SUMBER);
      data.set("website", form.querySelector('[name="website"]').value);

      btn.disabled = true;
      status.textContent = "Mengirim…";

      var ctrl = typeof AbortController === "function" ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);

      fetch(form.getAttribute("data-endpoint"), { method: "POST", body: data, signal: ctrl ? ctrl.signal : undefined })
        .then(function (res) {
          clearTimeout(timer);
          if (res.status === 400) {
            return res.json().catch(function () { return {}; }).then(function (j) {
              btn.disabled = false;
              status.textContent = "";
              setError(inWA, j.error || "Data belum lengkap, mohon periksa kembali.");
              inWA.focus();
              return "retry";
            });
          }
          if (!res.ok) throw new Error("HTTP " + res.status);
          return "ok";
        })
        .then(function (hasil) {
          if (hasil !== "ok") return;
          track("generate_lead", { method: "lead_form", minat: minat, page: location.pathname });
          if (typeof window.fbq === "function") window.fbq("track", "Lead", { method: "lead_form" });
          tampilSelesai(form, nama, link, true);
        })
        .catch(function () {
          clearTimeout(timer);
          track("lead_form_error", { page: location.pathname });
          tampilSelesai(form, nama, link, false);
        });
    });
  });

  // 4. Menu mobile
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
