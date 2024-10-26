import Service from '../models/serviceModel.js';

export async function getAllServiceStatus(req, res) {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve service status.' });
    }
}