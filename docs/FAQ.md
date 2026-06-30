# FAQ — CCS Project (Frontend)

Dokumentasi pertanyaan umum untuk pengguna dan operator frontend aplikasi CCS.

## Cara Menggunakan

- **Bagaimana cara membuat akun?**
  - Gunakan halaman `Daftar` (Register) lalu isi nama, email, dan password. Setelah pendaftaran sukses, login melalui halaman `Masuk`.

- **Saya lupa password, bagaimana cara reset?**
  - Gunakan fitur `Lupa password` pada halaman login untuk mengirim tautan reset ke email yang terdaftar.

## Wallet & Blockchain

- **Kenapa Wallet saya muncul "Disconnected" atau "Read-Only"?**
  - Bila aplikasi tidak menemukan bytecode kontrak di jaringan yang dikonfigurasi, frontend akan bekerja dalam mode "Read-Only" (tidak bisa menulis transaksi). Pastikan `VITE_BLOCKCHAIN_CONTRACT_ADDRESS` pada file lingkungan mengarah ke kontrak yang sudah dideploy.

- **Saya ingin melihat saldo ETH/MATIC saya, di mana?**
  - Saldo diperoleh langsung dari RPC provider yang dikonfigurasi (`VITE_BLOCKCHAIN_RPC_URL`). Jika saldo tidak muncul, periksa koneksi jaringan dan alamat dompet yang digunakan.

- **Jaringan apa yang digunakan aplikasi?**
  - Default saat ini diatur ke Polygon Mainnet (chainId=137). Periksa file environment `.env` di folder frontend untuk memastikan pengaturan jaringan.

## Verifikasi Dokumen

- **Bagaimana cara memverifikasi dokumen yang terdaftar di blockchain?**
  - Gunakan fitur `Verifikasi` di aplikasi dan masukkan hash dokumen. Aplikasi akan mencari di kontrak (jika tersedia) dan juga di backend untuk hasil verifikasi.

- **Saya mendapatkan pesan "No contract deployed" — apa artinya?**
  - Itu berarti alamat kontrak yang dikonfigurasi tidak memiliki bytecode di jaringan saat ini. Untuk fungsional penuh, deploy kontrak di jaringan yang dipilih dan perbarui alamat pada environment.

## Laporan & Monitoring

- **Bagaimana membuat laporan atau melihat riwayat aktivitas?**
  - Gunakan halaman `Laporan` atau `Monitoring` di dashboard pengguna. Pastikan Anda memiliki peran `user` atau `admin` yang sesuai.

## Admin & Konten FAQ

- **Di mana mengelola isi FAQ?**
  - Ada panel manajemen FAQ di frontend (`FAQAdmin` component) yang berkomunikasi dengan endpoint backend `/api/faqs`. Admin dapat membuat, mengedit, mengaktifkan/non-aktifkan, dan mengurutkan FAQ.

- **Bagaimana mengimpor FAQ ke database?**
  - Project memiliki seeder backend di `BE_CCS/database/seeders/FAQSeeder.php`. Jalankan seeder di environment backend untuk mengisi data awal:

  ```bash
  php artisan db:seed --class=FAQSeeder
  ```

## Troubleshooting

- **Aplikasi menampilkan "Blockchain offline"**
  - Periksa `VITE_BLOCKCHAIN_RPC_URL` dan pastikan provider RPC dapat diakses dari server/klien Anda.

- **Terjadi error saat login/registrasi**
  - Periksa response API pada network inspector. Pastikan backend berjalan dan endpoint autentikasi tersedia.

## Kontak & Bantuan

- Untuk masalah teknis yang tidak dapat diselesaikan melalui FAQ, hubungi tim pengembang atau buat issue pada repository.

---
Versi dokumen ini adalah versi awal. Ingin saya tambahkan FAQ lain atau sinkronkan entri ini ke backend seed/FAQAdmin?