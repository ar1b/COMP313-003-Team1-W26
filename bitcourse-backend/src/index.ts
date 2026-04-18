import('apminsight')
    .then(({ default: AgentAPI }) => AgentAPI.config())
    .catch(() => console.log('APM not available in this environment'));

import express from 'express';
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./lib/auth";

const app = express();
const PORT = 8000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL, // React app URL
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
        credentials: true, // allow cookies
    })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);

app.get('/', (req, res) => {
    res.send('Hello, welcome to the Classroom API!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use("/api/subjects", subjectsRouter);
