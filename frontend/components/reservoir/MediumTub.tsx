import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from '@material-ui/core';
import Skeleton from '@mui/material/Skeleton';
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons';

interface MediumTubData {
  id: number;
  reservoir: string;
  province: string;
  normalStorage: string;
  amountOfWater: string;
  waterRunningdown: string;
  drainWater: string;
}

const MediumTub = () => {
  const [mediumTubData, setMediumTubData] = useState<MediumTubData[] | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ทั่วประเทศ');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    async function fetchMediumTubData() {
      setIsLoading(true);
      setTimeout(async () => {
        const res = await fetch('https://waterapi.vercel.app/api/reservoir');
        const data = await res.json();
        setMediumTubData(data.mediumTub);
        setIsLoading(false);
      }, 1000);
    }

    fetchMediumTubData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTable(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = () => {
    let filteredData: MediumTubData[] = [];

    if (mediumTubData) {
      filteredData =
        selectedLocation === 'ทั่วประเทศ'
          ? mediumTubData
          : mediumTubData.filter((item) =>
              item.province.includes(selectedLocation)
            );
    }

    if (searchQuery !== '') {
      filteredData = filteredData?.filter((item) =>
        item.reservoir.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    setPage(Math.ceil(filteredData().length / rowsPerPage) - 1);
  };

  const provinces = [
    { name: 'กระบี่', location: 'กระบี่' },
    { name: 'กาญจนบุรี', location: 'กาญจนบุรี' },
    { name: 'กาฬสินธุ์', location: 'กาฬสินธุ์' },
    { name: 'กำแพงเพชร', location: 'กำแพงเพชร' },
    { name: 'ขอนแก่น', location: 'ขอนแก่น' },
    { name: 'จันทบุรี', location: 'จันทบุรี' },
    { name: 'ฉะเชิงเทรา', location: 'ฉะเชิงเทรา' },
    { name: 'ชลบุรี', location: 'ชลบุรี' },
    { name: 'ชัยนาท', location: 'ชัยนาท' },
    { name: 'ชัยภูมิ', location: 'ชัยภูมิ' },
    { name: 'เชียงราย', location: 'เชียงราย' },
    { name: 'เชียงใหม่', location: 'เชียงใหม่' },
    { name: 'ตรัง', location: 'ตรัง' },
    { name: 'ตราด', location: 'ตราด' },
    { name: 'ตาก', location: 'ตาก' },
    { name: 'นครนายก', location: 'นครนายก' },
    { name: 'นครปฐม', location: 'นครปฐม' },
    { name: 'นครพนม', location: 'นครพนม' },
    { name: 'นครราชสีมา', location: 'นครราชสีมา' },
    { name: 'นครศรีธรรมราช', location: 'นครศรีธรรมราช' },
    { name: 'นครสวรรค์', location: 'นครสวรรค์' },
    { name: 'นราธิวาส', location: 'นราธิวาส' },
    { name: 'บึงกาฬ', location: 'บึงกาฬ' },
    { name: 'บุรีรัมย์', location: 'บุรีรัมย์' },
    { name: 'ประจวบคีรีขันธ์', location: 'ประจวบคีรีขันธ์' },
    { name: 'ปราจีนบุรี', location: 'ปราจีนบุรี' },
    { name: 'ปัตตานี', location: 'ปัตตานี' },
    { name: 'พระนครศรีอยุธยา', location: 'พระนครศรีอยุธยา' },
    { name: 'พะเยา', location: 'พะเยา' },
    { name: 'พัทลุง', location: 'พัทลุง' },
    { name: 'พิจิตร', location: 'พิจิตร' },
    { name: 'พิษณุโลก', location: 'พิษณุโลก' },
    { name: 'เพชรบุรี', location: 'เพชรบุรี' },
    { name: 'เพชรบูรณ์', location: 'เพชรบูรณ์' },
    { name: 'แพร่', location: 'แพร่' },
    { name: 'ภูเก็ต', location: 'ภูเก็ต' },
    { name: 'มหาสารคาม', location: 'มหาสารคาม' },
    { name: 'มุกดาหาร', location: 'มุกดาหาร' },
    { name: 'แม่ฮ่องสอน', location: 'แม่ฮ่องสอน' },
    { name: 'ยโสธร', location: 'ยโสธร' },
    { name: 'ยะลา', location: 'ยะลา' },
    { name: 'ร้อยเอ็ด', location: 'ร้อยเอ็ด' },
    { name: 'ระนอง', location: 'ระนอง' },
    { name: 'ระยอง', location: 'ระยอง' },
    { name: 'ราชบุรี', location: 'ราชบุรี' },
    { name: 'ลพบุรี', location: 'ลพบุรี' },
    { name: 'ลำปาง', location: 'ลำปาง' },
    { name: 'ลำพูน', location: 'ลำพูน' },
    { name: 'เลย', location: 'เลย' },
    { name: 'ศรีสะเกษ', location: 'ศรีสะเกษ' },
    { name: 'สกลนคร', location: 'สกลนคร' },
    { name: 'สงขลา', location: 'สงขลา' },
    { name: 'สระแก้ว', location: 'สระแก้ว' },
    { name: 'สระบุรี', location: 'สระบุรี' },
    { name: 'สุโขทัย', location: 'สุโขทัย' },
    { name: 'สุพรรณบุรี', location: 'สุพรรณบุรี' },
    { name: 'สุราษฎร์ธานี', location: 'สุราษฎร์ธานี' },
    { name: 'สุรินทร์', location: 'สุรินทร์' },
    { name: 'หนองคาย', location: 'หนองคาย' },
    { name: 'หนองบัวลำภู', location: 'หนองบัวลำภู' },
    { name: 'อ่างทอง', location: 'อ่างทอง' },
    { name: 'อำนาจเจริญ', location: 'อำนาจเจริญ' },
    { name: 'อุดรธานี', location: 'อุดรธานี' },
    { name: 'อุตรดิตถ์', location: 'อุตรดิตถ์' },
    { name: 'อุทัยธานี', location: 'อุทัยธานี' },
    { name: 'อุบลราชธานี', location: 'อุบลราชธานี' },
  ];

  return (
    <div>
      {loadingTable ? (
        <div></div>
      ) : (
        <div className='flex flex-col gap-[1rem]'>
          <div className='flex gap-[2rem] justify-between'>
            <div className='w-full bg-[#1976d2] text-white flex items-center gap-[.6rem] pl-[1rem] rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.2)]'>
              <Image
                src='/assets/icon-reservoir.svg'
                alt=''
                className='invert'
                width={25}
                height={25}
              />
              <div>อ่างขนาดกลาง</div>
            </div>
            <input
              type='text'
              placeholder='ค้นหา'
              value={searchQuery}
              onChange={handleSearchInputChange}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
            <select
              id='location'
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value='ทั่วประเทศ'>ทั่วประเทศ</option>
              {provinces.map((province) => (
                <option key={province.name} value={province.location}>
                  {province.location}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>อ่างเก็บน้ำ</TableCell>
                    <TableCell align='right'>จังหวัด</TableCell>
                    <TableCell align='right'>กักเก็บปกติ</TableCell>
                    <TableCell align='right'>ปริมาณน้ำ</TableCell>
                    <TableCell align='right'>น้ำไหลลง</TableCell>
                    <TableCell align='right'>น้ำระบาย</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(rowsPerPage)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                      <TableCell align='right'>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                      <TableCell align='right'>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                      <TableCell align='right'>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant='text' animation='wave' />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>อ่างเก็บน้ำ</TableCell>
                    <TableCell align='right'>จังหวัด</TableCell>
                    <TableCell align='right'>กักเก็บปกติ</TableCell>
                    <TableCell align='right'>ปริมาณน้ำ</TableCell>
                    <TableCell align='right'>น้ำไหลลง</TableCell>
                    <TableCell align='right'>น้ำระบาย</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData()
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((data) => (
                      <TableRow key={data.id}>
                        <TableCell component='th' scope='row'>
                          {data.reservoir}
                        </TableCell>
                        <TableCell align='right'>{data.province}</TableCell>
                        <TableCell align='right'>
                          {data.normalStorage}
                        </TableCell>
                        <TableCell align='right'>
                          {data.amountOfWater}
                        </TableCell>
                        <TableCell align='right'>
                          {data.waterRunningdown}
                        </TableCell>
                        <TableCell align='right'>{data.drainWater}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100]}
                component='div'
                count={filteredData() ? filteredData().length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage='จำนวนแถวต่อหน้า'
                labelDisplayedRows={({ from, to, count }) =>
                  `แสดงรายการ ${from}-${to} จาก ${
                    count !== -1 ? count : `มากกว่า ${to} `
                  } รายการ`
                }
                ActionsComponent={() => (
                  <div className='flex items-center ml-2'>
                    <IconButton
                      onClick={() => handleFirstPage()}
                      disabled={page === 0}
                      aria-label='First Page'
                    >
                      <FirstPage />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleChangePage(event, page - 1)}
                      disabled={page === 0}
                      aria-label='Previous Page'
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleChangePage(event, page + 1)}
                      disabled={
                        page >=
                        Math.ceil(filteredData().length / rowsPerPage) - 1
                      }
                      aria-label='Next Page'
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                      onClick={() => handleLastPage()}
                      disabled={
                        page >=
                        Math.ceil(filteredData().length / rowsPerPage) - 1
                      }
                      aria-label='Last Page'
                    >
                      <LastPage />
                    </IconButton>
                  </div>
                )}
              />
            </TableContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default MediumTub;
