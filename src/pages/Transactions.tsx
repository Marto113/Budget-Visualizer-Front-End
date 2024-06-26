import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TransactionHistory from '../components/TransactionsHistory';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuAppBar from '../components/AppBar';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';

const TransactionsPage: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : undefined;
    const location = useLocation();
    const navigate = useNavigate();

    const initialSelectedDate = dayjs().month() + 1;
    const [selectedDate, setSelectedDate] = useState<number>(initialSelectedDate);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date.month() + 1);
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('selectedDate', (date.month() + 1).toString());
            navigate({ search: queryParams.toString() });
        }
    };

    useEffect(() => {
        const newSelectedDate = parseInt(new URLSearchParams(location.search).get('selectedDate') || initialSelectedDate.toString(), 10);
        setSelectedDate(newSelectedDate);
    }, [location.search]);

    return (
        <div>
            <div style={{ marginBottom: '5px'}}>
                <MenuAppBar userId={userId !== undefined ? userId : null} />
            </div>
            <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper sx={{ padding: '1rem' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={['year', 'month']}
                                    label="Select month"
                                    value={dayjs().month(selectedDate - 1)}
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <TransactionHistory selectedDate={selectedDate} showViewMoreButton={false} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default TransactionsPage;
