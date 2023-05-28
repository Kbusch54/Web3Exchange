'use client';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Address } from 'wagmi';
import { ethers } from 'ethers';
import RemoveLiquidityButton from '../../forms/buttons/RemoveLiquidityButton';
import CloseOutPositionButton from '../../forms/buttons/CloseOutPosition';

interface Props {
    tradeId: string;
    user: Address;
    vaultBalance: number;
    currentCollateral: number;
    leverage: number;
    currrentLoanAmt: number;
    maxLoanAmt: number;
    minimummarginReq: number;
    side:number;
    vammData:{
        baseAsset:number,
        quoteAsset:number,
    }
    currentPositionSize:number


}
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        backgroundColor: 'transparent',
        border: 'none',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
    },
    AnimationEffect: {
        enter: 'ease-out',
        exit: 'ease-in',
    },

};
// Modal.setAppElement('#yourAppElement');
const ClosePositionModal: React.FC<Props> = ({ tradeId, user, currentCollateral, currrentLoanAmt, vammData,currentPositionSize }) => {
    const maxAllowed = currentPositionSize; //would be current positon size
    const k = vammData.baseAsset * vammData.quoteAsset;

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    const getExitPriceAndUsdc = (positionSize:number) => {
        const newBase = (k)/(vammData.quoteAsset + positionSize );
        const usdc = (vammData.baseAsset - newBase)/100;
        const newExitPrice = (usdc*10**8)/positionSize;
        return [newExitPrice,usdc]; 
    }
    const amountOwed = (positionSize: number,usdcAmt:number) => {
        const amountOwed = positionSize / currentPositionSize * currrentLoanAmt;
        const pnl = usdcAmt - amountOwed;
        return [pnl,amountOwed];
    };
    const [newExitPrice,usdcAmt] = getExitPriceAndUsdc(currentPositionSize);
    const [pnl,amountOwedFromLoan]=amountOwed(currentPositionSize,usdcAmt)

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //   subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

  
  
    return (
        <div>
            <button className='lg:px-2 py-1 bg-red-500 rounded-xl hover:scale-125' onClick={openModal}>Close Position</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Add Liquidity Modal"
            >
                <div className='flex flex-col  modal-background opacity-90 gap-y-8 w-[80vw] md:w-auto p-12 md:p-12 text-lg relative'>
                    <button onClick={closeModal} className='text-lg text-white bg-red-500 rounded-full py-[.07rem] px-[.375rem] absolute top-5 right-4'>X</button>
                    <h1 className='text-white text-center text-3xl '>Close Position</h1>
                    <div className='flex flex-col  text-center  gap-x-4 border-2 border-white bg-sky-500 text-white w-full'>
                        <div className='flex flex-row justify-around m-2 '>
                            <p className='text-sm lg:text-lg'>Trade ID</p>
                            <div className='flex-col'>
                                <p className='text-sm md:text-md lg:text:lg text-sky-100'>{tradeId}</p>
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-around m-2'>
                            <p className='text-sm lg:text-lg'>Current Collateral</p>
                            <div className='flex-col'>
                                <p className='text-sm  md:text-md lg:text-lg text-sky-100 '> <div className='flex flex-col text-xs'>
                                    <p className=' md:text-md lg:text-xl text-sky-100'>${currentCollateral ? parseFloat(ethers.utils.formatUnits(currentCollateral, 6)).toFixed(2) : '0.00'}</p>
                                </div></p>
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-around m-2'>

                            <div className='flex flex-col '>
                                <p className='text-gray-800 text-sm lg:text-md'>Current Position Size</p>
                                <p className='text-xs md:text-sm lg:text-md text-sky-100'>{currentPositionSize?parseFloat(ethers.utils.formatUnits(currentPositionSize,8)).toFixed(4):0}</p>
                                <hr />
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-gray-800 text-sm lg:text-md'>Current Loan Amt</p>
                                <p className='text-xs md:text-sm lg:text-md text-sky-100'>${currrentLoanAmt ? String(parseFloat(ethers.utils.formatUnits(currrentLoanAmt, 6)).toFixed(2)) : 0}</p>
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4 py-4 '>
                        <div className='flex flex-row justify-between'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated Exit Price</p>
                            <div className='flex flex-col'>
                                <p className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32 mt-1'>${newExitPrice?(newExitPrice/10**6).toFixed(2):'0.00'}</p>
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between mb-4'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated PNL</p>
                            <div className='flex flex-col'>
                                <p className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32 mt-1'>${pnl?(pnl/10**6).toFixed(2):'0.00'} </p>
                                <hr />
                            </div>
                        </div>                 
                    </div>
                    <div className='flex flex-row justify-evenly gap-x-8'>
                        <button className='px-2 py-1 text-white bg-sky-200 rounded-lg text-sm md:text-md lg:text-lg' onClick={closeModal}>Cancel</button>
                        <CloseOutPositionButton  tradeId={tradeId} disabled={true} user={user}  />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ClosePositionModal
