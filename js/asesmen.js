/* Asesmen Hidup Sehat: semua perhitungan di perangkat pengunjung, jawaban tidak dikirim ke mana pun
   kecuali pengunjung sendiri mengisi formulir "Bahas hasil Anda". */
(function () {
  var form = document.getElementById("as-form");
  var hasil = document.getElementById("hasil");
  if (!form || !hasil) return;

  function track(event, params) {
    if (typeof window.gtag === "function") window.gtag("event", event, params || {});
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function ikon(cls) {
    var i = el("i", "fas " + cls);
    i.setAttribute("aria-hidden", "true");
    return i;
  }
  var WA = "6287718227922";

  // ---------- Data produk (klaim mengikuti teks resmi di halaman Produk, tanpa harga) ----------
  var PRODUK = {
    plus: {
      nama: "4Life Transfer Factor® Plus Tri-Factor™ Formula", pendek: "Transfer Factor Plus",
      img: "img/plus-baru.webp",
      desk: "Tri-Factor® Formula ditambah Cordyvant™ (jamur maitake, shiitake, cordyceps, dan lainnya) untuk membantu memelihara kesehatan tubuh.",
      bpom: "BPOM SI253073521", link: "https://indonesia.4life.com/leogito/product/transfer-factor-plus-tri-factor/89"
    },
    tri: {
      nama: "4Life Transfer Factor® Tri-Factor™ Formula", pendek: "Transfer Factor Tri-Factor",
      img: "img/1.webp",
      desk: "Kombinasi transfer factor dari kolostrum sapi dan kuning telur ayam untuk membantu mendukung dan menjaga keseimbangan sistem pertahanan tubuh. Cocok untuk tua maupun muda.",
      bpom: "BPOM SI263076871", link: "https://indonesia.4life.com/leogito/product/transfer-factor-tri-factor/95"
    },
    renuvo: {
      nama: "4Life Transfer Factor® Renuvo", pendek: "Transfer Factor Renuvo",
      img: "img/10.webp",
      desk: "Formula adaptogenik untuk membantu tubuh beradaptasi dengan pemicu stres sehari-hari, serta mendukung energi dan sistem kekebalan tubuh.",
      bpom: "BPOM SI253071271", link: "https://indonesia.4life.com/leogito/product/renuvo/1810"
    },
    recall: {
      nama: "4Life Transfer Factor® ReCall®", pendek: "Transfer Factor ReCall",
      img: "img/recall-baru.webp",
      desk: "Ginseng Asia, ginkgo biloba, dan Tri-Factor® Formula untuk mendukung fungsi belajar dan daya ingat.",
      bpom: "BPOM SI253071151", link: "https://indonesia.4life.com/leogito/product/t-f-recall/1891"
    },
    bellevie: {
      nama: "4Life Transfer Factor® Belle Vie®", pendek: "Transfer Factor Belle Vie",
      img: "https://media2.4life.com/products/Indonesia_belle_vie_image.webp?width=400&mode=crop&quality=85",
      desk: "Transfer Factor khusus wanita dengan fitoestrogen dan antioksidan untuk mendukung keseimbangan hormon dan sistem pertahanan tubuh.",
      catatan: "Mengandung fitoestrogen. Konsultasikan dengan dokter bila sedang hamil, menyusui, atau menjalani terapi hormon.",
      bpom: "BPOM TI134347441", link: "https://indonesia.4life.com/leogito/product/transfer-factor-belle-vie/75/106"
    },
    glucoach: {
      nama: "4Life Transfer Factor® GluCoach®", pendek: "Transfer Factor GluCoach",
      img: "https://media2.4life.com/products/Indonesia_glucoach.webp?width=400&mode=crop&quality=85",
      desk: "Bersama pola makan dan gaya hidup sehat, mendukung metabolisme gula darah yang sehat.",
      catatan: "Bukan untuk pengobatan diabetes. Sedang minum obat gula darah? Konsultasikan dengan dokter terlebih dahulu.",
      bpom: "BPOM TI253067651", link: "https://indonesia.4life.com/leogito/product/transfer-factor-glucoach/81"
    },
    bioefa: {
      nama: "4Life BioEFA", pendek: "BioEFA",
      img: "https://media2.4life.com/products/Indonesia_new_bioefa.webp?width=400&mode=crop&quality=85",
      desk: "Omega-3 dan omega-6 dengan minyak ikan untuk membantu memelihara kesehatan jantung dan sistem saraf.",
      catatan: "Mengandung minyak ikan. Alergi ikan atau sedang minum obat pengencer darah? Konsultasikan dengan dokter terlebih dahulu.",
      bpom: "BPOM SI253073511", link: "https://indonesia.4life.com/leogito/product/bioefa/2234/161"
    },
    tvmc: {
      nama: "4Life Targeted Vitamin & Mineral Complex", pendek: "Targeted Vitamin & Mineral Complex",
      img: "img/tvmc.webp?v=2",
      desk: "Perpaduan vitamin, mineral, dan antioksidan untuk melengkapi asupan nutrisi mikro harian.",
      bpom: "BPOM SI114302891", link: null
    }
  };

  var AREA = {
    otot: "Otot, tulang & sendi", pria: "Kesehatan pria", cerna: "Pencernaan", ginjal: "Ginjal & saluran kemih",
    wanita: "Kesehatan wanita", aktif: "Gaya hidup aktif", metabolisme: "Metabolisme", mata: "Kesehatan mata",
    detoks: "Membersihkan tubuh", imun: "Daya tahan tubuh", mulut: "Kesehatan gigi & mulut", kulit: "Kulit & kecantikan",
    gula: "Kadar gula darah", berat: "Mengelola berat badan", antioksidan: "Antioksidan", energi: "Energi",
    otak: "Otak & saraf", jantung: "Jantung & peredaran darah", penuaan: "Penuaan sehat", vitalitas: "Vitalitas & stamina",
    napas: "Pernapasan", stres: "Suasana hati, stres & tidur"
  };
  // Area tanpa produk khusus di katalog: dijawab jujur, diarahkan ke diskusi (dan dokter bila ada keluhan).
  var AREA_TANPA_PRODUK = ["otot", "pria", "cerna", "ginjal", "mata", "detoks", "mulut", "kulit", "berat", "vitalitas", "napas"];

  var WAJIB = ["gender", "usia", "tinggi", "berat", "rokok", "air", "buah", "sayur", "susu", "biji", "gula", "daging", "ikan",
    "menu", "bab", "duduk", "ringan", "sedang", "beratakt", "stres", "tidur", "energi", "imun", "area", "setuju"];

  function nilai(name) {
    if (name === "area") {
      return Array.prototype.map.call(form.querySelectorAll('[name="area"]:checked'), function (c) { return c.value; });
    }
    if (name === "setuju") return form.querySelector('[name="setuju"]').checked ? 1 : null;
    var r = form.querySelector('[name="' + name + '"]:checked');
    if (r) return r.value;
    var f = form.querySelector('select[name="' + name + '"], input[type="number"][name="' + name + '"]');
    return f && f.value !== "" ? f.value : null;
  }

  function sahAngka(name, v) {
    var n = parseFloat(String(v).replace(",", "."));
    var batas = { usia: [12, 100], tinggi: [100, 230], berat: [25, 250] }[name];
    return batas ? !isNaN(n) && n >= batas[0] && n <= batas[1] : true;
  }

  // ---------- Maksimal 3 area ----------
  var areaBox = form.querySelectorAll('[name="area"]');
  var hitung = form.querySelector(".as-hitung");
  function batasArea() {
    var n = form.querySelectorAll('[name="area"]:checked').length;
    Array.prototype.forEach.call(areaBox, function (c) {
      c.disabled = !c.checked && n >= 3;
      c.closest(".as-check").classList.toggle("is-off", c.disabled);
    });
    if (hitung) hitung.textContent = n + " dari 3 dipilih" + (n >= 3 ? ". Hapus satu pilihan untuk mengganti." : "");
  }
  Array.prototype.forEach.call(areaBox, function (c) { c.addEventListener("change", batasArea); });

  var mulai = false;
  form.addEventListener("input", function (e) {
    if (!mulai) { mulai = true; track("asesmen_mulai", { page: location.pathname }); }
    var box = e.target.closest("[data-q]");
    if (box && box.classList.contains("as-err")) {
      box.classList.remove("as-err");
      var m = box.querySelector(".as-err-msg");
      if (m) m.remove();
    }
  });

  // ---------- Validasi ----------
  function tandai(name, pesan) {
    var box = form.querySelector('[data-q="' + name + '"]');
    if (!box) return null;
    box.classList.add("as-err");
    if (!box.querySelector(".as-err-msg")) {
      var p = el("p", "as-err-msg", pesan);
      box.appendChild(p);
    }
    return box;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    Array.prototype.forEach.call(form.querySelectorAll(".as-err"), function (b) {
      b.classList.remove("as-err");
      var m = b.querySelector(".as-err-msg");
      if (m) m.remove();
    });
    var kosong = [];
    var data = {};
    WAJIB.forEach(function (k) {
      var v = nilai(k);
      data[k] = v;
      if (v == null || (k === "area" && !v.length)) {
        kosong.push(tandai(k, k === "area" ? "Pilih minimal 1 area." : k === "setuju" ? "Centang dulu untuk melihat hasil." : "Belum dijawab."));
      } else if (!sahAngka(k, v)) {
        kosong.push(tandai(k, { usia: "Isi usia 12–100 tahun.", tinggi: "Isi tinggi 100–230 cm.", berat: "Isi berat 25–250 kg." }[k]));
      }
    });
    var galat = form.querySelector(".as-galat");
    kosong = kosong.filter(Boolean);
    if (kosong.length) {
      galat.textContent = kosong.length === 1 ? "Masih ada 1 isian yang perlu dilengkapi." : "Masih ada " + kosong.length + " isian yang perlu dilengkapi.";
      galat.hidden = false;
      kosong[0].scrollIntoView({ behavior: "smooth", block: "center" });
      var f = kosong[0].querySelector("input:not([disabled]), select");
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 350);
      track("asesmen_belum_lengkap", { jumlah: kosong.length });
      return;
    }
    galat.hidden = true;
    tampilkan(olah(data));
  });

  // ---------- Pengolahan ----------
  function olah(d) {
    var n = {};
    ["air", "buah", "sayur", "susu", "biji", "gula", "daging", "ikan", "menu", "bab", "duduk", "ringan", "sedang", "beratakt", "stres", "tidur", "energi", "imun", "rokok"].forEach(function (k) { n[k] = parseInt(d[k], 10); });
    var usia = parseInt(d.usia, 10);
    var tinggi = parseFloat(String(d.tinggi).replace(",", "."));
    var berat = parseFloat(String(d.berat).replace(",", "."));
    var imt = berat / Math.pow(tinggi / 100, 2);
    var KALI = [0, 1.5, 3.5, 5.5];
    var menit = Math.round((KALI[n.sedang] + 2 * KALI[n.beratakt]) * 30);
    var area = d.area;
    var punya = function (a) { return area.indexOf(a) >= 0; };
    var wanita = d.gender === "w";

    var bagus = [];
    var ins = []; // {p: prioritas, ikon, teks, topik}
    function insight(p, ik, topik, teks) { ins.push({ p: p, ikon: ik, topik: topik, teks: teks }); }
    var imtTeks = imt.toFixed(1).replace(".", ",");

    if (imt < 18.5) insight(6, "fa-weight", "berat badan", "Indeks Massa Tubuh (IMT) Anda " + imtTeks + ", termasuk kurus menurut kategori Kemenkes. Pastikan asupan energi dan protein cukup di setiap makan. Bila berat badan turun tanpa sebab jelas, periksakan ke dokter.");
    else if (imt <= 25) bagus.push("Berat badan ideal (IMT " + imtTeks + ")");
    else if (imt <= 27) insight(6, "fa-weight", "berat badan", "IMT Anda " + imtTeks + ", termasuk berat badan lebih menurut kategori Kemenkes. Porsi Isi Piringku dan aktivitas 150 menit per minggu membantu mencapai berat ideal secara bertahap.");
    else insight(8, "fa-weight", "berat badan", "IMT Anda " + imtTeks + ", termasuk kategori obesitas menurut Kemenkes. Konsultasikan target berat badan yang aman dengan dokter atau ahli gizi, lalu mulai dari perubahan kecil: kurangi minuman manis dan tambah jalan kaki.");

    if (n.rokok === 1) insight(10, "fa-smoking-ban", "merokok", "Merokok, termasuk rokok elektrik, membebani paru-paru dan daya tahan tubuh. Berhenti merokok adalah langkah paling berdampak untuk kesehatan Anda. Puskesmas menyediakan layanan konseling berhenti merokok.");
    else bagus.push("Tidak merokok");

    if (n.air <= 1) insight(7, "fa-tint", "minum air", "Anda minum kurang dari 5 gelas air sehari. Kebutuhan orang dewasa umumnya sekitar 8 gelas. Taruh botol air di dekat Anda dan minum segelas setiap selesai ke kamar mandi.");
    else if (n.air === 2) insight(3, "fa-tint", "minum air", "Sedikit lagi: tambah 1–3 gelas air agar mencapai sekitar 8 gelas sehari.");
    else bagus.push("Minum air cukup");

    var kurangBuah = n.buah < 2, kurangSayur = n.sayur < 3;
    if (kurangBuah || kurangSayur) {
      insight(kurangBuah && kurangSayur ? 7 : 5, "fa-carrot", "sayur & buah",
        "Pedoman Isi Piringku menganjurkan 3–4 porsi sayur dan 2–3 porsi buah setiap hari. Saat ini Anda makan " + n.sayur + " porsi sayur dan " + n.buah + " porsi buah. Mulai dengan menambah satu porsi sayur di makan siang dan satu buah sebagai camilan.");
    }
    if (!kurangBuah) bagus.push("Konsumsi buah");
    if (!kurangSayur) bagus.push("Konsumsi sayur");

    if (n.biji === 0) insight(3, "fa-seedling", "biji-bijian utuh", "Coba ganti sebagian nasi putih dengan nasi merah, oat, atau roti gandum utuh untuk tambahan serat yang membuat kenyang lebih lama.");

    if (n.gula >= 2) insight(n.gula >= 4 ? 7 : 5, "fa-candy-cane", "makanan manis", "Anda mengonsumsi " + n.gula + (n.gula === 6 ? "+" : "") + " porsi makanan atau minuman manis sehari. Kemenkes menganjurkan gula tidak lebih dari 50 gram (4 sendok makan) per hari, termasuk gula di minuman kemasan dan es teh manis. Ganti satu minuman manis dengan air putih.");
    else bagus.push("Asupan gula terkendali");

    if (n.daging > 3) insight(4, "fa-drumstick-bite", "daging merah", "Anda makan daging merah lebih dari 3 kali seminggu. Selingi dengan ikan, ayam tanpa kulit, telur, tahu, tempe, atau kacang-kacangan.");
    else bagus.push("Konsumsi daging merah");

    if (n.ikan < 2) insight(4, "fa-fish", "ikan", "Usahakan makan ikan minimal 2 kali seminggu. Ikan adalah sumber protein dan lemak omega-3 yang baik, dan ikan lokal seperti kembung atau tongkol mudah didapat.");
    else bagus.push("Konsumsi ikan");

    if (n.menu === 0) insight(3, "fa-hamburger", "variasi menu", "Menu Anda cenderung berulang. Makanan yang beragam membantu tubuh mendapat zat gizi yang lebih lengkap. Coba satu sayur atau lauk baru setiap minggu.");
    else if (n.menu >= 2) bagus.push("Menu makan beragam");

    if (n.bab === 0) insight(6, "fa-poop", "pencernaan", "Buang air besar Anda tampaknya jarang. Tambah serat dari sayur, buah, dan biji-bijian, minum cukup air, dan bergerak aktif. Bila berlangsung lama atau disertai keluhan, periksakan ke dokter.");
    else if (n.bab === 4) insight(6, "fa-poop", "pencernaan", "Buang air besar lebih dari 3 kali sehari bisa menandakan gangguan pencernaan. Bila berlangsung lebih dari 2 hari atau disertai keluhan lain, periksakan ke dokter.");
    else bagus.push("Pencernaan teratur");

    if (n.duduk >= 2) insight(n.duduk === 3 ? 7 : 5, "fa-chair", "waktu duduk", "Duduk lama dan terus-menerus berdampak kurang baik bagi kesehatan. Bangun dan bergerak 2–3 menit setiap 30 menit, misalnya berdiri saat menelepon atau berjalan mengambil minum.");
    else bagus.push("Tidak terlalu lama duduk");

    if (menit < 150) {
      insight(menit === 0 ? 9 : 7, "fa-running", "aktivitas fisik", (menit === 0
        ? "Anda belum rutin melakukan aktivitas sedang atau berat. Mulai dari jalan cepat 10 menit setelah makan, lalu tambah sedikit demi sedikit."
        : "Aktivitas sedang dan berat Anda sekitar " + menit + " menit per minggu.") +
        " WHO menganjurkan orang dewasa melakukan minimal 150 menit aktivitas sedang (atau 75 menit aktivitas berat) per minggu, ditambah latihan kekuatan otot 2 hari per minggu.");
    } else bagus.push("Aktivitas fisik cukup");

    if (n.stres >= 3) insight(8, "fa-spa", "stres", "Stres Anda cukup tinggi. Sisihkan 10 menit sehari untuk napas dalam, berdoa, atau berjalan santai, dan ceritakan beban Anda ke orang yang dipercaya. Bila stres terasa berat dan mengganggu aktivitas, jangan ragu bicara dengan tenaga profesional.");
    else if (n.stres === 2) insight(4, "fa-spa", "stres", "Stres sedang itu wajar, asal tidak menumpuk. Jadwalkan waktu jeda singkat setiap hari dan tidur cukup.");
    else bagus.push("Tingkat stres terjaga");

    var MALAM = ["", "1–2 malam", "3–4 malam", "5–6 malam", "setiap malam"];
    if (n.tidur >= 2) insight(8, "fa-bed", "tidur", "Anda tidur 5 jam atau kurang " + MALAM[n.tidur] + (n.tidur === 4 ? "" : " seminggu") + ". Orang dewasa butuh 7–9 jam. Tidur dan bangun di jam yang sama, dan jauhkan ponsel 30 menit sebelum tidur.");
    else if (n.tidur === 1) insight(4, "fa-bed", "tidur", "Sesekali Anda kurang tidur. Usahakan tidur 7–9 jam dan ganti jam tidur yang hilang dengan tidur lebih awal, bukan tidur siang yang terlalu lama.");
    else bagus.push("Durasi tidur");

    if (n.energi <= 1) insight(6, "fa-battery-half", "energi", "Energi Anda terasa rendah. Tidur cukup, sarapan bergizi, minum air yang cukup, dan bergerak aktif membantu. Bila lemas berlangsung lama tanpa sebab jelas, periksakan ke dokter.");
    else if (n.energi >= 3) bagus.push("Tingkat energi");

    if (n.imun <= 1) insight(7, "fa-shield-alt", "daya tahan tubuh", "Anda merasa mudah sakit. Kebiasaan sehari-hari seperti tidur, makan bergizi, olahraga, dan kelola stres adalah fondasi daya tahan tubuh. Bila sering sakit atau lama sembuh, periksakan ke dokter.");
    else if (n.imun >= 3) bagus.push("Daya tahan tubuh terasa baik");

    ins.sort(function (a, b) { return b.p - a.p; });

    // ---------- Skor produk ----------
    var skor = {}, alasan = {};
    function tambah(id, s, label) {
      skor[id] = (skor[id] || 0) + s;
      alasan[id] = alasan[id] || [];
      if (label && alasan[id].indexOf(label) < 0) alasan[id].push(label);
    }
    var celah = ins.filter(function (i) { return i.p >= 5; }).length;

    // Fondasi daya tahan tubuh
    tambah("tri", 1);
    tambah("plus", celah >= 3 || usia >= 40 ? 2 : 0.5);
    if (n.imun <= 2) { tambah("tri", 3, "Daya tahan tubuh"); tambah("plus", 3, "Daya tahan tubuh"); }
    if (punya("imun")) { tambah("tri", 4, "Area pilihan: Daya tahan tubuh"); tambah("plus", 4, "Area pilihan: Daya tahan tubuh"); }
    if (n.tidur >= 2) { tambah("tri", 1, "Kualitas tidur"); tambah("plus", 1, "Kualitas tidur"); }
    if (n.stres >= 3) { tambah("tri", 1, "Tingkat stres"); tambah("plus", 1, "Tingkat stres"); }
    if (n.duduk >= 2) { tambah("tri", 1, "Waktu duduk"); tambah("plus", 1, "Waktu duduk"); }
    if (punya("napas")) { tambah("tri", 1, "Area pilihan: Pernapasan"); tambah("plus", 1, "Area pilihan: Pernapasan"); }

    // Stres, energi, aktivitas padat
    if (n.stres >= 2) tambah("renuvo", n.stres >= 3 ? 4 : 2, "Tingkat stres");
    if (n.energi <= 1) tambah("renuvo", 2, "Tingkat energi");
    if (n.beratakt >= 2) tambah("renuvo", 1, "Aktivitas berat");
    ["stres", "energi", "aktif", "penuaan", "antioksidan"].forEach(function (a) { if (punya(a)) tambah("renuvo", 4, "Area pilihan: " + AREA[a]); });

    if (punya("otak")) { tambah("recall", 6, "Area pilihan: Otak & saraf"); tambah("bioefa", 1, "Area pilihan: Otak & saraf"); }
    if (wanita && punya("wanita")) tambah("bellevie", 6, "Area pilihan: Kesehatan wanita");
    if (punya("gula")) tambah("glucoach", 6, "Area pilihan: Kadar gula darah");
    if (punya("metabolisme")) tambah("glucoach", 3, "Area pilihan: Metabolisme");
    if (punya("jantung")) tambah("bioefa", 6, "Area pilihan: Jantung & peredaran darah");
    if (n.ikan < 2) tambah("bioefa", 3, "Konsumsi ikan");
    if (kurangBuah || kurangSayur) tambah("tvmc", 2, kurangSayur ? "Konsumsi sayur" : "Konsumsi buah");
    if (kurangBuah && kurangSayur) tambah("tvmc", 1, "Konsumsi buah");
    if (n.menu === 0) tambah("tvmc", 1, "Variasi menu");

    var ids = Object.keys(skor).filter(function (k) { return skor[k] > 0; });
    var catatan = [];
    if (usia < 18) {
      ids = ["tri"];
      catatan.push("Untuk usia di bawah 18 tahun, konsultasikan dengan dokter dan orang tua sebelum mengonsumsi suplemen apa pun.");
    }
    ids.sort(function (a, b) { return skor[b] - skor[a]; });
    // Tri-Factor dan Plus: jangan keduanya di 3 teratas bila ada produk lain yang relevan; Plus tetap sebagai pilihan lengkap.
    var top = ids.slice(0, 3);
    if (top.indexOf("tri") >= 0 && top.indexOf("plus") >= 0 && ids.length > 3 && skor[ids[3]] >= 3) {
      var buang = skor.tri >= skor.plus ? "plus" : "tri";
      ids.splice(ids.indexOf(buang), 1);
      ids.push(buang);
    }
    var tanpa = area.filter(function (a) { return AREA_TANPA_PRODUK.indexOf(a) >= 0 || (a === "wanita" && !wanita); });
    if (tanpa.length) {
      catatan.push("Untuk area " + tanpa.map(function (a) { return AREA[a].toLowerCase(); }).join(", ") +
        ", katalog kami belum punya produk khusus. Diskusikan kebutuhan Anda lewat WhatsApp, dan bila ada keluhan, tetap periksakan ke dokter.");
    }

    return {
      usia: usia, wanita: wanita, imt: imtTeks, menit: menit, area: area, bagus: bagus, insight: ins,
      produk: ids, alasan: alasan, catatan: catatan
    };
  }

  // ---------- Tampilan hasil ----------
  var ringkasan = "";
  var waHasil = document.getElementById("wa-hasil");

  function kartuProduk(id, r, idx) {
    var p = PRODUK[id];
    var a = el("article", "as-prod");
    if (idx >= 3) { a.hidden = true; a.classList.add("as-ekstra"); }
    var img = el("img");
    img.src = p.img; img.alt = p.nama; img.width = 160; img.height = 160; img.loading = "lazy";
    if (id === "renuvo") { img.src = "https://media2.4life.com/products/Indonesia_new_aug_renuvo.webp?width=400&mode=crop&quality=85"; img.onerror = function () { img.onerror = null; img.src = "img/10.webp"; }; }
    var fig = el("div", "as-prod-img"); fig.appendChild(img);
    var body = el("div", "as-prod-body");
    if (idx === 0) body.appendChild(el("span", "product-badge", "Paling sesuai"));
    body.appendChild(el("h3", null, p.nama));
    body.appendChild(el("p", "small", p.desk));
    body.appendChild(el("p", "as-bpom", p.bpom));
    if (p.catatan) {
      var c = el("p", "product-note");
      c.appendChild(ikon("fa-info-circle"));
      c.appendChild(el("span", null, p.catatan));
      body.appendChild(c);
    }
    var aksi = el("div", "product-actions");
    var tanya = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Halo, saya sudah mengisi Asesmen Hidup Sehat dan direkomendasikan " + p.pendek + ". Saya mau tanya dulu.");
    if (p.link) {
      var beli = el("a", "btn btn--blue btn--sm");
      beli.href = p.link; beli.target = "_blank"; beli.rel = "noopener";
      beli.setAttribute("data-produk", p.pendek + " (asesmen)");
      beli.appendChild(ikon("fa-shopping-bag"));
      beli.appendChild(document.createTextNode(" Lihat harga & beli"));
      aksi.appendChild(beli);
    }
    var t = el("a", "btn btn--ghost btn--sm");
    t.href = tanya;
    var wi = el("i", "fab fa-whatsapp"); wi.setAttribute("aria-hidden", "true");
    t.appendChild(wi);
    t.appendChild(document.createTextNode(p.link ? " Tanya dulu" : " Tanya harga & stok"));
    aksi.appendChild(t);
    body.appendChild(aksi);
    var al = r.alasan[id] && r.alasan[id].length ? r.alasan[id].slice(0, 4).join("; ") : "Pilihan dasar untuk membantu memelihara daya tahan tubuh";
    var dasar = el("p", "as-dasar");
    dasar.appendChild(document.createTextNode("Saran ini berdasarkan jawaban Anda tentang: "));
    dasar.appendChild(el("strong", null, al));
    body.appendChild(dasar);
    a.appendChild(fig); a.appendChild(body);
    return a;
  }

  function tampilkan(r) {
    var box = document.getElementById("as-produk");
    box.textContent = "";
    r.produk.forEach(function (id, i) { box.appendChild(kartuProduk(id, r, i)); });
    var lebihP = hasil.querySelector('[data-lebih="produk"]');
    lebihP.hidden = r.produk.length <= 3;

    var cat = document.getElementById("as-catatan");
    cat.textContent = r.catatan.join(" ");
    cat.hidden = !r.catatan.length;

    var bagusBox = document.getElementById("bagus");
    var bl = document.getElementById("as-bagus");
    bl.textContent = "";
    r.bagus.forEach(function (b) {
      var li = el("li");
      li.appendChild(ikon("fa-check-circle"));
      li.appendChild(document.createTextNode(" " + b));
      bl.appendChild(li);
    });
    bagusBox.hidden = !r.bagus.length;

    var il = document.getElementById("as-insight");
    il.textContent = "";
    if (!r.insight.length) {
      il.appendChild(el("li", "as-ins-kosong", "Kebiasaan Anda sudah sangat baik. Pertahankan, dan ajak keluarga ikut menjalaninya."));
    }
    r.insight.forEach(function (x, i) {
      var li = el("li", "as-ins");
      if (i >= 3) { li.hidden = true; li.classList.add("as-ekstra"); }
      var ic = el("span", "as-ins-ikon"); ic.appendChild(ikon(x.ikon));
      li.appendChild(ic);
      li.appendChild(el("p", null, x.teks));
      il.appendChild(li);
    });
    hasil.querySelector('[data-lebih="insight"]').hidden = r.insight.length <= 3;

    var perlu = r.insight.filter(function (i) { return i.p >= 5; }).map(function (i) { return i.topik; });
    document.getElementById("as-ringkas").textContent =
      "Ada " + r.bagus.length + " kebiasaan yang sudah bagus" +
      (perlu.length ? " dan " + perlu.length + " hal yang paling perlu perhatian: " + perlu.slice(0, 4).join(", ") + (perlu.length > 4 ? ", dan lainnya" : "") + "." : ". Pertahankan!") +
      " Area yang ingin Anda jaga: " + r.area.map(function (a) { return AREA[a].toLowerCase(); }).join(", ") + ".";

    var namaProduk = r.produk.slice(0, 3).map(function (id) { return PRODUK[id].pendek; });
    ringkasan = "Asesmen Hidup Sehat: " + (r.wanita ? "wanita" : "pria") + ", " + r.usia + " th, IMT " + r.imt + ". " +
      (perlu.length ? "Perlu perhatian: " + perlu.join(", ") + ". " : "") +
      "Ingin dijaga: " + r.area.map(function (a) { return AREA[a]; }).join(", ") + ". " +
      "Saran produk: " + namaProduk.join(", ") + ".";
    waHasil.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent("Halo, saya sudah mengisi Asesmen Hidup Sehat di website. " + ringkasan.replace(/^Asesmen Hidup Sehat: /, "Hasil saya: ") + " Saya mau diskusi.");

    form.hidden = true;
    hasil.hidden = false;
    hasil.focus({ preventScroll: true });
    window.scrollTo({ top: Math.max(0, hasil.getBoundingClientRect().top + window.pageYOffset - 90), behavior: "smooth" });
    track("asesmen_selesai", { produk: r.produk.slice(0, 3).join(","), area: r.area.join(","), insight: perlu.length });
  }

  Array.prototype.forEach.call(hasil.querySelectorAll("[data-lebih]"), function (b) {
    b.addEventListener("click", function () {
      var wadah = b.getAttribute("data-lebih") === "produk" ? document.getElementById("as-produk") : document.getElementById("as-insight");
      var pertama = null;
      Array.prototype.forEach.call(wadah.querySelectorAll(".as-ekstra"), function (x) { x.hidden = false; if (!pertama) pertama = x; });
      b.hidden = true;
      if (pertama) { pertama.setAttribute("tabindex", "-1"); pertama.focus(); }
      track("asesmen_lebih", { bagian: b.getAttribute("data-lebih") });
    });
  });

  // ---------- Cetak, ulangi, bagikan ----------
  window.addEventListener("beforeprint", function () {
    Array.prototype.forEach.call(hasil.querySelectorAll(".as-ekstra"), function (x) { x.hidden = false; });
  });
  hasil.querySelector('[data-as="cetak"]').addEventListener("click", function () {
    track("asesmen_cetak", {});
    window.print();
  });
  hasil.querySelector('[data-as="ulang"]').addEventListener("click", function () {
    form.reset();
    batasArea();
    hasil.hidden = true;
    form.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    track("asesmen_ulang", {});
  });

  var stBagi = hasil.querySelector(".as-bagikan-status");
  hasil.querySelector('[data-as="bagikan"]').addEventListener("click", function () {
    var kode = "";
    try { var s = JSON.parse(localStorage.getItem("is_mitra") || "null"); if (s && s.kode) kode = s.kode; } catch (err) { /* abaikan */ }
    var url = location.origin + location.pathname + (kode ? "?mitra=" + encodeURIComponent(kode) : "");
    var teks = "Coba Asesmen Hidup Sehat gratis ini, ±4 menit, langsung dapat insight pola hidup:";
    track("asesmen_bagikan", { mitra: kode || "-" });
    if (navigator.share) {
      navigator.share({ title: "Asesmen Hidup Sehat", text: teks, url: url }).catch(function () { /* dibatalkan */ });
      return;
    }
    var salin = function () {
      var ta = el("textarea"); ta.value = url; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    };
    var beres = function () { stBagi.textContent = "Link tersalin: " + url; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(beres, function () { stBagi.textContent = salin() ? "Link tersalin: " + url : "Salin link ini: " + url; });
    } else {
      stBagi.textContent = salin() ? "Link tersalin: " + url : "Salin link ini: " + url;
    }
  });

  // ---------- Formulir bahas hasil + Panduan PDF (alur lead n8n yang sama dengan Cek 7 Pilar) ----------
  var pform = hasil.querySelector(".panduan-form");
  var pdone = hasil.querySelector(".panduan-done");
  if (pform && pdone) {
    var pNama = pform.querySelector('[name="nama"]');
    var pWA = pform.querySelector('[name="whatsapp"]');
    var pBtn = pform.querySelector('button[type="submit"]');
    var pStatus = pform.querySelector(".lead-status");
    var normalWA = function (v) {
      var wa = String(v || "").replace(/[^0-9]/g, "");
      if (wa.indexOf("0") === 0) wa = "62" + wa.slice(1);
      else if (wa.indexOf("8") === 0) wa = "62" + wa;
      return wa;
    };
    var salah = function (input, msg) {
      var box = input.closest(".lead-field");
      var old = box.querySelector(".field-error");
      if (old) old.remove();
      if (msg) {
        var e = el("p", "field-error", msg);
        e.id = input.id + "-err";
        box.appendChild(e);
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", e.id);
      } else {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
    };
    var selesai = function (nama, terkirim) {
      pdone.querySelector(".panduan-done-judul").textContent = "Terima kasih, " + nama + "! Panduan siap diunduh";
      pdone.querySelector(".panduan-done-teks").textContent = terkirim
        ? "Kami akan menghubungi Anda lewat WhatsApp untuk membahas hasil asesmen."
        : "Data Anda belum terkirim, tapi panduan tetap bisa diunduh. Untuk membahas hasil, tekan \"Diskusikan hasil saya\" di bawah.";
      pform.hidden = true;
      pdone.hidden = false;
      pdone.focus();
    };
    pform.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid")) salah(e.target, "");
    });
    pform.addEventListener("submit", function (e) {
      e.preventDefault();
      var nama = pNama.value.trim();
      var wa = normalWA(pWA.value);
      var ok = true;
      if (!nama) { salah(pNama, "Nama wajib diisi."); ok = false; } else salah(pNama, "");
      if (!/^62\d{8,13}$/.test(wa)) { salah(pWA, "Masukkan nomor WhatsApp yang valid, contoh 0812-3456-7890."); ok = false; } else salah(pWA, "");
      if (!ok) { (pform.querySelector('[aria-invalid="true"]') || pNama).focus(); return; }

      var sumber = "langsung";
      try { sumber = sessionStorage.getItem("is_sumber") || "langsung"; } catch (err) { /* abaikan */ }
      var data = new URLSearchParams();
      data.set("nama", nama);
      data.set("whatsapp", wa);
      data.set("minat", "tanya");
      data.set("pesan", ringkasan);
      data.set("halaman", location.pathname + " (asesmen hidup sehat)");
      data.set("sumber", sumber);
      data.set("website", pform.querySelector('[name="website"]').value);

      pBtn.disabled = true;
      pStatus.textContent = "Mengirim…";
      var ctrl = typeof AbortController === "function" ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 12000);
      fetch(pform.getAttribute("data-endpoint"), { method: "POST", body: data, signal: ctrl ? ctrl.signal : undefined })
        .then(function (res) {
          clearTimeout(timer);
          if (res.status === 400) {
            return res.json().catch(function () { return {}; }).then(function (j) {
              pBtn.disabled = false;
              pStatus.textContent = "";
              salah(pWA, j.error || "Data belum lengkap, mohon periksa kembali.");
              pWA.focus();
            });
          }
          if (!res.ok) throw new Error("HTTP " + res.status);
          track("generate_lead", { method: "asesmen_hidup_sehat", page: location.pathname });
          if (typeof window.fbq === "function") window.fbq("track", "Lead", { method: "asesmen_hidup_sehat" });
          selesai(nama, true);
        })
        .catch(function () {
          clearTimeout(timer);
          track("asesmen_lead_error", { page: location.pathname });
          selesai(nama, false);
        });
    });
    pdone.querySelector('[data-panduan="unduh"]').addEventListener("click", function () {
      track("panduan_unduh", { page: location.pathname });
    });
  }
})();
