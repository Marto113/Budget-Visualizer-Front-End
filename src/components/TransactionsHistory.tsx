import React, { useState, useEffect, useRef } from 'react';
import TransactionApi, { Transaction } from '../services/transactionApi';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Button, Grid } from '@mui/material';

export default function TransactionHistory() {
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
            setVisibleTransactions(transactions.slice(0, 2));
        }
    }, [transactions]);

    const handleEdit = (transactionId: number) => {
        // Handle edit action
    };

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
        navigate('/another-page');
    };

    return (
        <div ref={containerRef}>
            {visibleTransactions.map(transaction => (
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
                                <IconButton onClick={() => handleEdit(transaction.userId)} aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(transaction.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </Stack>
                        <Grid container justifyContent="flex-end" sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <Typography variant="h6" component="div">
                                {new Date(transaction.date).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    </Box>
                </Card>
            ))}
            {transactions.length > 2 && !showAllTransactions && (
                <Button type="submit" variant="contained" onClick={handleViewMore} sx={{ marginLeft: '15px', width: '90%', }}>
                    View More
                </Button>
            )}
        </div>
    );
}
