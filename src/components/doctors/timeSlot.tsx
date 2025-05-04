// TimeSlot.tsx
import { convertToTimestamp, hasObject, isFutureTimestamp } from '@/services/reUseFunctions';
import React from 'react';

interface TimeSlotProps {
  time: string;
  index: number;
  datesOfWeek: string[];
  appointments: any;
  setTimestamp?: (timestamp: number) => void;
  setShowPaymentModal?: (show: boolean) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, index, datesOfWeek, appointments, setTimestamp, setShowPaymentModal }) => {
  const timestamp = convertToTimestamp(`${time.split(" - ")[0]} ${datesOfWeek?.[index]}`);
  const isBooked = hasObject(appointments, timestamp);
  const isFuture = isFutureTimestamp(timestamp);

  const handleMouseEnter = (e: any) => {
    const btn = e.currentTarget.querySelector(".hover-btn");
    if (btn) {
      btn.classList.remove("hidden");
      btn.classList.add("flex");
    }
  };

  const handleMouseLeave = (e: any) => {
    const btn = e.currentTarget.querySelector(".hover-btn");
    if (btn) {
      btn.classList.remove("flex");
      btn.classList.add("hidden");
    }
  };

  return (
    <div
      className={`col-span-1 py-4 flex justify-center flex-wrap items-center border border-gray-300 font-bold ${
        isFuture ? "grayscale-0" : "grayscale"
      } bg-white text-gray-500`}
      onMouseEnter={setTimestamp && setShowPaymentModal ? handleMouseEnter : undefined}
      onMouseLeave={setTimestamp && setShowPaymentModal ? handleMouseLeave : undefined}
    >
      <div className="w-full flex justify-center">{time}</div>
      <div className={`w-full flex justify-center ${isBooked ? "text-red-500" : "text-green-500"}`}>
        {isBooked ? "Đã được đặt" : "Còn trống"}
      </div>
      {!isBooked && (
        <div
          className={`${
            isFuture ? "hover-btn" : ""
          } hidden w-full h-full bg-orange-400 absolute justify-center items-center`}
        >
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2"
            onClick={() => {
              if (setTimestamp && setShowPaymentModal) {
                setTimestamp(timestamp);
                setShowPaymentModal(true);
              }
            }}
          >
            Đăng ký
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlot;