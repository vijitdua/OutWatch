import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const ServiceUptime = sequelize.define('ServiceUptime', {
    serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    indexes: [
        {
            fields: ['timestamp'],
        },
    ],
});


export default ServiceUptime;
