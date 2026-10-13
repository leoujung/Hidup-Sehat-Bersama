/* Cek 7 Pilar Hidup Sehat: kuis 1 pertanyaan per layar, hasil dihitung di browser (tidak dikirim ke mana pun). */
(function () {
  var form = document.getElementById("cek-form");
  var hasil = document.getElementById("hasil");
  if (!form || !hasil) return;

  var WA = "https://wa.me/6287718227922?text=";
  var PILAR = [
    { k: "olahraga", nama: "Olahraga", tips: [
      "Mulai dari jalan kaki cepat 30 menit, 5 hari seminggu. Totalnya 150 menit aktivitas sedang per minggu, sesuai anjuran WHO untuk orang dewasa.",
      "Kalau banyak duduk, berdiri dan bergerak sebentar setiap 30 sampai 60 menit.",
      "Pilih aktivitas yang Anda sukai, misalnya berenang, bersepeda, atau senam, supaya mudah konsisten."
    ] },
    { k: "nutrisi", nama: "Makan bernutrisi", tips: [
      "Pakai panduan Isi Piringku dari Kemenkes: separuh piring sayur dan buah, sisanya makanan pokok dan lauk berprotein.",
      "Batasi gula, garam, dan lemak. Kurangi minuman manis kemasan.",
      "Cukupi minum air putih sepanjang hari."
    ] },
    { k: "istirahat", nama: "Istirahat cukup", tips: [
      "Tidur dan bangun di jam yang sama setiap hari, termasuk akhir pekan.",
      "Jauhkan layar ponsel 30 sampai 60 menit sebelum tidur.",
      "Hindari kopi atau teh pekat di sore dan malam hari."
    ] },
    { k: "stres", nama: "Kelola stres", tips: [
      "Luangkan 5 menit untuk menarik napas dalam dan perlahan saat terasa tegang.",
      "Bergerak ringan dan mengobrol dengan orang terdekat membantu meredakan tekanan.",
      "Bila stres terasa berat dan berlangsung lama, jangan ragu bicara dengan tenaga profesional."
    ] },
    { k: "polusi", nama: "Udara & air bersih", tips: [
      "Cek kualitas udara (ISPU) sebelum beraktivitas di luar, dan pakai masker saat udara sedang buruk.",
      "Jauhi asap rokok, dan buka ventilasi rumah saat udara luar sedang baik.",
      "Minum air yang sudah dimasak hingga mendidih atau air minum kemasan resmi."
    ] },
    { k: "pestisida", nama: "Bebas pestisida", tips: [
      "Cuci sayur dan buah di bawah air mengalir sambil digosok perlahan, jangan hanya direndam.",
      "Kupas kulit buah bila memungkinkan, dan buang lapisan daun terluar pada sayur seperti kol.",
      "Variasikan jenis dan sumber sayur-buah, atau pilih produk organik bila tersedia."
    ] },
    { k: "olahan", nama: "Olahan tanpa residu", tips: [
      "Hindari memakai minyak goreng berulang kali, apalagi yang sudah gelap dan berbau.",
      "Masak dengan api secukupnya dan buang bagian yang gosong.",
      "Pisahkan bahan mentah dan matang, cuci peralatan masak, dan jangan memanaskan makanan dalam wadah plastik yang tidak tahan panas."
    ] }
  ];
  var STATUS = { 2: ["Terjaga", "ok"], 1: ["Perlu ditingkatkan", "mid"], 0: ["Perlu perhatian", "low"] };

  var steps = form.querySelectorAll(".cek-step");
  var bar = form.querySelector(".cek-progress span");
  var status = form.querySelector(".cek-status");
  var back = form.querySelector('[data-cek="back"]');
  var next = form.querySelector('[data-cek="next"]');
  var idx = 0;
  var mulai = false;

  function track(event, params) {
    if (typeof window.gtag === "function") window.gtag("event", event, params);
  }

  function tampil(i, fokus) {
    idx = i;
    Array.prototype.forEach.call(steps, function (s, n) { s.hidden = n !== i; });
    bar.style.width = ((i + 1) / steps.length * 100).toFixed(1) + "%";
    status.textContent = "Pertanyaan " + (i + 1) + " dari " + steps.length;
    back.hidden = i === 0;
    next.disabled = !steps[i].querySelector("input:checked");
    next.innerHTML = i === steps.length - 1 ? 'Lihat hasil <i class="fas fa-arrow-right" aria-hidden="true"></i>' : 'Lanjut <i class="fas fa-arrow-right" aria-hidden="true"></i>';
    if (fokus) {
      var pilih = steps[i].querySelector("input:checked") || steps[i].querySelector("input");
      pilih.focus();
    }
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function hitung() {
    var skor = PILAR.map(function (p) {
      var c = form.querySelector('input[name="' + p.k + '"]:checked');
      return { p: p, v: c ? Number(c.value) : 0 };
    });
    var terjaga = skor.filter(function (s) { return s.v === 2; }).length;
    var lemah = skor.filter(function (s) { return s.v < 2; }).sort(function (a, b) { return a.v - b.v; });

    var judul = terjaga >= 6 ? "Mantap! " + terjaga + " dari 7 pilar sudah terjaga"
      : terjaga >= 3 ? "Sudah di jalur yang baik: " + terjaga + " dari 7 pilar terjaga"
      : "Masih banyak ruang untuk tumbuh: " + terjaga + " dari 7 pilar terjaga";
    document.getElementById("hasil-judul").textContent = judul;
    document.getElementById("hasil-ringkas").textContent = lemah.length
      ? "Yang paling perlu perhatian: " + lemah.slice(0, 3).map(function (s) { return s.p.nama; }).join(", ") + ". Tips di bawah bisa Anda mulai hari ini."
      : "Pertahankan kebiasaan baik ini. Konsistensi adalah kuncinya.";

    var list = document.getElementById("pilar-list");
    list.textContent = "";
    skor.forEach(function (s) {
      var li = el("li", "pilar pilar--" + STATUS[s.v][1]);
      li.appendChild(el("span", "pilar-nama", s.p.nama));
      li.appendChild(el("span", "pilar-chip", STATUS[s.v][0]));
      list.appendChild(li);
    });

    var tipsBox = document.getElementById("tips-list");
    tipsBox.textContent = "";
    var fokus = lemah.length ? lemah.slice(0, 3) : skor.slice(0, 2);
    if (!lemah.length) tipsBox.appendChild(el("p", "small", "Semua pilar Anda terjaga. Berikut pengingat supaya tetap konsisten:"));
    fokus.forEach(function (s) {
      var box = el("div", "tips-item");
      box.appendChild(el("h4", null, s.p.nama));
      var ul = el("ul");
      s.p.tips.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      box.appendChild(ul);
      tipsBox.appendChild(box);
    });

    var teks = "Halo, saya sudah cek 7 pilar hidup sehat di website. Hasil saya: " + terjaga + " dari 7 pilar terjaga." +
      (lemah.length ? " Yang perlu perhatian: " + lemah.map(function (s) { return s.p.nama; }).join(", ") + "." : "") +
      " Saya ingin diskusi lebih lanjut.";
    document.getElementById("wa-hasil").href = WA + encodeURIComponent(teks);

    track("cek_selesai", { terjaga: terjaga, pilar_lemah: lemah.map(function (s) { return s.p.k; }).join(",") || "tidak_ada" });

    form.hidden = true;
    hasil.hidden = false;
    hasil.scrollIntoView({ behavior: "smooth", block: "start" });
    hasil.focus({ preventScroll: true });
  }

  function maju() {
    if (!steps[idx].querySelector("input:checked")) return;
    if (idx < steps.length - 1) tampil(idx + 1, true);
    else hitung();
  }

  form.addEventListener("change", function (e) {
    if (e.target.type !== "radio") return;
    if (!mulai) { mulai = true; track("cek_mulai", { page: location.pathname }); }
    next.disabled = false;
  });

  // Klik/tap langsung pindah ke pertanyaan berikutnya. Panah keyboard (e.detail 0) hanya memilih; lanjut lewat tombol.
  var tunda = false;
  form.addEventListener("click", function (e) {
    if (e.detail === 0 || tunda || !e.target.closest(".cek-opt")) return;
    tunda = true;
    setTimeout(function () { tunda = false; maju(); }, 220);
  });
  next.addEventListener("click", maju);

  back.addEventListener("click", function () { if (idx > 0) tampil(idx - 1, true); });
  form.addEventListener("submit", function (e) { e.preventDefault(); maju(); });

  hasil.querySelector('[data-cek="ulang"]').addEventListener("click", function () {
    form.reset();
    hasil.hidden = true;
    form.hidden = false;
    tampil(0, true);
    track("cek_ulang", {});
  });
})();
