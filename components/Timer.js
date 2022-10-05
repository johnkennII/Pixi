import React from 'react'
import UseCountdown from './countdown/UseCountDown'
const Timer = () => {
  const endTime = new Date().getTime() + 60000 * 2 // 2 minutes
  const [timeLeft, setEndTime] = UseCountdown(endTime)

  const minutes = Math.floor(timeLeft / 60000) % 60
  const seconds = Math.floor(timeLeft / 1000) % 60
  return (
    <div className="text-white">
      <div className="app">
        <p>{`${minutes}:${seconds}`}</p>
       
      </div>
    </div>
  )
}

export default Timer
