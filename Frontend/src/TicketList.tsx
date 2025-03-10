import React, { useEffect, useState, useCallback } from 'react'
import FilterToDate from './FilterToDate'
interface Ticket {
    id: number
    topic: string
    message: string
    status: string
    createdAt: string
    resolution?: string
    cancellationReason?: string
}

interface TicketListProps {
    refresh: boolean
}

const TicketList: React.FC<TicketListProps> = ({ refresh }) => {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [showModaDelteTiket, setModaDelteTiket] = useState(false)
    const [ticketToDelete, setTicketToDelete] = useState<number | null>(null)
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)

    const loadTickets = useCallback(async () => {
        try {
            let url = 'http://localhost:3000/api/tickets?'
            if (startDate) {
                url += `startDate=${startDate}&`
            }
            if (endDate) {
                url += `endDate=${endDate}`
            }

            const response = await fetch(url)
            if (!response.ok) {
                const errorData = await response.json()
                console.error(
                    'Ошибка при получении списка обращений:',
                    errorData.error,
                )
                return
            }
            const data = await response.json()
            setTickets(data)
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }, [startDate, endDate])

    const handleDelete = async (ticketId: number) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/tickets/${ticketId}`,
                {
                    method: 'DELETE',
                },
            )
            if (response.ok) {
                loadTickets()
            }
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }

    const DeleteTicketConfirm = () => {
        if (ticketToDelete !== null) {
            handleDelete(ticketToDelete)
            setModaDelteTiket(false)
            setTicketToDelete(null)
        }
    }
    const DeleteTicketCancel = () => {
        setModaDelteTiket(false)
        setTicketToDelete(null)
    }

    const handleFilter = (start: string | null, end: string | null) => {
        setStartDate(start)
        setEndDate(end)
        loadTickets()
    }

    useEffect(() => {
        loadTickets()
    }, [refresh, loadTickets])

    return (
        <div className="ticket-list">
            <h2>Список обращений</h2>

            <div>
                {tickets.map(ticket => (
                    <div
                        key={ticket.id}
                        className={`ticket ${ticket.status}`}
                        onDoubleClick={() => {
                            setTicketToDelete(ticket.id)
                            setModaDelteTiket(true)
                        }}
                    >
                        <h3>
                            ID {ticket.id} - {ticket.topic}
                        </h3>
                        <p>{ticket.message}</p>
                        <div className="ticket-info">
                            <span className="status-badge">
                                {ticket.status}
                            </span>
                            <p>
                                Дата создания:{' '}
                                {new Date(ticket.createdAt).toLocaleString()}
                            </p>
                            {ticket.resolution && (
                                <p>Решение: {ticket.resolution}</p>
                            )}
                            {ticket.cancellationReason && (
                                <p>
                                    Причина отмены: {ticket.cancellationReason}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <FilterToDate onFilter={handleFilter} />
            </div>
            {showModaDelteTiket && (
                <div className="modal show">
                    <div className="modal-content">
                        <h2 className="modal-title">Подтверждение удаления</h2>
                        <p className="modal-message">
                            Вы уверены, что хотите удалить этот тикет?
                        </p>
                        <div className="modal-buttons">
                            <button onClick={DeleteTicketConfirm}>Да</button>
                            <button onClick={DeleteTicketCancel}>Нет</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TicketList
