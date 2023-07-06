'use client'
import React from 'react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts'

interface Props {
    dataForGraph?:any
}
const data = [
    {
      name: 'Theseus Dao',
      proposals: 26,
      executed: 10,
    },
    {
      name: 'Ariadne Tesla Dao',
      proposals: 20,
      executed: 19,
    },
    {
      name: 'Ariadne Google Dao',
      proposals: 37,
      executed: 15,
    },
    {
      name: 'Ariadne Meta Dao',
      proposals: 12,
      executed: 4,
    },
  ];
  function dataMutate(data: any) {
    let newData: {name:string,proposals:number,executed:number,proposal:number}[] = [];
    data.map((entry: {name:string,proposals:number,executed:number}, index: number) => ({
            newData: newData.push({
                name: entry.name,
                proposal: Number(entry.proposals) -Number(entry.executed),
                proposals:entry.proposals,
                executed: entry.executed,
            })
        }));
        return newData;
    }
//@ts-ignore
function CustomTooltip({ active = false, payload = [payload], label = '' }) {
      if (active) {
        return (
        <div className="tooltip ">
            <h4>{label}</h4>
            <p>{payload[0].payload.proposals} Proposals</p>
            <p>{payload[0].payload.executed} Executed</p>
            <p>{(payload[0].payload.executed/payload[0].payload.proposals *100).toFixed(2)} % Passed</p>
        </div>
        );
    }
    return null;
  }

const RechartDoubleBar: React.FC<Props> = ({dataForGraph}) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
            width={500}
            height={300}
            data={dataForGraph?dataMutate(dataForGraph):dataMutate(data)}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip/>} />
                <Legend />
               
                <Bar dataKey="executed" stackId="a" fill="rgb(217 119 6 )" />
                <Bar dataKey='proposal'stackId="a"  fill=' rgb(30 41 59  )' />
            </BarChart>
      </ResponsiveContainer>
    )
}

export default RechartDoubleBar
