import { React, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addFaculty.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'
import { useHistory } from 'react-router-dom';

export default function AddFaculty() {
  const [facultyName, setFacultyName] = useState('');
  const [facultyInitial, setFacultyInitial] = useState('');
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyExt, setFacultyExt] = useState('');
  const [facultyRoom, setFacultyRoom] = useState('');
  const [facultyMobile, setFacultyMobile] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state

  // Add new Faculty
  const navigate = useNavigate();
  const validateFacultyName = () => {
    if (facultyName.length > 50) {
      return 'Faculty name should be 50 characters or less.';
    }
    return '';
  };

  const validateFacultyInitial = () => {
    if (facultyInitial.length > 7) {
      return 'Faculty initial should be no more than 7 characters.';
    }
    return '';
  };

  const validateFacultyCourses = () => {
    const courseRegex = /^[A-Za-z]{3}\d{3}$/;
    let errorMsg = '';
    selectedCourses.forEach(course => {
      if (!courseRegex.test(course)) {
        errorMsg = 'Courses should be 6 characters. The first three characters should be string and the last three characters should be integers.';
      }
    });
    return errorMsg;
  };

  const validateFacultyEmail = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(facultyEmail)) {
      return 'Please provide a valid email address.';
    }
    return '';
  };

  const validateFacultyExt = () => {
    const extRegex = /^\d{3}$/;
    if (!extRegex.test(facultyExt)) {
      return 'Faculty extension should be three digits only.';
    }
    return '';
  };

  const validateFacultyRoom = () => {
    const facultyRoomLength = facultyRoom.length;
    if (facultyRoomLength !== 3 && facultyRoomLength !== 7) {
      return 'Faculty room should be either 3 or 7 characters.';
    }
    return '';
  };


  const validateFacultyMobile = () => {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(facultyMobile)) {
      return 'Mobile should be 11 digits only.';
    }
    return '';
  };

  const addNewFaculty = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the button is clicked

      // Check if required fields are filled up
      if (!facultyName || !facultyInitial || !selectedCourses || !facultyExt || !facultyEmail || !facultyRoom || !facultyMobile) {
        message.error('All fields are required.');
        return;
      }
      const errors = [
        validateFacultyName(),
        validateFacultyInitial(),
        validateFacultyCourses(),
        validateFacultyEmail(),
        validateFacultyExt(),
        validateFacultyRoom(),
        validateFacultyMobile(),
      ].filter((error) => error !== '');
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Check if course with provided code or title already exists
      const nameExists = await axios.get(`http://127.0.0.1:5557/api/faculties/getFaculties?FacultyName=${facultyName}`);
      const initialExists = await axios.get(`http://127.0.0.1:5557/api/faculties/getFaculties?FacultyInitial=${facultyInitial}`);

      if (nameExists.data.success && nameExists.data.details.length > 0) {
        message.error(`A faculty with name ${facultyName} already exists.`);
      } else if (initialExists.data.success && initialExists.data.details.length > 0) {
        message.error(`A faculty with initial ${facultyInitial} already exists.`);
      } else {
        const res = axios.post(`http://127.0.0.1:5557/api/faculties/addFaculty`, {
          FacultyName: facultyName,
          FacultyInitial: facultyInitial,
          Courses: selectedCourses,
          Email: facultyEmail,
          EXT: facultyExt,
          Room: facultyRoom,
          Mobile: facultyMobile
        });
        message.success("Faculty Added Successfully!")
        navigate("/faculties");
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleAddCourse = () => {
    if (facultyCourses.trim() !== "") {
      setSelectedCourses([...selectedCourses, facultyCourses]);
      setFacultyCourses("");
    }
  };

  const handleDropCourse = (index) => {
    const updatedCourses = [...selectedCourses];
    updatedCourses.splice(index, 1);
    setSelectedCourses(updatedCourses);
  };

  return (
    <>
      <div className='main-container'>
        <Navbar2 />
        <div className="container">
          <br />
          <h1 className="heading"> ADD NEW FACULTY <br /></h1>
          <br />
          <div className="container2">
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty Name:</label>
              <input
                type="text"
                id="FacultyName"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty Initial:</label>
              <input
                type="text"
                id="FacultyInitial"
                value={facultyInitial}
                onChange={(e) => setFacultyInitial(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">ADD Courses:</label>
              <input
                type="text"
                id="Courses"
                value={facultyCourses}
                onChange={(e) => setFacultyCourses(e.target.value.toUpperCase())}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddCourse}>Add</button>
            <div className="input-container">
              <p>Selected Courses:</p>
              <ul>
                {selectedCourses.map((course, index) => (
                  <li key={index}>
                    {course}
                    <button className="ul li button" onClick={() => handleDropCourse(index)}>Drop</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty E-mail:</label>
              <input
                type="email"
                id="Email"
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty Extention:</label>
              <input
                type="text"
                id="EXT"
                value={facultyExt}
                onChange={(e) => setFacultyExt(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty Room:</label>
              <input
                type="text"
                id="Room"
                value={facultyRoom}
                onChange={(e) => setFacultyRoom(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label htmlFor="facultyInfo">Mobile(+880):</label>
              <input
                type="text"
                id="Mobile"
                value={facultyMobile}
                onChange={(e) => setFacultyMobile(e.target.value)}
              />
            </div>
            <button className="btn btn-primary custom-button button2" onClick={addNewFaculty}>
              Add Faculty
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
