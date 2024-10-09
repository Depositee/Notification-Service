import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';
const EXCHANGE = 'notification_exchange';

export const sendMessageToQueue = async (message: any, userId: number) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    const routingKey = `user.${userId}.notification`;

    channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('Message sent to exchange:', message, 'with routing key:', routingKey);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to exchange:', error);
  }
};
