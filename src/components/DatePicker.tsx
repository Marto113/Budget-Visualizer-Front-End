import * as React from 'react';
import { useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export default function DatePickerOpenTo() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedMonth(date.month());
    } else {
      setSelectedMonth(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          label={''}
          openTo="year"
          views={['year', 'month']}
          value={selectedMonth !== null ? dayjs().month(selectedMonth) : null}
          onChange={handleDateChange}
        />
      </DemoContainer>
      <p>Selected Month: {selectedMonth !== null ? selectedMonth : 'None'}</p>
    </LocalizationProvider>
  );
}
