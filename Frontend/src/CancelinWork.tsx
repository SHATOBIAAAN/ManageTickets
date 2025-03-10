import React, { useState } from 'react'
import styles from './style/CancelinWork.module.css'

interface CancelinWorkProps {
    onRefresh: () => void // Функция для обновления родительского компонента
}

const CancelinWork: React.FC<CancelinWorkProps> = ({ onRefresh }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showNotification, setShowNotification] = useState<boolean>(false)

    const handleCancelAll = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(
                'http://localhost:3000/api/tickets/cancel-all-in-progress',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            if (response.ok) {
                onRefresh()
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 3500)
            }
        } catch (err) {
            console.error('Ошибка:', err)
        }
        setIsLoading(false)
    }

    return (
        <div
            style={{
                position: 'relative',
                maxWidth: '400px',
                margin: '20px auto',
                textAlign: 'center',
            }}
        >
            <h1 style={{ marginBottom: '20px' }}>Отмена работы</h1>

            <button
                onClick={handleCancelAll}
                disabled={isLoading}
                className={`${styles.button} ${
                    isLoading ? styles.buttonDisabled : ''
                }`}
            >
                Отменить все работы
            </button>
            {showNotification && (
                <div className={styles.notification}>
                    Все заявки успешно отменены.
                </div>
            )}
        </div>
    )
}

export default CancelinWork
