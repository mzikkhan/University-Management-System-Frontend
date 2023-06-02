import { React, useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addSection.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'

export default function AddSection() {
  const [courseSectionNumber, setCourseSectionNumber] = useState('');
  const [facultyInitial, setFacultyInitial] = useState('');
  const [assign, setAssign] = useState('Academic Classes');
  const [sectionRoom, setSectionRoom] = useState('');
  const [sectionTimeSlot, setSectionTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
  const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data
  const [roomOptions, setRoomOptions] = useState([]); // State to hold the room options
  const [timeSlotOptions, setTimeSlotOptions] = useState([]); // State to hold the room options
  // Add new course
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

    fetchRooms();
  }, [assign, sectionRoom]); // Add `assign` and `sectionRoom` as dependencies
  // Add `assign` as a dependency to re-fetch rooms whenever it changes

  const addNewSection = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the button is clicked

      // Check if required fields are filled up
      if (!courseSectionNumber || !facultyInitial || !sectionRoom) {
        message.error('All fields are required.');
        return;
      }



      if (!sectionRoom) {
        message.error('Course type is required.');
      }


      // Add new course to database
      const res = await axios.post(`http://127.0.0.1:5557/api/course/addCourse`, {
        // code: courseSectionNumber,
        // title: facultyInitial,
        // credits: sectionDay,
        // type: sectionRoom,
        CourseSectionNumber: courseSectionNumber,
        FacultyInitial: facultyInitial,
        sectionTimeSlot: sectionTimeSlot,
        SectionRoom: sectionRoom,
      });
      message.success('Section Added Successfully!');
      navigate('/courses');
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
