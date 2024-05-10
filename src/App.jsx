
import {BrowserRouter as Router , Route,Routes,useLocation} from "react-router-dom"
import RegistrationForm from "./components/Signup"
import LoginForm from "./components/Signin"
import PatientList from "./components/Dashboard"
import AddPatient from "./components/addpatient"
import PatientDetails from "./components/patientdetails"
import ReportPage from "./components/ReportData"
function App() {
  

  return (
    <>
      <Router>
        
        <Routes>
          <Route path='/' element={<RegistrationForm/>} />
          <Route path='/signin' element={<LoginForm/>} />
          <Route path='/dashboard' element={<PatientList/>} />
          <Route path='/add-patient' element={<AddPatient/>} />
          <Route path='/patient' element={<PatientDetails/>} />
          <Route path='/report' element={<ReportPage/>} />
          
          </Routes>
      </Router>
    </>
  )
}

export default App
