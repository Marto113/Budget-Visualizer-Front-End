import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import TransactionApi, { Transaction, TransactionData } from '../services/transactionApi';
import { Box, Button, Card, Divider, Paper, Typography } from '@mui/material';
import CustomPieChart from '../components/PieChart';
import CustomLineChart from '../components/LineChart';
import CustomBarChart from '../components/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import TransactionForm from '../components/TransactionForm';
import MenuAppBar from '../components/AppBar';
import TransactionHistoryAll from '../components/TransactionHistoryAll';
import '../index.css';

const Dashboard: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsCategory, setTransactionsCategory] = useState<TransactionData[]>([]);
    const [chartType, setChartType] = useState<'line' | 'bar' | 'circular'>('bar');
    const [budget, setBudget] = useState<number>(100);
    const [savings, setSavings] = useState<number>(100);
    const [income, setIncome] = useState<number>(100);
    const [selectedYear, setSelectedYear] = useState<number>(dayjs().year()); // Set current year
    const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month() + 1); // Set current month

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedYear(date.year());
            setSelectedMonth(date.month() + 1);
        } else {
            setSelectedYear(2024);
            setSelectedMonth(1);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const transactionApi = new TransactionApi();
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
                if (userId) {
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
                if (categoryData !== undefined) {
                    setTransactionsCategory(categoryData);
                } else {
                    console.error('Category data undefined');
                }
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };

        if (userId) {
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

    const barChartData = transactions.reduce((accumulator: any, transaction: any) => {
        const day = transaction.date;
        const existingIndex = accumulator.findIndex((item: any) => item.date === day);
        if (existingIndex !== -1) {
            accumulator[existingIndex].price += transaction.price;
        } else {
            accumulator.push({ date: day, price: transaction.price, category: transaction.category });
        }
        return accumulator;
    }, []);

    const refreshTransactions = async () => {
        const transactionApi = new TransactionApi();
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

    return (
        <>
            <div className="app-bar" style={{ marginBottom: '5px'}}>
                <MenuAppBar userId={userId !== undefined ? userId : null} />
            </div>
            <div className="main-content" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                <div className="chart-container">
                    <Paper elevation={1}>
                        <div>
                            <div className="chart-wrapper" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                                {transactions.length > 0 && (
                                    <>
                                        {chartType === 'bar' && (
                                            <CustomBarChart data={barChartData} month={selectedMonth - 1} year={selectedYear} />
                                        )}
                                        {chartType === 'line' && (
                                            <CustomLineChart data={chartData} max={budget} month={selectedMonth - 1} />
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
                        </div>
                    </Paper>
                </div>
                <div className="sidebar">
                    <Paper elevation={6} style={{ width: '100%', flexDirection: 'column' }}>
                    <div className="date-picker-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            </div>
                            <div className="chart-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
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
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxHeight: '1080px',
                        }}>
                        <Card variant="outlined" sx={{ maxWidth: '100%', margin: '15px' }}>
                            <Box sx={{ p: 1.5 }}>
                                <Typography variant="h6" component="div" sx={{ maxWidth: '100%', marginBottom: '5px' }}>Budget: {budget} lv</Typography>
                                <Divider />
                                <Typography variant="h6" component="div" sx={{ maxWidth: '100%', marginTop: '5px', marginBottom: '5px' }}>Income: {income} lv</Typography>
                                <Divider />
                                <Typography variant="h6" component="div" sx={{ maxWidth: '100%', marginTop: '5px' }}>Savings: {savings} lv</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        width: '50%',
                                        margin: '15px 0',
                                        marginTop: '0px'
                                    }}
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Card>

                        <Divider />
                    </form>
                    
                    <TransactionForm onSuccess={refreshTransactions} />

                    </Paper>
                    
                </div>
            </div>
            <div className='transaction-history'>
                <Card variant="outlined" sx={{ maxWidth: '100%', margin: '15px' }}>
                    <TransactionHistoryAll />
                </Card>
            </div>
        </>
    );
}

export default Dashboard;
