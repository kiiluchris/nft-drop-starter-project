import React, { useEffect, useState } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ dropDate }) => {
  // State
  const [timerString, setTimerString] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date().getTime();
      const distance = dropDate - currentDate;

      // Here it's as easy as doing some time math to get the different properties
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // We have our desired output, set it in state!
      setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      // If our distance passes zero this means that it's drop time!
      if (distance < 0) {
        console.log('Clearing interval...');
        clearInterval(interval);
      }
    }, 1000)
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  return (
    <div className="timer-container">
      <p className="timer-header">Candy Drop Starting In</p>
      {timerString && <p className="timer-value">{`⏰ ${timerString}`}</p>}
    </div>
  );
};

export default CountdownTimer;
