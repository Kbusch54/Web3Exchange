import { Button, Typography } from '@mui/material'
import React from 'react'

interface Props {
    //handle close function
    handleClose: () => void
}

const DaoModal: React.FC<Props> = ({handleClose}) => {
    return (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                DAO Purposal
            </Typography>
            <div className="flex flex-row justify-evenly mt-12">
                <Button className="text-white bg-red-500 hover:scale-125 hover:bg-amber-500 " onClick={handleClose}>Cancel</Button>
                <Button className="text-white bg-green-500 hover:scale-125 hover:bg-amber-500" onClick={handleClose}>Purpose</Button>
                <Button className="text-white bg-blue-500 hover:scale-125 hover:bg-amber-500" onClick={handleClose}>Sign And Propose</Button>
            </div>
        </>
    )
}

export default DaoModal
