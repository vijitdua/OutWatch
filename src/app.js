import express from "express";
import {globalRateLimit} from "./middleware/rateLimit.js";
import {env} from "./config/env.js";
import cors from 'cors';
import http from "http";
import bugRoutes from "./routes/bugRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import {seedServices} from "./seeders/serviceSeeder.js";
import {sequelize} from "./config/database.js";
import {setAssociations} from "./config/databaseAssociation.js";
import Service from "./models/serviceModel.js";
import ServiceUptime from "./models/serviceUptimeModel.js";
import BugReport from "./models/bugReportModel.js";
import {startCronJob} from "./scheduler.js";
import {trackUptime} from "./service/serviceStatusService.js";

const app = express();
app.use(globalRateLimit);

const allowedOrigins = env.corsOrigin.split(',');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/bug', bugRoutes);
app.use('/api/status', statusRoutes);


(async () => {
    try {
        await sequelize.authenticate();
        setAssociations(Service, ServiceUptime, BugReport);
        await sequelize.sync({ force: true });

        await seedServices(); // Seed data after syncing

        const server = http.createServer(app);
        server.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
        await trackUptime();
        startCronJob();
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();
