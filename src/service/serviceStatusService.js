import axios from 'axios';
import Service from '../models/serviceModel.js';
import ServiceUptime from '../models/serviceUptimeModel.js';
import { Sequelize } from 'sequelize';
import { sendStatusBackOnlineMessage, sendStatusOfflineMessage } from './discordMessageService.js';

export async function checkServiceStatus(service) {
    try {
        await axios.get(service.url);

        if (service.status !== 'up') {
            // Service just came back up
            await Service.update(
                { status: 'up', lastChecked: new Date(), downSince: null },
                { where: { serviceId: service.serviceId } }
            );
            const updatedService = await Service.findByPk(service.serviceId);
            await sendStatusBackOnlineMessage(updatedService);
        }

        return 'up';
    } catch (error) {
        if (service.status !== 'down') {
            // Service just went down
            await Service.update(
                { status: 'down', lastChecked: new Date(), downSince: new Date() },
                { where: { serviceId: service.serviceId } }
            );
            const updatedService = await Service.findByPk(service.serviceId);
            await sendStatusOfflineMessage(updatedService);
        } else {
            // Service is still down
            await Service.update(
                { lastChecked: new Date() },
                { where: { serviceId: service.serviceId } }
            );
        }

        return 'down';
    }
}

export async function trackUptime() {
    const services = await Service.findAll();
    const now = new Date();
    for (const service of services) {
        await checkServiceStatus(service);
        await ServiceUptime.create({ serviceId: service.serviceId, timestamp: now, status: service.status });
    }

    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    await ServiceUptime.destroy({
        where: {
            timestamp: {
                [Sequelize.Op.lt]: cutoffDate,
            },
        },
    });
}
