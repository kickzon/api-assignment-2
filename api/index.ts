import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import connectDB from '../src/db'
import userRoutes from '../src/routes/users'
import authRoutes from '../src/routes/auth'
import greetingRoutes from '../src/routes/greetings'
import bookRoutes from '../src/routes/book'
import reviewRoutes from '../src/routes/reviews'

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // This makes the Express server accept requests from other domains
    credentials: true, // Allows cookies sent to this API
  }),
)

app.use(express.static(path.join(process.cwd(), 'public')))

// Säkerställ en databasanslutning innan ett API-anrop hanteras.
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Routes
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/greetings', greetingRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/reviews', reviewRoutes)

// Starta en vanlig server lokalt. På Vercel hanteras servern av plattformen.
if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT) || 3000

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
  })
}

// Vercel använder Express-appen som en serverless-funktion.
export default app
