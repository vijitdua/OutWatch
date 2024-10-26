import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Service from "./serviceModel.js";

const ServiceUptime = sequelize.define('ServiceUptime', {
    serviceId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Service,
            key: 'serviceId',
        },
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

ServiceUptime.belongsTo(Service, { foreignKey: 'serviceId' });

ServiceUptime.sync();

export default ServiceUptime;
