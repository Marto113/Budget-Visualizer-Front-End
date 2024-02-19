import { LineChart } from '@mui/x-charts';

interface DataItem {
    price: number;
    date: string;
}

interface CustomLineChartProps {
    data: DataItem[];
}

export default function CustomLineChart({ data, max, month }: CustomLineChartProps & { max: number, month?: number }) {
    const currentDate = new Date();
    const currentMonth = month !== undefined ? month : currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDateOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDateOfMonth.getDate();

    const allDatesInMonth = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return new Date(currentYear, currentMonth, day + 1).toISOString().substr(5, 5);
    });

    const modifiedData = allDatesInMonth.map(date => {
        const existingData = data.find(item => new Date(item.date).toISOString().substr(5, 5) === date);
        return {
            date,
            price: existingData ? existingData.price : 0
        };
    });

    const cumulativePricesByDate: { [date: string]: number } = {};
    modifiedData.forEach(({ date, price }) => {
        if (cumulativePricesByDate[date]) {
            cumulativePricesByDate[date] += price;
        } else {
            cumulativePricesByDate[date] = price;
        }
    });

    const newData = Object.keys(cumulativePricesByDate).map(date => ({
        date,
        price: cumulativePricesByDate[date]
    }));

    for (let i = 1; i < newData.length; i++) {
        newData[i].price += newData[i - 1].price;
    }

    return (
        <LineChart
            xAxis={[{ scaleType: 'band', data: newData.map(item => item.date) }]}
            yAxis={[{ min: 0, max: max }]}
            series={[
                {
                    curve: "monotoneY",
                    data: newData.map(item => item.price),
                    area: true,
                    showMark: false,
                },
            ]}
            width={1250}
            height={700}
        />
    );
}