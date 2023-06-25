import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import Navbar2 from '../../components/NavBar/Navbar2';
import Footer from '../../components/Footer/Footer';
import Swal from 'sweetalert2';

export default function UpdateFaculty() {
    const navigate = useNavigate();
    const location = useLocation();
    // const { initial } = useParams();
    const { FacultyInitial } = location.state;
    console.log(FacultyInitial)

    const [facultyName, setFacultyName] = useState('');
    const [facultyInitial, setFacultyInitial] = useState('');
    const [facultyImage, setFacultyImage] = useState('');
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(
                    'http://127.0.0.1:5557/api/rooms/getRooms?AssignFor=Faculty'
                );
                const sortRooms = response.data.details;
                const sortedRooms = sortRooms.sort();
                setRoomOptions(sortedRooms);
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

        const refreshRooms = async () => {
            try {
                await fetchRooms();
            } catch (error) {
                console.error('Error refreshing rooms:', error);
            }
        };

        fetchCourseTitles();
        fetchCourseCodes();
        fetchRooms();



        const fetchFacultyDetails = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:5557/api/faculties/getFaculty/${FacultyInitial}`
                );
                const faculty = response.data.details;
                setFacultyName(faculty.FacultyName);
                setFacultyInitial(faculty.FacultyInitial);
                setFacultyImage(faculty.Image);
                setFacultyEmail(faculty.Email);
                setFacultyExt(faculty.EXT);
                setFacultyRoom(faculty.Room);
                setFacultyMobile(faculty.Mobile);
            } catch (error) {
                console.error('Error fetching faculty details:', error);
            }
        };

        fetchFacultyDetails();
    }, [FacultyInitial]);

    const updateFaculty = async () => {
        try {
            setIsLoading(true);
            const res = await axios.put(
                `http://127.0.0.1:5557/api/faculties/updateFaculty/${FacultyInitial}`,
                {
                    FacultyName: facultyName,
                    FacultyInitial: facultyInitial,
                    Email: facultyEmail,
                    EXT: facultyExt,
                    Room: facultyRoom,
                    Mobile: facultyMobile,
                    Image: facultyImage,
                }
            );

            if (res.data.success) {
                message.success('Faculty updated successfully!');
                navigate('/faculties');
            } else {
                message.error('Failed to update faculty.');
            }
        } catch (error) {
            console.error('Error updating faculty:', error);
            message.error('Failed to update faculty.');
        } finally {
            setIsLoading(false);
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
        // <>
        //     <div className='main-container'>
        //         <Navbar2 />
        //         <div className='container'>
        //             <br />
        //             <h1 className='heading'>UPDATE FACULTY</h1>
        //             <br />
        //             <div className='container2'>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyName'>Faculty Name:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyName'
        //                         value={facultyName}
        //                         onChange={(e) => setFacultyName(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyInitial'>Faculty Initial:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyInitial'
        //                         value={facultyInitial}
        //                         disabled
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyImage'>Faculty Image Link:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyImage'
        //                         value={facultyImage}
        //                         onChange={(e) => setFacultyImage(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyEmail'>Faculty Email:</label>
        //                     <input
        //                         type='email'
        //                         id='facultyEmail'
        //                         value={facultyEmail}
        //                         onChange={(e) => setFacultyEmail(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyExt'>Faculty Extension:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyExt'
        //                         value={facultyExt}
        //                         onChange={(e) => setFacultyExt(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyRoom'>Faculty Room:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyRoom'
        //                         value={facultyRoom}
        //                         onChange={(e) => setFacultyRoom(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <label htmlFor='facultyMobile'>Faculty Mobile:</label>
        //                     <input
        //                         type='text'
        //                         id='facultyMobile'
        //                         value={facultyMobile}
        //                         onChange={(e) => setFacultyMobile(e.target.value)}
        //                     />
        //                 </div>
        //                 <div className='input-container'>
        //                     <button
        //                         className='button-primary'
        //                         disabled={isLoading}
        //                         onClick={updateFaculty}
        //                     >
        //                         {isLoading ? 'Updating...' : 'Update Faculty'}
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <Footer />
        // </>
        <>
            <div className='main-container'>
                <Navbar2 />
                <div className="container">
                    <br />
                    <div className="move-text2">
                        <p>***Note you have to Select one or more Preferred Courses to Add Office hours & Preferred Days of Teaching***</p>
                    </div>
                    <h1 className="heading"> UPDATE FACULTY <br /></h1>
                    <br />
                    <div className="container2">
                        <div className="input-container">
                            <label htmlFor="facultyInfo">Faculty Name:</label>
                            <input
                                type="text"
                                id="FacultyName"
                                value={facultyName}
                                onChange={(e) => setFacultyName(e.target.value)}
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="facultyInfo">Faculty Initial:</label>
                            <input
                                type="text"
                                id="FacultyInitial"
                                value={facultyInitial}
                                onChange={(e) => setFacultyInitial(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="facultyInfo">Faculty Image Link:</label>
                            <input
                                type="text"
                                id="FacultyImage"
                                value={facultyImage}
                                onChange={(e) => setFacultyImage(e.target.value)}
                            />
                        </div>
                        <div className="am-pm-container">
                            <label htmlFor="addCourses">Courses:</label>
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
                            <label htmlFor="facultyInfo">Faculty E-mail:</label>
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
                            <label htmlFor="facultyInfo">Faculty Extention:</label>
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
                        <button id="refreshButton" style={{ backgroundColor: 'black', color: 'white' }}>
                            Refresh
                        </button>
                        <div className="input-container">
                            <label htmlFor="facultyInfo">Mobile(+880):</label>
                            <input
                                type="text"
                                id="Mobile"
                                value={facultyMobile}
                                onChange={(e) => setFacultyMobile(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary custom-button button2" onClick={updateFaculty}>
                            Update Faculty
                        </button>
                    </div>
                </div>
                <Footer />
            </div >
        </>
    );
}
