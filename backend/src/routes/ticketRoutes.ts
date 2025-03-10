import express, { Request, Response } from 'express'
import TicketController from '../controllers/ticketController'

const router = express.Router()

router.post('/tickets', async (req: Request, res: Response) => {
    try {
        await TicketController.createTicket(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при создании обращения' })
    }
})

router.put('/tickets/:id/take', async (req: Request, res: Response) => {
    try {
        await TicketController.takeTicket(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при взятии обращения в работу' })
    }
})

router.put('/tickets/:id/complete', async (req: Request, res: Response) => {
    try {
        await TicketController.completeTicket(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при завершении обращения' })
    }
})

router.put('/tickets/:id/cancel', async (req: Request, res: Response) => {
    try {
        await TicketController.cancelTicket(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при отмене обращения' })
    }
})

router.get('/tickets', async (req: Request, res: Response) => {
    try {
        await TicketController.getTickets(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при получении списка обращений' })
    }
})

router.post(
    '/tickets/cancel-all-in-progress',
    async (req: Request, res: Response) => {
        try {
            await TicketController.cancelAllInProgress(req, res)
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: 'Ошибка при отмене всех обращений в работе',
            })
        }
    },
)
router.delete('/tickets/:id', async (req: Request, res: Response) => {
    try {
        await TicketController.deleteTicket(req, res)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Ошибка при удалении обращения' })
    }
})

router.get('/tickets/:id', async (req: Request, res: Response) => {
    try {
        await TicketController.getTicketById(req, res)
    } catch (error) {
        console.error(error)      
        res.status(500).json({ error: 'Ошибка при получении обращения' })
    }
})

export default router
