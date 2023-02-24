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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchMediumTubData() {
      const res = await fetch('http://localhost:5000/api/reservoir');
      const data = await res.json();
      setMediumTubData(data.mediumSizeTub);
    }

    fetchMediumTubData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="text-[24px] bg-[#1976d2] text-white p-[1rem] rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        อ่างเก็บน้ำขนาดกลาง
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>อ่างเก็บน้ำ</TableCell>
              <TableCell align="right">จังหวัด</TableCell>
              <TableCell align="right">กักเก็บปกติ</TableCell>
              <TableCell align="right">ปริมาณน้ำ</TableCell>
              <TableCell align="right">น้ำไหลลง</TableCell>
              <TableCell align="right">น้ำระบาย</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mediumTubData &&
              mediumTubData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(data => (
                  <TableRow key={data.id}>
                    <TableCell component="th" scope="row">
                      {data.reservoir}
                    </TableCell>
                    <TableCell align="right">{data.province}</TableCell>
                    <TableCell align="right">{data.normalStorage}</TableCell>
                    <TableCell align="right">{data.amountOfWater}</TableCell>
                    <TableCell align="right">{data.waterRunningdown}</TableCell>
                    <TableCell align="right">{data.drainWater}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100]}
          component="div"
          count={mediumTubData ? mediumTubData.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default MediumTub;
