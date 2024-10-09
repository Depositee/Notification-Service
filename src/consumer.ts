import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';
const EXCHANGE = 'notification_exchange';

export const consumeMessages = async (userId: number) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    const queue = `notification_queue_${userId}`;
    await channel.assertQueue(queue, { durable: true });

    const routingKey = `user.${userId}.notification`;
    await channel.bindQueue(queue, EXCHANGE, routingKey);

    console.log(`Waiting for messages for user ${userId}...`);
    channel.consume(queue, async(message : any) => {
      if (message) {
        channel.ack(message);
        console.log(`Received message for user ${userId}:`, JSON.parse(message.content));
      }
    },{ noAck: false } );
  } catch (error) {
    console.error('Error consuming messages:', error);
  }
};

// when usage use this function with the userId
// Example : consumeMessages(userId)