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
  nonce: number,
  hash: string,
  votes: number,
  votesNeeded: number,
  information: {
    date: string;
    purposer: string;
    description: string;
  }
) {
  return {
    nonce,
    hash,
    votes,
    votesNeeded,
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
          {row.nonce}
        </TableCell>
        <TableCell className="text-white">{row.hash}</TableCell>
        <TableCell className="text-white">{row.votes}</TableCell>
        <TableCell className="text-white">{row.votesNeeded}</TableCell>
        <TableCell className="text-white">
          <button className="px-4 py-2 bg-amber-400 text-white hover:scale-125 rounded-2xl">
            Vote
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className="text-white"
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                className="text-white"
                variant="h6"
                gutterBottom
                component="div"
              >
                Information
              </Typography>
              <Table size="small" aria-label="info">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white">Date</TableCell>
                    <TableCell className="text-white">Purposer</TableCell>
                    <TableCell className="text-white" align="right">
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.information.date}>
                    <TableCell
                      className="text-white"
                      component="th"
                      scope="row"
                    >
                      {row.information.date}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.information.purposer}
                    </TableCell>
                    <TableCell className="text-white" align="right">
                      {row.information.description}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData(0, "0x83hsh348dhh5hjf", 12, 21, {
    date: "12-21-2023",
    purposer: "0xajj2ishjj2",
    description: "Allowing for a larger reward window of 72 hours",
  }),
  createData(1, "0xjsj3849923hjd", 20, 18, {
    date: "4-23-2023",
    purposer: "0xi83hdhHHhsd39",
    description: "change mmr to 8%",
  }),
  createData(2, "0x83udh388hh8s8h", 10, 8, {
    date: "12-21-2023",
    purposer: "0xajj2ishjj2",
    description: "Changing interest payment from 1% to 2.8% ",
  }),
];

export default function DaoTransaction() {
  return (
    <>
      <h1 className="text-white text-5xl text-center">DAO</h1>
      <h3 className="text-white text-2xl mb-4  ">Proposals</h3>
      <TableContainer
        component={Paper}
        className="bg-slate-800 rounded-2xl shadow-xl shadow-amber-400 text-white"
      >
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className="text-white">Nonce</TableCell>
              <TableCell className="text-white">Hash</TableCell>
              <TableCell className="text-white">Votes</TableCell>
              <TableCell className="text-white">Votes Needed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.nonce} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
