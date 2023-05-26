import { React, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addCourse.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'
const csvtoJson = require("csvtojson");

export default function AddSection() {
  const [courseSectionNumber, setCourseSectionNumber] = useState('');
  const [facultyInitial, setFacultyInitial] = useState('');
  const [sectionDay, setSectionDay] = useState();
  const [sectionRoom, setSectionRoom] = useState('');
  const [sectionTimeSlot, setSectionTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
  const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data

  // Add new course
  const navigate = useNavigate();

  const addNewSection = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the button is clicked

      // Check if required fields are filled up
      if (!courseSectionNumber || !facultyInitial || !sectionDay || !sectionRoom) {
        message.error('All fields are required.');
        return;
      }

      // Validate course section number
      const codeRegex = /^[a-zA-Z]{3}[0-9]{3}$/;
      if (!codeRegex.test(courseSectionNumber)) {
        message.warning('Course code should be 6 characters long and have 3 letters followed by 3 digits.');
      }

      // Validate faculty initial
      const titleRegex = /^([A-Z][a-z]+)+(\s[A-Z][a-z]+)*$/;
      if (!titleRegex.test()) {
        message.info('Course title should follow upper camel case and can have spaces in between words.');
      }

      if (!sectionRoom) {
        message.error('Course type is required.');
      }

      // Check if course with provided code or title already exists
      const codeExists = await axios.get(`http://127.0.0.1:5557/api/course/getCourses?code=${courseSectionNumber}`);
      const titleExists = await axios.get(`http://127.0.0.1:5557/api/course/getCourses?title=${facultyInitial}`);

      if (codeExists.data.success && codeExists.data.details.length > 0) {
        message.error(`A section with the section number ${courseSectionNumber} already exists.`);
      } else if (titleExists.data.success && titleExists.data.details.length > 0) {
        message.error(`A section with the faculty initial at the following time slot ${facultyInitial} already exists.`);
      } else {
        // Add new course to database
        const res = await axios.post(`http://127.0.0.1:5557/api/course/addCourse`, {
          // code: courseSectionNumber,
          // title: facultyInitial,
          // credits: sectionDay,
          // type: sectionRoom,
          CourseSectionNumber: courseSectionNumber,
          FacultyInitial: facultyInitial,
          SectionDay: sectionDay,
          sectionTimeSlot: sectionTimeSlot,
          SectionRoom: sectionRoom,
        });
        message.success('Section Added Successfully!');
        navigate('/courses');
      }
    } catch (err) {
      message.error(err.message);
    }
  };




  return (
    <>
      <div className='main-container'>
        <Navbar2 />
        <div className="container">
          <br />
          <h1 className="heading">Create New Section <br /></h1>
          <br />
          <div className="container2">
            <div className="input-container">
              <label htmlFor="timing">Enter Section Number:</label>
              <input
                type="text"
                id="code"
                value={courseSectionNumber}
                onChange={(e) => setCourseSectionNumber(e.target.value.toUpperCase())}
              />
            </div>
            <div className="input-container">
              <label htmlFor="timing">Enter Faculty Initial:</label>
              <input
                type="text"
                id="title"
                value={facultyInitial}
                onChange={(e) => setFacultyInitial(e.target.value)}
              />
            </div>
            <div className="am-pm-container">
              <label htmlFor="type">Select Room:</label>
              <select id="type" value={sectionRoom} onChange={(e) => setSectionRoom(e.target.value)}>
                <option value="">Select</option>
                <option value="SAC_301">SAC 301</option>
                <option value="SAC_302">SAC 302</option>
                <option value="SAC_303">SAC 303</option>
                <option value="SAC_304">SAC 304</option>
                <option value="SAC_305">SAC 305</option>
                <option value="SAC_306">SAC 306</option>
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="credits">Select Day:</label>
              <select id="credits" value={sectionDay} onChange={(e) => setSectionDay(e.target.value)}>
                <option value="">Select</option>
                <option value="ST">ST</option>
                <option value="MW">MW</option>
                <option value="RA">RA</option>
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="credits">Select Time Slot:</label>
              <select id="credits" value={sectionTimeSlot} onChange={(e) => setSectionTimeSlot(e.target.value)}>
                <option value="">Select</option>
                <option value="SAC_301">08:00 AM - 09:00 AM</option>
                <option value="SAC_302">09:10 AM - 10:10 AM</option>
                <option value="SAC_303">10:20 AM - 11:20 AM</option>
                <option value="SAC_304">11:30 AM - 12:30 PM</option>
                <option value="SAC_305">12:40 PM - 01:40 PM</option>
                <option value="SAC_306">01:50 PM - 02:50 PM</option>
                <option value="SAC_306">03:00 PM - 04:00 PM</option>
                <option value="SAC_306">04:10 PM - 05:10 PM</option>
              </select>
            </div>
            <button className="btn btn-primary custom-button button2" onClick={addNewSection}>
              Add Section
            </button>
            <br />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
