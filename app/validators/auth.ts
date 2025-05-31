// app/validators/auth.ts
import vine from '@vinejs/vine' //

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(255).nullable(),
    email: vine.string().email().trim().maxLength(254).unique(async (db, value) => {
      const User = (await import('#models/user')).default //
      const user = await db.from(User.table).where('email', value).first() // Mengecek apakah email sudah ada
      return !user
    }),
    password: vine.string().minLength(8), // Password minimal 8 karakter
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string(),
  })
)