import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TransactionApi, { CategoryData } from '../services/transactionApi';
import { Paper, Typography, Button, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import CompareLineChart from '../components/CompareLineChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import MenuAppBar from '../components/AppBar';

const ComparisonPage: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const userId = id ? parseInt(id, 10) : 1;
    const [selectedMonth1, setSelectedMonth1] = useState<number | null>(null);
    const [selectedMonth2, setSelectedMonth2] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>('');
    const [year1, setYear1] = useState<number | null>(null);
    const [year2, setYear2] = useState<number | null>(null);
    const [data1, setData1] = useState<CategoryData[]>([]);
    const [data2, setData2] = useState<CategoryData[]>([]);
    const [isFiltersApplied, setIsFiltersApplied] = useState<boolean>(false);

    const handleApplyFilters = async () => {
        setIsFiltersApplied(true);
        if (userId && selectedMonth1 !== null && selectedMonth2 !== null 
            && selectedCategory !== null && year1 !== null && year2 !== null) {
            const transactionApi = new TransactionApi();
            try {  
                const transactions1 = await transactionApi.getCategories(selectedMonth1, year1, selectedCategory, userId);
                const transactions2 = await transactionApi.getCategories(selectedMonth2, year2, selectedCategory, userId);
                setData1(transactions1);
                setData2(transactions2);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ marginBottom: '5px'}}>
                <MenuAppBar userId={userId !== undefined ? userId : null} />
			</div>
            <Paper elevation={1} style={{ padding: '10px', width: '100%', maxWidth: '1920px', marginLeft: '0', flex: '1', overflow: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , marginBottom: '20px', marginTop: '10px'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ display: 'flex'}}>
                            <DatePicker
                                label={'Month 1'}
                                openTo="year"
                                views={['year', 'month']}
                                value={selectedMonth1 !== null ? dayjs().month(selectedMonth1 - 1) : null}
                                onChange={(date: Dayjs | null) => {
                                    setSelectedMonth1(date!.month() + 1);
                                    setYear1(date!.year());
                                }}
                                sx={{
                                    marginRight: '10px' 
                                }}
                            />
                            <DatePicker
                                label={'Month 2'}
                                openTo="year"
                                views={['year', 'month']}
                                value={selectedMonth2 !== null ? dayjs().month(selectedMonth2 - 1) : null}
                                onChange={(date: Dayjs | null) => {
                                    setSelectedMonth2(date!.month() + 1);
                                    setYear2(date!.year());
                                }}
                                sx={{
                                    marginRight: '10px' 
                                }}
                            />
                            <FormControl sx={{ minWidth: 120, marginRight: '10px' }}>
                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    value={selectedCategory || ''}
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                                    <MenuItem value="Groceries">Groceries</MenuItem>
                                    <MenuItem value="Bills">Bills</MenuItem>
                                    <MenuItem value="Transportation">Transportation</MenuItem>
                                    <MenuItem value="Utilities">Utilities</MenuItem>
                                    <MenuItem value="Food">Food</MenuItem>
                                    <MenuItem value="Health">Health</MenuItem>
                                    <MenuItem value="Clothing">Clothing</MenuItem>
                                    <MenuItem value="Travel">Travel</MenuItem>
                                    <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
                        </div>
                    </LocalizationProvider>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', height: '70%' }}>
                    {isFiltersApplied && selectedMonth1 !== null && selectedMonth2 !== null ? (
                        <CompareLineChart data1={data1} data2={data2} max={100} month1={selectedMonth1 - 1} month2={selectedMonth2 - 1}/>
                    ) : (
                        <Typography variant="body1">Waiting for filters to be applied...</Typography>
                    )}
                </div>
            </Paper>
        </div>
    );
}

export default ComparisonPage;
