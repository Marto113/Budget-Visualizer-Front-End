import * as React from 'react';
import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { TextField } from '@mui/material';

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
      <p>
        Selected Date: {selectedDate ? selectedDate.format('YYYY-MM-DD') : 'None'}
      </p>
      <p>Selected Year: {selectedYear !== null ? selectedYear : 'None'}</p>
    </LocalizationProvider>
  );
}
