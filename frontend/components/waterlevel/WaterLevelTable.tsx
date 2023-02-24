import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { FirstPage, LastPage } from '@material-ui/icons';

interface WaterData {
  id: number;
  station: string;
  location: string;
  waterLevel: number;
  riverBankLevel: number;
  waterSituation: string;
  status: string;
  trend: string;
  datetime: string;
}

const WaterLevelTable = () => {
  const [waterData, setWaterData] = useState<WaterData[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchWaterData() {
      const res = await fetch('http://localhost:5000/api/waterlevel');
      const data = await res.json();
      setWaterData(data);
    }

    fetchWaterData();
  }, []);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = waterData
    ? waterData.filter(data => {
        const searchString = `${data.station}`.toLowerCase();
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

  const getWaterSituationClass = (waterSituation: string) => {
    if (waterSituation === 'น้อยวิกฤต') {
      return {
        bgClass: 'bg-[#DB802B]',
        textClass: 'text-[#DB802B]'
      };
    } else if (waterSituation === 'น้อย') {
      return {
        bgClass: 'bg-[#FFC000]',
        textClass: 'text-[#FFC000]'
      };
    } else if (waterSituation === 'ปกติ') {
      return {
        bgClass: 'bg-[#00B050]',
        textClass: 'text-[#00B050]'
      };
    } else if (waterSituation === 'มาก') {
      return {
        bgClass: 'bg-[#003CFA] text-white',
        textClass: 'text-[#003CFA]'
      };
    } else if (waterSituation === 'ล้นตลิ่ง') {
      return {
        bgClass: 'bg-[#FF0000] text-white',
        textClass: 'text-[#FF0000]'
      };
    }
    return {
      bgClass: '',
      textClass: ''
    };
  };

  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="text-[24px] bg-[#1976d2] text-white p-[1rem] rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        ระดับน้ำ
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-bold">สถานี</TableCell>
              <TableCell>ที่ตั้ง</TableCell>
              <TableCell align="right">
                <div>ระดับน้ำ</div>
                <div>(ม.รทก)</div>
              </TableCell>
              <TableCell align="right">
                <div>ระดับน้ำตลิ่ง</div>
                <div>(ม.รทก)</div>
              </TableCell>
              <TableCell align="right">สถานการณ์น้ำ</TableCell>
              <TableCell></TableCell>
              <TableCell align="left">แนวโน้ม</TableCell>
              <TableCell align="center">เวลา</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {waterData &&
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(data => (
                  <TableRow key={data.id}>
                    <TableCell component="th" scope="row">
                      {data.station}
                    </TableCell>
                    <TableCell>{data.location}</TableCell>
                    <TableCell align="right">{data.waterLevel}</TableCell>
                    <TableCell align="right">{data.riverBankLevel}</TableCell>
                    <TableCell align="right">
                      <div
                        className={`p-[.5rem] rounded-[8px] flex justify-center
                          ${getWaterSituationClass(data.waterSituation).bgClass}
                        `}
                      >
                        {data.waterSituation}
                      </div>
                    </TableCell>
                    <TableCell>
                      {' '}
                      <div>{data.status.split(/(?<=\))(?=\d)/)[0]}</div>
                      <div
                        className={
                          getWaterSituationClass(data.waterSituation).textClass
                        }
                      >
                        {data.status.split(/(?<=\))(?=\d)/)[1]}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <button
                        className="w-[40px] h-[40px] flex justify-center items-center rounded-full hover:bg-[#0000000a]"
                        dangerouslySetInnerHTML={{ __html: data.trend }}
                      />
                    </TableCell>
                    <TableCell className="!text-center">
                      {data.datetime}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={waterData ? waterData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default WaterLevelTable;
