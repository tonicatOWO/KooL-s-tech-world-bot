import cron from 'node-cron';
import prisma from '../lib/prisma';

const initializeCronJob = () => {
  const cronTime = process.env.cron_time;

  if (!cronTime) {
    throw new Error('CRON_TIME not set in environment variables');
  }

  if (!isValidCronExpression(cronTime)) {
    throw new Error(`Invalid cron expression: ${cronTime}`);
  }

  cron.schedule(cronTime, async () => {
    try {
      const monitoringThreads = await prisma.threadStatus.findMany({
        where: {
          isMonitoring: true,
        },
        orderBy: {
          lastActivity: 'desc',
        },
      });
    } catch (error) {
      console.error('Error during cron job execution:', error);
    }
  });
};

const isValidCronExpression = (expr: string): boolean => {
  const cronRegex =
    /^(\*|[0-5]?\d|\*\/\d+) (\*|1?\d|2[0-3]|\*\/\d+) (\*|[12]?\d|3[01]|\*\/\d+) (\*|1?\d|12|\*\/\d+) (\*|[0-6]|\*\/\d+)$/;
  return cronRegex.test(expr);
};
