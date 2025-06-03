import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MitosFakta from '#models/mitos_fakta'

export default class extends BaseSeeder {
  async run() {
    await MitosFakta.createMany([
      {
        mitos: 'Mitos: Memberi makan bayi di malam hari akan membuat mereka manja.',
        fakta: 'Fakta: Memberi makan bayi di malam hari adalah kebutuhan alami karena bayi membutuhkan kalori tambahan untuk tumbuh kembangnya, bukan karena manja.'
      },
      {
        mitos: 'Mitos: Bayi seharusnya dimandikan dengan air dingin supaya kuat.',
        fakta: 'Fakta: Bayi memiliki suhu tubuh yang lebih sensitif, memandikan dengan air hangat adalah cara terbaik agar bayi tetap nyaman dan sehat.'
      },
      {
        mitos: 'Mitos: Jika bayi menangis, berarti mereka sedang manja.',
        fakta: 'Fakta: Menangis adalah cara bayi berkomunikasi. Bisa karena lapar, lelah, atau butuh kenyamanan.'
      },
      {
        mitos: 'Mitos: Anak yang tidur siang terlalu lama akan susah tidur di malam hari.',
        fakta: 'Fakta: Tidur siang yang cukup justru membantu anak mendapatkan tidur malam yang lebih baik dan berkualitas.'
      },
      {
        mitos: 'Mitos: Menyusui terlalu sering akan membuat bayi terlalu bergantung pada ibu.',
        fakta: 'Fakta: Menyusui adalah kebutuhan dasar bayi, dan memberikan rasa aman serta keterikatan yang penting untuk perkembangan emosional mereka.'
      },
      {
        mitos: 'Mitos: Ibu hamil sebaiknya tidak berolahraga.',
        fakta: 'Fakta: Olahraga ringan yang aman justru membantu kesehatan ibu dan bayi, serta mempermudah persalinan.'
      },
      {
        mitos: 'Mitos: Anak yang sering bermain di luar rumah akan mudah sakit.',
        fakta: 'Fakta: Bermain di luar rumah dengan pengawasan yang baik justru membantu sistem imun anak dan perkembangan motorik mereka.'
      },
      // Tambahkan data lain sesuai kebutuhan
    ])
  }
}
