import React, { useState } from 'react'
import TicketForm from './TicketForm'
import TicketList from './TicketList'
import ManagementTicket from './ManagementTicket'
import CancelinWork from './CancelinWork'
const App: React.FC = () => {
    const [refresh, setRefresh] = useState<boolean>(false)

    const handleCreate = () => {
        setRefresh(prev => !prev)
    }

    const handleRefresh = () => {
        setRefresh(prev => !prev)
    }

    return (
        <div className="container">
            <h1>Управление обращениями</h1>
            <TicketForm onCreate={handleCreate} />
            <TicketList refresh={refresh} />
            <ManagementTicket onRefresh={handleRefresh} />
            <CancelinWork onRefresh={handleRefresh} />
        </div>
    )
}

export default App
