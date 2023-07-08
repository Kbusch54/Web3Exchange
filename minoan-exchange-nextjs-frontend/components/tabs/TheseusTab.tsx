"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ReachartsEx from "../charts/poolCharts/ReachartsEx";
import RechartPie from "../charts/poolCharts/recharts/RechartPie";
import ReachartLines from "../charts/poolCharts/recharts/RechartLines";
import RechartDoubleBar from "../charts/poolCharts/recharts/RechartDoubleBar";
import { getAllTradesPie, getPNlByUser, getPoolPnl, getTradeHistory, getTradeShortVLong, proposalsExecutedByAmm } from "utils/helpers/dataMutations";
import { fetchStakes } from "app/lib/graph/stakes";
import { use } from "react";
import { getAmmName } from "utils/helpers/doas";
import { getGlobalTradeData } from "app/lib/graph/globalTradeData";

type Stakes ={
  stakes: {
    totalStaked: number;
    ammPool: {
      id: string;
    }|null;
}[]
}
type Trades = {
  trades: {
    created: number;
    ammPool: {
      id: string;
    };
    tradeBalance: {
      side:number;
    }
    isActive: boolean;
  }[];
};
type Vamms ={
  vamms: {
      name:string,
      loanPool: {
        id:string,
        poolPnl:{
          amount:number,
          timeStamp:number,
          }[]
        }
      }[]
}
interface Props {
  theseusData: {
    trades: Trades;
    vamms: Vamms;
  }
}

export default function TheseusTab({theseusData}:Props) {
  const [value, setValue] = React.useState("2");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const proposalData = use(proposalsExecutedByAmm());
  const {trades}:Trades = use(getGlobalTradeData())as Trades;
  const stakes:Stakes = use(fetchStakes()) as Stakes;
  const vamms = theseusData.vamms;
  const pnlForPools = getPoolPnl(vamms);
  const stakingData: { name: string; value: number; }[] = [];
  const longVsShort = getTradeShortVLong(trades);
  const dataForTardePie = getAllTradesPie(trades)
  const {data ,pnl} = getTradeHistory(trades,undefined,undefined);
  const ammStakeMap = new Map();
  for(let i = 0; i < stakes.stakes?.length; i++){
    let amm;
    let amount = stakes.stakes[i].totalStaked /10**6;
    if(stakes.stakes[i].ammPool != null){
      // @ts-ignore
        amm = getAmmName(stakes.stakes[i].ammPool.id.toLowerCase());
        ammStakeMap.set(amm, (ammStakeMap.get(amm) ?? 0) + amount)
      }else{
          amm = 'Theseus';
          ammStakeMap.set(amm, (ammStakeMap.get(amm) ?? 0) + amount)
      }
}
ammStakeMap.forEach(function(value, key) {
stakingData.push({name: key, value: value})
})
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            variant="scrollable"
            textColor="inherit"
          >

            <Tab className="text-white" label="Pool Earnings" value="2" />
            <Tab className="text-white" label="Staked in Pools" value="3" />
            <Tab className="text-white" label="Long vs Shorts" value="4" />
            <Tab className="text-white" label="Trades" value="5" />
            <Tab className="text-white" label="Proposals" value="6" />
            <Tab className="text-white" label="Pnl" value="7" />
          </TabList>
        </Box>

        <TabPanel value="2">
          <ReachartLines height={400}  lineData={pnlForPools} type="$" />
        </TabPanel>
        <TabPanel value="3">
          <RechartPie  dataForPie={stakingData} toolTipLabel="$"/>
        </TabPanel>
        <TabPanel value="4">
          <RechartPie dataForPie={longVsShort} />
        </TabPanel>
        <TabPanel value="5">
          <div className="grid grid-cols-4 items-center mx-2">
            <div className=" hidden  lg:inline lg:col-span-3">
              <ReachartLines height={400} lineData={data}  />
            </div>
            <div className="col-span-4 lg:hidden">
              <ReachartLines height={200} lineData={data}  />
            </div>
            <div className="col-span-4 lg:col-span-1">
              <RechartPie dataForPie={dataForTardePie} />
            </div>
          </div>
        </TabPanel>
        <TabPanel value="6">
          <RechartDoubleBar dataForGraph={proposalData} />
        </TabPanel>
        <TabPanel value="7">
          <ReachartLines height={400} lineData={pnl} type="$" />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
