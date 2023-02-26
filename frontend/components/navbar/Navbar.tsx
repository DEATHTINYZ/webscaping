import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface NavItemType {
  to: string;
  name: string;
  icon: string;
}

const Navbar = () => {
  const headerData: NavItemType[] = [
      {
        to: '/',
        name: 'อ่างเก็บน้ำ',
        icon: '/assets/icon-reservoir.svg'
      },
      {
        to: '/waterlevel',
        name: 'ระดับน้ำ',
        icon: '/assets/icon-waterlevel.svg'
      }
    ]

  return (
    <header className="h-[90px] mt-[2rem]">
      <nav className="container w-fit border-[1px] border-[#ced4da] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] overflow-hidden">
        <ul className="flex items-center justify-center">
          {headerData.map((data, index) => {
            return (
              <Link href={data.to} key={index} passHref>
                <div className="flex flex-col gap-[.5rem] items-center w-[100px] p-[1rem] hover:bg-[#ced4da]">
                  <Image src={data.icon} alt="" width={35} height={35} />
                  <div>{data.name}</div>
                </div>
              </Link>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
