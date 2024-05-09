import React, { useState, useEffect, useRef } from 'react';
import TransactionApi, { Transaction } from '../services/transactionApi';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Button, Grid } from '@mui/material';

const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const monthAbbreviation = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const day = date.getDate();
    
    const formattedDate = `${monthAbbreviation} ${day}`;
    
    return formattedDate;
};

export default function TransactionHistoryAll() {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleTransactions, setVisibleTransactions] = useState<Transaction[]>([]);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const transactionApi = new TransactionApi();
            try {
                const response = await transactionApi.getTransactions(userId);
                setTransactions(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        if (transactions.length > 0) {
            setVisibleTransactions(transactions.slice(0, 3));
        }
    }, [transactions]);

    const handleDelete = async (transactionId: number) => {
        try {
            const transactionApi = new TransactionApi();
            await transactionApi.deleteTransaction(transactionId);
            window.location.reload();
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
        setVisibleTransactions(transactions);
        setShowAllTransactions(true);
        navigate(`/transactions/${userId}`);
    };

    return (
        <div ref={containerRef}>
            {visibleTransactions.map(transaction => (
                <Card key={transaction.id} variant="outlined" sx={{ maxWidth: '100%', margin: '15px', position: 'relative' }}>
                    <Box sx={{ p: 1.5 }}>
                        <Typography variant="h6" component="div" sx={{ marginBottom: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                {transaction.category}
                            </div>
                            <div>
                                <IconButton onClick={() => handleDelete(transaction.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Typography>
                        <Divider />
                        {renderName(transaction.name)}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 1 }}>
                            <Typography variant="h6" component="div">
                                {transaction.price} lv
                            </Typography>
                            <Typography variant="h6" component="div">
                                {formatDate(transaction.date)}
                            </Typography>
                        </Stack>
                    </Box>
                </Card>
            ))}
            {transactions.length > 3 && !showAllTransactions && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button type="submit" variant="contained" onClick={handleViewMore} sx={{ width: '50%' }}>
                        View More
                    </Button>
                </Box>
            
            )}
        </div>
    );
}