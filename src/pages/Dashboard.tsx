import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TransactionApi, { Transaction } from '../services/transactionApi';
import { Button } from '@mui/material';
import CustomPieChart from '../components/PieChart';
import CustomLineChart from '../components/LineChart';
import CustomBarChart from '../components/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import BasicDatePicker from '../components/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { SelectAllRounded } from '@mui/icons-material';

const Dashboard: React.FC = () => {
	const { id } = useParams<{ id: string | undefined }>();
	const userId = id ? parseInt(id, 10) : undefined;
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [chartType, setChartType] = useState<'line' | 'bar' | 'circular'>('line');
	const [budget, setBudget] = useState<number | null>(null);
    const [savings, setSavings] = useState<number | null>(null);
    const [income, setIncome] = useState<number | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

	const handleDateChange = (date: Dayjs | null) => {
		if (date) {
			setSelectedMonth(date.month() + 1);
		} else {
			setSelectedMonth(null);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const transactionApi = new TransactionApi();

				if(selectedMonth === null) {
					const currentDate = new Date();
					setSelectedMonth(currentDate.getMonth() + 1);
				}

				console.log(userId, selectedMonth);

				const response = await transactionApi.getTransactionsForMonth(selectedMonth!, userId!);
				if (response?.transactions) {
					const formattedTransactions = response.transactions.map((transaction: any) => ({
						id: transaction.id,
						price: transaction.price,
						date: new Date(transaction.date),
						category: transaction.category,
					}));
					setTransactions(formattedTransactions);
				} else {
					console.error('Error: Response or transactions array is missing');
				}
			} catch (error) {
				console.error('Error fetching transactions:', error);
			}
		};

		const fetchBalance = async () => {
            try {
				if(userId){
					const transactionApi = new TransactionApi();
					const balanceData = await transactionApi.getBalance(userId);
					if (balanceData) {
						setSavings(balanceData[0].savings);
						setIncome(balanceData[0].income);
						setBudget(balanceData[0].budget);
					} else {
						console.error('Error: Balance data is missing');
					}
				} else {
					console.error('No user id found');
				}
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

		if(userId){
			fetchData();
			fetchBalance();
		}
	}, [userId, selectedMonth]);

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
			<div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
                <p><strong>Budget: {budget != null ? `$${budget}` : 'Loading...'}</strong></p>
				<p><strong>Income: {income != null ? `$${income}` : 'Loading...'}</strong></p>
                <p><strong>Savings: {savings != null ? `$${savings}` : 'Loading...'}</strong></p>
                <Button variant="outlined" startIcon={<EditIcon />}>
                    Edit
                </Button>
            </div>
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
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DemoContainer components={['DatePicker']}>
					<DatePicker
					label={''}
					openTo="year"
					views={['year', 'month']}
					value={selectedMonth !== null ? dayjs().month(selectedMonth - 1) : null}
					onChange={handleDateChange}
					/>
				</DemoContainer>
				<p>Selected Month: {selectedMonth !== null ? selectedMonth : 'None'}</p>
			</LocalizationProvider>

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