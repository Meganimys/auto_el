import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Визначаємо приватні роути
const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/control/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Якщо користувач не залогінений і намагається зайти на захищену сторінку
  if (!userId && isProtectedRoute(req)) {
    // Отримуємо URL головної сторінки
    const homeUrl = new URL('/', req.url);
    return NextResponse.redirect(homeUrl);
  }
});

export const config = {
  matcher: [
    // Пропускати внутрішні файли Next.js та статичні файли (картинки і т.д.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Завжди запускати для API роутів
    '/(api|trpc)(.*)',
  ],
};
