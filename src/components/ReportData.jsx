// ReportPage.jsx

import React, { useEffect, useState } from 'react';
import './patient.css'; // Import your CSS file
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { firestore } from './firebaseconfig';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Chart } from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';

import html2canvas from 'html2canvas';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const ReportPage = () => {
    const [weekData, setWeekData] = useState([]); // Initialize as an empty array
    const [prediction, setPrediction] = useState('');
    const [showPredictionModal, setShowPredictionModal] = useState(false);
    const [patientdetails, setPatientDetails] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [showGraph, setShowGraph] = useState(false); // State to manage whether to show the graph
    const [showAllCharts, setShowAllCharts] = useState(false); // State to manage whether to show all charts for report generation
    const [chartInstance, setChartInstance] = useState(null); // State to store the chart instance
  
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');
    const age = searchParams.get('age');
    
    useEffect(() => {
      const fetchPatientDetails = async () => {
        try {
          console.log('Fetching patient details...');
          const userCollection = collection(firestore, 'patientdetails');
          const q = query(userCollection, where('name', '==', name));
          const querySnapshot = await getDocs(q);
          const patientData = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            patientData.push(data);
          });
          console.log('Fetched patient data:', patientData);
          setPatientDetails(patientData);
          const weekDataArray = patientData.map((data) => data.weekdata);
          const predictionvalue = patientData.map((data) => data.prediction);
          console.log('Prediction value:', predictionvalue);
          setWeekData(weekDataArray);
          setPredictions(predictionvalue);
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      };
    
      fetchPatientDetails();
    }, [name]);
    
    // Original chart data
    const chartData = {
        acceleration: {
          label: 'Acceleration Frequencies',
          data: weekData.map((week) => week[1]),
          backgroundColor: 'red', // Change borderColor to backgroundColor for bar chart
        },
        uterineContractions: {
          label: 'Uterine Contractions',
          data: weekData.map((week) => week[3]),
          backgroundColor: 'blue', // Change borderColor to backgroundColor for bar chart
        },
        abnormalShortTermVariability: {
          label: 'Abnormal Short-Term Variability',
          data: weekData.map((week) => week[7]),
          backgroundColor: 'green', // Change borderColor to backgroundColor for bar chart
        },
        abnormalLongTermVariability: {
          label: 'Abnormal Long-Term Variability',
          data: weekData.map((week) => week[2]),
          backgroundColor: 'purple', // Change borderColor to backgroundColor for bar chart
        },
        baselineHeartRate: {
          label: 'Baseline Heart Rate',
          data: weekData.map((week) => week[0]),
          backgroundColor: 'orange', // Change borderColor to backgroundColor for bar chart
        }
      };

    

    useEffect(() => {
        // Render charts when weekData is available
        if (weekData.length > 0) {
            Object.keys(chartData).forEach(chartType => createChart(chartType));
        }
    }, [weekData]);

    const createChart = (chartType) => {
        const ctx = document.getElementById(`${chartType}Chart`).getContext('2d');
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: weekData.length }, (_, i) => i + 1),
                datasets: [{
                    label: chartData[chartType].label,
                    data: chartData[chartType].data,
                    backgroundColor: chartData[chartType].backgroundColor,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        setChartInstance(newChartInstance);
    };

    return (
        <div className="flex flex-col gap-20 px-20 mt-20">
        <div className='flex flex-col text-center'>
            <h1 className='text-3xl font-bold'>Patient Report</h1>
            <h2 className='text-xl font-semibold'>Patient Name: {name}</h2>
            <h2 className='text-xl font-semibold'>Age: {age}</h2>
           
        </div>
            {Object.keys(chartData).map(chartType => (
                <div className="chart-item" key={chartType}>
                    <canvas id={`${chartType}Chart`}></canvas>
                </div>
            ))}
        </div>
    );
};


export default ReportPage;
