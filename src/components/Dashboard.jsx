import React from 'react';
import "./dashboard.css"
import { useEffect ,useState} from 'react';
import {auth,firestore} from './firebaseconfig';
import { collection,doc ,getDoc,getDocs,query,where} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
// import your firebase configuration
import "./dashboard.css"

const PatientList = () => {
    const [doctor, setDoctor] = useState({ username: '', specialisation: '', hospitalName: '' });
    const [patients, setPatients] = useState([]); // state variable to hold the patient list

  const handleNewPatientClick = () => {
    window.location.href = '/add-patient';
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const fetchDoctorData = async () => {
          console.log("user", user)
  
          const userId = user.uid; // get the current user's ID
          const userCollection = collection(firestore, 'users');
  
          const q = query(userCollection, where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
  
            setDoctor(doc.data());
          });
  
          const patientCollection = collection(firestore, 'patient');
          const patientSnapshot = await getDocs(patientCollection);
          const patientList = patientSnapshot.docs.map(doc => doc.data());
          setPatients(patientList);
        };
  
        fetchDoctorData();
      }
    });
  
    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Dr.{doctor.username} - Patient List</title>
       
      </head> 
      <body>
        <div className=" w-screen flex flex-col items-center justify-center bg-[#52A952] h-[50vh]">
          <img src="/logo.png" alt="Hospital Logo" className="uploaded-image"/>
          <h2> </h2>
          <div className="doctor-info">
            <h1 className='text-2xl font-bold'>Dr. {doctor.username}</h1>
            <h3 className='text-2xl font-bold'>{doctor.specialisation}</h3>
            <h4 className='text-2xl font-bold'>{doctor.hospitalName}</h4>
          </div>
        </div>
        <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Last Visit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient, index) => (
                        <tr key={index}>
                            <td><Link to={`/patient?name=${patient.name}&age=${patient.age}`}>{patient.name}</Link></td>
                            <td>{new Date().toISOString().slice(0, 10)}</td>
                            <td><button className="delete-button">Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <button onClick={handleNewPatientClick}>New Patient</button>
        </div>
      </body>
    </html>
  );
};

export default PatientList;
