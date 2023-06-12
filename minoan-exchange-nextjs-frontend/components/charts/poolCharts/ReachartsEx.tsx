'use client'
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
    ComposedChart,
    Line,
    Legend,
  } from "recharts";
  import { format, parseISO, subDays } from "date-fns";
  
  const data: any[] | undefined = [];
  for (let num = 30; num >= 0; num--) {
    let rando = Math.random();
    let rando2 = Math.random();
    data.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      index: 200 *(rando+rando2),
      market: 222 *rando ,
      delta: Math.abs(( 200 *(rando+rando2)) - (222 *rando )),
    });
  }
  

interface Props {
    height: number
    
}
const COLORS = ["#2451B7","#9251B7", "rgb(30 58 138)", "rgb(88 28 135)",  "rgb(153 27 27)"];
//@ts-ignore
function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className="tooltip ">
          <h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
          <p>${payload[0].value.toFixed(2)} Index</p>
          <p>${payload[1].value.toFixed(2)} Market</p>
          <p>{payload[2].value.toFixed(2)} Delta</p>
        </div>
      );
    }
    return null;
  }

const ReachartsEx: React.FC<Props> = ({height}) => {
    return (
      // <div className="h-max w-96">
        <ResponsiveContainer height={height} width={'100%'} >
        <ComposedChart data={data} margin={{ top: 0, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
  
          <Line dataKey="index" stroke="#2451B7" fill="url(#color)" activeDot={{ r: 8 }} />
          <Line dataKey="market" stroke="#9251B7" fill="url(#color)" activeDot={{ r: 8 }}  />
          <Area type="monotone" dataKey={'delta'} stroke="rgb(22 163 74)" fill="rgb(2 132 199)"/>
          
          
  
          <XAxis
            dataKey="date"
            accumulate="sum"
            axisLine={false}
            tickLine={false}
            tickFormatter={(str) => {
              const date = parseISO(str);
              if (date.getDate() % 7 === 0) {
                return format(date, "MMM, d");
              }
              return "";
            }}
          />
  
          <YAxis
            dataKey="index"
            accumulate="sum"
            axisLine={false}
            tickLine={false}
            tickCount={12}
            tickFormatter={(number) => `$${number.toFixed(2)}`}
          />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip  />} />
  
          <CartesianGrid opacity={0.1} vertical={false} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
      // </div>
    )
}

export default ReachartsEx
