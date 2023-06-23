"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Modal from 'react-modal';
import { getAllFunctions, getFunctionCallDataLoanPool } from '../../../utils/contractReads/loanpool/functionReading';
import { getAllUpdateFunctions, getFunctionCallDataAriadne } from '../../../utils/contractReads/ariadneDao/internalFunctions';
import { Address } from 'wagmi';
import AriadnePurposeButton from '../../forms/buttons/proposals/ProposeButton';
import { useGetCurrentId } from '../../../utils/contractReads/ariadneDao/currentId';
import DAODetails from '../interior/DAODetails';
import { getFunctionsOf, getAllExchangeFunctions, getFunctionCallDataThesesusAll } from '../../../utils/contractReads/theseus/internalFunctions';
import InputMaster from '../../forms/inputs/InputMaster';
import TheseusButtonSelection from '../interior/TheseusButtonSelection';
import { convertCamelCaseToTitle } from '../../../utils/helpers/functions';
import ProposeButton from '../../forms/buttons/proposals/ProposeButton';
import { theseus } from '../../../utils/address';


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
interface Props {
    user: Address;
}
export default function TheseusProposalModal({user}:Props) {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const [description, setDescription] = useState<string | null>(null);
    const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
    const [contractFuncs, setContractFuncs] = useState<any>(null);
    const [contractName, setContractName] = useState<string | null>(null);
    const [callData, setCallData] = useState<string | null>(null);
    const [inputData, setInputData] = useState<any[] | null>(null);
    const [contract, setContract] = useState<string>('theseus');
    const [check, setCheck] = useState<boolean>(false);
    const [addressTo, setAddressTo] = useState<Address | null>(null);



    const handleSelection = (e: any) => {
        funcs = getFunctionsOf(e.target.id)
        setContract(e.target.id);
        setContractFuncs(funcs);
        setSelected(true);
        setContractName(e.target.innerText);
    };
    const handleFunctionSelect = (e: any) => {
        setSelected(false);
        setSelectedFunction(e.target.id);
    };

    const handleInputChange = (index: number, value: any) => {
        if (selectedFunction) {
            const checkLength = contractFuncs[selectedFunction].inputs.length;
            const updatedInputData = inputData ? [...inputData] : [];
            updatedInputData[index] = value;
            setInputData(prevState => updatedInputData);
            if (updatedInputData.length == checkLength && checkIfEmpty(updatedInputData)) {
                const [callDATA, to] = getFunctionCallDataThesesusAll(contractFuncs[selectedFunction].name, updatedInputData, contract);
                const des = contractFuncs[selectedFunction].name + '(' + updatedInputData.map((item: any) => item.toString()).join(', ') + ')';
                setDescription("Proposing " + contractFuncs[selectedFunction].name + " to " + contractName + ' ' + des);
                setCallData(prevState => callDATA);
                //@ts-ignore
                setAddressTo(prevState =>to);
                setCheck(true);
            } else {
                setCallData(null);
                setCheck(false);
            }
        }

    };
    const checkIfEmpty = (data: any[]) => {
        let empty = true;
        data.forEach((item: any) => {
            if (item == null || item == undefined || item == '' || item == 'empty' || item < 0) {
                empty = false;
            }
        })
        return empty;
    }
    function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.preventDefault();
        const descriptionValue = e.target.value;
        setDescription(descriptionValue);
    }
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
        setDescription(null);
        setContractFuncs(null);
        setContractName(null);
        setAddressTo(null);
        setInputData(null);
        setCallData(null);
        setCheck(false);
        setIsOpen(false);
    }
    const { currentId } = useGetCurrentId('theseus');

    useEffect(() => {
        console.log('current id', currentId);
        console.log('call data', callData);
        console.log('address to', addressTo);
        console.log('description', description);
        console.log('user', user);
        console.log('check', check);
        

    }, [currentId, callData,check]);

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
                            <TheseusButtonSelection handleSelection={handleSelection} />
                        </div>
                    )}
                    {selected && contractFuncs && (
                        <div>

                            <h1 className='text-white text-center m-2 mx-32'>{contractName} Functions to Propose</h1>
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
                                <div className='flex flex-col justify-center items-center' >
                                    <h1 className='text-white text-center m-12 '>{convertCamelCaseToTitle(contractFuncs[selectedFunction].name)}</h1>
                                    <div className='flex  flex-wrap justify-center  gap-5  text-md xl:text-lg text-center text-white pb-12 px-4 '>
                                        {contractFuncs[selectedFunction].inputs.map((input: any, index: number) => {
                                            return (
                                                <div key={input.name} className='flex flex-col'>
                                                    <InputMaster index={index} input={input} handleInputChange={handleInputChange} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className='flex flex-row justify-center gap-x-2 m-2'>
                                        <label className='mt-4 text-sm md:text-lg text-sky-900'>
                                            Description:
                                        </label>

                                        <textarea className='text-gray-800 text-sm lg:text-md text-left p-2 rounded-xl'
                                            name="postContent"
                                            onChange={(e) => handleDescription(e)}
                                            placeholder={description ? description : 'Enter a description for your proposal'}
                                            rows={2}
                                            cols={25}
                                        />
                                    </div>
                                    <div className='flex flex-row gap-x-28 justify-between my-4'>
                                        <button disabled className='px-2 py-1 bg-red-500 rounded-2xl text-white text-lg hover:scale-125'>Cancel</button>
                                       
                                        {(check == true && callData != null && addressTo !=null && description !=null && currentId !=null&& user) ? (
                                            <ProposeButton addressTo={addressTo} callData={callData} contractAddress={theseus} description={description} nonce={currentId} user={user} disabled={!check} option='thesesu' close={closeModal} />
                                        ) : (
                                            <button disabled className='px-2 py-1 bg-teal-500 rounded-2xl text-white text-lg hover:scale-125'>Loading...</button>
                                        )}
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


