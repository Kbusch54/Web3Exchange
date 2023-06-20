'use client'
import {
    ResponsiveContainer,
    AreaChart,
    XAxis,
    YAxis,
    Area,
    Tooltip,
    ComposedChart,
    Legend,
  } from "recharts";
  import { format, parseISO } from "date-fns";
import { convertCamelCaseToTitle, getHoursAndMinutes } from "utils/helpers/functions";

  const data =  [{ date: '2023-06-16', Tesla: 0, Google: 0, Meta: 0, All: 0 },
  { date: '2023-06-16', Tesla: 1, Google: 0, Meta: 0, All: 1 },
  { date: '2023-06-18', Tesla: 0, Google: 2, Meta: 0, All: 2 }]
  

interface Props {
    height: number,
    lineData?: any
    type?: string
    
}
const COLORS = ["rgb(30 58 138)","#2451B7", "#9251B7", "rgb(2 132 199)",  "rgb(153 27 27)"];
//@ts-ignore
function CustomTooltip({ active, payload, label,type }) {
    if (active) {
      const date = new Date(label);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const mmm =date.toDateString().split(' ')[1];
      const day = String(date.getDate() +1).padStart(2, '0');
      const formattedDate = `${mmm} ${day}`;
      return (
        <div className="tooltip opacity-60">
         <h4>{formattedDate}</h4> 
         {
           payload.map((item:any,index:number)=>{
             return <p>{type=='time'?getHoursAndMinutes(item.value)[0].toString() :item.value} {convertCamelCaseToTitle(item.dataKey)}</p>
           })
          }    
         </div>
      );
    }
    return null;
  }

const ReachartLines: React.FC<Props> = ({height,lineData,type}) => {
  const keyNames = Object.keys(lineData? lineData[0]:data[0]);
    return (
        <ResponsiveContainer height={height} width={'100%'} >
        <ComposedChart data={lineData?lineData: data}>
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {
            keyNames.map((keyName,index)=>{
              if(index>0 && index<keyNames.length){
                return <Area dataKey={keyName} stroke={COLORS[index]} fill="url(#color)"  activeDot={{ r: 8 }} />
              }
            })
          }
          <XAxis
            dataKey="date"
            accumulate="sum"
            axisLine={false}
            tickLine={false}
            tickFormatter={(str) => {
              const date = parseISO(str);
              const mmm =date.toDateString().split(' ')[1];
              const day = String(date.getDate() +1).padStart(2, '0');
              const formattedDate = `${mmm} ${day}`;
              return formattedDate;
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
          <Tooltip content={<CustomTooltip type={type}  />} />
  
          {/* <CartesianGrid opacity={0.1} vertical={true} /> */}
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
      // </div>
    )
}

export default ReachartLines
