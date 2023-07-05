import { cache } from "react";
import axios from 'axios';

export const fetchStockData = cache(async (stock: string) => {

    const options = {
      method: 'GET',
      url: 'https://apistocks.p.rapidapi.com/intraday',
      params: {
        symbol: stock,
        interval: '15min',
        maxreturn: '100'
      },
      headers: {
        'X-RapidAPI-Key': 'e70ebb1b60mshf11976b783c2186p1cc165jsnffe0a87e55b3',
        'X-RapidAPI-Host': 'apistocks.p.rapidapi.com'
      }
    };
    
    try {
        const response = await axios.request(options);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
    });