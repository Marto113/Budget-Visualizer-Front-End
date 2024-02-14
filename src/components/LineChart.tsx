import * as React from 'react';
import { LineChart } from '@mui/x-charts';

interface DataItem {
    price: number;
    date: Date;
}

interface CustomLineChartProps {
    data: DataItem[];
}


export default function CustomLineChart({ data, max }: CustomLineChartProps & { max : number }) {
    const cumulativePrices = data.reduce((acc: number[], curr: any, index: number) => {
        const sum = index === 0 ? curr.price : acc[index - 1] + curr.price;
        acc.push(sum);
        return acc;
    }, []);

    return (
        <LineChart
            xAxis={[{ scaleType: 'band', data: data.map((item: any) => item.date) }]}
            yAxis={[{ min: 0, max: max }]}
            series={[
                {
                    curve: "natural",
                    data: cumulativePrices,
                    area: true,
                },
            ]}
            width={700}
            height={500}
        />
    );
}