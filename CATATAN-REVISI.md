# Hidup Sehat Bersama — redesign Oktober 2026

## Cara melihat di komputer
1. Klik kanan file zip, pilih "Extract All" / "Ekstrak Semua".
2. Buka folder hasil ekstrak, lalu klik dua kali `index.html`.
Jangan membuka `index.html` langsung dari dalam zip: CSS, font, dan gambar tidak ikut terbaca sehingga tampilan rusak.

## Domain
Website memakai domain `ingatsehat.my.id` (file `CNAME`). DNS diatur di Hostinger: 4 A record @ ke IP GitHub Pages dan CNAME `www` ke `leoujung.github.io`. Jangan hapus record MX/TXT karena dipakai email `info@ingatsehat.my.id`.

## Cara upload ke GitHub
Isi folder ini menggantikan seluruh isi repo `Hidup-Sehat-Bersama`. File lama (Bootstrap, jQuery, gambar .jpg/.png lama, folder Montserrat, css/style.css) sudah tidak dipakai dan boleh dihapus dari repo.

## Masih perlu kamu lengkapi
1. Halaman produk hanya menampilkan produk yang nomor BPOM-nya sudah dicek. Untuk menambah produk lain, siapkan nomor BPOM dari cekbpom.pom.go.id.
2. ID Google Analytics 4 dan Meta Pixel (lihat komentar TRACKING di `<head>` kedua halaman).
4. Pastikan Mariana & Yoke setuju foto dan namanya dipakai.
5. Cek isi dua video YouTube, pastikan tidak ada klaim menyembuhkan penyakit.
