'use client';
import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { Address } from 'wagmi';
import { ethers } from 'ethers';
import AddLiquidityButton from '../../forms/buttons/trade/AddLiquidityButton';
import useRedstonePayload, { getPayload } from '../../../utils/contractWrites/exchange';

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
    positionSize:number
    minLoanAmt:number


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
const AddLiquidityModal: React.FC<Props> = ({ tradeId, user, vaultBalance, currentCollateral, leverage, currrentLoanAmt, maxLoanAmt, minimummarginReq,vammData,side,positionSize,minLoanAmt }) => {
    const maxAllowed = maxLoanAmt - currrentLoanAmt; //would be  maxLoanAmt - CurrentLoanAmt
    const k = vammData.baseAsset * vammData.quoteAsset;
    
    const payload = useRedstonePayload()
    const [modalIsOpen, setIsOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [check, setCheck] = useState(false);
    const [rawValue, setRawValue] = useState<number>(0); //in usdc
    const [leverageValue, setLeverageValue] = useState<number>(0); //leverage
    const usdcAmtRef = useRef<HTMLInputElement>(null);
    const levRef = useRef<HTMLInputElement>(null);
    const newPSizeRef = useRef<HTMLInputElement>(null);
    const entryPriceRef = useRef<HTMLInputElement>(null);
    const newTotalPSizeRef = useRef<HTMLInputElement>(null);
    const [newMmr, setNewMmr] = useState<number>(0);

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
        if (usdcAmtRef.current && levRef.current) {
            // if (leverageInputRef.current) {
            if (parseFloat(levRef.current.value) > 15) levRef.current.value = '15';
            if (parseFloat(levRef.current.value) < 1) levRef.current.value = '1';
            //     setLeverage(parseFloat(levRef.current.value));
            //   }
            //   if (usdcAmtRef.current) {
            if (parseFloat(usdcAmtRef.current.value) < 1) usdcAmtRef.current.value = '1';
            //     setCollateral(parseFloat(usdcAmtRef.current.value));
            //   }

            const value = parseFloat(usdcAmtRef.current.value.replace('$', "")) * 10 ** 6 * parseFloat(levRef.current.value);
            const leverageValue = parseFloat(levRef.current.value);
            const rawValue = parseFloat(usdcAmtRef.current.value.replace('$', "")) * 10 ** 6;
            console.log('value', value);
            console.log('raw', rawValue);
            const totalCollateral = rawValue + Number(currentCollateral);
            const totalLoan = Number(leverageValue * rawValue) + Number(currrentLoanAmt);
            console.log('totalLoan', totalLoan/10**6);
            console.log('calculation', collateralToLoan(totalCollateral, totalLoan) * 10 ** 4);
            console.log('mmr', minimummarginReq);
            if (collateralToLoan(totalCollateral, totalLoan) * 10 ** 4 < Number(minimummarginReq)) {
                setIsError(true);
                setErrorMessage(`Minimum Margin Requirements Not Met`);
                setCheck(false);
                setRawValue(0);
            } else if (value > maxAllowed) {
                setIsError(true);
                setErrorMessage('Amount exceeds max allowed');
                setCheck(false);
                setRawValue(0);
            } else if (value <= 0 || rawValue <= 0 || leverageValue <= 0 || value <= Number(minLoanAmt)) {
                console.log('here',minLoanAmt,'totalCollateral',value);
                setIsError(true);
                setErrorMessage('Amount is less than min allowed');
                setCheck(false);
                setRawValue(0);
            } else {
                setIsError(false);
                setErrorMessage('');
                setCheck(true);
                setRawValue(rawValue);
                setLeverageValue(leverageValue);
                const [newEntryPrice,newPs] = getEntryPriceAndPsize(rawValue * leverageValue);
                entryPriceRef.current ? entryPriceRef.current.value = '$'.concat(String((newEntryPrice/10**6).toFixed(2))) : null;
                newPSizeRef.current ? newPSizeRef.current.value = ethers.utils.formatUnits(Math.floor(newPs),6) : null;
                newTotalPSizeRef.current ? newTotalPSizeRef.current.value = ethers.utils.formatUnits(Math.floor(newPs + Number(positionSize)),8) : null;
            }
        }
    };
    const getEntryPriceAndPsize = (newAmt:number) => {
        const newQ = k/(Number(vammData.baseAsset) + Number(newAmt) *Number(side));
        const newPs = Number(vammData.quoteAsset) - newQ;
        const newEntryPrice = newAmt*10**6/newPs;
        return [newEntryPrice,newPs]; 
    }
    const collateralToLoan = (collateral: number, loan: number) => {
        const newMmr = (collateral/loan ) *100;
        setNewMmr(newMmr);
        return newMmr;
    };

    useEffect(() => {
        console.log('USE EFFECT')
        return () => {
            setRawValue(0);
            setLeverageValue(0);
        }
    },[]);
 
    return (
        <div>
            <button className='lg:px-2 py-1 bg-blue-500 rounded-xl hover:scale-125' onClick={openModal}>Add Liquidity</button>
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
                    <h1 className='text-white text-center text-3xl '>Add Liquidity</h1>
                    {isError && <p className='text-red-500 text-center gap-y-0'>{errorMessage}</p>}
                    <div className='flex flex-col  text-center  gap-x-4 border-2 border-white bg-sky-500 text-white w-full'>
                        <div className='flex flex-row justify-around m-2 '>
                            <p className='text-sm lg:text-lg'>Trade ID</p>
                            <div className='flex-col'>
                                <p className='text-sm md:text-md lg:text:lg text-sky-100'>{tradeId.slice(30,45)}</p>
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
                                <p className='text-gray-800 text-sm lg:text-md'>Current Leverage</p>
                                <p className='text-xs md:text-sm lg:text-md text-sky-100'>{leverage}</p>
                                <hr />

                            </div>
                            <div className='flex flex-col'>
                                <p className='text-gray-800 text-sm lg:text-md'>Current Loan Amt</p>
                                <p className='text-xs md:text-sm lg:text-md text-sky-100'>${currrentLoanAmt ? String(parseFloat(ethers.utils.formatUnits(currrentLoanAmt, 6)).toFixed(2)) : 0}</p>
                                <hr />

                            </div>
                            <div className='flex flex-col'>
                                <p className='text-gray-800 text-sm lg:text-md'>Current MMR</p>
                                <p className='text-xs md:text-sm lg:text-md text-sky-100'>{minimummarginReq / 10 ** 6 * 100}%</p>
                                <hr />

                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <div className='flex flex-row justify-evenly text-white  my-2'>
                            <p className='text-xs md:text-lg lg:text:2xl mr-7'>Added Liquidity </p>
                            <div className='flex flex-col vtext-center '>
                                <input type='number' placeholder="$0.00" prefix={"$"} className='text-center text-md lg:text-lg bg-sky-700 w-[5rem] rounded-3xl text-sky-200' ref={usdcAmtRef} onChange={handleValidation} />
                                <p className='text-xs md:text-md lg:text:lg text-sky-100'>USDC Amt</p>
                            </div>
                            <div className='flex flex-col text-center'>
                                <input type='number' placeholder="0" className='text-center  text-md lg:text-lg bg-sky-700 w-[5rem] rounded-3xl text-sky-200' ref={levRef} onChange={handleValidation} />
                                <p className='text-xs md:text-sm lg:text:md text-sky-100'>Leverage</p>
                            </div>
                        </div>
                        <div className='flex flex-row justify-around'>

                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Balance</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${vaultBalance ? String(Number(ethers.utils.formatUnits(vaultBalance, 6)).toFixed(2)) : '0.00'}</p>
                            </div>
                            <div className='flex flex-row justify-between gap-x-4 mt-1'>
                                <p className='text-sm text-white '>New Loan Amount: </p>
                                <div className='flex flex-col'>
                                    <p className='text-xs md:text-md lg:text:lg text-sky-100'>${leverageValue && rawValue ? parseFloat(ethers.utils.formatUnits(Math.floor(leverageValue * rawValue), 6)).toFixed(2) : '0.00'}</p>
                                    <hr />
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <h3>New Balances</h3>
                        <div className='flex flex-row justify-around'>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Total Loan</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${leverageValue && rawValue ? parseFloat(ethers.utils.formatUnits(leverageValue * rawValue + Number(currrentLoanAmt), 6)).toFixed(2) : '0.00'}</p>
                            </div>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Total Collateral</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>${currentCollateral && rawValue ? parseFloat(ethers.utils.formatUnits(rawValue + Number(currentCollateral), 6)).toFixed(2) : '0.00'}</p>
                            </div>
                            <div className='flex flex-col text-xs'>
                                <p className='text-gray-800 text-sm lg:text-md'>Collateral:Loan</p>
                                <p className=' md:text-md lg:text-xl text-sky-100'>{newMmr.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col  text-center justify-between gap-x-4 border-2 border-white bg-sky-500 px-4'>
                        <div className='flex flex-row justify-between'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated Entry Price</p>
                            <div className='flex flex-col'>
                                <input className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32'ref={entryPriceRef} />
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated new Position Size</p>
                            <div className='flex flex-col'>
                                <input className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32'ref={newPSizeRef} />
                                <hr />
                            </div>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <p className='text-md md:text-lg lg:text:xl text-sky-100'>Estimated Total Position Size</p>
                            <div className='flex flex-col'>
                                <input className='text-sm md:text-lg lg:text:xl text-sky-100 bg-transparent text-right disabled w-32'ref={newTotalPSizeRef} />
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-evenly gap-x-8'>
                        <button className='px-2 py-1 text-white bg-sky-200 rounded-lg text-sm md:text-md lg:text-lg' onClick={closeModal}>Cancel</button>
                        {payload && rawValue && check && user && leverageValue?(

                            <AddLiquidityButton payload={payload} value={Number(rawValue)} tradeId={tradeId} disabled={!check && rawValue < 0 && leverageValue < 0} user={user} leverage={leverageValue} />
                        ):
                        (
                            <button className='px-2 py-1 text-white bg-sky-300 rounded-lg'>Loading...</button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AddLiquidityModal
