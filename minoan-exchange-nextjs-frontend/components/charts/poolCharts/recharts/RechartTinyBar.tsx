'use client'
import {
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    Cell,
  } from "recharts";
  import { subDays } from "date-fns";
import { getHoursAndMinutes, moneyFormatter } from "utils/helpers/functions";
  
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
    dataBar?: any
    toolTipLabel?: string
    toolTipPost?: string
    
}
const COLORS = ["#2451B7","#9251B7", "rgb(30 58 138)", "rgb(88 28 135)",  "rgb(153 27 27)"];
interface CustomTooltipProps {
  active: boolean;
  payload: any[]; // Replace 'any' with the actual type of the payload array elements
  label: string;
  toolTipLabel: string;
  tooTipPost: string;
}

function CustomTooltip({ active, payload, label, toolTipLabel, tooTipPost }: CustomTooltipProps) {
    if (active) {
      const date = new Date(Number(payload[0].payload.date) * 1000);
      return (
        <div className="tooltip ">
          <h4>{date.toISOString().substring(0, 10)
          }</h4>
          <p>{toolTipLabel?toolTipLabel:''}{toolTipLabel == '$'?moneyFormatter(payload[0].payload.value):toolTipLabel == 'Duration: '? getHoursAndMinutes(payload[0].value * 1000)[0]: payload[0].value} {tooTipPost}</p>
        </div>
      );
    }
    return null;
  }

const RechartTinyBar: React.FC<Props> = ({height,dataBar,toolTipLabel,toolTipPost}) => {
    return (
      <ResponsiveContainer width="100%" height={height}>
      <BarChart

     data={dataBar?dataBar:data}
     margin={{
       top: 50,
       right: 10,
       left: 10,
       bottom: 20,
     }}
     barSize={20}
      >
                  {/* @ts-ignore */}
        <Tooltip content={<CustomTooltip tooTipPost={toolTipPost} toolTipLabel={toolTipLabel} />} />
        <Bar dataKey={`${toolTipLabel=='$'?'absoluteValue':'value'}`}background={{ fill: 'rgb(51 65 85)' }}   barSize={4} >
          {/* @ts-ignore */}
        {dataBar.map((item, index) => (
            <Cell key={index} fill={item.value >= 0 ? 'rgb(56 189 247)' : 'rgb(185 28 28)'} />
        ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    )
}

export default RechartTinyBar
