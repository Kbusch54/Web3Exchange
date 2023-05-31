import React, { useEffect, useState } from 'react'
function padTo2Digits(num:number) {
    return num.toString().padStart(2, '0');
  }
  
  function toHoursAndMinutes(totalMinutes:number) {
    const totalTimne = totalMinutes/ 360000*6;
    const minutes = totalTimne % 60;
    const hours = Math.floor(totalTimne / 60);
    return [`${hours}h${minutes > 0 ? ` ${Math.floor(minutes)}m ` : ''}`, `${padTo2Digits(hours)}:${padTo2Digits(Math.floor(minutes))}`,totalTimne];
  }

const useCountdown = (initialTimestamp: number, window: number) => {
    const [remainingTime, setRemainingTime] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        const currentTime = new Date().getTime();
        const targetTime = initialTimestamp + window;
  
        if (currentTime >= targetTime) {
          clearInterval(interval);
          setRemainingTime(0);
        } else {
          setRemainingTime((targetTime - currentTime) );
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }, [initialTimestamp, window]);
  
    return remainingTime;
  };
  
  interface Props {
    initialTimestamp: number;
    window: number;
  }
  

const CountDownProposal: React.FC<Props> = ({ initialTimestamp, window }) => {
    const remainingTime = useCountdown(initialTimestamp, window);

    const formattedTime = toHoursAndMinutes(remainingTime);
  

    return (
      <div className={`${formattedTime[2] == 0&&'text-red-500'}`}>{formattedTime[0]}</div>
    );
  };


export default CountDownProposal
