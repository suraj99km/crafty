'use client';

import React, { useState, useEffect } from 'react';

interface CompactCountdownProps {
  endDate: string;
  onExpire: () => void;
}

const CompactCountdownTimer: React.FC<CompactCountdownProps> = ({ endDate, onExpire }) => {
 const calculateTimeLeft = () => {
    const difference = new Date(endDate).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      onExpire();
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      if (Object.values(updatedTimeLeft).every(v => v === 0)) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono min-w-[2.5rem] text-center">
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <span className="text-xs mt-1 text-red-700">days</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono min-w-[2.5rem] text-center">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <span className="text-xs mt-1 text-red-700">hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono min-w-[2.5rem] text-center">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <span className="text-xs mt-1 text-red-700">min</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md font-mono min-w-[2.5rem] text-center">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <span className="text-xs mt-1 text-red-700">sec</span>
      </div>
    </div>
  );
};


export default CompactCountdownTimer;