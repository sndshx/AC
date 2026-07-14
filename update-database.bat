@echo off
echo ============================================
echo Database Migration Script
echo ============================================
echo.
echo This will update your database schema.
echo IMPORTANT: Make sure the dev server is STOPPED before running this!
echo.
pause

echo.
echo Step 1: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 2: Pushing schema changes to database...
call npx prisma db push --skip-generate

echo.
echo ============================================
echo Migration Complete!
echo ============================================
echo.
echo You can now restart your dev server with: npm run dev
echo.
pause
