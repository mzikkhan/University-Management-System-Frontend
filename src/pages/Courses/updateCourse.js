import { React, useState, useRef } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addCourse.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from 'antd'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function UpdateCourse() {
  const location = useLocation();
  const { code } = location.state;
  const { credits } = location.state;
  const { type } = location.state;
  const { title } = location.state;
  const [courseCode, setCourseCode] = useState(code);
  const [courseTitle, setCourseTitle] = useState(title);
  const [courseCredits, setCourseCredits] = useState(credits);
  const [courseType, setCourseType] = useState(type);
  const navigate = useNavigate();


  // Update course
  const updateCourse = async () => {
    const course = await axios.put(
        `http://127.0.0.1:5557/api/course/updateCourse/${courseCode}`,
        {code: courseCode,
            title: courseTitle,
            credits: courseCredits,
            type: courseType,}
    );
    if (course.status === 200) {
        message.success('Course updated successfully!');
        navigate('/courses');
    } else {
        message.error('Failed to update section');
    }
  };   

  return (
    <>
      <div className='main-container'>
        <Navbar2 />
        <div className="container">
          <br />
          <h1 className="heading">Update Course <br /></h1>
          <br />
          <div className="container2">
            <div className="input-container">
              <label htmlFor="timing">Enter Course Code:</label>
              <input
                type="text"
                id="code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="input-container">
              <label htmlFor="timing">Enter Course Title:</label>
              <input
                type="text"
                id="title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="am-pm-container">
              <label htmlFor="credits">Enter Course Credits:</label>
              <select id="credits" value={courseCredits} onChange={(e) => setCourseCredits(e.target.value)}>
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="type">Enter Course Type:</label>
              <select id="type" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                <option value="">Select</option>
                <option value="Core">Core - CSE Core Courses</option>
                <option value="MC">MC - CSE Major Compulsory</option>
                <option value="ME">ME - CSE Major Elective</option>
                <option value="MCD">MCD - Major Capstone Design</option>
                <option value="I/C">I/C- Internship/Co-op</option>
                <option value="OD">OD - Offered for Other Departments</option>
              </select>
            </div>
            <button className="btn btn-primary custom-button button2" onClick={updateCourse}>
              Update Course
            </button>
          </div>
          <br />
        </div>
        <Footer />
      </div>
    </>
  );
}
