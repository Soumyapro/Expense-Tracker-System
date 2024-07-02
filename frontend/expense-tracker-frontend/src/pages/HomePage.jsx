import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expensesPerPage] = useState(5);
    const [error, setError] = useState(null);
    const tableProps = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }
                const response = await axios.get('http://localhost:8080/api/get-details', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setExpenses(response.data.data);
                setFilteredExpenses(response.data.data);
            } catch (err) {
                console.error('Error fetching expenses:', err);
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/LoginPage');
                }
            }
        };

        fetchExpenses();
    }, [navigate]);

    useEffect(() => {
        const filtered = expenses.filter(expense =>
            expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.amount.toString().includes(searchQuery) ||
            new Date(expense.date).toLocaleDateString().includes(searchQuery) ||
            expense.description.toLowerCase().includes(searchQuery)
        );
        setFilteredExpenses(filtered);
        setCurrentPage(1);
    }, [searchQuery, expenses]);

    const handleAddExpense = () => {
        navigate('/FormPage');
    };

    const handleUpdateExpense = (expenseId) => {
        navigate(`/Update/${expenseId}`);
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            await axios.delete(`http://localhost:8080/api/delete-details/${expenseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedExpenses = expenses.filter(expense => expense._id !== expenseId);
            setExpenses(updatedExpenses);
            setFilteredExpenses(updatedExpenses);
        } catch (err) {
            console.error('Error deleting expense:', err);
            setError('Failed to delete expense. Please try again later.');
        }
    };

    const indexOfLastExpense = currentPage * expensesPerPage;
    const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
    const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

    const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-blue-600 p-4">
            <animated.div style={tableProps} className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center">Expense Tracker</h2>
                {error && <p className="text-red-500 mb-5 text-center">{error}</p>}
                <div className="flex flex-col md:flex-row justify-between mb-5 space-y-4 md:space-y-0">
                    <button
                        onClick={handleAddExpense}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Expense
                    </button>
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
                    />
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/LoginPage');
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleUpdateExpense(expense._id)}
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteExpense(expense._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </animated.div>
        </div>
    );
};

export default HomePage;
