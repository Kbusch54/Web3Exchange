import { ethers } from 'ethers';
import React, {useEffect, useState } from 'react'
import {  Address, useAccount } from 'wagmi';
import { supabase } from '../../../../supabase';
import { verifyMessage } from 'viem';
import { toast } from 'react-hot-toast';
import {  useRouter } from 'next/navigation';

interface Props {
  user: Address,
  transactionHash: string,
  nonce: number,
  contractAdd: Address,
  addressTo: Address,
  signatures: string[]|null,
  signers: Address[]|null,
  timeStamp: number
}

export default function SignProposalButton({ user, transactionHash, nonce, contractAdd, addressTo, signatures, signers,timeStamp }: Props) {

  const [signed, setSigned] = useState<boolean>(false);
  const [addedToDB, setAddedToDB] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { connector } = useAccount()
  const router = useRouter();



  //@ts-ignore
  const hanldeSign = async (e) => {
    e.preventDefault();
    if (!transactionHash) {
      alert('no transaction hash')
    } else {
      const provider = await connector?.getProvider()
      const signature = await provider.send("personal_sign", [transactionHash, user])

            if (signature.result  ) {
            const verified = ethers.utils.verifyMessage(
             ethers.utils.arrayify(transactionHash),
              signature.result
            );
        if (verified.toLowerCase() == user.toLowerCase()) {
          setSigned(true);
          await updateDataBase(signature.result, transactionHash);
        } else {
          setError('Signature not verified')
        }
      }
    }
  };
  const updateDataBase = async (signature: string, transacitonHash: string) => {
    if (signatures && signers) {
      if (signers.includes(user)) {
         setError('Already signed') 
         toast.error(`Already signed ${nonce} `, {  duration: 6000 ,position:'top-right'});
      }
      //update
      try {
        console.log('updating');
        setAddedToDB(true);  
        const { error } = await supabase
        .from('Proposals')
        .update([{ timeStamp:timeStamp,signatures: [...signatures, signature], signers: [...signers, user] }])
        .eq('contractNonce', contractAdd + '_' + Number(nonce));
        if(error) setError('Error adding proposal')
        if(!error) router.refresh();
        toast.success(`Signed ${nonce} updated DB `, {  duration: 6000 ,position:'top-right'});
      } catch (error) {
        console.error('Error updating proposal:', error);
        setError('Error updating proposal')
        toast.error(`Error updating proposal ${nonce} `, {  duration: 6000 ,position:'top-right'});
      }
    }
    else {
      //create
      try {
        console.log('creating');
        setAddedToDB(true);
        const { error } = await supabase
          .from('Proposals')
          .insert([{ contractAddress: contractAdd, contractNonce: contractAdd + '_' + Number(nonce), etherscanTransactionHash: null, proposer: user, nonce: Number(nonce), to: addressTo, transactionHashToSign: transacitonHash, executor: null, signatures: [signature], timeStamp: timeStamp, isProposalPassed: false, description: null, result: null, signers: [user] }])
        if(error) setError('Error adding proposal')
          if(!error) router.refresh();
        toast.success(`Signed ${nonce} created DB`, {  duration: 6000 ,position:'top-right'});
        if (error) {
          console.error('Error adding proposal:', error);
        } else {
          console.log('Proposal added successfully');
          setError('Error adding proposal')
        }
      } catch (error) {
        console.error('Error adding proposal:', error);
        setError('Error adding proposal')
        toast.error(`Error adding proposal ${nonce} `, {  duration: 6000 ,position:'top-right'});
      }
    }
  }


  if (!error) {
    if (signed) {
      return (
        <button className="px-2 py-1  rounded-2xl  text-lg hover:scale-125 bg-teal-400 text-white"disabled={signed} >Adding to DB....</button>
      )
    }else if(addedToDB){ 
      return (
        <button className="px-2 py-1  rounded-2xl  text-lg hover:scale-125 bg-green-600 text-white">Added to DB</button>
      )
    }else {

      return (
        <button className="px-4 py-1 my-1  rounded-2xl text-lg hover:scale-125 bg-amber-400 text-white"
           onClick={hanldeSign} disabled={signed} >Vote
        </button>
      )
    }
  } else {
    return (
      <button className="px-4 py-1 my-1  rounded-2xl text-lg hover:scale-125 bg-red-500 text-white"  disabled={signed} >{error}</button>
    )
  }


}