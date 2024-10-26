import express from "express";
import {globalRateLimit} from "./middleware/rateLimit.js";
import {env} from "./config/env.js";
import cors from 'cors';
import http from "http";
import bugRoutes from "./routes/bugRoutes.js";
import statusRoutes from "./routes/statusRoutes.js";
import {seedServices} from "./seeders/serviceSeeder.js";

const app = express();
app.use(globalRateLimit);

const corsOptions={
    // origin: env.corsOrigin,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/bugs', bugRoutes);
app.use('/api/status', statusRoutes);


(async () => {
    await seedServices();

    // seed then start
    const server = http.createServer(app);
    server.listen(env.port, () => {
        console.log(`Server is running on port ${env.port}`);
    });
})();
