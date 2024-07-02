import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Food", "Transportation", "Medicines", "Doctor Fees", "Shopping", "Other"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    description: {
        type: String,
        required: [true, "Reason is required"]
    }
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;