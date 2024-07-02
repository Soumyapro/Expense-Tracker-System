import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from './DB/connect.js';
import router from './router/routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const url = process.env.MONGO_URL;
connectDB(url, app);

app.get("/", (req, res) => {
    res.send("Expense Tracker System");
});

app.use("/api", router);