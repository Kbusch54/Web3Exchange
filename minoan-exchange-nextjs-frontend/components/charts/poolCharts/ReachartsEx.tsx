'use client'
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  import { format, parseISO, subDays } from "date-fns";
  
  const data: any[] | undefined = [];
  for (let num = 30; num >= 0; num--) {
    data.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      value: 10 * Math.random(),
      other: 18 * Math.random() + Math.random(),
    });
  }
  

interface Props {
    
}
//@ts-ignore
function CustomTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className="tooltip ">
          <h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4>
          <p>${payload[0].value.toFixed(2)} Index</p>
          <p>${payload[1].value.toFixed(2)} Market</p>
        </div>
      );
    }
    return null;
  }

const ReachartsEx: React.FC<Props> = () => {
    return (
        <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
  
          <Area dataKey="value" stroke="#2451B7" fill="url(#color)" />
          <Area dataKey="other" stroke="#9251B7" fill="url(#color)" />
  
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
            dataKey="other"
            axisLine={false}
            tickLine={false}
            tickCount={12}
            tickFormatter={(number) => `$${number.toFixed(2)}`}
          />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip  />} />
  
          <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
      </ResponsiveContainer>
    )
}

export default ReachartsEx
