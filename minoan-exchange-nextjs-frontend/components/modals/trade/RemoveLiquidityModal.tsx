'use client';
import React, { useState, useEffect, useRef,use } from 'react';
import Modal from 'react-modal';
import { Address } from 'wagmi';
import { ethers } from 'ethers';
import RemoveLiquidityButton from '../../forms/buttons/trade/RemoveLiquidityButton';
import { getPayload } from '../../../utils/contractWrites/exchange';

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
const RemoveLiquidityModal: React.FC<Props> = ({ tradeId, user, vaultBalance, currentCollateral, leverage, currrentLoanAmt, maxLoanAmt, minimummarginReq,vammData,side,currentPositionSize }) => {
    const maxAllowed = currentPositionSize; //would be current positon size
    const k = vammData.baseAsset * vammData.quoteAsset;

    const payload = use(getPayload());

    let subtitle;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [check, setCheck] = useState(false);
    const [rawValue, setRawValue] = useState<number>(0);
    const positionRef = useRef<HTMLInputElement>(null);
    const usdcAmtRef = useRef<HTMLInputElement>(null);
    const exitPriceRef = useRef<HTMLInputElement>(null);
    const [newLoanAmt, setNewLoanAmt] = useState<number>(currrentLoanAmt);

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
    const handleValidation = () => {
        if (positionRef.current ) {
            const value = parseFloat(positionRef.current.value) * 10 ** 8 ;
            const rawValue = parseFloat(positionRef.current.value) * 10 ** 8;
            if (value > maxAllowed) {
                setIsError(true);
                setErrorMessage('Amount exceeds current position size');
                setCheck(false);
                setRawValue(0);
            } else if (value <= 0 || rawValue <= 0 ) {
                setIsError(true);
                setErrorMessage('Amount is less than min allowed');
                setCheck(false);
                setRawValue(0);
            } else {
                setIsError(false);
                setErrorMessage('');
                setCheck(true);
                setRawValue(rawValue);
                const [newExitPrice,usdcAmt] = getExitPriceAndUsdc(rawValue );
                exitPriceRef.current ? exitPriceRef.current.value = '$'.concat(String((newExitPrice/10**6).toFixed(2))) : null;
                const [pnl,amountOwedFromLoan]=amountOwed(rawValue,usdcAmt)
                usdcAmtRef.current ? usdcAmtRef.current.value = '$'.concat(String((pnl/10**6).toFixed(2))) : null;
                setNewLoanAmt(currrentLoanAmt -amountOwedFromLoan);
            }
        }
    };
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
    useEffect(() => {
    }, [check, rawValue,payload]);
    return (
        <div>
            <button className='lg:px-2 py-1 bg-yellow-400 rounded-xl hover:scale-125' onClick={openModal}>Remove Liquidity</button>
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
                    <h1 className='text-white text-center text-3xl '>Remove Liquidity</h1>
                    {isError && <p className='text-red-500 text-center gap-y-0'>{errorMessage}</p>}
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
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <div className='flex flex-row justify-evenly text-white  my-2'>
                            <p className='text-xs md:text-lg lg:text:2xl mr-7'>Remove Liquidity </p>
                            <div className='flex flex-col vtext-center '>
                                <input type='number' placeholder="0"  className='text-center text-md lg:text-lg bg-sky-700 w-[8rem] rounded-3xl text-sky-200' ref={positionRef} onInput={handleValidation} />
                                <p className='text-xs md:text-md lg:text:lg text-sky-100'>Position to Remove</p>
                            </div> 
                        </div>
                        <div className='flex flex-row justify-around'>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Current Position Value</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${currentPositionSize ? ((currentPositionSize* (vammData.baseAsset/vammData.quoteAsset))/10**8).toFixed(2) : '0.00'}</p>
                            </div>
                            <div className='flex flex-row justify-between gap-x-4 mt-1'>
                                <p className='text-sm text-white '>New Position Size: </p>
                                <div className='flex flex-col'>
                                    <p className='text-md md:text-lg lg:text:xl text-sky-100'>{ rawValue ? parseFloat(ethers.utils.formatUnits( Math.floor(currentPositionSize - rawValue), 8)).toFixed(2) : (currentPositionSize/10**8).toFixed(2)}</p>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <h3>New Balances</h3>
                        <div className='flex flex-row justify-around'>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-xs md:text-sm lg:text-md'>Total Loan</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${rawValue && newLoanAmt ? parseFloat(ethers.utils.formatUnits( Math.floor(newLoanAmt), 6)).toFixed(2) : (currrentLoanAmt/10**6).toFixed(2)}</p>
                            </div>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-xs md:text-sm lg:text-md'> Value Remaining</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${rawValue && currentPositionSize ?
                                  (((currentPositionSize* (vammData.baseAsset/vammData.quoteAsset))/10**8)- ((rawValue* (vammData.baseAsset/vammData.quoteAsset))/10**8)).toFixed(2) :((currentPositionSize* (vammData.baseAsset/vammData.quoteAsset))/10**8).toFixed(2)}</p>
                            </div>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-xs md:text-sm lg:text-md'>Value Removed</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${rawValue && currentPositionSize ?((rawValue* (vammData.baseAsset/vammData.quoteAsset))/10**8).toFixed(2) :'0'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4 '>
                        <div className='flex flex-row justify-between'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated Exit Price</p>
                            <div className='flex flex-col'>
                                <input className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32'ref={exitPriceRef} />
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between mb-4'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated PNL</p>
                            <div className='flex flex-col'>
                                <input className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32'ref={usdcAmtRef} />
                                <hr />
                            </div>
                        </div>                 
                    </div>
                    <div className='flex flex-row justify-evenly gap-x-8'>
                        <button className='px-2 py-1 text-white bg-sky-200 rounded-lg text-sm md:text-md lg:text-lg' onClick={closeModal}>Cancel</button>
                        {rawValue && check && payload?(

                            <RemoveLiquidityButton value={rawValue} tradeId={tradeId} disabled={!check && rawValue < 0} user={user} payload={payload}  />
                            ):(
                            <button className='px-2 py-1 text-white bg-sky-900 rounded-lg text-sm md:text-md lg:text-lg'>Loading ...</button>
                            )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default RemoveLiquidityModal
