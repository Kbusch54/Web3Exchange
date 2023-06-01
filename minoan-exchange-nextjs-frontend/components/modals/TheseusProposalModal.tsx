"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Modal from 'react-modal';
import { getAllFunctions, getFunctionCallDataLoanPool } from '../../utils/contractReads/loanpool/functionReading';
import { getAllUpdateFunctions, getFunctionCallDataAriadne } from '../../utils/contractReads/ariadneDao/internalFunctions';
import { Address } from 'wagmi';
import AriadnePurposeButton from '../forms/buttons/AriadnePurposeButton';
import { useGetCurrentId } from '../../utils/contractReads/ariadneDao/currentId';
import DAODetails from './interior/DAODetails';


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
  export default function TheseusProposalModal(){
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const [description, setDescription] = useState<string>('');
    const [isError, setIsError] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [callData, setCallData] = useState<string | null>(null);

    
  const { currentId } = useGetCurrentId('theseus');
  console.log('id',currentId);
  
  useEffect(() => {
 
  }, [currentId]);
  return(
    <div>
        hello</div>
  )
  }