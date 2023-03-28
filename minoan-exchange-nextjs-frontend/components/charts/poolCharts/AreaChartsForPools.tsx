'use client'

import ReactApexChart, { Props } from "react-apexcharts";

const AreaChartsForPools: React.FC<Props> = ({  }) => {
   const options = {
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },

    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'datetime',
      categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };
    const series = [
      {
        name: "Market Price",
        data: [300, 321, 317, 328, 298, 205, 251]
      },
      {
        name: "Index Price",
        data: [300, 315, 318, 330, 308, 250, 247]
      }
    ];
  
    return (
        <ReactApexChart
          type="area"
          options={options}
          series={series}
          height={350}

        />
    );
  };
  export default AreaChartsForPools;


