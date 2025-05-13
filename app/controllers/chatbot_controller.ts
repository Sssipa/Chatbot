import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class ChatbotController {
  public async sendMessage({ request, response }: HttpContextContract) {
    try {
      const { message } = request.body()
      
      // Your n8n webhook URL - store this in your .env file
      const n8nWebhookUrl = Env.get('N8N_WEBHOOK_URL', '')
      
      if (!n8nWebhookUrl) {
        return response.status(500).json({ 
          error: 'N8N webhook URL not configured' 
        })
      }
      
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId: request.input('userId', 'anonymous'),
          context: 'parenting',
        }),
      })
      
      const data = await n8nResponse.json()
      
      return response.status(200).json(data)
    } catch (error) {
      console.error('Error processing chatbot message:', error)
      return response.status(500).json({ 
        error: 'Failed to process message',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
}