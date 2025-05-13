import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"

interface N8nResponse {
    response?: string; // Respons dari bot (opsional)
}

export default class ChatbotController {
    /**
     * Handle chatbot message and forward to n8n
     */
    async handleMessage({ request, response }: HttpContext) {
        try {
            const { message } = request.body()
            console.log("Menerima pesan:", message)

            // Ambil URL webhook n8n dari environment variable
            const n8nWebhookUrl = env.get("N8N_WEBHOOK_URL")
            console.log("Menggunakan webhook URL:", n8nWebhookUrl)

            if (!n8nWebhookUrl) {
                throw new Error("N8N_WEBHOOK_URL tidak ditemukan di environment variables.");
            }

            if (!message) {
                return response.status(400).json({
                    success: false,
                    message: "Pesan tidak boleh kosong",
                })
            }

            // Kirim pesan ke n8n webhook
            const n8nResponse = await fetch(n8nWebhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    message,
                    userId: request.input("userId", "anonymous"),
                    context: "parenting",
                }),
            })

            // Periksa tipe konten respons
            const contentType = n8nResponse.headers.get('content-type');
            console.log("Tipe konten respons:", contentType);
            
            let responseData: N8nResponse = {};
            
            // Tangani respons berdasarkan tipe konten
            if (contentType && contentType.includes('application/json')) {
                // Jika respons adalah JSON, parse sebagai JSON
                responseData = await n8nResponse.json() as N8nResponse;
                console.log("Respons JSON dari n8n:", responseData);
            } else {
                // Jika respons bukan JSON (mungkin HTML atau teks), ambil sebagai teks
                const textResponse = await n8nResponse.text();
                console.log("Respons teks dari n8n:", textResponse.substring(0, 100) + "...");
                
                // Gunakan respons teks sebagai respons bot
                responseData = {
                    response: "Maaf, saya sedang mengalami masalah teknis. Silakan coba lagi nanti."
                };
            }

            // Simpan riwayat chat ke database
            await this.saveChatHistory(message, responseData.response || "Tidak ada respons")

            return response.status(200).json({
                success: true,
                response: responseData.response || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.",
            })
        } catch (error) {
            console.error("Error processing chatbot message:", error)
            return response.status(500).json({
                success: false,
                message: "Terjadi kesalahan saat memproses pesan",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            })
        }
    }

    /**
     * Save chat history to database
     */
    private async saveChatHistory(userMessage: string, botResponse: string) {
        try {
            // Uncomment kode di bawah ini setelah Anda membuat model ChatHistory
            
            const ChatHistory = (await import('#models/chat_history')).default
            await ChatHistory.create({
              user_message: userMessage,
              bot_response: botResponse,
              user_id: 'anonymous' // Ganti dengan ID pengguna jika ada sistem autentikasi
            })
            
        } catch (error) {
            console.error("Error saving chat history:", error)
        }
    }
}