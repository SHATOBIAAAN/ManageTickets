import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import Ticket from '../models/ticket'

class TicketController {
    async createTicket(req: Request, res: Response) {
        const { topic, message } = req.body
        try {
            const ticket = await Ticket.create({ topic, message })
            return res.status(201).json(ticket)
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при создании обращения' })
        }
    }

    async takeTicket(req: Request, res: Response) {
        const { id } = req.params
        try {
            const ticket = await Ticket.findByPk(id)
            if (!ticket)
                return res.status(404).json({ error: 'Обращение не найдено' })

            ticket.status = 'in_progress'
            await ticket.save()
            return res.json(ticket)
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при взятии обращения в работу' })
        }
    }

    async completeTicket(req: Request, res: Response) {
        const { id } = req.params
        const { resolution } = req.body
        try {
            const ticket = await Ticket.findByPk(id)
            if (!ticket)
                return res.status(404).json({ error: 'Обращение не найдено' })
            if (ticket.status !== 'in_progress')
                return res
                    .status(400)
                    .json({ error: 'Обращение не в статусе "В работе"' })

            ticket.status = 'completed'
            ticket.resolution = resolution
            await ticket.save()
            return res.json(ticket)
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при завершении обращения' })
        }
    }

    async cancelTicket(req: Request, res: Response) {
        const { id } = req.params
        const { cancellationReason } = req.body
        try {
            const ticket = await Ticket.findByPk(id)
            if (!ticket)
                return res.status(404).json({ error: 'Обращение не найдено' })

            ticket.status = 'cancelled'
            ticket.cancellationReason = cancellationReason
            await ticket.save()
            return res.status(204).send()
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при отмене обращения' })
        }
    }

    async getTickets(req: Request, res: Response) {
        const { startDate, endDate } = req.query
        try {
            const where: WhereOptions = {}

            if (startDate && endDate) {
                where.createdAt = {
                    [Op.between]: [
                        new Date(startDate as string),
                        new Date(endDate as string),
                    ],
                }
            } else if (startDate) {
                where.createdAt = { [Op.gte]: new Date(startDate as string) }
            } else if (endDate) {
                where.createdAt = { [Op.lte]: new Date(endDate as string) }
            }

            const tickets = await Ticket.findAll({ where })
            return res.json(tickets)
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при получении списка обращений' })
        }
    }

    async cancelAllInProgress(req: Request, res: Response) {
        try {
            const [updatedRowsCount] = await Ticket.update(
                { status: 'cancelled', cancellationReason: 'Массовая отмена' },
                { where: { status: 'in_progress' } },
            )
            return res.json({
                message: 'Все обращения в работе успешно отменены',
                updated: updatedRowsCount,
            })
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при отмене обращений в работе' })
        }
    }

    async deleteTicket(req: Request, res: Response) {
        const { id } = req.params
        try {
            const ticket = await Ticket.findByPk(id)
            if (!ticket)
                return res.status(404).json({ error: 'Обращение не найдено' })
            await ticket.destroy()
            return res.json({ message: 'Обращение успешно удалено' })
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при удалении обращения' })
        }
    }

    async getTicketById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const ticket = await Ticket.findByPk(id)
            if (!ticket) {
                return res.status(404).json({ error: 'Обращение не найдено' })
            }
            return res.json(ticket)
        } catch (error) {
            console.error(error)
            return res
                .status(500)
                .json({ error: 'Ошибка при получении обращения' })
        }
    }
}

export default new TicketController()
