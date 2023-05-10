"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import DaoModal from "./interior/DaoModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PurposalModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        onClick={handleOpen}
        className=" py-4 my-6 text-xl px-8 md:px-32 md:py-12 rounded-full md:my-12  bg-amber-400 hover:shadow-2xl hover:shadow-amber-200 text-white md:text-5xl text-center hover:scale-125"
      >
        Purpose
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DaoModal handleClose={handleClose}/>
        </Box>
      </Modal>
    </div>
  );
}
