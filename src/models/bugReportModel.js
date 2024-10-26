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
        references: {
            model: Service,
            key: 'serviceId',
        },
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

BugReport.belongsTo(Service, { foreignKey: 'serviceId' });

BugReport.sync();

export default BugReport;
