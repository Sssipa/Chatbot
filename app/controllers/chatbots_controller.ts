import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"
import ChatHistory from "#models/chat_history" // Pastikan ChatHistory diimpor
import { DateTime } from 'luxon' // Impor DateTime jika digunakan di view untuk format waktu
import { marked } from 'marked'; // install dulu: npm i marked

export default class ChatbotController {
  /**
   * Handle chatbot message and forward to n8n
   */
  // Menambahkan 'auth' ke destructuring HttpContext agar bisa mengakses status login pengguna
  async handleMessage({ request, response, auth, session  }: HttpContext) {
    try {
      const { chatInput, clientSessionId: clientSessionId } = request.body();
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

      let n8nSessionId = userIdForN8n;

      if (userIdForN8n === 'anonymous') {
          // Jika anonim, gunakan sessionId dari client (harus unik per browser session)
          if (!clientSessionId) {
              // Jika clientSessionId tidak ada (misalnya halaman baru), buat yang baru
              // Ini harusnya diurus di frontend, tapi sebagai fallback
              n8nSessionId = `anonymous-${crypto.randomUUID()}`; // Contoh: gunakan UUID
              session.put('anonymous_session_id', n8nSessionId); // Simpan di session backend jika perlu
          } else {
              n8nSessionId = clientSessionId;
          }
      }

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput, // 3
          sessionId: n8nSessionId, // Mengirim sessionId ke n8n
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

      const botResponse = (data.response || data.output || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*(.*?)\*/g, "<i>$1</i>").replace(/\*/g, "").replace(/\n/g, "<br>");
      const botResponseHTML = marked.parse(botResponse); // Menggunakan marked untuk mengonversi Markdown ke HTML

      // HANYA simpan riwayat chat jika pengguna sudah login.
      if (auth.user) {
        console.log("Akan simpan chat untuk user_id:", auth.user.id, chatInput, botResponse);
        await this.saveChatHistory(auth.user.id.toString(), chatInput, botResponse);
        console.log("Berhasil simpan chat (atau catch error jika gagal)");
      }
      // Jika pengguna belum login (auth.user null), saveChatHistory tidak akan dipanggil,
      // sehingga riwayat chat tidak disimpan ke database.

      return response.status(200).json({
        success: true,
        response: botResponseHTML,
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

      console.log("saveChatHistory:", { userId, userMessage, botResponse });

    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }

  /**
   * Metode baru untuk menampilkan Chatbot Dashboard beserta histori chat
   */
  async showChatbotDashboard({ view, auth }: HttpContext) {
    // Perbaikan: Berikan tipe eksplisit untuk chatHistories
    let chatHistories: ChatHistory[] = []; // Memberi tahu TypeScript bahwa ini adalah array dari objek ChatHistory

    console.log('auth.user:', auth.user);
    
    if (auth.user) {
      // Ambil riwayat chat berdasarkan user_id hanya jika pengguna login
      chatHistories = await ChatHistory
        .query()
        .where('user_id', auth.user.id.toString())
        .orderBy('createdAt', 'desc') // Urutkan dari yang terbaru
        .limit(10);
    } else {
      chatHistories = []
    }

    return view.render('chatbot', {
      chatHistories,
      DateTime
    })
  }
}