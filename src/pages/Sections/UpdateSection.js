import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import Navbar2 from '../../components/NavBar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './UpdateSection.css';

export default function UpdateSection() {
    const location = useLocation();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);
    const [facultyInitials, setFacultyInitials] = useState([]);
    const [facultyInitial, setFacultyInitial] = useState('');
    const [sectionRoom, setSectionRoom] = useState('');
    const [sectionTimeSlot, setSectionTimeSlot] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
    const [roomOptions, setRoomOptions] = useState([]); // State to hold the room options
    const [timeSlotOptions, setTimeSlotOptions] = useState([]);
    const [academicBuilding, setAcademicBuilding] = useState('Academic Classes');
    // Gets the particular section using Course and SectionNumber
    useEffect(() => {
        const fetchSection = async () => {
            const { section } = location.state; // Accessing the section from location state

            console.log(section);
            try {
                const response = await axios.get(
                    `http://127.0.0.1:5557/api/sections/getSectionByCodeAndNumber/${section.Course}/${section.SectionNumber}`
                );
                const data = response.data;
                setSection(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSection();
    }, [location.state]);

    // Fetch Faculty initials
    useEffect(() => {
        const fetchFacultyInitials = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5557/api/faculties/getFaculties');
                console.log(response);
                if (response.data.success) {
                    const facultyList = response.data.details;
                    const facultyInitials = facultyList
                        .filter((faculty) => faculty.Courses.includes(section?.Course))
                        .map((faculty) => faculty.FacultyInitial);
                    setFacultyInitials(facultyInitials);
                } else {
                    console.error('API error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching faculty initials:', error);
            }
        };

        if (section) {
            fetchFacultyInitials();
        }
    }, [section]);

    // Fetch room options
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                let assignFor = ""; // Initialize the value of assignFor based on the selected option

                if (academicBuilding === "Academic Classes") {
                    assignFor = "Academic Classes";
                } else if (academicBuilding === "Academic Labs") {
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
    }, [academicBuilding, sectionRoom]); // Add `assign` and `sectionRoom` as dependencies

    const handleUpdate = async () => {
        try {
            // Check if required fields are filled up
            if (!facultyInitial) {
                message.error('Please select a faculty initial.');
                return;
            }

            const updatedSection = {
                ...section,
                FacultyInitial: facultyInitial,
            };

            const response = await axios.put(
                `http://127.0.0.1:5557/api/sections/updateSection/${section.Course}/${section.SectionNumber}`,
                updatedSection
            );

            if (response.status === 200) {
                message.success('Section updated successfully!');
                navigate('/sections');
            } else {
                message.error('Failed to update section');
            }
        } catch (error) {
            console.error('Error updating section:', error);
            message.error('Failed to update section');
        }
    };

    return (
        <>
            <Navbar2 />

            <div className="update-section-container">
                {section ? (
                    <form className="update-section-form">
                        <div className="form-row">
                            <label htmlFor="Course">Course Code</label>
                            <input type="text" id="Course" name="Course" value={section.Course} disabled />
                        </div>
                        <div className="form-row">
                            <label htmlFor="SectionNumber">Section Number</label>
                            <input
                                type="text"
                                id="SectionNumber"
                                name="SectionNumber"
                                value={section.SectionNumber}
                                disabled
                            />
                        </div>

                        <div className="f-i-container">
                            <label htmlFor="facultyInfo">Select Faculty Initial:</label>
                            <select
                                id="facultyInitial"
                                value={facultyInitial}
                                onChange={(e) => setFacultyInitial(e.target.value)}
                            >
                                <option value="">-- Select Faculty --</option>
                                {facultyInitials.map((initial) => (
                                    <option key={initial} value={initial}>
                                        {initial}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="am-pm-container">
                            <label htmlFor="credits">Assign For:</label>
                            <select id="credits" value={academicBuilding} onChange={(e) => setAcademicBuilding(e.target.value)}>

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
                                <option value="">-- Select Time Slot --</option>
                                {timeSlotOptions.map((timeslot) => (
                                    <option key={timeslot} value={timeslot}>
                                        {timeslot}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="button" onClick={handleUpdate}>
                            Update Section
                        </button>
                    </form>
                ) : (
                    <p>Loading section...</p>
                )}
            </div>

            <Footer />
        </>
    );
}
