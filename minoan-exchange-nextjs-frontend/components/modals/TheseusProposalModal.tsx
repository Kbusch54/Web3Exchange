"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Modal from 'react-modal';
import { getAllFunctions, getFunctionCallDataLoanPool } from '../../utils/contractReads/loanpool/functionReading';
import { getAllUpdateFunctions, getFunctionCallDataAriadne } from '../../utils/contractReads/ariadneDao/internalFunctions';
import { Address } from 'wagmi';
import AriadnePurposeButton from '../forms/buttons/AriadnePurposeButton';
import { useGetCurrentId } from '../../utils/contractReads/ariadneDao/currentId';
import DAODetails from './interior/DAODetails';
import { getFunctionsOf, getAllExchangeFunctions } from '../../utils/contractReads/theseus/internalFunctions';
import InputMaster from '../forms/inputs/InputMaster';


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
export default function TheseusProposalModal() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [isError, setIsError] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
    const [contractFuncs, setContractFuncs] = useState<any>(null);
    const [contractName,setContractName] = useState<string | null>(null);
    const [callData, setCallData] = useState<string | null>(null);

    const convertCamelCaseToTitle = (camelCaseString: string) => {
        // Replace uppercase letters with a space followed by the uppercase letter
        const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1');
        // Convert the string to uppercase
        const allCapsString = spacedString.toUpperCase();
        // Remove leading space if present
        const trimmedString = allCapsString.trim();
        // Return the final converted string
        return trimmedString;
    };
    const handleSelection = (e: any) => {
        funcs = getFunctionsOf(e.target.id)
        setContractFuncs(funcs);
        setSelected(true);
        setContractName(e.target.innerText);
    };
    const handleFunctionSelect = (e: any) => {
        setSelected(false);
        setSelectedFunction(e.target.id);
        // const callData = getFunctionCallDataLoanPool(e.target.innerText);
        // console.log('call data', callData);
        // setCallData(callData);
    };
    let funcs: any[] = [];
  

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //   subtitle.style.color = '#f00';
    }


    function closeModal() {
        setSelected(false);
        setSelectedFunction(null);
        setContractFuncs(null);
        setContractName(null);
        setIsOpen(false);
    }
    const { currentId } = useGetCurrentId('theseus');

    useEffect(() => {

    }, [currentId]);
    return (
        <div className=''>
            <button className='py-4 my-6 text-xl px-8 md:px-32 md:py-12 rounded-full md:my-12  bg-amber-400 hover:shadow-2xl hover:shadow-amber-200 text-white md:text-5xl text-center hover:scale-125' onClick={openModal}>Propose</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
                contentLabel="Add Collateral Modal"
            >
                <div className=' flex flex-col justify-center modal-background opacity-90' >
                    {!selected && !contractFuncs && (
                        <div className='m-12'>

                            <h1 className='text-white text-center m-12 '>Smart Contracts</h1>
                            <div className='flex  flex-wrap justify-center gap-5 text-md xl:text-lg text-center text-white pb-12 px-4 '>
                                <button id='internal' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Theseus Functions</button>
                                <button id='exchange' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Exchange</button>
                                <button id='loanPool' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Loan Pool</button>
                                <button id='ammViewer' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Amm Viewer</button>
                                <button id='ariadne' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Create Ariadne</button>
                                <button id='staking' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Staking</button>
                                <button id='usdc' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>USDC</button>
                                <button id='custom' onClick={handleSelection} className='px-5 py-1 hover:scale-125 rounded-2xl bg-blue-500 inline-block'>Custom</button>
                            </div>
                        </div>
                    )}
                    {selected && contractFuncs && (
                        <div>

                            <h1 className='text-white text-center m-2 mx-44'>{contractName} Functions to Propose</h1>
                            <div className='flex  flex-wrap justify-center gap-5 text-md 2xl:text-lg text-center text-white pb-12 px-4 m-12'>
                                {contractFuncs.map((func: any, index: number) => {
                                    return (
                                        <button key={func.name} id={String(index)} onClick={handleFunctionSelect} className='px-2 py-1 hover:scale-125 rounded-2xl bg-amber-500 inline-block overflow-hidden hover:overflow-visible'>{func.name}</button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    <div>

                        <div className='flex justify-center items-center'>
                            {selectedFunction && contractFuncs && (
                                <div>
                                    <h1 className='text-white text-center m-12 px-32'>{convertCamelCaseToTitle(contractFuncs[selectedFunction].name)}</h1>
                                    <div className='flex  flex-wrap justify-center  gap-5  text-md xl:text-lg text-center text-white pb-12 px-4 '>
                                        {contractFuncs[selectedFunction].inputs.map((input: any, index: number) => {
                                            return (
                                                <div key={input.name} className='flex flex-col'>
                                                    <InputMaster index={index} input={input}/>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    )
}


