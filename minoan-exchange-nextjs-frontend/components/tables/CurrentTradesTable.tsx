"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// TODO pull data
// from component which DAO
// from graph get all data
function createData(
  id: string,
  asset: string,
  size: number,
  side: number,
  leverage: number,
  pnl: number,
  information: {
    mmr: number;
    ffr: number;
    liquidationPrice: number;
    interestRate: number;
    interestPeriod: number;
    interestAccrued: number;
    startCollateral: number;
    currentCollateral: number;
    openValue: number;
    currentValue: number;
  }
) {
  return {
    id,
    asset,
    size,
    side,
    leverage,
    pnl,
    information,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className="text-white">
          {row.id}
        </TableCell>

        <TableCell className="text-white">{row.asset}</TableCell>
        <TableCell className="text-white">{row.side}</TableCell>
        <TableCell className="text-white">{row.size}</TableCell>
        <TableCell className="text-white">{row.leverage}X</TableCell>
        <TableCell className="text-white">${row.pnl}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="text-white"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                className="text-white"
                variant="h6"
                gutterBottom
                component="div"
              >
                Information
              </Typography>
              <Table size="small" aria-label="info" className="text-center">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white">MMR</TableCell>
                    <TableCell className="text-white">FFR</TableCell>
                    <TableCell className="text-white">
                      Liquidation Price
                    </TableCell>
                    <TableCell className="text-white">
                      Start Collateral
                    </TableCell>
                    <TableCell className="text-white">
                      CurrentCollateral
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.information.liquidationPrice}>
                    <TableCell
                      className="text-white"
                      component="th"
                      scope="row"
                    >
                      {row.information.mmr}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.ffr}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.liquidationPrice}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.startCollateral}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.currentCollateral}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 2 }}>
              <Table size="small" aria-label="info">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white">Interest Rate</TableCell>
                    <TableCell className="text-white">
                      Interest Period
                    </TableCell>
                    <TableCell className="text-white">
                      Interest Accrued
                    </TableCell>
                    <TableCell className="text-white">Open Value</TableCell>
                    <TableCell className="text-white">Current Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.information.liquidationPrice}>
                    <TableCell className="text-white">
                      {row.information.interestRate}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.interestPeriod}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.interestAccrued}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.openValue}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.currentValue}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <div className="flex justify-between mb-8 ml-4">
              <button className="px-3 py-2 rounded-lg hover:scale-125 bg-green-400">
                Add Leverage
              </button>
              <button className="px-3 py-2 rounded-lg hover:scale-125 bg-green-400">
                Add Collateral
              </button>
              <button className="px-3 py-2 rounded-lg hover:scale-125 bg-yellow-400">
                Remove Collateral
              </button>
              <button className="px-3 py-2 rounded-lg hover:scale-125 bg-red-400">
                Close Postion
              </button>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData("0x83hsh348dhh5hjf", "TSL", 12.3, 1, 10, 2899.33, {
    mmr: 5,
    ffr: 12.34,
    liquidationPrice: 313.82,
    interestRate: 1,
    interestPeriod: 12,
    interestAccrued: 22,
    startCollateral: 400,
    currentCollateral: 382,
    openValue: 100,
    currentValue: 3000,
  }),
];

export default function CurrentTradesTable() {
  return (
    <TableContainer
      component={Paper}
      className="bg-slate-800 rounded-2xl shadow-xl shadow-amber-400 text-white"
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className="text-white">Id</TableCell>
            <TableCell className="text-white">Asset</TableCell>
            <TableCell className="text-white">Side</TableCell>
            <TableCell className="text-white">Size</TableCell>
            <TableCell className="text-white">Lev</TableCell>
            <TableCell className="text-white">PNL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
