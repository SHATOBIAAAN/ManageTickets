import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

class Ticket extends Model {
    public id!: number
    public topic!: string
    public message!: string
    public status!: 'new' | 'in_progress' | 'completed' | 'cancelled'
    public resolution?: string
    public cancellationReason?: string
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

Ticket.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                'new',
                'in_progress',
                'completed',
                'cancelled',
            ),
            defaultValue: 'new',
        },
        resolution: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        cancellationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'ticket',
    },
)

export default Ticket
