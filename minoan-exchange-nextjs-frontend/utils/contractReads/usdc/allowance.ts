import { UsdcAbi } from "../../abis/UsdcAbi";
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { exchange, usdc } from "../../address";

export const useGetAllowance = (address: string) => {
    //@ts-ignore
  const [allowance, setAllowance] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  const { data, error, isLoading } = useContractRead({
    address: usdc,
    abi: UsdcAbi,
    functionName: 'allowance',
    args: [address, exchange],
    watch:   true ,
  });

  useEffect(() => {
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
