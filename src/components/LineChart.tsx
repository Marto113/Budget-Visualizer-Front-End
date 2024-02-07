import * as React from 'react';
import { LineChart } from '@mui/x-charts';

interface DataItem {
    price: number;
    date: string;
}

interface CustomLineChartProps {
    data: DataItem[];
}


export default function CustomLineChart({ data }: CustomLineChartProps) {
    const cumulativePrices = data.reduce((acc: number[], curr: any, index: number) => {
        const sum = index === 0 ? curr.price : acc[index - 1] + curr.price;
        acc.push(sum);
        return acc;
    }, []);

    return (
        <LineChart
            xAxis={[{ scaleType: 'band', data: data.map((item: any) => item.date) }]}
            yAxis={[{ min: 0, max: cumulativePrices[cumulativePrices.length - 1] + 500 }]}
            series={[
                {
                    curve: "natural",
                    data: cumulativePrices,
                    area: true,
                },
            ]}
            width={window.innerWidth * 0.5}
            height={window.innerHeight * 0.5}
        />
    );
}