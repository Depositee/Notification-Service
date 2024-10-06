import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost'; // Your RabbitMQ server URL
const QUEUE = 'notification_queue';

export const sendMessageToQueue = async (message: any) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('Message sent to queue:', message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to queue:', error);
  }
};
