import { React, useState, useEffect } from 'react';
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
  const [facultyOfficeTime, setFacultyOfficeTime] = useState('');
  const [facultyOfficeDay, setFacultyOfficeDay] = useState('');
  const [facultyPrefrerredDays, setFacultyPrefrerredDays] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedOfficeHour, setSelectedOfficeHour] = useState([]);
  const [selectedPreferredDays, setSelectedPreferredDays] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]); // State to hold the room options
  const [courseCodeOptions, setCourseCodeOptions] = useState([]); // State to hold the code options
  const [courseTitleOptions, setCourseTitleOptions] = useState([]); // State to hold the title options
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state

  // Add new Faculty
  const navigate = useNavigate();

  // Fetch room options
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:5557/api/rooms/getRooms?AssignFor=Faculty'
        );
        const sortRooms = response.data.details;
        const sortedRooms = sortRooms.sort();
        setRoomOptions(sortedRooms);
        setRoomOptions(response.data.details); // Set the room options directly from the `details` property
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const fetchCourseCodes = async () => {
      try {
        const courseCodesResponse = await axios.get(
          'http://127.0.0.1:5557/api/course/getCourses/CODES'
        );
        setCourseCodeOptions(courseCodesResponse.data.codes); // Set the course codes
      } catch (error) {
        console.error('Error fetching course codes:', error);
      }
    };

    const fetchCourseTitles = async () => {
      try {
        const courseTitlesResponse = await axios.get(
          'http://127.0.0.1:5557/api/course/getCourses/TITLES'
        );
        setCourseTitleOptions(courseTitlesResponse.data.codes); // Set the course titles
      } catch (error) {
        console.error('Error fetching course titles:', error);
      }
    };
    fetchCourseTitles();
    fetchCourseCodes();
    fetchRooms();
  }, []);


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
    const courseRegex = /^[A-Za-z]{3}\d{3}[L]?$/;
    let errorMsg = '';
    selectedCourses.forEach(course => {
      if (!courseRegex.test(course)) {
        errorMsg = 'Courses should be 6 characters. The first three characters should be a string, the last three characters should be integers, and an optional "L"(LAB) at the end.';
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
          Mobile: facultyMobile,
          OfficeHour: selectedOfficeHour,
          PreferredDays: selectedPreferredDays
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
      if (selectedCourses.includes(facultyCourses)) {
        message.error('Preferred Course already exists.');
        setFacultyCourses("");
        return;
      }
      setSelectedCourses([...selectedCourses, facultyCourses]);
      setFacultyCourses("");
    }
  };

  const handleDropCourse = (index) => {
    const updatedCourses = [...selectedCourses];
    updatedCourses.splice(index, 1);
    setSelectedCourses(updatedCourses);
  };

  const handleAddPrefrerredDays = () => {
    if (facultyPrefrerredDays.trim() !== "") {
      const PrefrerredDays = `${facultyPrefrerredDays}`;
      if (selectedPreferredDays.includes(PrefrerredDays)) {
        message.error('Prefrerred Day already exists.');
        setFacultyPrefrerredDays("");
        return;
      }
      setSelectedPreferredDays([...selectedPreferredDays, facultyPrefrerredDays]);
      setFacultyPrefrerredDays("");
    }
  };

  const handleDropPrefrerredDays = (index) => {
    const updatedPreferredDays = [...selectedPreferredDays];
    updatedPreferredDays.splice(index, 1);
    setSelectedPreferredDays(updatedPreferredDays);
  };

  const handleAddOfficeHour = () => {
    if (facultyOfficeDay.trim() !== "" && facultyOfficeTime.trim() !== "") {
      const officeHour = `${facultyOfficeDay} ${facultyOfficeTime}`; // Concatenate the selected day and time

      const [day, timeRange] = officeHour.split(" "); // Split officeHour into day and timeRange

      // Define mappings for day abbreviations that should be considered the same
      const dayMappings = {
        ST: ["ST", "S", "T"],
        MW: ["MW", "M", "W"],
        RA: ["RA", "R", "A"],
        S: ["ST", "S"],
        T: ["ST", "T"],
        M: ["MW", "M"],
        W: ["MW", "W"],
        R: ["RA", "R"],
        A: ["RA", "A"],
        F: ["F"]
      };

      // Check for clashes with other office hours based on both day and time range
      if (
        selectedOfficeHour.some((hour) =>
          dayMappings[day].includes(hour.split(" ")[0]) &&
          hour.split(" ")[1] === timeRange
        )
      ) {
        message.error('Office hour already exists. Time is Clashing with other Office Hour.');
        setFacultyOfficeDay("");
        setFacultyOfficeTime("");
        return;
      }

      // Check if the maximum number of office hours (5) has been reached
      if (selectedOfficeHour.length >= 5) {
        message.error('Maximum number of office hours reached.');
        setFacultyOfficeDay("");
        setFacultyOfficeTime("");
        return;
      }

      setSelectedOfficeHour([...selectedOfficeHour, officeHour]);
      setFacultyOfficeDay("");
      setFacultyOfficeTime("");
    }
  };

  const handleDropOfficeHour = (index) => {
    const updatedOfficeHour = [...selectedOfficeHour];
    updatedOfficeHour.splice(index, 1);
    setSelectedOfficeHour(updatedOfficeHour);
  };

  return (
    <>
      <div className='main-container'>
        <Navbar2 />
        <div className="container">
          <br />
          <div className="move-text2">
            <p>***Note you have to Select one or more Preferred Courses to Add Office hours & Preferred Days of Teaching***</p>
          </div>
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
            <div className="am-pm-container">
              <label htmlFor="addCourses">ADD Courses:</label>
              <select
                id="addCourses"
                value={facultyCourses}
                onChange={(e) => setFacultyCourses(e.target.value)}
              >
                <option value="">-- Select Courses --</option>
                {courseCodeOptions.map((Courses, index) => (
                  <option key={Courses} value={Courses}>
                    {Courses} {courseTitleOptions[index]}
                  </option>
                ))}
              </select>
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
            {selectedCourses.length > 0 && (
              <>
                <div className="am-pm-container">
                  <label htmlFor="OfficeDay">Office Day:</label>
                  <select
                    id="OfficeDay"
                    value={facultyOfficeDay}
                    onChange={(e) => setFacultyOfficeDay(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="ST">ST</option>
                    <option value="MW">MW</option>
                    <option value="RA">RA</option>
                    <option value="S">S</option>
                    <option value="T">T</option>
                    <option value="M">M</option>
                    <option value="W">W</option>
                    <option value="R">R</option>
                    <option value="A">A</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div className="am-pm-container">
                  <label htmlFor="OfficeHour">Office Hour:</label>
                  <select
                    id="OfficeHour"
                    value={facultyOfficeTime}
                    onChange={(e) => setFacultyOfficeTime(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="09:10 AM - 10:10 AM">09:10 AM - 10:10 AM</option>
                    <option value="10:20 AM - 11:20 AM">10:20 AM - 11:20 AM</option>
                    <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                    <option value="12:40 PM - 01:40 PM">12:40 PM - 01:40 PM</option>
                    <option value="01:50 PM - 02:50 PM">01:50 PM - 02:50 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:10 PM - 05:10 PM">04:10 PM - 05:10 PM</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddOfficeHour}>Add OfficeHour</button>
                <div className="input-container">
                  <p>Selected OfficeHour:</p>
                  <ul>
                    {selectedOfficeHour.map((OfficeHour, index) => (
                      <li key={index}>
                        {OfficeHour}
                        <button className="ul li button" onClick={() => handleDropOfficeHour(index)}>Drop</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="am-pm-container">
                  <label htmlFor="PreferredDays">Preferred Days:</label>
                  <select
                    id="PreferredDays"
                    value={facultyPrefrerredDays}
                    onChange={(e) => setFacultyPrefrerredDays(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="ST">ST</option>
                    <option value="MW">MW</option>
                    <option value="RA">RA</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="R">R</option>
                    <option value="T">T</option>
                    <option value="W">W</option>
                    <option value="A">A</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleAddPrefrerredDays}>Add Preferred Days</button>
                <div className="input-container">
                  <p>Selected PreferredDays:</p>
                  <ul>
                    {selectedPreferredDays.map((preferredDays, index) => (
                      <li key={index}>
                        {preferredDays}
                        <button className="ul li button" onClick={() => handleDropPrefrerredDays(index)}>Drop</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <div className="input-container">
              <label htmlFor="facultyInfo">Enter Faculty Extention:</label>
              <input
                type="text"
                id="EXT"
                value={facultyExt}
                onChange={(e) => setFacultyExt(e.target.value)}
              />
            </div>
            <div className="am-pm-container">
              <label htmlFor="facultyInfo">Select Faculty Room:</label>
              <select
                id="Room"
                value={facultyRoom}
                onChange={(e) => setFacultyRoom(e.target.value)}
              >
                <option value="">-- Select Room --</option>
                {roomOptions.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
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
      </div >
    </>
  );
}
