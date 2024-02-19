import React, { useState } from 'react';
import TransactionApi from '../services/transactionApi';
import { useParams } from 'react-router-dom';
import { TextField, MenuItem, Box, Button, Divider } from '@mui/material';

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

const TransactionForm: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [formData, setFormData] = useState({
        category: TransactionCategory.Empty,
        name: '',
        price: 0
    });

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const transactionApi = new TransactionApi();
        try {
            await transactionApi.addTransaction(userId!, formData.category, formData.price, formData.name);
            setFormData({
                category: TransactionCategory.Empty,
                name: '',
                price: 0
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: '15px',
                gap: '1rem',
                maxHeight: '1080px',
                '& .MuiTextField-root': { width: '100%' },
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
                label="Amount"
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
            />
            <Button type="submit" variant="contained">Add transaction</Button>
            <Divider />
        </Box>
    );
};

export default TransactionForm;
