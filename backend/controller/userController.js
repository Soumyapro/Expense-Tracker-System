import User from "../models/userSchema.js";
import Expense from "../models/expenseDetails.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Some field values are missing" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "user already exists" });
        }
        user = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10)
        });
        await user.save();
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ message: "use has created..", data: token });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not upload user details.." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "some field values are missing.." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user does not exist.." });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not login...." });
    }
};

export const submitDetails = async (req, res) => {
    try {
        const { category, amount, date, description } = req.body;
        const user = req.user.id;
        console.log(user);
        if (!category || !amount || !date || !description) {
            return res.status(400).json({ message: "some field values are missing.." });
        }
        const expense = new Expense({ user, category, amount, date, description });
        await expense.save();
        return res.status(201).json({ message: "expense details have been submited" });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not upload expense details." });
    }
};

export const getDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const userDetail = await Expense.find({ user: userId });
        return res.status(200).json({ message: "These are your expenses list..", data: userDetail });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not fetch expense details.." });
    }
};

export const updateDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.expenseId;
        console.log(userId);
        let site_user = await Expense.findOne({ _id: expenseId, user: userId });
        if (!site_user) {
            return res.status(404).json({ message: "user does not exist.." });
        }
        const { category, amount, date, description } = req.body;
        site_user.category = category;
        site_user.amount = amount;
        site_user.date = date;
        site_user.description = description;
        await site_user.save();
        return res.status(200).json({ message: "details have been submited...", data: site_user });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not update details..." });
    }
};

export const deleteDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.expenseId;
        const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });
        if (!deletedExpense) {
            return res.status(404).json({ message: "could not find the detail" });
        }
        return res.status(200).json({ message: "details have been deleted", data: deletedExpense });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "could not delete the details..." });
    }
};

export const getExpense = async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        const userId = req.user.id;
        const expense = await Expense.findOne({ _id: expenseId, user: userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense found', data: expense });
    } catch (error) {
        console.log("!error");
        return res.status(500).json({ message: "server error" });
    }
};
