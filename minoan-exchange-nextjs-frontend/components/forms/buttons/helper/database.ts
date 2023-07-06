import { cache } from "react";
import { supabase } from "supabase";


export const addTransaction = async (transactionHash: string, user: string, timestamp: string, name: string,type:string) => {
const res = await supabase
          .from('Past Transactions')
          .insert([{transactionHash: transactionHash, user: user, timestamp: timestamp, name: name,type:type}]);
          return res;
}
export const updateProposal = async (contractNonce:string) => {
  const { data, error } = await supabase
  .from('Proposals')
  .update({isProposalPassed:true})
  .eq('contractNonce',contractNonce)
  .select()
  console.log('data or err on upsert',data,error)
  return data;
}
export const getTransactions = cache(async (user: string) => {
    const { data, error } = await supabase
            .from('Past Transactions')
            .select()
            .ilike('user', user)
            .order('timestamp', { ascending: false })
            .range(0, 4)
            return data;
    });
    export const addProposal = async (contractAddress:string, nonce:number,user:string, addressTo:string,transacitonHash:string,description:string,etherscanTransactionHash:string) => {
        const { data, error } = await supabase
      .from('Proposals')
      .insert([ {contractAddress:contractAddress,contractNonce:contractAddress+'_'+Number(nonce),etherscanTransactionHash:etherscanTransactionHash,proposer:user,nonce:Number(nonce), to:addressTo, transactionHashToSign:transacitonHash, executor:null, signatures:[], timeStamp:Date.now(), isProposalPassed:false, description:description, result:null, signers:[]} ]);
      console.log('data or err on add proposal',data,error)
        return data;
    }
    export const upsertProposal = async(contractAddress:string, nonce:number,user:string,signatures:string) => {
        const { data, error } = await supabase
        .from('Proposals')
        .update({signatures:[signatures],signers:[user]})
        .eq('contractNonce',contractAddress+'_'+Number(nonce))
        .select()
        console.log('data or err on upsert',data,error)
        return data;
    }
    export const executedProposal = async(contractAddress:string, nonce:number,executor:string,executionTransactionhash:string) => {
        const { data, error } = await supabase
      .from('Proposals')
      .update([{result:executionTransactionhash,isProposalPassed:true,executor:executor}])
        .eq('contractNonce', contractAddress+'_'+Number(nonce))
    }