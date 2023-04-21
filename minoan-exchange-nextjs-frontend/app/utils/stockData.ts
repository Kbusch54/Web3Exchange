import { Stock } from "../../types/custom";
import MetaSymbol from "../../public/assets/metaSymbol.png";
import TeslaSymbol from '../../public/assets/teslaSymbol.png';
import GoogleSymbol from '../../public/assets/googleSymbol.png';
export const stocks:Stock[] = [
    {
    slug:0,
    name: 'Meta',
    symbol: 'META',
    img: MetaSymbol,
    address: '0x9fE46736679d2D9a65F0992F2272de9f3c7fa6e0',
    poolAddress: "0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab1"

}
,
    {
        slug:1,
        name: 'Tesla',
        symbol: 'TSLA',
        img: TeslaSymbol,
        address: '0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab3',
        poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    },
{
    slug:2,
    name: 'Google',
    symbol: 'GOOG',
    img: GoogleSymbol,
    address: '0x0fac6788EBAa4E7481BCcaFB469CD0DdA089ab2',
    poolAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0513"
}
];