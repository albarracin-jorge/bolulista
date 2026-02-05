import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    return Response.json({ status: 'ok'});
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        db: 'disconnected',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    );
  }
}