import React, { useState, useEffect, useRef } from 'react';
import TransactionApi, { Transaction } from '../services/transactionApi';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Button, Grid } from '@mui/material';

interface TransactionHistoryProps {
    selectedDate: number;
    showViewMoreButton: boolean;
}

const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const day = date.getDate();
    
    const formattedDate = `${monthAbbreviation} ${day}`;
    
    return formattedDate;
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ selectedDate, showViewMoreButton }) => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const transactionApi = new TransactionApi();
            try {
                const response = await transactionApi.getTransactionsForMonth(selectedDate, userId);
                setTransactions(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedDate, userId]);

    const handleDelete = async (transactionId: number) => {
        try {
            const transactionApi = new TransactionApi();
            await transactionApi.deleteTransaction(transactionId);
            setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const renderName = (name?: string) => {
        if (name && name !== 'N/A') {
            return (
                <Typography gutterBottom variant="h6" component="div" style={{ marginTop: '5px' }}>
                    {name}
                </Typography>
            );
        }
        return null;
    };

    const handleViewMore = () => {
        setShowAllTransactions(true);
        navigate(`/transactions/${userId}`);
    };

    const groupTransactionsByDate = (transactions: Transaction[]) => {
        const groups: { [key: string]: Transaction[] } = {};
        transactions.forEach(transaction => {
            const date = new Date(transaction.date).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(transaction);
        });
        return groups;
    };

    const transactionGroups = groupTransactionsByDate(transactions);

    return (
        <div ref={containerRef}>
            {Object.entries(transactionGroups).map(([date, transactions]) => (
                <div key={date}>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', marginTop: '1rem',  margin: '15px' }}>
                        {formatDate(date)}
                    </Typography>
                    {transactions.map(transaction => (
                        <Card key={transaction.id} variant="outlined" sx={{ maxWidth: '100%', margin: '15px', position: 'relative' }}>
                            <Box sx={{ p: 1.5 }}>
                                <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
                                    {transaction.category}
                                </Typography>
                                <Divider />
                                {renderName(transaction.name)}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {transaction.price} lv
                                    </Typography>
                                    <div>
                                        <IconButton onClick={() => handleDelete(transaction.id)} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </Stack>
                            </Box>
                        </Card>
                    ))}
                </div>
            ))}
            {showViewMoreButton && transactions.length > 2 && !showAllTransactions && (
                <Button type="submit" variant="contained" onClick={handleViewMore} sx={{ marginLeft: '15px', width: '90%', }}>
                    View More
                </Button>
            )}
        </div>
    );
}

export default TransactionHistory;
