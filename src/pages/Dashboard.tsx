import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TransactionApi, { Transaction, TransactionData } from '../services/transactionApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CustomPieChart from '../components/PieChart';
import CustomLineChart from '../components/LineChart';
import CustomBarChart from '../components/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { Dayjs } from 'dayjs';
import TransactionForm from '../components/TransactionForm';

const Dashboard: React.FC = () => {
	const { id } = useParams<{ id: string | undefined }>();
	const userId = id ? parseInt(id, 10) : undefined;
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [transactionsCategory, setTransactionsCategory] = useState<TransactionData[]>([]);
  	const [chartType, setChartType] = useState<'line' | 'bar' | 'circular'>('bar');
	const [budget, setBudget] = useState<number>(100);
    const [savings, setSavings] = useState<number>(100);
    const [income, setIncome] = useState<number>(100);
	const [selectedYear, setSelectedYear] =  useState<number>(2024);
	const [selectedMonth, setSelectedMonth] = useState<number>(2);
	const [isFormOpen, setIsFormOpen] = useState(false);

	const handleDateChange = (date: Dayjs | null) => {
		if (date) {
			setSelectedYear(date.year());
			setSelectedMonth(date.month() + 1);
		} else {
			setSelectedYear(1);
			setSelectedMonth(1);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const transactionApi = new TransactionApi();

			if(selectedMonth == null) {
				const currentDate = new Date();
				setSelectedMonth(currentDate.getMonth() + 1);
			}

			try {
				const transaction = await transactionApi.getTransactionsForMonth(selectedMonth, userId!);
				if (transaction !== undefined) {
					setTransactions(transaction);
				} else {
					console.error('Transactions data is undefined');
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

		const fetchCategory = async () => {
			const transactionApi = new TransactionApi();

			try {
				const categoryData = await transactionApi.getTransactionsCategory(selectedMonth, userId);
				if(categoryData !== undefined) {
					setTransactionsCategory(categoryData);
				} else {
					console.error('Category data undefined');
				}
			} catch (error) {
				console.error('Error fetching transactions', error);
			}
		}

		if(userId){
			fetchData();
			fetchBalance();
			fetchCategory();
		}
	}, [userId, selectedMonth, selectedYear]);

	const chartData = transactions.reduce((accumulator: any, transaction: any) => {
		const day = transaction.date;
		const existingIndex = accumulator.findIndex((item: any) => item.date === day);
		if (existingIndex !== -1) {
			accumulator[existingIndex].price += transaction.price;
		} else {
			accumulator.push({ date: day, price: transaction.price });
		}
		return accumulator;
	}, []);

	const openForm = () => {
        setIsFormOpen(true);
    };

	const closeForm = () => {
        setIsFormOpen(false);
    };

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
			<Button 
				onClick={openForm}
			>
				Add transaction
			</Button>
			<Dialog open={isFormOpen} onClose={closeForm}>
                <DialogTitle>
                    <span style={{ flexGrow: 1 }}>Add Transaction</span>
                    <IconButton onClick={closeForm} aria-label="close" size="large">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TransactionForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm}>Cancel</Button>
                </DialogActions>
            </Dialog>
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
			</LocalizationProvider>

			{transactions.length > 0 && (
				<>
					{chartType === 'bar' && (
						<CustomBarChart data={chartData} month={selectedMonth - 1} year={selectedYear}/>
					)}
					{chartType === 'line' && (
						<CustomLineChart data={chartData} max={budget}/>
					)}
				</>
			)}

			{transactionsCategory.length > 0 && (
				<>
					{chartType === 'circular' && (
						<CustomPieChart data={transactionsCategory} />
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;