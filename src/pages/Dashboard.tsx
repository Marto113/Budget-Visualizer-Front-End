import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TransactionApi, { Transaction } from '../services/transactionApi';
import { Button } from '@mui/material';
import CustomPieChart from '../components/PieChart';
import CustomLineChart from '../components/LineChart';
import CustomBarChart from '../components/BarChart';

const Dashboard: React.FC = () => {
	const { id } = useParams<{ id: string | undefined }>();
	const userId = id ? parseInt(id, 10) : undefined;
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [chartType, setChartType] = useState<'line' | 'bar' | 'circular'>('line');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const transactionApi = new TransactionApi();
				const response = await transactionApi.getTransactions(1);
				if (response?.transactions) {
					const formattedTransactions = response.transactions.map((transaction: any) => ({
						id: transaction.id,
						price: transaction.price,
						date: new Date(transaction.date),
						category: transaction.category,
						name: transaction.name ?? "",
						description: transaction.description ?? ""
					}));
					setTransactions(formattedTransactions);
				} else {
					console.error('Error: Response or transactions array is missing');
				}
			} catch (error) {
				console.error('Error fetching transactions:', error);
			}
		};

		fetchData();
	}, [userId]);

	const getCurrentMonthTransactions = () => {
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();

		return transactions.filter((transaction) => {
			const transactionDate = transaction.date as unknown as Date;
			return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
		});
	};

	const chartData = getCurrentMonthTransactions().reduce((accumulator: any, transaction: any) => {
		const day = transaction.date.getDate();
		const existingIndex = accumulator.findIndex((item: any) => item.date === day);
		if (existingIndex !== -1) {
			accumulator[existingIndex].price += transaction.price;
		} else {
			accumulator.push({ date: day, price: transaction.price });
		}
		return accumulator;
	}, []);

	return (
		<div>
			<h2>Dashboard</h2>

			<div>
				<Button
					variant={chartType === 'line' ? "contained" : "outlined"}
					onClick={() => setChartType('line')}
					sx={{ ml: 1, mr: 1 }}
				>
					Line
				</Button>

				<Button
					variant={chartType === 'bar' ? "contained" : "outlined"}
					onClick={() => setChartType('bar')}
					sx={{ ml: 1, mr: 1 }}
				>
					Bar
				</Button>

				<Button
					variant={chartType === 'circular' ? "contained" : "outlined"}
					onClick={() => setChartType('circular')}
					sx={{ ml: 1, mr: 1 }}
				>
					Circular
				</Button>
			</div>

			{transactions.length > 0 && (
				<>
					{chartType === 'bar' && (
						<CustomBarChart data={chartData} />
					)}
					{chartType === 'line' && (
						<CustomLineChart data={chartData} />
					)}

					{chartType === 'circular' && (
						<CustomPieChart />
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;