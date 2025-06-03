import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"
import ChatHistory from "#models/chat_history"
import { DateTime } from 'luxon'
import { marked } from 'marked'

export default class ChatbotController {
  /**
   * Handle chatbot message and forward to n8n
   */
  async handleMessage({ request, response, auth, session }: HttpContext) {
    try {
      const { chatInput, clientSessionId } = request.body();
      const n8nWebhookUrl = env.get("N8N_WEBHOOK_URL");

      if (!chatInput) {
        return response.status(400).json({
          success: false,
          message: "Pesan tidak boleh kosong",
        });
      }

      // Siapkan sessionId untuk n8n
      const userId = auth.user?.id ?? null;
      console.log("auth.user:", auth.user);
      let n8nSessionId = userId ? userId.toString() : 'anonymous';
      if (!userId) {
        n8nSessionId = clientSessionId || `anonymous-${crypto.randomUUID()}`;
        session.put('anonymous_session_id', n8nSessionId);
      }

      // Kirim ke n8n
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput,
          sessionId: n8nSessionId,
          userId: userId ? userId.toString() : 'anonymous',
          context: "parenting",
        }),
      });

      const responseText = await n8nResponse.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        return response.status(500).json({
          success: false,
          message: "Respons dari server tidak valid",
        });
      }

      const botResponse = (data.response || data.output || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/\*/g, "")
        .replace(/\n/g, "<br>");
      const botResponseHTML = marked.parse(botResponse);

      // Simpan history hanya jika user login
      if (userId) {
        console.log("Akan menyimpan history:", { userId, chatInput, botResponse });
        try {
          await ChatHistory.create({
            userId,
            user_message: chatInput,
            bot_response: botResponse,
          });
          console.log("Berhasil simpan history");
        } catch (error) {
          console.error("Error saving chat history:", error);
        }
      }

      return response.status(200).json({
        success: true,
        response: botResponseHTML,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memproses pesan",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Tampilkan dashboard chatbot beserta histori chat user login
   */
  async showChatbotDashboard({ view, auth }: HttpContext) {
    let chatHistories: ChatHistory[] = [];
    if (auth.user) {
      chatHistories = await ChatHistory
        .query()
        .where('user_id', auth.user.id)
        .orderBy('createdAt', 'desc')
        .limit(10);
    }
    return view.render('chatbot', {
      chatHistories,
      DateTime
    });
  }
}