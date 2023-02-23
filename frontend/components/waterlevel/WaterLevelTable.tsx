import React from 'react';
import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@material-ui/core';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    async function fetchWaterData() {
      const res = await fetch('http://localhost:5000/api/water');
      const data = await res.json();
      setWaterData(data);
    }

    fetchWaterData();
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>สถานี</TableCell>
            <TableCell>ที่ตั้ง</TableCell>
            <TableCell className={styles.tableright}>ระดับน้ำ</TableCell>
            <TableCell className={styles.tableright}>ระดับน้ำตลิ่ง</TableCell>
            <TableCell className={styles.tableright}>สถานการณ์น้ำ</TableCell>
            <TableCell></TableCell>
            <TableCell className={styles.tablecenter}>แนวโน้ม</TableCell>
            <TableCell className={styles.tablecenter}>เวลา</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {waterData &&
            waterData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((data) => (
                <TableRow key={data.id}>
                  <TableCell component='th' scope='row'>
                    {data.station}
                  </TableCell>
                  <TableCell>{data.location}</TableCell>
                  <TableCell className={styles.tableright}>
                    {data.waterLevel}
                  </TableCell>
                  <TableCell className={styles.tableright}>
                    {data.riverBankLevel}
                  </TableCell>
                  <TableCell className={styles.tableright}>
                    {data.waterSituation}
                  </TableCell>
                  <TableCell>
                    {' '}
                    <div>{data.status.split(' ')[0]}</div>
                    <div>{data.status.split(' ')[1]}</div>
                  </TableCell>
                  <TableCell className={styles.tablecenter}>
                    <div dangerouslySetInnerHTML={{ __html: data.trend }} />
                  </TableCell>
                  <TableCell className={styles.tablecenter}>
                    {data.datetime}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 50, 100]}
        component='div'
        count={waterData ? waterData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default WaterLevelTable;
