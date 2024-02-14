// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Paper, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from '@mui/material';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { JSX } from 'react/jsx-runtime';

// type Transaction = {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   date: string;
// };

// const fetchTransactions = async (month: number, year: number): Promise<Transaction[]> => {
//   const response = await fetch(`/api/transactions?month=${month}&year=${year}`);
//   const data = await response.json();
//   return data;
// };

// const TransactionsPage: React.FC = () => {
//   const [transactions, setTransactions] = useSt  // Replace this with your actual API call
//   ate<Transaction[]>([]);
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
// const [year, setYear] = useState(new Date().getFullYear());
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchTransactions(month, year);
//         setTransactions(data);
//       } catch (error) {
//         console.error('Failed to fetch transactions:', error);
//       }
//     };

//     fetchData();
//   }, [month, year]);

//   const handleLoadAll = async () => {
//     try {
//       const data = await fetchTransactions(month, year);
//       setTransactions(data);
//     } catch (error) {
//       console.error('Failed to fetch all transactions:', error);
//     }
//   };

//   const handleMonthChange = (date: Date | null) => {
//     if (date) {
//       setMonth(date.getMonth() + 1);
//     }
//   };

//   const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setYear(parseInt(event.target.value));
//   };

//   return (
//     <div>
//       <LocalizationProvider>
//         <DatePicker
//           label="Month"
//           value={month}
//           onChange={handleMonthChange}
//           renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />}
//         />
//       </LocalizationProvider>
//       <TextField label="Year" value={year} onChange={handleYearChange} />
//       <Button onClick={handleLoadAll}>Load All Transactions</Button>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Date</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {transactions.map((transaction) => (
//               <TableRow key={transaction.id}>
//                 <TableCell>{transaction.name}</TableCell>
//                 <TableCell>{transaction.category}</TableCell>
//                 <TableCell>{transaction.price}</TableCell>
//                 <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default TransactionsPage;
export {};