"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Stock } from "../../../types/custom";
import InvestmentStats from "../../balances/dashboard/InvestmentStats";
import StakingStatsPersonal from "../../balances/dashboard/StakingStatsPersonal";
import { Address } from "wagmi";


interface Props {
    stockData: Stock,
    user:Address,
    userData:any
}
const AssetStatsTab: React.FC<Props> = ({stockData,user,userData}) => {
    const [value, setValue] = React.useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
      setValue(newValue);
    };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            variant="fullWidth"
            textColor="inherit"
          >
            <Tab className="text-white text-center text-base md:text-lg lg:text-3xl" label="Investments" value="1" />
            <Tab className="text-white text-center text-base md:text-lg lg:text-3xl" label="Staking" value="2" />
            <Tab className="text-white text-center text-base md:text-lg lg:text-3xl" label="DAO" value="3" />

          </TabList>
        </Box>
        <TabPanel value="1">
            Invest{stockData.name}
        <InvestmentStats symbol={stockData.name} userTrades={userData.trades}/>
            </TabPanel>
        <TabPanel value="2">Staking{stockData.name}
        <StakingStatsPersonal symbol={stockData.name} userStakes={userData.users[0]}/>
        </TabPanel>
        <TabPanel value="3">DAO{stockData.name}</TabPanel>
      </TabContext>
    </Box>
  );
}

export default AssetStatsTab
