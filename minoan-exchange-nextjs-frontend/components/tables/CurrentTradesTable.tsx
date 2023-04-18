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
    ffrReturn:string;
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
      <TableRow sx={{}}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="medium"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="header"
          scope="row"
          className="table-text text-left"
        >
          {row.id.slice(0, 4) + "..." + row.id.slice(-4)}
        </TableCell>

        <TableCell className="table-text">{row.asset}</TableCell>
        <TableCell className="table-text">{row.side}</TableCell>
        <TableCell className="table-text">{row.size}</TableCell>
        <TableCell className="table-text">{row.leverage}X</TableCell>
        <TableCell className="table-text">${row.pnl}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="text-white"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{}}>
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
                    <TableCell className="text-white">FFR Return</TableCell>
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
                      {row.information.ffrReturn}
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
            <Box sx={{}}>
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
            <div className="flex justify-between mb-8 md:ml-4 mt-6 ">
              <button className="px-2 py-1  text-xs md:text-base md:px-3 md:py-2  rounded-lg hover:scale-125 bg-green-400">
                Add Leverage
              </button>
              <button className="px-2 py-1  text-xs md:text-base md:px-3 md:py-2 rounded-lg hover:scale-125 bg-green-400">
                Add Collateral
              </button>
              <button className="px-2 py-1  text-xs md:text-base md:px-3 md:py-2 rounded-lg hover:scale-125 bg-yellow-400">
                Remove Collateral
              </button>
              <button className="px-2 py-1  text-xs md:text-base md:px-3 md:py-2 rounded-lg hover:scale-125 bg-red-400">
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
  createData("0x83hsh348dhh5hjf", "TSLA", 12.3, 1, 10, 2899.33, {
    mmr: 5,
    ffr: 12.34,
    ffrReturn:'$28.73',
    liquidationPrice: 313.82,
    interestRate: 1,
    interestPeriod: 12,
    interestAccrued: 22,
    startCollateral: 400,
    currentCollateral: 382,
    openValue: 100,
    currentValue: 3000,
  }),
  createData("0x87ad83DC2F12A14C85D20f178A918a65Edfe1B42", "TSLA", 120.3, -1, 10, 20899.33, {
    mmr: 5,
    ffr: 12.34,
    ffrReturn:'-$38.73',
    liquidationPrice: 303.82,
    interestRate: 1,
    interestPeriod: 12,
    interestAccrued: 40,
    startCollateral: 400,
    currentCollateral: 320,
    openValue: 1000,
    currentValue: 30000,
  }),
];

export default function CurrentTradesTable() {
  return (
    <TableContainer
      component={Paper}
      className="bg-slate-800 rounded-2xl shadow-xl shadow-amber-400 text-white"
    >
      <div className="text-2xl text-center border-4 border-slate-900">
        Active Trades
      </div>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className="table-text">Id</TableCell>
            <TableCell className="table-text">Asset</TableCell>
            <TableCell className="table-text">Side</TableCell>
            <TableCell className="table-text">Size</TableCell>
            <TableCell className="table-text">Lev</TableCell>
            <TableCell className="table-text">PNL</TableCell>
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
