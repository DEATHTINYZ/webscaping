import React from 'react';
import { useState, useEffect } from 'react';

interface LargeTubData {
  reservoir: string;
  capacity: string;
  amountOfWater: string;
  practical: string;
  waterRunningdown: string;
  drainWater: string;
}

const LargeTub = () => {
  const [largeTubData, setLargeTubData] = useState<LargeTubData[] | null>(null);
  console.log(
    '🚀 ~ file: LargeTub.tsx:15 ~ LargeTub ~ largeTubData:',
    largeTubData
  );

  useEffect(() => {
    async function fetchLargeTubData() {
      const res = await fetch('http://localhost:5000/api/reservoir');
      const data = await res.json();
      setLargeTubData(data.largeTub);
    }

    fetchLargeTubData();
  }, []);

  return (
    <div>
      <h2>Large Tub Data</h2>
      {largeTubData ? (
        <table>
          <thead>
            <tr>
              <th>Reservoir</th>
              <th>Capacity</th>
              <th>Amount of Water</th>
              <th>Practical</th>
              <th>Water Running Down</th>
              <th>Drain Water</th>
            </tr>
          </thead>
          <tbody>
            {largeTubData.map((data) => (
              <tr key={data.reservoir}>
                <td>{data.reservoir}</td>
                <td>{data.capacity}</td>
                <td>{data.amountOfWater}</td>
                <td>{data.practical}</td>
                <td>{data.waterRunningdown}</td>
                <td>{data.drainWater}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LargeTub;
