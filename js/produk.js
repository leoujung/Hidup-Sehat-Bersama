/* Halaman produk: saring kartu menurut kebutuhan. Tanpa JS, semua kartu tetap tampil. */
(function () {
  var chips = document.querySelectorAll(".filter-chip");
  var cards = document.querySelectorAll(".products .product[data-cat]");
  var status = document.querySelector(".filter-status");
  if (!chips.length || !cards.length) return;

  function saring(kat) {
    var n = 0;
    Array.prototype.forEach.call(cards, function (c) {
      var tampil = kat === "semua" || c.getAttribute("data-cat") === kat;
      c.hidden = !tampil;
      if (tampil) n++;
    });
    Array.prototype.forEach.call(chips, function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === kat ? "true" : "false");
    });
    if (status) status.textContent = "Menampilkan " + n + " produk";
  }

  Array.prototype.forEach.call(chips, function (b) {
    b.addEventListener("click", function () {
      var kat = b.getAttribute("data-filter");
      saring(kat);
      if (typeof window.gtag === "function") window.gtag("event", "filter_produk", { kategori: kat });
    });
  });
})();
