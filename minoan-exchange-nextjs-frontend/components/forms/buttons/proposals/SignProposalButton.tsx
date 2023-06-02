import { ethers } from 'ethers';
import React, { use, useEffect, useState } from 'react'
import { useContractWrite, Address, useSigner } from 'wagmi';
import { supabase } from '../../../../supabase';

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

  useEffect(() => {
    return () => {
      setSigned(false);
      setAddedToDB(false);
      setError(null);
    }
  }, [signed, addedToDB, error]);

  const { data: signer, isError, isLoading } = useSigner();
  //@ts-ignore
  const hanldeSign = async (e) => {
    e.preventDefault();
    if (!transactionHash) {
      alert('no transaction hash')
    } else {
      const signature = await signer
        ?.signMessage(ethers.utils.arrayify(transactionHash))
        .catch((err: Error) => {
          alert(err);
        });

      if (signature) {
        const verified = ethers.utils.verifyMessage(
          ethers.utils.arrayify(transactionHash),
          signature
        );
        console.log('is verified', verified);
        if (verified == user) {
          setSigned(true);
          await updateDataBase(signature, transactionHash);
        } else {
          setError('Signature not verified')
        }
      }
    }
  };
  const updateDataBase = async (signature: string, transacitonHash: string) => {
    if (signatures && signers) {
      if (signers.includes(user)) return setError('Already signed')
      //update
      try {
        const { error } = await supabase
        .from('Proposals').update([{ timeStamp:timeStamp,signatures: [...signatures, signature], signers: [...signers, user] }]).eq('contractNonce', contractAdd + '_' + Number(nonce));
        setAddedToDB(true);  
      } catch (error) {
        console.error('Error updating proposal:', error);
        setError('Error updating proposal')
      }
    }
    else {
      //create

      try {
        const { error } = await supabase
          .from('Proposals')
          .insert([{ contractAddress: contractAdd, contractNonce: contractAdd + '_' + Number(nonce), etherscanTransactionHash: null, proposer: user, nonce: Number(nonce), to: addressTo, transactionHashToSign: transacitonHash, executor: null, signatures: [signature], timeStamp: timeStamp, isProposalPassed: false, description: null, result: null, signers: [user] }]);
        setAddedToDB(true);
        if (error) {
          console.error('Error adding proposal:', error);
        } else {
          console.log('Proposal added successfully');
          setError('Error adding proposal')
        }
      } catch (error) {
        console.error('Error adding proposal:', error);
        setError('Error adding proposal')
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