
// const sdk = require("redstone-sdk");

import sdk from "redstone-sdk"
export const getPayload = async() =>{

    const unsignedMetadata = "manual-payload";
    const redstonePayload = await sdk.requestRedstonePayload(
        {
        dataServiceId: "redstone-main-demo",
        uniqueSignersCount: 1,
        dataFeeds: ["TSLA","META","GOOG"],
        urls:["https://d33trozg86ya9x.cloudfront.net"],
        },
        // @ts-ignore
        unsignedMetadata
    );
    return `0x${redstonePayload}`
}