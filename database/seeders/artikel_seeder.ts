import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Artikel from '#models/artikel'

export default class extends BaseSeeder {
  async run() {
    await Artikel.createMany([
      {
              judul: 'Tips Parenting Modern',
              gambar: 'uploads/artikel/artikel1.jpg',
              penulis: 'Admin',
              isi: `
      Parenting di era modern memerlukan pendekatan yang seimbang antara teknologi dan perhatian emosional. Orang tua perlu memahami bahwa anak-anak saat ini tumbuh dalam lingkungan yang serba cepat dan penuh distraksi. 

      Beberapa tips parenting modern:
      1. Prioritaskan komunikasi terbuka: Anak perlu merasa didengar dan dihargai pendapatnya.
      2. Batasi penggunaan gadget: Tetapkan waktu layar yang sehat dan ajarkan anak cara menggunakan teknologi dengan bijak.
      3. Kembangkan empati: Dorong anak untuk peduli dan menghormati orang lain sejak dini.
      4. Berikan waktu berkualitas: Luangkan waktu khusus tanpa gangguan untuk bermain dan belajar bersama anak.

      Dengan penerapan tips ini, orang tua dapat membantu anak berkembang menjadi pribadi yang mandiri, penuh empati, dan mampu menghadapi tantangan masa depan.
              `.trim(),
            },
            {
              judul: 'Cara Mengasuh Anak di Era Digital',
              gambar: 'uploads/artikel/artikel2.jpg',
              penulis: 'Admin',
              isi: `
      Di era digital, anak-anak terpapar teknologi sejak usia dini. Hal ini membuka peluang besar, tetapi juga tantangan baru bagi para orang tua.

      Beberapa langkah untuk mengasuh anak di era digital:
      - Kenali dunia digital: Orang tua perlu melek teknologi agar bisa membimbing anak dengan tepat.
      - Tetapkan batasan: Buat aturan yang jelas tentang penggunaan gadget, misalnya waktu layar harian dan konten yang aman.
      - Jadilah contoh yang baik: Anak akan meniru perilaku orang tuanya. Gunakan teknologi secara bijak agar anak bisa mencontoh.
      - Seimbangkan aktivitas digital dan fisik: Ajak anak bermain di luar rumah, berolahraga, dan melakukan aktivitas sosial.

      Dengan pendekatan yang positif, orang tua bisa membantu anak memanfaatkan teknologi untuk hal-hal yang bermanfaat tanpa kehilangan nilai-nilai kehidupan nyata.
              `.trim(),
            },
            {
              judul: 'Pentingnya Rutinitas Harian untuk Anak',
              gambar: 'uploads/artikel/artikel3.jpg',
              penulis: 'Admin',
              isi: `
      Rutinitas harian yang konsisten dapat membantu anak merasa aman dan nyaman. Ketika anak tahu apa yang diharapkan dan apa yang akan terjadi, mereka cenderung lebih tenang dan percaya diri.

      Manfaat rutinitas harian:
      - Membantu perkembangan keterampilan manajemen waktu.
      - Mengurangi stres karena anak tahu apa yang akan terjadi selanjutnya.
      - Meningkatkan kualitas tidur dan waktu belajar.
      - Membantu anak mengembangkan rasa tanggung jawab.

      Sebagai orang tua, penting untuk membuat rutinitas yang sesuai dengan kebutuhan anak, sambil tetap fleksibel untuk situasi khusus.
              `.trim(),
            },
            {
              judul: 'Mengatasi Tantrum pada Balita',
              gambar: 'uploads/artikel/artikel4.jpg',
              penulis: 'Admin',
              isi: `
      Tantrum adalah hal normal yang terjadi pada balita saat mereka belajar mengatur emosi. Namun, tantrum bisa menjadi tantangan bagi orang tua.

      Cara mengatasi tantrum:
      - Tetap tenang: Jangan terpancing emosi, karena anak akan belajar dari sikap orang tua.
      - Validasi perasaan anak: Biarkan anak tahu bahwa emosinya dimengerti.
      - Berikan pilihan: Saat anak merasa memiliki kontrol, tantrum cenderung mereda.
      - Gunakan kata-kata sederhana: Sampaikan pesan dengan lembut dan jelas.

      Tantrum adalah bagian dari perkembangan anak. Dengan kesabaran dan empati, orang tua bisa membantu anak belajar mengelola emosinya.
              `.trim(),
            },
            {
              judul: 'Membangun Kebiasaan Membaca Sejak Dini',
              gambar: 'uploads/artikel/artikel5.jpg',
              penulis: 'Admin',
              isi: `
      Membaca adalah keterampilan penting yang mendukung perkembangan kognitif dan bahasa anak. Membiasakan membaca sejak dini akan memberikan banyak manfaat jangka panjang.

      Langkah-langkah membangun kebiasaan membaca:
      1. Jadikan membaca aktivitas menyenangkan, bukan kewajiban.
      2. Bacakan cerita dengan ekspresi yang menarik agar anak terlibat.
      3. Sediakan buku-buku sesuai usia dan minat anak.
      4. Jadwalkan waktu membaca setiap hari, misalnya sebelum tidur.

      Kebiasaan membaca bukan hanya memperkaya kosa kata anak, tetapi juga memperkuat ikatan emosional antara anak dan orang tua.
              `.trim(),
            },
            // Tambahkan artikel lain sesuai kebutuhan
    ])
  }
}
