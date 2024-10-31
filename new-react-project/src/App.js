import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [prediction, setPrediction] = useState('');
  //
  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };
  //
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //
  //   if (!selectedFile) {
  //     alert('Please select a file first!');
  //     return;
  //   }
  //
  //   const formData = new FormData();
  //   formData.append('file', selectedFile);
  //
  //   try {
  //     const response = await axios.post('http://localhost:8000/predict', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     setPrediction(response.data.prediction);
  //   } catch (error) {
  //     console.error('There was an error making the request:', error);
  //   }
  // };
  //
  return (
      <div className="App">
      </div>
  );
}

export default App;