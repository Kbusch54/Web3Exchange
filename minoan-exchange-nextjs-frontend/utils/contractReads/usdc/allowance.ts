import { UsdcAbi } from "../../abis/UsdcAbi";
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { exchange, usdc } from "../../address";
import { Address } from "viem";

export const useGetAllowance = (address: string) => {
  
  const [allowance, setAllowance] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  const user:Address = address as Address;
  const { data,error,isLoading } = useContractRead({
    address: usdc,
    abi: UsdcAbi,
    functionName: 'allowance',
    args: [user, exchange],
    account: user,
    watch: true,
  });

  useEffect(() => {
    console.log('data from contract',data);
    if (!isLoading && !error) {
        //@ts-ignore
      setAllowance(data);
      setIsPending(false);
    }
    if (error) {
      setIsError(error.message);
      setIsPending(false);
    }
  }, [isLoading, error, data]);

  return { allowance, isPending, isError };
};
