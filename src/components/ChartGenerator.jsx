import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Importing Line chart from Chart.js
import { firestore } from './firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

const ChartGenerator = () => {
  const [chartData, setChartData] = useState({
    acceleration: null,
    uterineContractions: null,
    abnormalShortTermVariability: null,
    abnormalLongTermVariability: null,
    baselineHeartRate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        const userCollection = collection(firestore, 'patientdetails');
        const querySnapshot = await getDocs(userCollection);

        querySnapshot.forEach((doc) => {
          const weekData = doc.data().weekdata;
          data.push(weekData);
        });

        // Extract data for each chart
        const accelerationData = data.map((week) => week[1]);
        const uterineContractionsData = data.map((week) => week[3]);
        const abnormalShortTermVariabilityData = data.map((week) => week[7]);
        const abnormalLongTermVariabilityData = data.map((week) => week[2]);
        const baselineHeartRateData = data.map((week) => week[0]);


        // Update state with chart data
        setChartData({
          acceleration: accelerationData,
          uterineContractions: uterineContractionsData,
          abnormalShortTermVariability: abnormalShortTermVariabilityData,
          abnormalLongTermVariability: abnormalLongTermVariabilityData,
          baselineHeartRate: baselineHeartRateData,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Acceleration Frequencies Chart */}
      <Line data={{
        labels: [...Array(chartData.acceleration ? chartData.acceleration.length : 0).keys()],
        datasets: [
          {
            label: 'Acceleration Frequencies',
            data: chartData.acceleration || [],
            fill: false,
            borderColor: 'red',
          },
        ],
      }} />

      {/* Uterine Contractions Chart */}
      <Line data={{
        labels: [...Array(chartData.uterineContractions ? chartData.uterineContractions.length : 0).keys()],
        datasets: [
          {
            label: 'Uterine Contractions',
            data: chartData.uterineContractions || [],
            fill: false,
            borderColor: 'blue',
          },
        ],
      }} />

      {/* Abnormal Short-Term Variability Chart */}
      <Line data={{
        labels: [...Array(chartData.abnormalShortTermVariability ? chartData.abnormalShortTermVariability.length : 0).keys()],
        datasets: [
          {
            label: 'Abnormal Short-Term Variability',
            data: chartData.abnormalShortTermVariability || [],
            fill: false,
            borderColor: 'green',
          },
        ],
      }} />

      {/* Abnormal Long-Term Variability Chart */}
      <Line data={{
        labels: [...Array(chartData.abnormalLongTermVariability ? chartData.abnormalLongTermVariability.length : 0).keys()],
        datasets: [
          {
            label: 'Abnormal Long-Term Variability',
            data: chartData.abnormalLongTermVariability || [],
            fill: false,
            borderColor: 'purple',
          },
        ],
      }} />

      {/* Baseline Heart Rate Chart */}
      <Line data={{
        labels: [...Array(chartData.baselineHeartRate ? chartData.baselineHeartRate.length : 0).keys()],
        datasets: [
          {
            label: 'Baseline Heart Rate',
            data: chartData.baselineHeartRate || [],
            fill: false,
            borderColor: 'orange',
          },
        ],
      }} />
    </div>
  );
};

export default ChartGenerator;
