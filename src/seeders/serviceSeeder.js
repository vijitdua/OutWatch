import Service from '../models/serviceModel.js';

export async function seedServices() {
    const services = [
        {
            serviceName: 'vijitdua.com',
            type: 'Frontend',
            url: 'https://vijitdua.com',
            status: 'up',
            lastChecked: new Date(),
            private: false
        },
        {
            serviceName: 'Is My Wifi On.com',
            type: 'Frontend',
            url: 'https://ismywifion.com',
            status: 'up',
            lastChecked: new Date(),
            private: false
        },
        {
            serviceName: 'launchdavis.com',
            type: 'Frontend',
            url: 'https://launchdavis.com',
            status: 'up',
            lastChecked: new Date(),
            private: false
        },
    ];

    try {
        for (const newService of services) {
            const existingService = await Service.findOne({ where: { url: newService.url } });

            if (existingService) {
                // Update the existing service if there are any changes
                const hasChanges =
                    existingService.serviceName !== newService.serviceName ||
                    existingService.type !== newService.type ||
                    existingService.status !== newService.status;

                if (hasChanges) {
                    await existingService.update(newService);
                    console.log(`Service updated: ${newService.serviceName}`);
                } else {
                    console.log(`Service already up-to-date: ${newService.serviceName}`);
                }
            } else {
                // Create a new service if it doesn't exist
                await Service.create(newService);
                console.log(`New service added: ${newService.serviceName}`);
            }
        }
        console.log('Service seeding completed successfully.');
    } catch (error) {
        console.error('Failed to seed services:', error);
    }
}
