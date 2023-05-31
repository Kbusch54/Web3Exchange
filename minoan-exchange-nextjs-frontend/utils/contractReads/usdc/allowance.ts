import { UsdcAbi } from "../../abis/UsdcAbi";
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
const exchange = '0xbf68D4a14c353B9781e5c481413DaEa0d9bD5405';

export const useGetAllowance = (address: string) => {
    //@ts-ignore
  const [allowance, setAllowance] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  const { data, error, isLoading } = useContractRead({
    address: '0xAADbde5D0ED979b0a88770be054017fC40Bc43d1',
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
