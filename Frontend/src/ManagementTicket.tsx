import React, { useState, useEffect } from 'react'
import styles from './style/ManagementTicket.module.css'

interface ManagementTicketProps {
    onRefresh: () => void
}

const API_BASE_URL = 'http://localhost:3000/api/tickets'

const ACTIONS_BY_STATUS: {
    [key: string]: { value: string; label: string; disabled?: boolean }[]
} = {
    new: [
        { value: 'take', label: 'Взять в работу' },
        { value: 'cancel', label: 'Отменить' },
    ],
    in_progress: [
        { value: '', label: 'Выберите' },
        { value: 'complete', label: 'Завершить' },
        { value: 'cancel', label: 'Отменить' },
    ],
    completed: [
        {
            value: 'take',
            label: 'Обращение завершено или отменено',
            disabled: true,
        },
    ],
    cancelled: [
        {
            value: 'take',
            label: 'Обращение завершено или отменено',
            disabled: true,
        },
    ],
}

const ManagementTicket: React.FC<ManagementTicketProps> = ({ onRefresh }) => {
    const [ticketId, setTicketId] = useState<string>('')
    const [action, setAction] = useState<string>('take')
    const [resolution, setResolution] = useState<string>('')
    const [ticketStatus, setTicketStatus] = useState<string>('')
    const [ticketOptions, setTicketOptions] = useState<number[]>([])

    const fetchTicketStatus = async (id: number) => {
        if (!id) return
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`)
            if (response.ok) {
                const ticket = await response.json()
                setTicketStatus(ticket.status)
            } else {
                setTicketStatus('')
                console.error(
                    'Ошибка при получении статуса обращения:',
                    response.statusText,
                )
            }
        } catch (error) {
            console.error('Ошибка при получении статуса обращения:', error)
        }
    }

    const fetchTicketOptions = async () => {
        try {
            const response = await fetch(API_BASE_URL)
            if (response.ok) {
                const tickets: { id: number; status: string }[] =
                    await response.json()
                const filteredTickets = tickets
                    .filter(
                        ticket =>
                            ticket.status === 'new' ||
                            ticket.status === 'in_progress',
                    )
                    .map(ticket => ticket.id)
                setTicketOptions(filteredTickets)
            }
        } catch (error) {
            console.error('Ошибка при получении списка обращений:', error)
        }
    }

    useEffect(() => {
        const numericId = parseInt(ticketId, 10)
        if (ticketId.trim() !== '' && !isNaN(numericId)) {
            fetchTicketStatus(numericId)
        } else {
            setTicketStatus('')
        }
    }, [ticketId])

    useEffect(() => {
        fetchTicketOptions()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            fetchTicketOptions()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const numericTicketId = parseInt(ticketId, 10)
        if (isNaN(numericTicketId)) {
            return
        }
        if (!ticketOptions.includes(numericTicketId)) {
            return
        }
        let url: string = `${API_BASE_URL}/${numericTicketId}`
        const method: string = 'PUT'
        let body: { cancellationReason?: string } = {}
        if (action === 'cancel') {
            url += '/cancel'
            body = { cancellationReason: resolution }
        } else if (action === 'take') {
            url += '/take'
        } else if (action === 'complete') {
            url += '/complete'
            body = { cancellationReason: resolution }
        }
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (response.ok) {
                fetchTicketStatus(numericTicketId)
                onRefresh()
                fetchTicketOptions()
                setTicketId('')
                setResolution('')
                setAction('take')
                setTicketStatus('')
            }
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }

    const filteredTicketOptions = ticketOptions.filter(option =>
        option.toString().includes(ticketId),
    )

    const renderActionOptions = () => {
        const actions = ACTIONS_BY_STATUS[ticketStatus] || []
        return actions.map(({ value, label, disabled }) => (
            <option key={value} value={value} disabled={disabled}>
                {label}
            </option>
        ))
    }

    const isFormComplete =
        ticketId.trim() !== '' &&
        (action === 'take' ||
            ((action === 'cancel' || action === 'complete') &&
                resolution.trim() !== ''))

    return (
        <div className={styles.container}>
            <div className={styles.manageSection}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Управление обращением
                </h2>
                <form
                    id="manageTicketForm"
                    onSubmit={handleSubmit}
                    className={styles.manageForm}
                >
                    <div className={styles.formGroup}>
                        <input
                            type="search"
                            id="ticketId"
                            placeholder="ID обращения"
                            value={ticketId}
                            onChange={e => setTicketId(e.target.value)}
                            required
                            pattern="\d+"
                            className={styles.inputField}
                            list="ticketOptions"
                        />
                        <datalist id="ticketOptions">
                            {filteredTicketOptions.map(id => (
                                <option key={id} value={id} />
                            ))}
                        </datalist>
                    </div>
                    {ticketId.trim() !== '' &&
                        ticketOptions.includes(parseInt(ticketId, 10)) && (
                            <>
                                <div className={styles.formGroup}>
                                    <select
                                        id="action"
                                        value={action}
                                        onChange={e => {
                                            setAction(e.target.value)
                                            if (
                                                e.target.value === 'complete' ||
                                                e.target.value === 'cancel'
                                            ) {
                                                setResolution('')
                                            }
                                        }}
                                        className={styles.selectField}
                                        disabled={
                                            ticketStatus === 'completed' ||
                                            ticketStatus === 'cancelled'
                                        }
                                    >
                                        {renderActionOptions()}
                                    </select>
                                </div>
                                {(action === 'complete' ||
                                    action === 'cancel') && (
                                    <div className={styles.formGroup}>
                                        <input
                                            type="text"
                                            id="resolution"
                                            placeholder="Введите решение"
                                            value={resolution}
                                            onChange={e =>
                                                setResolution(e.target.value)
                                            }
                                            required={action === 'complete'}
                                            className={styles.inputField1}
                                        />
                                    </div>
                                )}
                                {ticketStatus !== 'completed' &&
                                    ticketStatus !== 'cancelled' &&
                                    isFormComplete && (
                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                        >
                                            Выполнить
                                        </button>
                                    )}
                            </>
                        )}
                </form>
            </div>
        </div>
    )
}

export default ManagementTicket
