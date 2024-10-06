import amqp from 'amqplib';
const RABBITMQ_URL = 'amqp://localhost'; // Your RabbitMQ server URL
const QUEUE = 'notification_queue';

export const startConsumer = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    console.log('Waiting for messages in queue:', QUEUE);

    channel.consume(
      QUEUE,
      async (msg : any) => {
        if (msg !== null) {
          channel.ack(msg); // Acknowledge message
        }
      },
      { noAck: false } // Ensure message acknowledgment
    );
  } catch (error) {
    console.error('Error starting RabbitMQ consumer:', error);
  }
};
