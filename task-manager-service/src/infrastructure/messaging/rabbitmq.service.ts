import amqp, { type Channel, type Connection } from "amqplib"

export interface MessagePayload {
  event: string
  data: any
  timestamp: Date
}

export class RabbitMQService {
  private static instance: RabbitMQService
  private connection: Connection | null = null
  private channel: Channel | null = null
  private readonly url: string

  private constructor() {
    this.url = process.env.RABBITMQ_URL || "amqp://localhost:5672"
  }

  static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService()
    }
    return RabbitMQService.instance
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url)
      this.channel = await this.connection.createChannel()

      await this.setupExchanges()

      console.log("[RabbitMQ] Connected successfully")

      this.connection.on("error", (err) => {
        console.error("[RabbitMQ] Connection error:", err)
      })

      this.connection.on("close", () => {
        console.log("[RabbitMQ] Connection closed, reconnecting...")
        setTimeout(() => this.connect(), 5000)
      })
    } catch (error) {
      console.error("[RabbitMQ] Failed to connect:", error)
      setTimeout(() => this.connect(), 5000)
    }
  }

  private async setupExchanges(): Promise<void> {
    if (!this.channel) return

    await this.channel.assertExchange("auth.events", "topic", {
      durable: true,
    })

    await this.channel.assertExchange("task.events", "topic", {
      durable: true,
    })
  }

  async publish(exchange: string, routingKey: string, message: MessagePayload): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized")
    }

    const content = Buffer.from(JSON.stringify(message))

    this.channel.publish(exchange, routingKey, content, {
      persistent: true,
      timestamp: Date.now(),
    })

    console.log(`[RabbitMQ] Published to ${exchange}.${routingKey}:`, message.event)
  }

  async subscribe(
    exchange: string,
    routingKey: string,
    queueName: string,
    callback: (message: MessagePayload) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not initialized")
    }

    await this.channel.assertQueue(queueName, { durable: true })
    await this.channel.bindQueue(queueName, exchange, routingKey)

    this.channel.consume(
      queueName,
      async (msg) => {
        if (msg) {
          try {
            const message: MessagePayload = JSON.parse(msg.content.toString())
            await callback(message)
            this.channel!.ack(msg)
            console.log(`[RabbitMQ] Processed message from ${queueName}:`, message.event)
          } catch (error) {
            console.error("[RabbitMQ] Error processing message:", error)
            this.channel!.nack(msg, false, false)
          }
        }
      },
      { noAck: false },
    )

    console.log(`[RabbitMQ] Subscribed to ${exchange}.${routingKey} on queue ${queueName}`)
  }

  async disconnect(): Promise<void> {
    try {
      await this.channel?.close()
      await this.connection?.close()
      console.log("[RabbitMQ] Disconnected successfully")
    } catch (error) {
      console.error("[RabbitMQ] Error during disconnect:", error)
    }
  }
}
