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

interface LargeTubData {
  id: number;
  reservoir: string;
  capacity: string;
  amountOfWater: string;
  practical: string;
  waterRunningdown: string;
  drainWater: string;
}

const LargeTub = () => {
  const [largeTubData, setLargeTubData] = useState<LargeTubData[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    async function fetchLargeTubData() {
      setIsLoading(true);
      setTimeout(async () => {
        const res = await fetch('https://waterapi.vercel.app/api/reservoir');
        const data = await res.json();
        setLargeTubData(data.largeTub);
        setIsLoading(false);
      }, 2000);
    }

    fetchLargeTubData();
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

  const filteredData = largeTubData
    ? largeTubData.filter((data) => {
        const searchString = `${data.reservoir}`.toLowerCase();
        return searchString.includes(searchQuery.toLowerCase());
      })
    : [];

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
    setPage(Math.ceil(filteredData.length / rowsPerPage) - 1);
  };
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
              <div>อ่างขนาดใหญ่</div>
            </div>
            <input
              type='text'
              placeholder='ค้นหา'
              value={searchQuery}
              onChange={handleSearchInputChange}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </div>
          {isLoading ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>อ่างเก็บน้ำ</TableCell>
                    <TableCell align='right'>ความจุ</TableCell>
                    <TableCell align='right'>ปริมาณน้ำ</TableCell>
                    <TableCell align='right'>ใช้การได้จริง</TableCell>
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
                    <TableCell align='right'>ความจุ</TableCell>
                    <TableCell align='right'>ปริมาณน้ำ</TableCell>
                    <TableCell align='right'>ใช้การได้จริง</TableCell>
                    <TableCell align='right'>น้ำไหลลง</TableCell>
                    <TableCell align='right'>น้ำระบาย</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data) => (
                      <TableRow key={data.id}>
                        <TableCell component='th' scope='row'>
                          {data.reservoir}
                        </TableCell>
                        <TableCell align='right'>{data.capacity}</TableCell>
                        <TableCell align='right'>
                          {data.amountOfWater}
                        </TableCell>
                        <TableCell align='right'>{data.practical}</TableCell>
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
                count={filteredData ? filteredData.length : 0}
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
                        page >= Math.ceil(filteredData.length / rowsPerPage) - 1
                      }
                      aria-label='Next Page'
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                      onClick={() => handleLastPage()}
                      disabled={
                        page >= Math.ceil(filteredData.length / rowsPerPage) - 1
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

export default LargeTub;
