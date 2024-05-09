import React, { useState } from 'react';
import TransactionApi from '../services/transactionApi';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, MenuItem, Box, Button, Divider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

enum TransactionCategory {
    Empty = "",
    Entertainment = "Entertainment",
    Groceries = "Groceries",
    Bills = "Bills",
    Transportation = "Transportation",
    Utilities = "Utilities",
    Food = "Food",
    Health = "Health",
    Clothing = "Clothing",
    Travel = "Travel",
    Miscellaneous = "Miscellaneous"
}

const TransactionForm: React.FC<{ onSuccess: () => Promise<void>; }> = ({ onSuccess }) => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [formData, setFormData] = useState({
        category: TransactionCategory.Empty,
        name: '',
        desc: '',
        price: 0
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            category: value as TransactionCategory
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const transactionApi = new TransactionApi();
        try {
            await transactionApi.addTransaction(userId!, formData.category, formData.price, formData.name, formData.desc);
            setFormData({
                category: TransactionCategory.Empty,
                name: '',
                desc: '',
                price: 0
            });
            setSnackbarMessage('Transaction added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            onSuccess();
            navigate(`/dashboard/${userId}`);
        } catch (error) {
            console.error('Error adding transaction:', error);
            setSnackbarMessage('Failed to add transaction');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '15px',
                    gap: '1rem',
                    maxHeight: '1080px',
                }}
            >
                <TextField
                    label="Category"
                    id="category"
                    name="category"
                    select
                    margin-top="dense"
                    value={formData.category}
                    onChange={handleCategoryChange}
                >
                    {Object.values(TransactionCategory).map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                </TextField>
        
                <TextField
                    label="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
        
                <TextField
                    label="Description"
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                />
        
                <TextField
                    label="Amount"
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" variant="contained" sx={{width: '50%'}}>Add transaction</Button>
                </Box>
                <Divider />
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
}    

export default TransactionForm;
