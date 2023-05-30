import { AriadneDAO } from "../../abis"
import { useEffect, useState } from "react";
import { useContractRead } from 'wagmi';
import { ariadneGoogle,ariadneMeta,ariadneTesla} from "../../address";

export const useGetCurrentId= (ammId:string) => {
    //@ts-ignore
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const ariadneAddress = getAriadnePool(ammId);

  const { data, error, isLoading } = useContractRead({
    address: ariadneAddress,
    abi: AriadneDAO,
    functionName: 'currentId',
  });

  useEffect(() => {
    if (!isLoading && !error) {
        //@ts-ignore
      setCurrentId(data);
      setIsPending(false);
    }
    if (error) {
      setIsError(error.message);
      setIsPending(false);
    }
  }, [isLoading, error, data]);

  return { currentId, isPending, isError };
};
function getAriadnePool(ammId: string) {
    const amm =ammId.toLowerCase();
    if(amm === "tesla"){
        return ariadneTesla;
    }else if(amm === "google"){
        return ariadneGoogle;
    }else if(amm === "meta"){
        return ariadneMeta;
    }
    else{
        return ariadneTesla;
    }
}