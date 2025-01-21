import { clerkMiddleware } from '@clerk/nextjs/server'
import { jseqlClerkMiddleware } from '@cipherstash/nextjs/clerk'

export default clerkMiddleware(async (auth, req) => {
  return jseqlClerkMiddleware(auth, req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
