export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/components/server/lib/prisma';


export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Один SQL запит для оновлення всіх користувачів за один раз
    const result = await prisma.$executeRaw`
      UPDATE "User" u
      SET "medalId" = (
        SELECT a.id 
        FROM "UserDateTimeAchivement" a
        WHERE EXTRACT(DAY FROM (NOW() - u."createdAt")) >= a."medalDayCount"
        ORDER BY a."medalDayCount" DESC
        LIMIT 1
      )
      WHERE EXISTS (
        SELECT 1 
        FROM "UserDateTimeAchivement" a
        WHERE EXTRACT(DAY FROM (NOW() - u."createdAt")) >= a."medalDayCount"
        AND (u."medalId" IS NULL OR u."medalId" != a.id)
      );
    `;

    return NextResponse.json({ success: true, updated: result });
  } catch (error) {
    console.error('SQL Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
