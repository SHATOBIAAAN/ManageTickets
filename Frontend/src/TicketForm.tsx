import React, { useState } from 'react'

interface TicketFormProps {
    onCreate: () => void
}

const TicketForm: React.FC<TicketFormProps> = ({ onCreate }) => {
    const [topic, setTopic] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, message }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Ошибка при создании обращения:', errorData.error)
                return
            }

            onCreate()
            setTopic('')
            setMessage('')
        } catch (error) {
            console.error('Ошибка:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="ticket-form">
            <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Тема обращения"
                required
            />
            <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Сообщение"
                required
            ></textarea>
            <button type="submit">Создать</button>
        </form>
    )
}

export default TicketForm
