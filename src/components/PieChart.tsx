import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

interface TransactionData {
    category: string;
    amount: number;
}

interface CustomPieChartProps {
    data: TransactionData[];
}

const palette = ['#3BB273', '#E1BC29', '#4D9DE0', '#F6828C', '#8F3985', '#FA7921', '#A20021', '#4A0D67', "#1D2F6F, '#0014A8"];

const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
}));

export default function CustomPieChart({ data }: CustomPieChartProps) {
    const seriesData = data.map(({ category, amount }, index) => ({
        id: index.toString(),
        value: amount,
        label: category
    }));

    return (
        <PieChart 
            colors={palette}
            series={[{ 
                data: seriesData, 
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            }]} 
            height={400}
        >
        </PieChart>
    );
}