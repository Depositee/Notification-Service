import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';
const EXCHANGE = 'notification_exchange';

export const consumeMessages = async (userId: string) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    const queue = `user.${userId}.notification`;
    await channel.assertQueue(queue, { durable: true });

    const routingKey = `user.${userId}.notification`;
    await channel.bindQueue(queue, EXCHANGE, routingKey);

    console.log(`Waiting for messages for user ${userId}...`);
    channel.consume(queue, async (message: any) => {
      if (message) {
        channel.ack(message);
        console.log(`Received message for user ${userId}:`, JSON.parse(message.content));
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
};

// when usage use this function with the userId
const userId = "671207717a198c8657edbdd3" // Jame
// const userId = "671372fe70d389ca3c5d47f8" // Tar
consumeMessages(userId)