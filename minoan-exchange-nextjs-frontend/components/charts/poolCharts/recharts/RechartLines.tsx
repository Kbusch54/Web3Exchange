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
  for (let num = 12; num >= 0; num--) {
    let rando = Math.random();
    let rando2 = Math.random();
    data.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      tesla: Math.floor(2 *(rando+rando2)),
      google: Math.floor(2 *rando) ,
      meta: Math.floor((Math.random() +Math.random() )*2) ,
      All: Math.floor(( 2 *(rando+rando2)) + (2 *rando ) + 0),
    });
  }
  

interface Props {
    height: number
    
}
const COLORS = ["#2451B7","#9251B7", "rgb(30 58 138)", "rgb(2 132 199)",  "rgb(153 27 27)"];
//@ts-ignore
function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className="tooltip opacity-60">
          <h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
          <p>{payload[0].value} Tesla</p>
          <p>{payload[1].value} Google</p>
          <p>{payload[2].value} Meta</p>
            <p>{payload[0].value+payload[1].value+payload[2].value} All</p>
        </div>
      );
    }
    return null;
  }

const ReachartLines: React.FC<Props> = ({height}) => {
    return (
      // <div className="h-max w-96">
        <ResponsiveContainer height={height} width={'100%'} >
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
  
          <Area dataKey="tesla" stroke="#2451B7" fill="url(#color)" activeDot={{ r: 8 }} />
          <Area dataKey="google" stroke="#9251B7" fill="url(#color)" activeDot={{ r: 8 }}  />
          <Area dataKey="meta" stroke="#9491D7" fill="url(#color)" activeDot={{ r: 8 }}  />
          {/* <Line dataKey={'All'} stroke="rgb(22 163 74)" fill="rgb(2 132 199)" type="monotoneY"  /> */}
          
          
  
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
  
          {/* <YAxis
            dataKey="tesla"
            axisLine={false}
            tickLine={false}
            tickCount={12}
            tickFormatter={(number) => `${Math.floor(number)}`}
          /> */}
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip  />} />
  
          {/* <CartesianGrid opacity={0.1} vertical={true} /> */}
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
      // </div>
    )
}

export default ReachartLines
