import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"
import ChatHistory from "#models/chat_history" // Pastikan ChatHistory diimpor
import { DateTime } from 'luxon' // Impor DateTime jika digunakan di view untuk format waktu

export default class ChatbotController {
  /**
   * Handle chatbot message and forward to n8n
   */
  // Menambahkan 'auth' ke destructuring HttpContext agar bisa mengakses status login pengguna
  async handleMessage({ request, response, auth }: HttpContext) {
    try {
      const { chatInput, sessionId } = request.body();
      const n8nWebhookUrl = env.get("N8N_WEBHOOK_URL");

      console.log("Webhook URL:", n8nWebhookUrl); // Log URL
      if (!chatInput) { // 2
        return response.status(400).json({
          success: false,
          message: "Pesan tidak boleh kosong",
        });
      }

      // Menentukan userId yang akan dikirim ke n8n.
      // Jika pengguna login, gunakan ID mereka. Jika tidak, gunakan 'anonymous'.
      const userIdForN8n = auth.user ? auth.user.id.toString() : 'anonymous';

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput, // 3
          sessionId,
          userId: userIdForN8n, // Mengirim userId ke n8n
          context: "parenting",
        }),
      });

      console.log("n8n Response Status:", n8nResponse.status); // Log status
      const responseText = await n8nResponse.text();
      console.log("n8n Response Text:", responseText); // Log raw response

      let data;
      try {
        data = JSON.parse(responseText); // Parse JSON
      } catch (error) {
        console.error("Invalid JSON response:", error);
        return response.status(500).json({
          success: false,
          message: "Respons dari server tidak valid",
        });
      }

      const botResponse = data.response || data.output || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";

      // HANYA simpan riwayat chat jika pengguna sudah login.
      // Jika auth.user ada, berarti pengguna sudah terautentikasi.
      if (auth.user) {
        // Memanggil saveChatHistory dengan ID pengguna yang sebenarnya
        await this.saveChatHistory(auth.user.id.toString(), chatInput, botResponse);
      }
      // Jika pengguna belum login (auth.user null), saveChatHistory tidak akan dipanggil,
      // sehingga riwayat chat tidak disimpan ke database.

      return response.status(200).json({
        success: true,
        response: botResponse,
      });
    } catch (error) {
      console.error("Error processing chatbot message:", error);
      return response.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memproses pesan",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Save chat history to database
   * Menerima userId sebagai parameter untuk menyimpan riwayat chat yang spesifik untuk pengguna.
   */
  private async saveChatHistory(userId: string, userMessage: string, botResponse: string) {
    try {
      // Mengimpor model ChatHistory secara dinamis
      // Ini adalah praktik yang baik jika model tidak selalu dibutuhkan di setiap request
      // const ChatHistory = (await import('#models/chat_history')).default; // Baris ini sudah ada, pastikan diimpor di atas

      await ChatHistory.create({
        user_id: userId, // Menggunakan userId yang diberikan dari handleMessage
        user_message: userMessage,
        bot_response: botResponse,
      });

    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }

  /**
   * Metode baru untuk menampilkan Chatbot Dashboard beserta histori chat
   */
  async showChatbotDashboard({ view, auth, request }: HttpContext) {
    // Perbaikan: Berikan tipe eksplisit untuk chatHistories
    let chatHistories: ChatHistory[] = []; // Memberi tahu TypeScript bahwa ini adalah array dari objek ChatHistory

    if (auth.user) {
      // Ambil riwayat chat berdasarkan user_id hanya jika pengguna login
      chatHistories = await ChatHistory
        .query()
        .where('user_id', auth.user.id.toString())
        .orderBy('createdAt', 'desc') // Urutkan dari yang terbaru
        .limit(10); // Batasi jumlah riwayat yang ditampilkan di sidebar, misalnya 10 percakapan terakhir
    }

    // Siapkan data JSON
    const chatData = {
      histories: chatHistories,
      selectedHistoryId: request.input('historyId')
    }

    // Mengirim data histori chat, DateTime, dan request ke view chatbot
    // Sekarang, 'request' objek juga di-pass secara eksplisit ke view
    // return view.render('chatbot', { chatHistories, DateTime, request });
    
    return view.render('chatbot', {
      chatData: JSON.stringify(chatData),
      DateTime
    })
  }
}