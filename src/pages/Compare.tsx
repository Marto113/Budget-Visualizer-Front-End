import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TransactionApi, { Transaction, TransactionData } from '../services/transactionApi';
import { Paper, Typography } from '@mui/material';
import CompareLineChart from '../components/CompareLineChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DataItem } from '../components/CompareLineChart';

const ComparisonPage: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [selectedMonth1, setSelectedMonth1] = useState<number>(2);
    const [selectedMonth2, setSelectedMonth2] = useState<number>(3);
    const [data1, setData1] = useState<Transaction[]>([]);
    const [data2, setData2] = useState<Transaction[]>([]);

    const handleDateChange1 = (date: Dayjs | null) => {
        if (date) {
            setSelectedMonth1(date.month() + 1);
        }
    };

    const handleDateChange2 = (date: Dayjs | null) => {
        if (date) {
            setSelectedMonth2(date.month() + 1);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const transactionApi = new TransactionApi();

            try {
                const transactions1 = await transactionApi.getTransactionsForMonth(selectedMonth1, userId!);
                const transactions2 = await transactionApi.getTransactionsForMonth(selectedMonth2, userId!);
                console.log(transactions1);
                console.log(transactions2);
                setData1(transactions1 || []);
                setData2(transactions2 || []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId, selectedMonth1, selectedMonth2]);

    const chartData1: DataItem[] = data1.reduce((accumulator: DataItem[], transaction: any) => {
        const day = transaction.date;
        const existingIndex = accumulator.findIndex((item: any) => item.date === day);
        if (existingIndex !== -1) {
            accumulator[existingIndex].price += transaction.price;
        } else {
            accumulator.push({ date: day, price: transaction.price });
        }
        return accumulator;
    }, []);
    
    const chartData2: DataItem[] = data2.reduce((accumulator: DataItem[], transaction: any) => {
        const day = transaction.date;
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
            <div style={{ marginBottom: '5px'}}>
                {/* MenuAppBar */}
            </div>
            <Paper elevation={1} style={{ padding: '10px', width: '85%', maxWidth: '1920px', marginLeft: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' , marginBottom: '10px'}}>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div style={{ display: 'flex', alignItems: 'center'}}>
                                <Typography variant="h6" sx={{ marginRight: '10px' }}>Select Month 1:</Typography>
                                <DatePicker
                                    label={''}
                                    openTo="year"
                                    views={['year', 'month']}
                                    value={selectedMonth1 !== null ? dayjs().month(selectedMonth1 - 1) : null}
                                    onChange={handleDateChange1}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px'}}>
                                <Typography variant="h6" sx={{ marginRight: '10px' }}>Select Month 2:</Typography>
                                <DatePicker
                                    label={''}
                                    openTo="year"
                                    views={['year', 'month']}
                                    value={selectedMonth2 !== null ? dayjs().month(selectedMonth2 - 1) : null}
                                    onChange={handleDateChange2}
                                />
                            </div>
                        </LocalizationProvider>
                    </div>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                    {data1.length > 0 && data2.length > 0 && (
                        <>
                            <CompareLineChart data={chartData1} data2={chartData2} max={100} month1={selectedMonth1 - 1} month2={selectedMonth2 - 1} />
                        </>
                    )}
                </div>
            </Paper>
        </div>
    );
}

export default ComparisonPage;
