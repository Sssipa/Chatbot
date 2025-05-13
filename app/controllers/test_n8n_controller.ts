import type { HttpContext } from "@adonisjs/core/http"
import env from "#start/env"

export default class TestN8nController {
    async testConnection({ response }: HttpContext) {
        try {
            const n8nWebhookUrl = env.get("N8N_WEBHOOK_URL")
            console.log("Testing connection to n8n webhook URL:", n8nWebhookUrl)

            const testPayload = {
                message: "test connection",
                userId: "test",
                context: "testing",
            }

            const n8nResponse = await fetch(n8nWebhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(testPayload),
            })

            console.log("n8n test response status:", n8nResponse.status)

            // Periksa tipe konten respons
            const contentType = n8nResponse.headers.get('content-type');
            console.log("Content-Type:", contentType);

            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await n8nResponse.json();
                console.log("n8n test response data (JSON):", responseData);
            } else {
                const textResponse = await n8nResponse.text();
                console.log("n8n test response data (Text):", textResponse.substring(0, 200) + "...");
                responseData = { text: textResponse.substring(0, 200) + "..." };
            }

            return response.status(200).json({
                success: true,
                n8nStatus: n8nResponse.status,
                contentType: contentType,
                n8nResponse: responseData,
            })
        } catch (error) {
            console.error("Error testing n8n connection:", error)
            return response.status(500).json({
                success: false,
                error: error.message,
            })
        }
    }
}