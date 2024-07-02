import express from "express";
import { deleteDetails, getDetails, getExpense, login, signUp, submitDetails, updateDetails } from "../controller/userController.js";
import auth from "../middleware/auth.js"

const router = express.Router();

router.post("/signin", signUp);
router.post("/login", login);
router.post("/submit-details", auth, submitDetails);
router.get("/get-details", auth, getDetails);
router.put("/update-details/:expenseId", auth, updateDetails);
router.delete("/delete-details/:expenseId", auth, deleteDetails);
router.get("/get-expense/:expenseId", auth, getExpense);

export default router;