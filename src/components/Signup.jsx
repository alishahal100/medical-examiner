// RegistrationForm.jsx
import React from 'react';
import { auth,firestore } from './firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection,doc,setDoc,addDoc } from 'firebase/firestore';
const RegistrationForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const specialisation = document.getElementById("register-specialisation").value;
    const phNo = document.getElementById("register-ph-no").value;
    const hospitalName = document.getElementById("register-hospital-name").value;
    const city = document.getElementById("register-city").value;
    const createPassword = document.getElementById("register-create-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;

    // Firebase user registration
    createUserWithEmailAndPassword(auth,email, createPassword)
      .then((userCredential) => {
        // Signed up successfully
        const user = userCredential.user;
        console.log("User registered:", user.uid);

        // Save user details to Firestore
        addDoc(collection(firestore, "users"), {
            userId:user.uid,
            username: username,
            email: email,
            specialisation: specialisation,
            phNo: phNo,
            hospitalName: hospitalName,
            city: city
          })
        .then(() => {
          console.log("User details saved to Firestore");
          // Redirect to another page after successful registration
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Error saving user details:", error);
          // Display error message (optional)
          alert("Error saving user details. Please try again.");
        });
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Registration error:", errorMessage);
        // Display error message (optional)
        alert("Registration failed! Please try again.");
      });
  };

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        
        <title>Registration Form</title>
      </head>
      <body className='body'>
        <div className="container">
          <div className="form-container">
            <h2>Sign Up</h2>
            <form id="register-form" onSubmit={handleSubmit}>
              <input type="text" id="register-username" placeholder="Username" required/>
              <input type="text" id="register-email" placeholder="Email" required/>
              <input type="text" id="register-specialisation" placeholder="Specialisation" required/>
              <input type="text" id="register-ph-no" placeholder="Phone No" required/>
              <input type="text" id="register-hospital-name" placeholder="Hospital Name" required/>
              <input type="text" id="register-city" placeholder="City" required/>
              <input type="password" id="register-create-password" placeholder="Create Password" required/>
              <input type="password" id="register-confirm-password" placeholder="Confirm Password" required/>
              <button type="submit">Register</button>
              <div className="signup-link">
                <p>Already have an account? <a href="/signin">Login</a></p>
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RegistrationForm;
