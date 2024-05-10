import React from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
// Import CSS file
import { firestore } from './firebaseconfig'; // Import Firestore instance

const AddPatient = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const form = event.target;

    // Get form values
    const name = form.elements.name.value;
    const age = form.elements.age.value;
    const medicalDetails = form.elements.medicalDetails.value;

    try {
      // Add patient details to Firestore
      const docRef = await addDoc(collection(firestore, 'patient'), {
        name,
        age,
        medicalDetails,
      });
      console.log('Patient details added with ID: ', docRef.id);
      alert('Patient details added with ID: ', docRef.id);

      // Clear form fields after submission
      form.reset();
    } catch (error) {
      console.error('Error adding patient details: ', error);
    }
  };

  return (
    <div className="container">
      <h1>Patient Details</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" required />
        <label htmlFor="age">Age:</label>
        <input type="number" id="age" required />
        <label htmlFor="medicalDetails">Relevant Medical Details:</label>
        <textarea id="medicalDetails" rows="5" required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPatient;
