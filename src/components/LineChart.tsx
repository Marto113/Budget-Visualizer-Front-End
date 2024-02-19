import { useEffect } from 'react';
import Highcharts from 'highcharts'

interface DataItem {
    price: number;
    date: number;
}

interface CustomLineChartProps {
    data: DataItem[];
}

function convertToSeriesFormat({ data, month }: { data: DataItem[]; month: number }): DataItem[] {
    const currentDate = new Date();
    const currentMonth = month !== undefined ? month : currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDateOfMonth.getDate();

    const allDatesInMonth = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return day;
    });

    const modifiedData = allDatesInMonth.map(day => {
        const existingData = data.find(item => new Date(item.date).getDate() === day);
        return {
            date: day,
            price: existingData ? existingData.price : 0
        };
    });

    const cumulativePricesByDate: { [date: number]: number } = {};
    modifiedData.forEach(({ date, price }) => {
        if (cumulativePricesByDate[date]) {
            cumulativePricesByDate[date] += price;
        } else {
            cumulativePricesByDate[date] = price;
        }
    });

    const newData = Object.keys(cumulativePricesByDate).map(date => ({
        date: parseInt(date),
        price: cumulativePricesByDate[parseInt(date)]
    }));

    return newData;
}

export default function CustomLineChart({ data, max, month }: CustomLineChartProps & { max: number, month: number }) {
    useEffect(() => {
        const seriesData = convertToSeriesFormat({data, month});
    
        for (let i = 1; i < seriesData.length; i++) {
            seriesData[i].price += seriesData[i - 1].price;
    
            if (seriesData[i].price > max) {
                max = seriesData[i].price + 10;
            }
        }

        console.log(seriesData);

        const options: Highcharts.Options = {
            title: {
                text: 'Spendings:',
                align: 'left'
            },
            yAxis: {
                title: {
                    text: 'Spent for this month'
                }
            },
            tooltip: {
                valueSuffix: ' lv',
            },
            xAxis: {
                categories: seriesData.map(item => item.date.toString()),
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: seriesData[0].date
                }
            },
            series: [{
                type: 'line',
                name: 'Price',
                data: seriesData.map(item => item.price)
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        };

        Highcharts.chart('container', options);
    }, [data, max, month]); 

    return <div id="container" style={{ width: '100%', height: '700px' }} />;
}
