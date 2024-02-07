import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, LineChart } from '@mui/x-charts';
import TransactionApi, { Transaction } from '../services/transactionApi';

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const userId = id ? parseInt(id, 10) : undefined;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionApi = new TransactionApi();
        const response = await transactionApi.getTransactions(1);
        if (response?.transactions) {
          const formattedTransactions = response.transactions.map((transaction: any) => ({
            id: transaction.id,
            price: transaction.price,
            date: transformDate(transaction.date),
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


  const chartData = transactions.reduce((accumulator: any, transaction: any) => {
    const existingIndex = accumulator.findIndex((item: any) => item.date === transaction.date);
    if (existingIndex !== -1) {
      accumulator[existingIndex].price += transaction.price;
    } else {
      accumulator.push({ date: transaction.date, price: transaction.price });
    }
    return accumulator;
  }, []);

  const transformDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const formattedDay = day < 10 ? `0${day - 1}` : day;
    return `${formattedDay}`;
  };

  console.log(chartData)

  return (
    <div>
      <h2>Dashboard</h2>
      {id ? <p>ID: {userId}</p> : <p>No ID provided</p>}
      {transactions.length > 0 && (
        <BarChart
          xAxis={[{scaleType: 'band', data: chartData.map((item: any) => item.date)}]}
          series={[
            {
              data: chartData.map((item: any) => item.price),
            },
          ]}
          width={window.innerWidth * 0.7}
          height={window.innerHeight * 0.5}
        />
      )};
    </div>
  );
};

export default Dashboard;