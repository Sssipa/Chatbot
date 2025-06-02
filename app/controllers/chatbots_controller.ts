
import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"

export default class ChatbotController {
  /**
   * Handle chatbot message and forward to n8n
   */
  async handleMessage({ request, response }: HttpContext) {
    try {
      const { chatInput, sessionId } = request.body(); // 1
      const n8nWebhookUrl = env.get("N8N_WEBHOOK_URL");

      console.log("Webhook URL:", n8nWebhookUrl); // Log URL
      if (!chatInput) { // 2
        return response.status(400).json({
          success: false,
          message: "Pesan tidak boleh kosong",
        });
      }

      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatInput, // 3
          sessionId,
          userId: request.input("userId", "anonymous"),
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

      await this.saveChatHistory(chatInput, botResponse);

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
   */
  private async saveChatHistory(userMessage: string, botResponse: string) {
    try {
      const ChatHistory = (await import('#models/chat_history')).default
      await ChatHistory.create({
        user_message: userMessage,
        bot_response: botResponse,
        user_id: 'anonymous', // Ganti dengan ID pengguna jika ada sistem autentikasi
      })

    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }
}
