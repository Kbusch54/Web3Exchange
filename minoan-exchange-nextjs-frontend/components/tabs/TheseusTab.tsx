"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AreaChartPoolsApex from "../charts/poolCharts/AreaChartPoolsApex";
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
            <Tab className="text-white" label="Amount on Loan" value="4" />
            <Tab className="text-white" label="Dividend Payments" value="5" />
            <Tab className="text-white" label="DAO Earnings" value="6" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {/* <AreaChartPoolsApex /> */}
          hello
        </TabPanel>
        <TabPanel value="2">Graph no</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item Three</TabPanel>
        <TabPanel value="5">Item Three</TabPanel>
        <TabPanel value="6">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
}
