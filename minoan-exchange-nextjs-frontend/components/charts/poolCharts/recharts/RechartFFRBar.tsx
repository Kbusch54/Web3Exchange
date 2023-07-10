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
    Bar,
    Cell,
  } from "recharts";
  import { format, parseISO, subDays } from "date-fns";
import { convertCamelCaseToTitle, moneyFormatter } from "utils/helpers/functions";
  
  const datas: any[] | undefined = [];
  for (let num = 30; num >= 0; num--) {
    let rando = Math.random();
    let rando2 = Math.random();
    datas.push({
      date: subDays(new Date(), num).toISOString().substring(0, 10),
      index: 200 *(rando+rando2),
      market: 222 *rando ,
      delta: Math.abs(( 200 *(rando+rando2)) - (222 *rando )),
    });
  }
  

interface Props {
    height: number,
    dataBar?: any
    
}
const COLORS = ["#2451B7","#9251B7", "rgb(30 58 138)", "rgb(88 28 135)",  "rgb(153 27 27)"];
//@ts-ignore
function CustomTooltip({ active = false, payload = [{payload}], label = '' }) {
    if (active) {
      const date = new Date(label).toLocaleDateString() + " " + new Date(label).toLocaleTimeString();
      return (
        <div className="tooltip ">
         <h4>{date}</h4> 
         <p>Delta: {moneyFormatter(payload[0].payload.delta)}</p>  
         <p>Funding Rate: {payload[0].payload.ffr}</p>
         </div>
      );
         
    }
    
    return null;
  }

const ReachartFFRBar: React.FC<Props> = ({height,dataBar}) => {
    return (
      // <div className="h-max w-96">
        <ResponsiveContainer height={height} width={'100%'} >
        <ComposedChart data={dataBar?dataBar:datas} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
  
          <Area type="monotone" dataKey="delta" stroke="rgb(2 132 199)" fill="rgb(2 132 199)" yAxisId={'deltaAxis'} /> 
          <Bar dataKey={'absoluteFFR'}    barSize={20} >
          {/* @ts-ignore */}
        {dataBar.map((item, index) => (
            <Cell key={index} fill={item.ffr >= 0 ? 'rgb(22 163 74)' : 'rgb(220 38 38)'} />
        ))}
        </Bar>
          
  
          <XAxis
            dataKey="date"
            accumulate="sum"
            axisLine={false}
            tickLine={false}
            tickFormatter={(str) => {
                return new Date(str).toLocaleDateString();
            }}
          />
  
          <YAxis dataKey={'delta'} yAxisId="deltaAxis"  domain={["dataMin", "dataMax"]} tickCount={0}/>
          <YAxis
            AxisComp={Bar}
            dataKey="absoluteFFR"
            domain={['0', "dataMax"]}
            tickCount={0}
          />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip  />} />
  
          <CartesianGrid opacity={0.1} vertical={false} />
          <Legend content={<div className="flex flex-row justify-center gap-x-4"><p className="text-blue-400">DELTA</p><p className="text-green-500">Funding Rate</p></div>} />
        </ComposedChart>
      </ResponsiveContainer>
      // </div>
    )
}

export default ReachartFFRBar
