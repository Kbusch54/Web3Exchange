"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Suspense } from "react";
import ExSkeleton from "../../skeletons/ExSkeleton";
import AllTrades from "../../tables/trades/AllTrades";
import { Address } from "wagmi";

interface Props {
  user: Address;
  vaultBal: number;
}
export default function DashBoardTradeTab({user,vaultBal}:Props) {
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
            <Tab className={`text-white `}  label="Active Trades" value="1" />
            <Tab className="text-white" label="Past Trades" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <AllTrades user={user} userAvailableBalance={vaultBal} global={false} active={true}   />
        </TabPanel>
        <TabPanel value="2">
            <AllTrades user={user} userAvailableBalance={vaultBal} global={false} active={false}   />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
