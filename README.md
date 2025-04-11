# PigStar

# Prisma + Neon + Vercel Development Workflow

This project uses **Prisma**, **Neon**, and **Vercel** to manage schema migrations, data, and continuous deployment in a clean and scalable way.

---

## 🛠 Tooling Setup

- **Database**: [Neon](https://neon.tech/) (with `main` for production, `test` for preview/dev)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Hosting**: [Vercel](https://vercel.com/)

Migrations are applied automatically during build via:

```json
"postinstall": "prisma generate && prisma migrate deploy"
```

> **Important**: This project avoids `npx prisma db pull`. The schema is maintained entirely in code.

---

## 🔁 Local Development Flow (on `test` branch)

1. **Modify the Prisma schema**

   - Edit `prisma/schema.prisma` to change models, enums, relations, etc.

2. **Generate a migration (but don’t apply it yet)**

   ```bash
   npx prisma migrate dev --name your_migration_name --create-only
   ```

3. **(Optional) Edit the generated SQL file**

   - Located at `prisma/migrations/<timestamp>_<name>/migration.sql`
   - You can tweak indexes, constraints, or column ordering

4. **Regenerate the Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Start the local dev server**

   ```bash
   npm run dev
   ```

6. **Commit and push to the `test` branch**

   ```bash
   git add .
   git commit -m "feat: add new field to Post model"
   git push origin test
   ```

7. **Verify preview deployment on Vercel**
   - Vercel runs the `postinstall` script
   - Migration is applied to the `test` Neon branch
   - Preview URL is generated for live testing

---

## 🚀 Deploy to Production (merge into `main`)

1. **Merge changes from `test` into `main`**

   ```bash
   git checkout main
   git merge test
   git push origin main
   ```

2. **Vercel production deployment runs**

   - Executes `postinstall`
   - Applies migrations to the `main` Neon branch

3. **Verify production site and Neon `main` schema**

---

## ✅ Best Practices

- ✅ Always run `npx prisma generate` after editing the schema
- ✅ Remove any field usage in code before deleting it from the schema
- ✅ Thoroughly test in the preview deployment before merging to `main`
- ✅ Do not run `npx prisma db pull`
- ✅ Use Neon restore points or `pg_dump` to back up production before major changes

---

## 🧪 Common Commands

| Action                   | Command                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Generate migration only  | `npx prisma migrate dev --name your_migration --create-only` |
| Generate Prisma Client   | `npx prisma generate`                                        |
| Run local dev server     | `npm run dev`                                                |
| Deploy preview (test)    | `git push origin test`                                       |
| Deploy production (main) | `git push origin main`                                       |

---

## 🙌 Summary

This setup keeps local development clean, production stable, and database migrations versioned and automated across environments using a code-first approach.

Everything is designed to avoid surprises and ensure consistent, traceable schema evolution.
