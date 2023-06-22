import { cache } from "react";
import { supabase } from "supabase";


export const addTransaction = async (transactionHash: string, user: string, timestamp: string, name: string,type:string) => {
const res = await supabase
          .from('Past Transactions')
          .insert([{transactionHash: transactionHash, user: user, timestamp: timestamp, name: name,type:type}]);
          return res;
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