import type { HttpContext } from "@adonisjs/core/http"
import type { NextFn } from "@adonisjs/core/types/http"

/**
 * Optional Auth middleware checks for authentication but doesn't redirect
 * if user is not authenticated. This is useful for public pages that
 * need to show different content based on auth status.
 */
export default class OptionalAuthMiddleware {
    async handle(ctx: HttpContext, next: NextFn) {
        try {
            // Try to authenticate the user silently
            await ctx.auth.check()
        } catch (error) {
            // User is not authenticated, but that's okay
            // The auth.user will be null and templates can handle this
        }
        return next()
    }
}
