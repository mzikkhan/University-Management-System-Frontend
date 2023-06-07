import { React, useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addSection.css';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from 'antd'
export default function AddSection() {
  const location = useLocation();
  const location2 = useLocation();
  const { code } = location.state;
  const { credits } = location2.state;

  const [sectionNumber, setSectionNumber] = useState('');
  const [facultyInitial, setFacultyInitial] = useState('');
  const [assign, setAssign] = useState('Academic Classes');
  const [sectionRoom, setSectionRoom] = useState('');
  const [sectionTimeSlot, setSectionTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
  const [roomOptions, setRoomOptions] = useState([]); // State to hold the room options
  const [facultyInitialOptions, setFacultyInitialOptions] = useState([]);
  const [timeSlotOptions, setTimeSlotOptions] = useState([]); // State to hold the room options
  const [preferredDaysMap, setPreferredDaysMap] = useState({});
  const [availabilityMap, setAvailabilityMap] = useState({});

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

          const roomSort = response.data.details;
          const sortedRooms = roomSort.sort();
          setRoomOptions(sortedRooms); // Set the room options directly from the `details` property

          // Check if a room is already selected
          if (sectionRoom) {
            const timeSlotResponse = await axios.get(
              `http://127.0.0.1:5557/api/rooms/getRooms?roomNameForTimeSlot=${sectionRoom}`
            );
            const timeSlots = timeSlotResponse.data.details;
            const sortedTimeSlots = timeSlots.sort((a, b) => {
              // Extract the time slot identifiers
              let timeSlotA = a.substr(3); // Extract the time slot identifier from the time slot string 
              let timeSlotB = b.substr(3); // substr a specified character position


              // Compare and sort the time slots alphabetically
              if (timeSlotA < timeSlotB) return -1;
              if (timeSlotA > timeSlotB) return 1;
              return 0;
            });
            setTimeSlotOptions(sortedTimeSlots); // Set the time slots in the sorted order
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

        const sortedFacultyInitials = facultyInitials.sort();
        setFacultyInitialOptions(facultyInitials.length === 0 ? [] : sortedFacultyInitials);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };
    fetchFaculties();
    fetchRooms();
  }, [assign, sectionRoom, code]); // Add `assign` and `sectionRoom` as dependencies



  useEffect(() => {
    const fetchPreferredDays = async (facultyInitial) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5557/api/faculties/getFaculties?preferredDaysFor=${facultyInitial}`
        );
        const preferredDays = response.data.details;
        setPreferredDaysMap((prevMap) => ({
          ...prevMap, // ...It essentially creates a shallow copy 
          [facultyInitial]: preferredDays,
        }));
      } catch (error) {
        console.error(`Error fetching preferred days for ${facultyInitial}:`, error);
      }
    };

    facultyInitialOptions.forEach((facultyInitial) => {
      fetchPreferredDays(facultyInitial);
    });
  }, [facultyInitialOptions]);


  // Fetch availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5557/api/sections/getSections');

        const sections = response.data;

        const availability = {};
        timeSlotOptions.forEach(timeslot => {
          const sectionsWithSameRoomAndTimeSlot = sections.filter(section => {
            return section.Room === sectionRoom && section.TimeSlot === timeslot;
          });
          availability[timeslot] = sectionsWithSameRoomAndTimeSlot.length === 0;
        });

        setAvailabilityMap(availability);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [sectionTimeSlot]);



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
          FacultyInitial: facultyInitial,
          TimeSlot: sectionTimeSlot,
        },
      });
      const checkSection = await axios.get('http://127.0.0.1:5557/api/sections/getSections');

      const sectionsWithSameRoomAndTimeSlot = checkDuplicateSection.data.filter(section => {
        return section.Room === sectionRoom && section.TimeSlot === sectionTimeSlot;
      });

      const sectionsWithSameInititalAndTimeSlot = checkDuplicateSection.data.filter(section => {
        return section.FacultyInitial === facultyInitial && section.TimeSlot === sectionTimeSlot;
      });
      const sectionsWithTimeSlot = checkSection.data.filter(section => {
        return section.FacultyInitial === facultyInitial && section.TimeSlot === sectionTimeSlot;
      });
      const [day, timeRange] = sectionTimeSlot.split(" "); // Split TimeSlot into day and timeRange

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
      };

      // Check for clashes with other sections based on both day and time range
      // if (
      //   sectionsWithTimeSlot.some(section =>
      //     dayMappings[day].includes(section.TimeSlot.split(" ")[0]) &&
      //     section.TimeSlot.split(" ")[1] === timeRange
      //   )
      // ) {
      //   console.log(day);
      //   console.log(timeRange);
      //   console.log(sectionsWithTimeSlot);
      //   console.log(dayMappings[day]);
      //   message.error('Already exists. Time is clashing with another section.');
      //   return;
      // }

      if (
        facultyInitial &&
        preferredDaysMap[facultyInitial] &&
        !preferredDaysMap[facultyInitial].includes(day)
      ) {
        message.error(
          "Assign TimeSlot based on faculty's Preferred Days. Please choose another timeslot."
        );
        return;
      }
      if (sectionsWithSameRoomAndTimeSlot.length > 0) {
        const duplicateCourseSections = sectionsWithSameRoomAndTimeSlot.map(section => section.Course_Section);
        message.warning(`Same room and timeslot already exist for ${duplicateCourseSections.join(', ')}. Please choose a different room or timeslot for this section.`);
        return;
      }

      if (sectionsWithSameInititalAndTimeSlot.length > 0) {
        const duplicateCourse = sectionsWithSameInititalAndTimeSlot.map(section => section.Course_Section);
        const duplicateIntital = sectionsWithSameInititalAndTimeSlot.map(section => section.FacultyInitial);
        const duplicateTimeslot = sectionsWithSameInititalAndTimeSlot.map(section => section.TimeSlot);
        message.warning(`The selected faculty (${duplicateIntital.join(', ')}) is not available during the ${duplicateTimeslot.join(', ')} time slot(s).
        ${duplicateCourse.join(', ')} is already assigned for the ${duplicateTimeslot.join(', ')} time slot(s). Please choose a different room or time slot for this section.`);
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

      if (sectionNumber && !updatedSections.includes(sectionNumber)) {
        updatedSections.push(sectionNumber); // Add the new section number to the sections array if it doesn't already exist
      }
      const loadingMessage = message.loading('Please wait until the section is successfully added.', 0);
      const updateCourseRes = await axios.put(`http://127.0.0.1:5557/api/course/updateCourse/${code}`, {
        sections: updatedSections.filter(Boolean) // Filter out any empty values from the sections array
      });

      // Fetch the course data
      if (updateCourseRes.status === 200 && res.status === 200) {

        message.success('Section Added Successfully!');
        setTimeout(loadingMessage, 1.5 * 1000);
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
          <h1 className="heading">Create New Section({code} cr{credits}) <br /></h1>
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
                  {facultyInitialOptions.map((facultyInitial) => (
                    <option key={facultyInitial} value={facultyInitial}>
                      {facultyInitial}
                      {preferredDaysMap[facultyInitial] ? (
                        ` : Preferred Days: ${preferredDaysMap[facultyInitial].join(",")}`
                      ) : (
                        ""
                      )}
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
                <option value="">-- Select Time Slot -- : Room</option>
                {timeSlotOptions.map(timeslot => (
                  <option key={timeslot} value={timeslot}>
                    {`${timeslot} ${availabilityMap[timeslot] !== undefined ? (availabilityMap[timeslot] ? ': Available' : ': Unavailable') : ''}`}
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
