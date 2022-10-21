import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { userRouteur } from './routes/user.js';
import { create as createMongoModule } from '../db/mongo/mongo.js';
import { create as createMongoCrud } from '../db/mongo/crud.js';
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const port = process.env.PORT;

async function runServer() {

    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "User API",
                version: "1.0.0",
                description: "A simple Express user API for managing users",
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                },
            ],
        },
        apis: ["./routes/*.js"],
    };
    
    const specs = swaggerJsDoc(options);

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    const dbCtxt = await createMongoModule().getDbCtxt();
    const mongoDbCrud = createMongoCrud(dbCtxt);
    app.use("/user", userRouteur(mongoDbCrud).router);
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

runServer();