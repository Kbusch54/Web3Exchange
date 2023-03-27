import { Stock } from "../../types/custom";
import MetaSymbol from "../../public/assets/metaSymbol.png";
import TeslaSymbol from '../../public/assets/teslaSymbol.png';
import GoogleSymbol from '../../public/assets/googleSymbol.png';
export const stocks:Stock[] = [
    {
    slug:0,
    name: 'Meta',
    symbol: 'META',
    img: MetaSymbol}
,
    {
        slug:1,
        name: 'Tesla',
        symbol: 'TSLA',
        img: TeslaSymbol
    },
{
    slug:2,
    name: 'Google',
    symbol: 'GOOG',
    img: GoogleSymbol
}
];