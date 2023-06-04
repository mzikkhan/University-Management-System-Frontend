import { React, useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addSection.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from 'antd'
export default function AddSection() {
  const location = useLocation();
  const { code } = location.state;
  const [sectionNumber, setSectionNumber] = useState('');
  const [facultyInitial, setFacultyInitial] = useState('');
  const [assign, setAssign] = useState('Academic Classes');
  const [sectionRoom, setSectionRoom] = useState('');
  const [sectionTimeSlot, setSectionTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
  const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data
  const [roomOptions, setRoomOptions] = useState([]); // State to hold the room options
  const [facultyInitialOptions, setFacultyInitialOptions] = useState([]);
  const [timeSlotOptions, setTimeSlotOptions] = useState([]); // State to hold the room options


  const navigate = useNavigate();
  // Fetch room options
  // Fetch room options
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let assignFor = ""; // Initialize the value of assignFor based on the selected option

        if (assign === "Academic Classes") {
          assignFor = "Academic Classes";
        } else if (assign === "Academic Labs") {
          assignFor = "Academic Labs";
        }

        if (assignFor !== "") {
          const response = await axios.get(
            `http://127.0.0.1:5557/api/rooms/getRooms?AssignFor=${assignFor}`
          );
          setRoomOptions(response.data.details); // Set the room options directly from the `details` property

          // Check if a room is already selected
          if (sectionRoom) {
            const timeSlotResponse = await axios.get(
              `http://127.0.0.1:5557/api/rooms/getRooms?roomNameForTimeSlot=${sectionRoom}`
            );
            setTimeSlotOptions(timeSlotResponse.data.details); // Set the time slots directly from the `details` property
          }
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    const fetchFaculties = async () => {
      try {
        const facultyInitialresponse = await axios.get(
          `http://127.0.0.1:5557/api/faculties/getFaculties?wishCourses=${code}`
        );
        const facultyInitials = facultyInitialresponse.data.details;

        setFacultyInitialOptions(facultyInitials.length === 0 ? [] : facultyInitials);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };


    fetchFaculties();
    fetchRooms();
  }, [assign, sectionRoom, code]); // Add `assign` and `sectionRoom` as dependencies
  // Add `assign` as a dependency to re-fetch rooms whenever it changes

  const addNewSection = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the button is clicked

      // Check if required fields are filled up
      if (!sectionNumber || !facultyInitial || !sectionRoom || !sectionTimeSlot) {
        message.error('All fields are required.');
        return;
      }

      // Check if sectionNumber is a number and its length is between 1 and 25
      const sectionNumberLength = sectionNumber.length;
      const sectionNumberInt = parseInt(sectionNumber);

      if (isNaN(sectionNumberInt) || sectionNumberInt < 1 || sectionNumberInt > 25) {
        message.error('Section Number must be a number between 1 and 25.');
        return;
      }

      // Concatenate code and sectionNumber for Course_Section
      const Course_Section = code + '.' + sectionNumber;
      // Check if section with the same room and timeslot exists
      const checkDuplicateSection = await axios.get(`http://127.0.0.1:5557/api/sections/getSections`, {
        params: {
          Room: sectionRoom,
          TimeSlot: sectionTimeSlot,
        },
      });

      const sectionsWithSameRoomAndTimeSlot = checkDuplicateSection.data.filter(section => {
        return section.Room === sectionRoom && section.TimeSlot === sectionTimeSlot;
      });

      if (sectionsWithSameRoomAndTimeSlot.length > 0) {
        const duplicateCourseSections = sectionsWithSameRoomAndTimeSlot.map(section => section.Course_Section);
        message.warning(`Same room and timeslot already exist for ${duplicateCourseSections.join(', ')}. Please choose a different room or timeslot for this section.`);
        return;
      }
      // Check if section with the same Course_Section already exists
      const checkDuplicateCourseSection = await axios.get(`http://127.0.0.1:5557/api/sections/getSections`, {
        params: {
          Course_Section: Course_Section,
        },
      });

      const sameCourse_Section = checkDuplicateCourseSection.data.filter(section => {
        return section.Course_Section === Course_Section;
      });
      if (sameCourse_Section.length > 0) {
        message.warning(`Section ${Course_Section} already exists. Please choose a different section number for this course.`);
        return;
      }

      const getCourseRes = await axios.get(`http://127.0.0.1:5557/api/course/getCourses?code=${code}`);

      if (getCourseRes.data.details.length === 0) {
        message.error('Course not found.');
        return;
      }
      const course = getCourseRes.data.details[0];
      // Add new section to database
      const res = await axios.post(`http://127.0.0.1:5557/api/sections/addSection`, {
        Course_Section: Course_Section,
        Course: code,
        SectionNumber: sectionNumber,
        FacultyInitial: facultyInitial,
        Room: sectionRoom,
        TimeSlot: sectionTimeSlot,
      });

      // Update the course with the new section
      const updatedSections = course.sections || []; // Assign an empty array if sections is undefined

      if (!updatedSections.includes(sectionNumber)) {
        updatedSections.push(sectionNumber); // Add the new section number to the sections array if it doesn't already exist
      }
      const updateCourseRes = await axios.put(`http://127.0.0.1:5557/api/course/updateCourse/${code}`, {
        sections: updatedSections
      });

      // Fetch the course data

      if (updateCourseRes.status === 200 && res.status === 200) {

        message.success('Section Added Successfully!');
        navigate('/courses');
      } else {
        message.error('Failed to update course with the new section.');
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
          <h1 className="heading">Create New Section({code}) <br /></h1>
          <br />
          <div className="container2">
            <div className="input-container">
              <label htmlFor="timing">Enter Section Number:</label>
              <input
                type="text"
                id="code"
                value={sectionNumber}
                onChange={(e) => setSectionNumber(e.target.value.toUpperCase())}
              />
            </div>
            <div className="am-pm-container">
              <label htmlFor="FacultyInitial">Faculty Initial:</label>
              {facultyInitialOptions.length === 0 ? (
                <select
                  id="FacultyInitial"
                  value={facultyInitial}
                  onChange={(e) => setFacultyInitial(e.target.value)}
                >
                  <option value="">-- Select Initial --</option>
                  <option value="TBA">TBA</option>
                </select>
              ) : (
                <select
                  id="FacultyInitial"
                  value={facultyInitial}
                  onChange={(e) => setFacultyInitial(e.target.value)}
                >
                  <option value="">-- Select Initial --</option>
                  {facultyInitialOptions.map((Initial) => (
                    <option key={Initial} value={Initial}>
                      {Initial}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="am-pm-container">
              <label htmlFor="credits">Assign For:</label>
              <select id="credits" value={assign} onChange={(e) => setAssign(e.target.value)}>

                <option value="Academic Classes">Academic Classes</option>
                <option value="Academic Labs">Academic Labs</option>
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="roomInfo">Select Room:</label>
              <select
                id="roomInfo"
                value={sectionRoom}
                onChange={(e) => setSectionRoom(e.target.value)}
              >
                <option value="">-- Select Room --</option>
                {roomOptions.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="timeslot">Select Time Slot:</label>
              <select
                id="timeslot"
                value={sectionTimeSlot}
                onChange={(e) => setSectionTimeSlot(e.target.value)}
              >
                <option value="">-- Select Room --</option>
                {timeSlotOptions.map((timeslot) => (
                  <option key={timeslot} value={timeslot}>
                    {timeslot}
                  </option>
                ))}
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
