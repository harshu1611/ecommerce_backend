import express from 'express';
import { Login, deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { isAdmin } from '../middlewares/auth.js';
const app = express.Router();
// '/user/new' used as prefix in app.ts in app.use()
// function of each api is in controllers 
app.post("/login", Login);
app.post("/new", newUser);
app.get("/all", isAdmin, getAllUsers); //isAdmin is a middleware, which executes before getAllUsers. In isAdmin, we have called next() which automatically calls next function in the chain, i.e, here getAllUsers. If no function is in the chain, next calls next(new Error)
app.get("/:id", getUser);
app.delete("/:id", isAdmin, deleteUser);
export default app;
