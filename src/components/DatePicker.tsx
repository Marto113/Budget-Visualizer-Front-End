import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export default function DatePickerOpenTo() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        if (date) {
            setSelectedYear(date.year());
        } else {
            setSelectedYear(null);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label="Select Date"
                    openTo="year"
                    views={['year', 'month']}
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
