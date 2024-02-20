import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

export interface DataItem {
    category: string;
    price: number;
    date: number;
}

interface CompareLineChartProps {
    data1: DataItem[];
    data2: DataItem[];
    max: number;
    month1: number;
    month2: number;
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

    const cumulativePricesByDate: { [date: number]: { price: number; category: string } } = {};
    data.forEach(({ date, price, category }) => {
        const day = new Date(date).getDate();
        if (cumulativePricesByDate[day]) {
            cumulativePricesByDate[day].price += price;
        } else {
            cumulativePricesByDate[day] = { price, category };
        }
    });

    const modifiedData = allDatesInMonth.map(day => ({
        date: day,
        price: cumulativePricesByDate[day] ? cumulativePricesByDate[day].price : 0,
        category: cumulativePricesByDate[day] ? cumulativePricesByDate[day].category : ''
    }));

    return modifiedData;
}

export default function CompareLineChart({ data1, data2, max, month1, month2 }: CompareLineChartProps) {
    useEffect(() => {
        const seriesData1 = convertToSeriesFormat({ data: data1, month: month1 });
        const seriesData2 = convertToSeriesFormat({ data: data2, month: month2 });

        for (let i = 1; i < seriesData1.length; i++) {
            seriesData1[i].price += seriesData1[i - 1].price;
            seriesData2[i].price += seriesData2[i - 1].price;
    
            if (seriesData1[i].price > max) {
                max = seriesData1[i].price + 10;
            }
            if (seriesData2[i].price > max) {
                max = seriesData2[i].price + 10;
            }
        }

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
                categories: seriesData1.map(item => item.date.toString()),
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
                    pointStart: seriesData1[0].date
                }
            },
            series: [{
                type: 'line',
                name: `${monthNames[month1]}`,
                data: seriesData1.map(item => item.price)
            }, {
                type: 'line',
                name: `${monthNames[month2]}`,
                data: seriesData2.map(item => item.price)
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

        const chart = Highcharts.chart('container', options);

        const resizeHandler = () => {
            chart.reflow();
        };
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [data1, data2, max, month1, month2]); 

    return <div id="container" style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
}
