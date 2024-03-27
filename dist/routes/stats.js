import express from 'express';
import { isAdmin } from '../middlewares/auth.js';
import { getBarChart, getDashBoardStats, getLineChart, getPieChart } from '../controllers/stats.js';
const app = express.Router();
app.get("/stats", isAdmin, getDashBoardStats);
app.get("/pie", isAdmin, getPieChart);
app.get("/bar", isAdmin, getBarChart);
app.get("/line", isAdmin, getLineChart);
export default app;
