import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import Navbar2 from '../../components/NavBar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './updateRoom.css';
export default function UpdateRoom() {
    const { Rooms } = useParams();
    const location = useLocation();
    const { rooms } = location.state;
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [roomNumber, setRoomNumber] = useState('');
    const [academicBuilding, setAcademicBuilding] = useState('');
    const [floorNumber, setFloorNumber] = useState('');
    const [assignFor, setAssignFor] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
    const [selectedTimeSlot, setSelectedTimeSlot] = useState([]);
    const [Day, setDay] = useState("");
    const [Time, setTime] = useState('');
    const [TimeSlot, setTimeSlot] = useState('');
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5557/api/rooms/getRooms?Rooms=${rooms.Rooms}`);
                if (response.data.success) {
                    const roomData = response.data.details;
                    if (roomData.length > 0) {
                        const room = roomData[0]; // Assuming you only want to update the first room in the array
                        setRoom(room);
                        setRoomNumber(room.RoomNumber);
                        setAcademicBuilding(room.AcademicBuilding);
                        setFloorNumber(room.FloorNumber);
                        setAssignFor(room.AssignFor);
                        setSelectedTimeSlot(room.TimeSlot);
                    } else {
                        message.error('No room data found');
                    }
                } else {
                    message.error(response.data.message);
                }
            } catch (error) {
                message.error('Failed to fetch room data');
            }
        };

        fetchRoom();
    }, [Rooms]);

    const handleAddTimeSlot = () => {
        if (Day.trim() !== "" && Time.trim() !== "") {
            const timeSlot = `${Day} ${Time}`; // Concatenate the selected day and time
            // Check if the time slot already exists
            if (selectedTimeSlot.includes(timeSlot)) {
                message.error('Time slot already exists.');
                return;
            }

            setSelectedTimeSlot([...selectedTimeSlot, timeSlot]); //The ... syntax is called the spread syntax, and it is used in JavaScript to spread the elements of an array or object. 
            setDay("");
            setTime("");
            setTimeSlot("");

        }
    };

    const handleDropTimeSlot = (index) => {
        const updatedTimeSlot = [...selectedTimeSlot];
        updatedTimeSlot.splice(index, 1);
        setSelectedTimeSlot(updatedTimeSlot);
    };
    const handleDropAllTimeSlots = () => {
        setSelectedTimeSlot([]);
    };

    const handleUpdateRoom = async () => {
        try {
            // Check if required fields are filled up
            if (!roomNumber || !assignFor) {
                message.error('All fields are required.');
                return;
            }
            if ((assignFor === 'Academic Classes' || assignFor === 'Academic Labs') && (selectedTimeSlot.length === 0)) {
                message.error('Select Day and Select Timeslot are required for Academic Classes and Academic Labs.');
                return;
            }
            // Validate room number format
            let roomNumberRegex;
            if (floorNumber === '10') {
                roomNumberRegex = new RegExp(`^${floorNumber}\\d{2}?$`); // Regular expression to match exactly 4 digits
            } else if (floorNumber >= '1' && floorNumber <= '9') {
                roomNumberRegex = new RegExp(`^${floorNumber}\\d{2}[A-Za-z]?$`); // Regular expression to match floor number followed by 2 digits and an optional letter
            } else {
                message.error('Invalid floor selection.');
                return;
            }

            if (!roomNumberRegex.test(roomNumber)) {
                message.error('Room number format is invalid.');
                return;
            }

            const roomName = academicBuilding + roomNumber; // Combine academic building and room number
            // Check if the room name already exists
            const existingRooms = await axios.get(`http://127.0.0.1:5557/api/rooms/getRooms`);
            if (existingRooms.data.success) {
                const rooms = existingRooms.data.details;
                const existingRoom = rooms.find((room) => (
                    room.RoomNumber === roomNumber &&
                    room.AssignFor === assignFor &&
                    room.TimeSlot === selectedTimeSlot
                ));

                if (existingRoom) {
                    message.error('Room already exists.');
                    return;
                }
            }

            const updatedRoom = {
                Rooms: roomName,
                RoomNumber: roomNumber,
                AcademicBuilding: academicBuilding,
                FloorNumber: floorNumber,
                AssignFor: assignFor,
                TimeSlot: selectedTimeSlot
            };
            const response = await axios.put(
                `http://127.0.0.1:5557/api/rooms/updateRooms/${rooms.Rooms}`,
                updatedRoom
            );

            if (response.status === 200) {
                message.success('Room updated successfully!');
                navigate('/rooms');
            } else {
                message.error('Failed to update room');
            }
        } catch (error) {
            message.error('Failed to update room');
        }
    };

    return (
        <>
            <div className="main-container">
                <Navbar2 />
                <div className="container">
                    <br />
                    <div className="move-text">
                        <p>***Please Drop All TimeSlot's Before Changing Assign For Faculty,Academic Classes,Academic Labs or Others.***</p>
                    </div>
                    <h1 className="heading">Update Room</h1>
                    <br />
                    <div className="container2">
                        <div className="input-container">
                            <label htmlFor="roomNumber">Room Number:</label>
                            <input
                                type="text"
                                id="roomNumber"
                                value={roomNumber}
                                placeholder="e.g. 301, 302 or 507B, 1029"
                                onChange={(e) => setRoomNumber(e.target.value.toUpperCase())}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="academicBuilding">Academic Building:</label>
                            <input
                                type="text"
                                id="academicBuilding"
                                value={academicBuilding}
                            />
                        </div>
                        <div className="am-pm-container">
                            <label htmlFor="floorNumber">Select Floor:</label>
                            <select id="floorNumber" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)}>
                                {Array.from({ length: 10 }, (_, index) => (
                                    <option key={index} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="am-pm-container">
                            <label htmlFor="type">Assign For:</label>
                            <select id="type" value={assignFor} onChange={(e) => setAssignFor(e.target.value)}>
                                <option value="Academic Classes">Academic Classes</option>
                                <option value="Academic Labs">Academic Labs</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        {assignFor === "Academic Classes" && (
                            <div className="am-pm-container">
                                <label htmlFor="day1">Select Day:</label>
                                <select id="day1" value={Day} onChange={(e) => setDay(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="ST">ST</option>
                                    <option value="MW">MW</option>
                                    <option value="RA">RA</option>
                                </select>
                            </div>)}
                        {assignFor === "Academic Labs" && (
                            <div className="am-pm-container">
                                <label htmlFor="day2">Select Day:</label>
                                <select id="day2" value={Day} onChange={(e) => setDay(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="S">S</option>
                                    <option value="T">T</option>
                                    <option value="M">M</option>
                                    <option value="W">W</option>
                                    <option value="R">R</option>
                                    <option value="A">A</option>
                                </select>
                            </div>)}
                        {(assignFor === "Academic Classes" || assignFor === "Academic Labs") && (
                            <div className="am-pm-container">
                                <label htmlFor="time">Select Timeslot:</label>
                                <select id="time" value={Time} onChange={(e) => setTime(e.target.value)}>
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
                        )}
                        {(assignFor === "Academic Classes" || assignFor === "Academic Labs") && (
                            <button className="btn btn-primary" onClick={handleAddTimeSlot}>Add</button>)}
                        {(assignFor === "Academic Classes" || assignFor === "Academic Labs") && (<div className="input-container">
                            <p>Selected TimeSlot:</p>
                            <ul>
                                {selectedTimeSlot.map((course, index) => (
                                    <li key={index}>
                                        {course}
                                        <button className="ul li button" onClick={() => handleDropTimeSlot(index)}>Drop</button>
                                    </li>
                                ))}

                            </ul>
                        </div>)}
                        {(assignFor === "Academic Classes" || assignFor === "Academic Labs") && selectedTimeSlot.length > 0 && (
                            <div className="input-container">
                                <button className="btn btn-danger" onClick={handleDropAllTimeSlots}>Drop All</button>
                                <p>Note: Removing the TimeSlot may result in sections becoming illogical. Therefore,
                                    please ensure to update the sections accordingly based on any changes made.</p>
                            </div>)}
                        {(assignFor === "Faculty" || assignFor === "Others") && selectedTimeSlot.length > 0 && (
                            <div className="input-container">
                                <button className="btn btn-danger" onClick={handleDropAllTimeSlots}>Drop All Timeslot</button>
                            </div>)}
                        <div className="btn-container">
                            <button className="btn btn-primary custom-button button2" onClick={handleUpdateRoom}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
