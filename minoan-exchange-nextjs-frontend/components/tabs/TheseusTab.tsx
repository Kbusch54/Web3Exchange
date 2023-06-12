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
export default function TheseusTab() {
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
            variant="scrollable"
            textColor="inherit"
          >
            <Tab className="text-white" label="Insurance Fund" value="1" />
            <Tab className="text-white" label="Pool Earnings" value="2" />
            <Tab className="text-white" label="Staked in Pools" value="3" />
            <Tab className="text-white" label="Long vs Shorts" value="4" />
            <Tab className="text-white" label="Trades" value="5" />
            <Tab className="text-white" label="Proposals" value="6" />
            <Tab className="text-white" label="Avg Pnl" value="7" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <ReachartsEx height={400} />
        </TabPanel>
        <TabPanel value="2">
          <ReachartsEx height={400} />
        </TabPanel>
        <TabPanel value="3">
          <RechartPie />
        </TabPanel>
        <TabPanel value="4">
          <RechartPie />
        </TabPanel>
        <TabPanel value="5">
          <div className="grid grid-cols-4 items-center mx-2">
            <div className=" hidden  lg:inline lg:col-span-3">
              <ReachartLines height={400} />
            </div>
            <div className="col-span-4 lg:hidden">
              <ReachartLines height={200} />
            </div>
            <div className="col-span-4 lg:col-span-1">
              <RechartPie />
            </div>
          </div>
        </TabPanel>
        <TabPanel value="6">
          <RechartDoubleBar />
        </TabPanel>
        <TabPanel value="7">
          <ReachartLines height={400} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
