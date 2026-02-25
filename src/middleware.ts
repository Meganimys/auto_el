import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Визначаємо приватні роути
const isProtectedRoute = createRouteMatcher(['/profile(.*)', '/control/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Пропускати внутрішні файли Next.js та статичні файли (картинки і т.д.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Завжди запускати для API роутів
    '/(api|trpc)(.*)',
  ],
};
