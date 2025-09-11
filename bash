# in backend/
cp .env.example .env
npm i
npm run prisma:generate
npm run db:init   # sets up SQLite and seeds services
npm run dev       # starts API at http://localhost:8080
