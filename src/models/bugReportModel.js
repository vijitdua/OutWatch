import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Service from "./serviceModel.js";

const BugReport = sequelize.define('BugReport', {
    reportId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default BugReport;
