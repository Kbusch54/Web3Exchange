//tradeId, traderAddress, asset, side, position size, entry price, entry date,  leverage, lastInterest, interestAccrued, startCollateral, currentColateral, openValue, cummulativeFFR, 
//to get pnl call contract.getPnl(tradeId)
// to get liquidation price call contract.getLiquidationPrice(tradeId)

import { Trade } from "../types/custom";

export const tradesData:Trade[] = [
    {
        tradeId: "0x0000000000000000000000009fe46736679d2d9a65f0992f2272de9f3c7fa6e0000000000000000000000000000000000000000000000000000000000000001d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512",
        traderAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        asset: "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3",
        side: 1,
        positionSize: 12.1,
        entryPrice: 10000,
        entryDate: "2021-05-01",
        leverage: 10,
        lastInterest: 0,
        interestAccrued: 0,
        startCollateral: 1000,
        currentCollateral: 1000,
        openValue: 1000,
        cummulativeFFR: 0,
    },
    {
        tradeId: "0x0000000000000000000000009fe46736679d2d9a65f0992f2272de9f3c7fa6e0000000000000000000000000000000000000000000000000000000000000001d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb93366000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512",
        traderAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        asset: "0x9fE46736679d2D9a65F0992F2272de9f3c7fa6e0",
        side: 1,
        positionSize: 0.1,
        entryPrice: 1000,
        entryDate: "2021-05-01",
        leverage: 12,
        lastInterest: 0,
        interestAccrued: 0,
        startCollateral: 100,
        currentCollateral: 100,
        openValue: 1070,
        cummulativeFFR: 0,
    },
    {
        tradeId: "0x0000000000000000000000009fe46736679d2d9a65f0992f2272de9f3c7fa6e0000000000000000000000000000000000000000000000000000000000000001d0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000d72fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512",
        traderAddress: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        asset: "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3",
        side: -1,
        positionSize: 0.1,
        entryPrice: 10000,
        entryDate: "2021-05-01",
        leverage: 2,
        lastInterest: 0,
        interestAccrued: 0,
        startCollateral: 1000,
        currentCollateral: 1000,
        openValue: 1000,
        cummulativeFFR: 0,
    },
];
 
