import { supabase } from "supabase";


export const addTransaction = async (transactionHash: string, user: string, timestamp: string, name: string,type:string) => {
const res = await supabase
          .from('Past Transactions')
          .insert([{transactionHash: transactionHash, user: user, timestamp: timestamp, name: name,type:type}]);
          return res;
}