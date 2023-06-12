'use client'
const sdk = require("redstone-sdk");
import { useEffect, useState } from 'react';

// import sdk from "redstone-sdk"
export const getPayload = async() =>{

    const unsignedMetadata = "manual-payload";
const redstonePayload = await sdk.requestRedstonePayload(
    {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["TSLA","META","GOOG"],
    },
    ["https://d33trozg86ya9x.cloudfront.net"],
    unsignedMetadata
  );
    return `0x${redstonePayload}`
}




const useRedstonePayload = () => {
    const [payload, setPayload] = useState<string|null>(null);

    useEffect(() => {
        const getPayload = async () => {
            const unsignedMetadata = "manual-payload";
            const redstonePayload = await sdk.requestRedstonePayload(
                {
                    dataServiceId: "redstone-main-demo",
                    uniqueSignersCount: 1,
                    dataFeeds: ["TSLA", "META", "GOOG"],
                },
                ["https://d33trozg86ya9x.cloudfront.net"],
                unsignedMetadata
            );
            setPayload(`0x${redstonePayload}`);
        };

        // Call getPayload immediately on component mount
        getPayload();
        
        // Then set an interval to call getPayload every 5 seconds
        const intervalId = setInterval(getPayload, 30000); // 5000ms = 30 s

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return payload;
};

export default useRedstonePayload;
