
'use client'
import React, { useState } from 'react';

import { PieChart, Pie, Sector, ResponsiveContainer, Cell, Tooltip, Legend, Label } from 'recharts';
import { moneyFormatter } from 'utils/helpers/functions';

const data = [
  { name: 'Tesla', value: 800 },
  { name: 'Google', value: 300 },
  { name: 'Meta', value: 300 },
  { name: 'Theseus', value: 3000 },
];
const COLORS = ["rgb(101 163 13)  ","rgb(2 132 199)", "rgb(234 179 8)", "rgb(88 28 135)",  "rgb(153 27 27)"];
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
      <text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill} >
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
        style={{ filter: `drop-shadow(0px 0px 10px rgb(217 119 6)) ` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={"rgb(255 255 235) "}
        style={{ filter: `drop-shadow(0px 0px 50px rgb(217 119 6)) ` }}
        className='opacity-40'
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={8} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="rgb(37 99 235)">{`AMT ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="rgb(217 119 6)">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};
interface Props {
    dataForPie?: { name: string; value: number; }[]
    toolTipLabel?: string
}
// @ts-ignore
const CustomTooltip = ({ active, payload,toolTipLabel }) => {
  if (active) {
     return (
     <div
        className="text-amber-400 bg-slate-900 border-2 border-gray-800 rounded-lg p-2"
       
      >
        <label>{`${payload[0].name} : ${toolTipLabel?toolTipLabel:''}${ toolTipLabel == '$'?moneyFormatter(payload[0].value*10**6) :payload[0].value}`}</label>
        <br />
        </div>
    );
 }
};
const RechartPie: React.FC<Props> = ({dataForPie,toolTipLabel}) => {
    
 
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: any) => {
    setActiveIndex(index);
  };
  
    return (
        <ResponsiveContainer width={'99%'} height={700} >
        <PieChart  >
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={dataForPie? dataForPie:data}
            cx="50%"
            cy="50%"
            innerRadius={'30%'}
            outerRadius={'50%'}
            fill="rgb(217 119 6)"
            dataKey="value"
            onMouseEnter={onPieEnter}
            >
               {data.map((entry, index) => (
         
           <Cell
           key={`cell-${entry}`}
           fill={COLORS[index % COLORS.length]}
           stroke='rgb(255 255 235)'
           style={{
             filter: `drop-shadow(0px 0px 10px rgb(217 119 6)) `,
             strokeWidth: '1px',
             stroke: COLORS[index % COLORS.length]
            }}
            />
            
            ))}
            </Pie>
          <Tooltip content={<CustomTooltip active={activeIndex} payload={data} toolTipLabel={toolTipLabel}/>} />
        <Legend  type='diamond'/>
        </PieChart>
      </ResponsiveContainer>
    )
}

export default RechartPie
