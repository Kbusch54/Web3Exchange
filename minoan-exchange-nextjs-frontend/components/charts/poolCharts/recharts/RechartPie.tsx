
'use client'
import React, { useState } from 'react';

import { PieChart, Pie, Sector, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Tesla', value: 800 },
  { name: 'Google', value: 300 },
  { name: 'Meta', value: 300 },
  { name: 'Theseus', value: 3000 },
];
const COLORS = ["#8184d8", "#9251B7", "#FFBB28", "#7151B7", "#9252D7"];
const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; }) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
interface Props {
}
// @ts-ignore
const CustomTooltip = ({ active, payload }) => {
  if (active) {
     return (
     <div
        className="text-amber-400 bg-slate-900"
       
      >
        <label>{`${payload[0].name} : ${payload[0].value}`}</label>
        <br />
        </div>
    );
 }
};
const RechartPie: React.FC<Props> = () => {
    
 
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: any) => {
    setActiveIndex(index);
  };
  
    return (
        <ResponsiveContainer width={'100%'} height={800}>
        <PieChart  >
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            color='#8884d8'
            innerRadius={'35%'}
            outerRadius={'80%'}
            fill="#2451C7"
            dataKey="value"
            onMouseEnter={onPieEnter}
            >
               {data.map((entry, index) => (
            <Cell
               key={`cell-${index}`}
               fill={COLORS[index % COLORS.length]}
            />
         ))}
            </Pie>
            {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip active={activeIndex} payload={data}/>} />
        </PieChart>
      </ResponsiveContainer>
    )
}

export default RechartPie
