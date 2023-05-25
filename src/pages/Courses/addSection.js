import { React, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addCourse.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
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
                <option value="SAC_301">8:00AM - 9:00AM</option>
                <option value="SAC_302">9:10AM - 10:20AM</option>
                <option value="SAC_303">10:30AM - 11:30AM</option>
                <option value="SAC_304">11:40AM - 12:40PM</option>
                <option value="SAC_305">12:50PM - 1:50PM</option>
                <option value="SAC_306">2:00PM - 3:00PM</option>
                <option value="SAC_306">3:10PM - 4:10PM</option>
                <option value="SAC_306">4:20PM - 5:20PM</option>
              </select>
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
