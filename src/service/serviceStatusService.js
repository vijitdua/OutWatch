import axios from 'axios';
import Service from '../models/serviceModel.js';
import ServiceUptime from '../models/serviceUptimeModel.js';
import {Sequelize} from "sequelize";
import {sendStatusBackOnlineMessage, sendStatusOfflineMessage} from "./discordMessageService.js";

export async function checkServiceStatus(service) {
    try {
        await axios.get(service.url);
        if (service.status === 'down') {
            await sendStatusBackOnlineMessage(service);
        }
        await Service.update({ status: 'up', lastChecked: new Date() }, { where: { serviceId: service.serviceId } });
        return 'up';
    } catch (error) {
        await Service.update({ status: 'down', lastChecked: new Date() }, { where: { serviceId: service.serviceId } });
        await sendStatusOfflineMessage(service);
        return 'down';
    }
}

export async function trackUptime() {
    const services = await Service.findAll();
    const now = new Date();
    for (const service of services) {
        const status = await checkServiceStatus(service);
        await ServiceUptime.create({ serviceId: service.serviceId, timestamp: now, status });
    }

    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    await ServiceUptime.destroy({
        where: {
            timestamp: {
                [Sequelize.Op.lt]: cutoffDate,
            }
        }
    });
}
