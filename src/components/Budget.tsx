import { Box, Button, Card, Divider, Typography, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TransactionApi from "../services/transactionApi";

const Budget: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const [budget, setBudget] = useState<number>(0);
    const [savings, setSavings] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedBudget, setEditedBudget] = useState<number>(0);
    const [editedSavings, setEditedSavings] = useState<number>(0);
    const [editedIncome, setEditedIncome] = useState<number>(0);

    useEffect(() => {
        fetchBalance();
    }, []);

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

    const handleEditButtonClick = () => {
        setEditedBudget(budget);
        setEditedSavings(savings);
        setEditedIncome(income);
        setEditMode(true);
    };

    const handleFormClose = () => {
        setEditMode(false);
    };

    const handleFormSubmit = async () => {
        try {
            if (userId) {
                const transactionApi = new TransactionApi();
                await transactionApi.updateBalance(userId, editedBudget, editedSavings, editedIncome);
                await fetchBalance();
            } else {
                console.error('No user id found');
            }
            setEditMode(false);
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    return (
        <>
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
                        onClick={handleEditButtonClick}
                    >
                        Edit
                    </Button>
                </Box>
            </Card>
            <Dialog open={editMode} onClose={handleFormClose}>
                <DialogTitle>Edit Budget</DialogTitle>
                <DialogContent sx={{ '& > *': { marginBottom: '0.5rem', marginTop: '0.5rem' } }}>                    
                <TextField
                        label="Budget"
                        type="number"
                        fullWidth
                        value={editedBudget}
                        onChange={(e) => setEditedBudget(parseFloat(e.target.value))}
                    />
                    <TextField
                        label="Savings"
                        type="number"
                        fullWidth
                        value={editedSavings}
                        onChange={(e) => setEditedSavings(parseFloat(e.target.value))}
                    />
                    <TextField
                        label="Income"
                        type="number"
                        fullWidth
                        value={editedIncome}
                        onChange={(e) => setEditedIncome(parseFloat(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFormClose} startIcon={<CloseIcon />}>
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Budget;
