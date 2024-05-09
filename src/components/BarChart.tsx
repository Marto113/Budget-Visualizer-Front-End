import { useEffect } from 'react';
import Highcharts, { SeriesOptionsType } from 'highcharts';

interface DataItem {
    price: number;
    date: string;
    category: string;
}

interface CustomBarChartProps {
    data: DataItem[];
    month: number;
    year: number;
}

interface SeriesData {
    name: string;
    data: number[];
    type?: string;
}


export default function CustomBarChart({ data, month, year }: CustomBarChartProps) {
    const weeksInMonth: { [key: string]: DataItem[] } = {};

    // за всеки елемент се извлича датата му
    // изчислява се номера на седмицата в месеца спрямо тази дата
    data.forEach((item) => {
        const itemDate = new Date(item.date);
        const weekNumber = Math.ceil(itemDate.getDate() / 7);
        if (!weeksInMonth[`Week ${weekNumber}`]) {
            weeksInMonth[`Week ${weekNumber}`] = [];
        }
        weeksInMonth[`Week ${weekNumber}`].push(item);
    });

    const categories = Array.from(new Set(data.map((item) => item.category)));

    // изчислява се общата цена за всяка седмица, принадлежаща на 
    // категорията, и се създава масив от обекти SeriesData.
    const seriesData: SeriesData[] = categories.map((category) => {
        const prices = Array.from({ length: 5 }, (_, index) => {
            const weekData = weeksInMonth[`Week ${index + 1}`] || [];
            return weekData
                .filter((item) => item.category === category)
                .reduce((total, item) => total + item.price, 0);
        });
        return {
            name: category,
            data: prices,
            type: 'bar',
        };
    });

    useEffect(() => {
        const options: Highcharts.Options = {
            chart: {
                type: 'bar',
            },
            title: {
                text: 'Monthly Category Expenses',
                align: 'left',
            },
            xAxis: {
                categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                title: {
                    text: null,
                },
                gridLineWidth: 1,
                lineWidth: 0,
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Price',
                    align: 'high',
                },
                labels: {
                    overflow: 'justify',
                },
                gridLineWidth: 0,
            },
            tooltip: {
                valueSuffix: ' lv',
            },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    grouping: true,
                    dataLabels: {
                        enabled: false,
                    },
                    groupPadding: 0.1,
                },
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend!.backgroundColor || '#FFFFFF',
                shadow: true,
            },
            credits: {
                enabled: false,
            },
            series: seriesData as SeriesOptionsType[],
        };

        Highcharts.chart('container', options);
    }, [data, month, year]);

    return <div id="container" style={{ width: '100%', height: '700px' }} />;
}