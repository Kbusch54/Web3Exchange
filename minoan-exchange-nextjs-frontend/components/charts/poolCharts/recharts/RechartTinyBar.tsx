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
    BarChart,
    Bar,
    Cell,
  } from "recharts";
  import { format, parseISO, subDays } from "date-fns";
  
  const data: any[] | undefined = [];
  for (let num = 8; num >= 0; num--) {
    let rando = Math.random();
    let rando2 = Math.random();
    data.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      value:2*(rando+rando2)
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
          {/* <h4>{format(parseISO(label), "eeee, d MMM, yyyy")}</h4> */}
          <p>${payload[0].value.toFixed(2)} PNL</p>
        </div>
      );
    }
    return null;
  }

const RechartTinyBar: React.FC<Props> = ({height}) => {
    return (
      // <div className="h-max w-96">
      <ResponsiveContainer width="100%" height={height}>
      <BarChart

     data={data}
     margin={{
       top: 50,
       right: 10,
       left: 10,
       bottom: 20,
     }}
     barSize={20}
      >
        {/* <CartesianGrid  className="text-red-700"/> */}
                  {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" background={{ fill: 'rgb(51 65 85)' }}     barSize={4} >
        {data.map((item, index) => (
            <Cell key={index} fill={item.value >= 0 ? 'rgb(56 189 247)' : 'rgb(185 28 28)'} />
        ))}
        </Bar>
        {/* <Bar dataKey="index" fill="rgb(185 28 28)" background={{ fill: 'rgb(51 65 85)' }} xAxisId={1}  barSize={4} /> */}
        
      </BarChart>
    </ResponsiveContainer>
      // </div>
    )
}

export default RechartTinyBar
