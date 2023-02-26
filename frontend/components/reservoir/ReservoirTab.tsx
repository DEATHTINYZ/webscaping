import React, { useState } from 'react';
import LargeTub from './LargeTub';
import MediumTub from './MediumTub';

const ReservoirTab = () => {
  const [activeTab, setActiveTab] = useState('large');

  const handleTab = (tabName: string) => {
    setActiveTab(tabName);
  };
  return (
    <>
      <div className='flex justify-between'>
        <div
          className={`w-full bg-[#1976d2] text-white flex justify-center items-center rounded-tl-[8px] rounded-bl-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${
            activeTab === 'large'
              ? 'bg-opacity-100'
              : 'bg-opacity-50 hover:bg-opacity-75 cursor-pointer'
          }`}
          onClick={() => handleTab('large')}
        >
          <div className='w-full text-center p-[1rem]'>อ่างขนาดใหญ่</div>
        </div>
        <div
          className={`w-full bg-[#1976d2] text-white flex justify-center items-center rounded-tr-[8px] rounded-br-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${
            activeTab === 'medium'
              ? 'bg-opacity-100'
              : 'bg-opacity-50 hover:bg-opacity-75 cursor-pointer'
          }`}
          onClick={() => handleTab('medium')}
        >
          <div className='w-full text-center p-[1rem]'>อ่างขนาดกลาง</div>
        </div>
      </div>
      {activeTab === 'large' && <LargeTub />}
      {activeTab === 'medium' && <MediumTub />}
    </>
  );
};

export default ReservoirTab;
