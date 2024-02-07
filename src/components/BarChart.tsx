import * as React from 'react';
import { BarChart } from '@mui/x-charts';

interface DataItem {
    price: number;
    date: string;
}

interface CustomBarChartProps {
    data: DataItem[];
}

export default function CustomBarChart({ data }: CustomBarChartProps) {
    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: data.map((item: any) => item.date) }]}
            series={[
                {
                    data: data.map((item: any) => item.price),
                },
            ]}
            width={window.innerWidth * 0.5}
            height={window.innerHeight * 0.5}
        />
    );
}