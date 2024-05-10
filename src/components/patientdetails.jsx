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

const PatientDetails = () => {
  const [weekData, setWeekData] = useState([]); // Initialize as an empty array
  const [prediction, setPrediction] = useState('');
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [patientdetails, setPatientDetails] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [showGraph, setShowGraph] = useState(false); // State to manage whether to show the graph
  const [showAllCharts, setShowAllCharts] = useState(false); // State to manage whether to show all charts for report generation

  const handleGenerateGraph = () => {
    setShowGraph(true); // Set showGraph state to true when the button is clicked
  };

  const handleGenerateReport = () => {
    setShowAllCharts(true); // Set showAllCharts state to true to generate the report
  };

  const openWeekDialog = () => {
    document.getElementById('week-dialog').style.display = 'block';
  };

  const closeWeekDialog = () => {
    document.getElementById('week-dialog').style.display = 'none';
  };

  const openAddWeekDialog = () => {
    const dialog = document.getElementById('add-week-dialog');
    if (dialog) {
      dialog.style.display = 'block';
    } else {
      console.error('Dialog element not found!');
    }
  };

  const closeAddWeekDialog = () => {
    document.getElementById('add-week-dialog').style.display = 'none';
  };

  const handleChange = (index, value) => {
    const updatedWeekData = [...weekData];
    updatedWeekData[index] = value !== '' ? Number(value) : '';
    setWeekData(updatedWeekData);
  };

  const addWeekData = async (e) => {
    e.preventDefault()
    const inputdata = [130.0,0.005,0.469,0.005,0.004,0.0,0.001,29.0,1.7,0.0,7.8,112.0,65.0,177.0,6.0,1.0,133.0,129.0,133.0,27.0,0.0,]
    try {
      const response = await axios.post('http://localhost:5000/api/add-week-data', {
        weekData: inputdata,
      });
      console.log(response.data);

      await addDoc(collection(firestore, "patientdetails"), {
        name: name,
        weekdata: inputdata,
        prediction: response.data.prediction,
      });

      setPrediction(response.data.prediction);
      setShowPredictionModal(true);
    } catch (error) {
      console.error('Error adding week data:', error);
    }
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const age = searchParams.get('age');
  
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const userCollection = collection(firestore, 'patientdetails');
        const q = query(userCollection, where('name', '==', name));
        const querySnapshot = await getDocs(q);
        const patientData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          patientData.push(data);
        });
        setPatientDetails(patientData);
        const weekDataArray = patientData.map((data) => data.weekdata);
        const predictionvalue = patientData.map((data) => data.prediction);
        console.log("prediction value",predictionvalue)
        setWeekData(weekDataArray);
        setPredictions(predictionvalue)
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };
    fetchPatientDetails();
  }, [name]);

  return (
    <div className='bodypatient'>
      <div className="w-screen h-[50vh] bg-[#52A952] flex flex-col justify-between gap-5">
        <div>
          <img src="/logo.png" alt="Hospital Logo" className="uploaded-image" />
        </div>
        <div className='flex flex-col gap-5'> 
          <h2 className='text-3xl font-bold text-white'>Patient Details</h2>
          <p className='font-bold text-xl' >Name: {name}</p>
          <p className='font-bold text-xl'>Age: {age}</p>
        </div>
      </div>
      <div className="white-section">
        <div className="button-container">
          {patientdetails.length > 0 && patientdetails.map((patient, index) => (
            <button key={index} onClick={openWeekDialog} id={`week${index + 1}`}>Week {index + 1}</button>
          ))}
          <button onClick={openAddWeekDialog} id="add-week">Add Week</button>
        </div>
        {/* Dialogs */}
        <div id="week-dialog" className="dialog">
          <span className="close-btn" onClick={closeWeekDialog}>&times;</span>
          <h2>Week Data</h2>
          <div className="input">
          {weekData.length > 0 && weekData.map((week, weekIndex) => (
  <div key={weekIndex}>
    {week.map((value, dayIndex) => (
      <div key={dayIndex}>
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(dayIndex, e.target.value)}
          placeholder={`Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
        />
        <br/>
      </div>
    ))}
    {/* Display prediction here */}
    {predictions.length > 0 && predictions[weekIndex]?.prediction && (
      <p>
        Prediction for Week {weekIndex + 1}: {
          predictions[weekIndex].prediction[0] === 1 ? 'Normal' :
          predictions[weekIndex].prediction[0] === 2 ? 'Abnormal' :
          predictions[weekIndex].prediction[0] === 3 ? 'Pathological' :
          'Unknown'
        }
      </p>
    )}
  </div>
))}


      </div>

          {/* <button onClick={addWeekData}>Submit</button> */}
        </div>
        <div id="add-week-dialog" className="dialog">
  <span className="close-btn" onClick={closeAddWeekDialog}>&times;</span>
  <h2>Add Week Data</h2>
  <form id="week-form" onSubmit={addWeekData}>
    <div className="input">
      {[...Array(21)].map((_, index) => (
        <input
          key={index}
          type="number"
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder={`Week ${index + 1}`}
        />
      ))}
    </div>
    <button type="submit">Submit</button>
  </form>
</div>

      </div>
      <div className={`modal ${showPredictionModal ? 'show' : ''}`} id="interpretation-dialog">
        <div className="modal-content">
          <span className="close-btn" onClick={() => setShowPredictionModal(false)}>&times;</span>
          <h2>Interpretation</h2>
          {console.log(prediction)}
          {prediction && prediction.prediction && prediction.prediction.length > 0 && (
            <p>
              {prediction.prediction[0] === 1 && 'Normal'}
              {prediction.prediction[0] === 2 && 'Abnormal'}
              {prediction.prediction[0] === 3 && 'Pathological'}
            </p>
          )}

          {prediction && prediction.error && <p>{prediction.error}</p>}
        </div>
      </div>
      <div className="green-line"></div>
      <div className="green-container">
        {/* Green container content */}
      </div>
      <div className="green-line"></div>
      <div className="generate-report-container">
     
      <button onClick={handleGenerateReport}>Generate Report</button>
        {/* Render ChartGenerator only if showAllCharts state is true */}
        {showAllCharts && (
          <ChartGenerator weekData={weekData} showAllCharts={showAllCharts} />
        )}
    
        
      
      </div>
    </div>
  );
};




const ChartGenerator = ({ weekData,showAllCharts }) => {
  const [selectedChart, setSelectedChart] = useState(null); // State to store the selected chart type
  const [chartInstance, setChartInstance] = useState(null); // State to store the chart instance
  const navigate = useNavigate()

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const age = searchParams.get('age');
  // Define chart data for each type
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
    // Create or update the chart when weekData or selectedChart changes
    if (weekData && selectedChart) {
      if (chartInstance) {
        // Update the existing chart
        chartInstance.data.datasets[0].data = chartData[selectedChart].data;
        chartInstance.update();
      } else {
        // Create a new chart
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'bar', // Change chart type to 'bar'
          data: {
            labels: Array.from({ length: weekData.length }, (_, i) => i + 1),
            datasets: [{
              label: chartData[selectedChart].label,
              data: chartData[selectedChart].data,
              backgroundColor: chartData[selectedChart].backgroundColor, // Change to backgroundColor for bar chart
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
        setChartInstance(newChartInstance);
      }
    }
  }, [weekData, selectedChart]);

  const handleChartSelection = (chartType) => {
    setSelectedChart(chartType); // Set the selected chart type
  };

  
    
  
  return (
    <div>
      {/* Buttons to select different charts */}
      <div>
        <button onClick={() => handleChartSelection('acceleration')}>Acceleration Frequencies</button>
        <button onClick={() => handleChartSelection('uterineContractions')}>Uterine Contractions</button>
        <button onClick={() => handleChartSelection('abnormalShortTermVariability')}>Abnormal Short-Term Variability</button>
        <button onClick={() => handleChartSelection('abnormalLongTermVariability')}>Abnormal Long-Term Variability</button>
        <button onClick={() => handleChartSelection('baselineHeartRate')}>Baseline Heart Rate</button>
        
        <Link to={`/report?name=${name}&age=${age}`}>Download report</Link>
      </div>

      {/* Render selected chart */}
      <div>
      <canvas id="chartCanvas"></canvas>
      </div>
    </div>
  );
};






export default PatientDetails;
