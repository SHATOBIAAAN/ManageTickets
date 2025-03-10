import express from 'express'
import cors from 'cors'
import ticketRoutes from './routes/ticketRoutes'
import sequelize from './config/database'

const app = express()

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
)

app.use(express.json())
app.use('/api', ticketRoutes)

sequelize.sync().then(() => {
    console.log('Database synced')
})

export default app
