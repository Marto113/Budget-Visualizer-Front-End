import { BarChart } from '@mui/x-charts';

interface DataItem {
    price: number;
    date: Date;
}

interface CustomBarChartProps {
    data: DataItem[];
    month: number;
    year: number;
}

function monthToWeeks(month: number, year: number) {
    const firstDay = new Date(year, month, 1);

    const lastDayOfMonth = new Date(year, month + 1, 0);
    lastDayOfMonth.setDate(lastDayOfMonth.getDate());
    const weeks = [];

    const adjustedFirstDay = new Date(firstDay.getTime());

    for (let i = 0; i < Math.ceil((lastDayOfMonth.getTime() - adjustedFirstDay.getTime()) / (7 * 24 * 60 * 60 * 1000)); i++) {
        const weekStart = new Date(adjustedFirstDay.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

        const weekFirstDay = weekStart.getDate();
        let weekLastDay = weekEnd.getDate();

        if (weekLastDay > lastDayOfMonth.getDate()) {
            weekLastDay = lastDayOfMonth.getDate();
        }

        weeks.push([weekFirstDay, weekLastDay]);
    }

    return weeks;
}

export default function CustomBarChart({ data, month, year }: CustomBarChartProps) {
    const weeks = monthToWeeks(month, year);
    const filteredData = weeks.map((week) => {
        const weekData = data.filter(
            (item) =>
                new Date(item.date).getUTCFullYear() === year &&
                new Date(item.date).getUTCMonth() === month &&
                new Date(item.date).getUTCDate() >= week[0] &&
                new Date(item.date).getUTCDate() <= week[1]
        );
        const totalPrice = weekData.reduce((sum, item) => sum + item.price, 0);
        return { week: `${week[0]}-${week[1]}`, price: totalPrice };
    });

    const chartData = {
        weeks: filteredData.map((item) => item.week),
        prices: filteredData.map((item) => item.price),
    };
    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: chartData.weeks }]}
            series={[
                {
                    data: chartData.prices,
                },
            ]}
            width={1250}
            height={700}
        />
    );
}

