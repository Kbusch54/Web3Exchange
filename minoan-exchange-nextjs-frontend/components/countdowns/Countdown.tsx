'use client';
import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = new Date();
      const difference = targetDate.getTime() - currentTime.getTime();
      setTimeLeft(Math.max(0, difference));
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [targetDate]);

  const formatTimeLeft = (milliseconds: number) => {
    if(milliseconds === 0) return <p className="animate-pulse text-red-500">

      0:00:00
    </p>
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
//   <p>Hello</p>
  <div>{formatTimeLeft(timeLeft)}</div>
  );
};

export default Countdown;
