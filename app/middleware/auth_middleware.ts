import type { HttpContext } from "@adonisjs/core/http"
import type { NextFn } from "@adonisjs/core/types/http"
import type { Authenticators } from "@adonisjs/auth/types"

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = "/login"

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
      optional?: boolean
    } = {},
  ) {
    if (options.optional) {
      // For optional auth, just check if user is authenticated but don't redirect
      try {
        await ctx.auth.check()
      } catch (error) {
        // User is not authenticated, but that's okay for optional routes
      }
    } else {
      // For required auth, redirect if not authenticated
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    }
    return next()
  }
}
