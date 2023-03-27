import { StaticImageData } from "next/image";

export type Stock = {
    name: string;
    symbol: string;
    img: StaticImageData;
    slug: number;
}