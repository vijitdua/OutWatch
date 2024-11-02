import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Service = sequelize.define('Service', {
    serviceId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Frontend', 'Backend', 'Database']],
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unknown',
        validate: {
            isIn: [['up', 'down', 'unknown']],
        }
    },
    lastChecked: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    downSince: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    private: { // New Field
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // If true service will be shown on discord but not on public get requests
    },
});

export default Service;
