"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";

type ChartData = {
  period: string;
  indexPrice: number;
  marketPrice: number;
};

type ChartProps = {
  data: ChartData[];
};
const data = [
  {
    period: "Jan",
    indexPrice: 4000,
    marketPrice: 2400,
  },
  {
    period: "Feb",
    indexPrice: 3000,
    marketPrice: 1398,
  },
  {
    period: "Mar",
    indexPrice: 2000,
    marketPrice: 9800,
  },
  {
    period: "Apr",
    indexPrice: 2780,
    marketPrice: 3908,
  },
  {
    period: "May",
    indexPrice: 1890,
    marketPrice: 4800,
  },
  {
    period: "Jun",
    indexPrice: 2390,
    marketPrice: 3800,
  },
  {
    period: "Jul",
    indexPrice: 3490,
    marketPrice: 4300,
  },
];
const options: ApexCharts.ApexOptions = {
  colors: ["#4287f5", "#E91E63", "#9C27B0"],
  chart: {
    type: "area",
    stacked: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
  },
  series: [
    {
      name: "Index Price",
      data: data.map(({ indexPrice }) => indexPrice),
    },
    {
      name: "Market Price",
      data: data.map(({ marketPrice }) => marketPrice),
    },
  ],
  xaxis: {
    categories: data.map(({ period }) => period),
  },
  yaxis: {
    title: {
      text: "Price",
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y: number) {
        if (typeof y !== "undefined") {
          return "$" + y.toFixed(2);
        }
        return y;
      },
    },
  },
};

const AreaChartPoolsApex: React.FC = () => {
  return (
    <ReactApexChart
      options={options}
      series={options.series}
      type="area"
      height={400}
    />
  );
};

export default AreaChartPoolsApex;
