'use client'
import {
    ResponsiveContainer,
    XAxis,
    Area,
    Tooltip,
    ComposedChart,
    Legend,
  } from "recharts";
  import { parseISO } from "date-fns";
import { convertCamelCaseToTitle, getHoursAndMinutes, moneyFormatter } from "utils/helpers/functions";

  const data =  [{ date: '2023-06-16', Tesla: 0, Google: 0, Meta: 0, All: 0 },
  { date: '2023-06-16', Tesla: 1, Google: 0, Meta: 0, All: 1 },
  { date: '2023-06-18', Tesla: 0, Google: 2, Meta: 0, All: 2 }]
  

interface Props {
    height: number,
    lineData?: any
    type?: string
    
}
const COLORS = ["rgb(30 58 138)","#2451B7", "#9251B7", "rgb(2 132 199)",  "rgb(153 27 27)"];
interface CustomTooltipProps {
  active: boolean;
  payload: any[]; // Replace 'any' with the actual type of the payload array elements
  label: string;
  type?: string;
}

function CustomTooltip({ active =false, payload =[], label = '' , type = '' }: CustomTooltipProps) {
    if (active) {
      const date = new Date(label);
      const mmm =date.toDateString().split(' ')[1];
      const day = String(date.getDate() +1).padStart(2, '0');
      const formattedDate = `${mmm} ${day}`;
      return (
        <div className="tooltip opacity-60">
         <h4>{formattedDate}</h4> 
         {
           payload.map((item:any,index:number)=>{
             return <p key={item.dataKey}>{type=='time'?getHoursAndMinutes(item.value)[0].toString() :type=='$'?`$${moneyFormatter(item.value)}`  : item.value} {convertCamelCaseToTitle(item.dataKey)}</p>
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
                return <Area key={keyName} dataKey={keyName} stroke={COLORS[index]} fill="url(#color)"  activeDot={{ r: 8 }} />
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
          
          <Tooltip content={<CustomTooltip type={type} active={false} payload={[]} label={""}   />} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    )
}

export default ReachartLines
