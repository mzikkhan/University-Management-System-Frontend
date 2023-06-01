import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from 'antd';
import './viewRoom.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';

export default function ViewRoom() {
    const location = useLocation();
    const { rooms } = location.state;

    const [editedRoom, setEditedRoom] = useState(rooms);
    const [editMode, setEditMode] = useState(false);

    const handleEditButton = () => {
        setEditMode(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedRoom((prevRoom) => ({
            ...prevRoom,
            [name]: value,
        }));
    };

    return (
        <div>
            <Navbar2 />
            <div className="container">
                <div className="profile-card">
                    <div className="profile-header">
                        <Avatar
                            className="profile-picture"
                            src="https://imgcdn.sohopathi.com/wp-content/uploads/2018/05/North-South-University-logo-03.png"
                            alt="Profile"
                        />
                        <h2 className="profile-name">
                            {editMode ? (
                                <input
                                    type="text"
                                    value={editedRoom.Rooms}
                                    name="Rooms"
                                    onChange={handleInputChange}
                                />
                            ) : (
                                rooms.Rooms
                            )}
                        </h2>
                    </div>
                    <div className="profile-details">
                        <div className="profile-info">
                            <span className="profile-label">Room Number:</span>
                            <span className="profile-value">
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={editedRoom.RoomNumber}
                                        name="RoomNumber"
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    rooms.RoomNumber
                                )}
                            </span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Academic Building:</span>
                            <span className="profile-value">
                                {editMode ? (
                                    <select
                                        id="type"
                                        value={editedRoom.AcademicBuilding}
                                        name="AcademicBuilding"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="SAC">SAC (South Academic Building)</option>
                                        <option value="NAC">NAC (North Academic Building)</option>
                                        <option value="LIB">LIB (Library Building)</option>
                                    </select>
                                ) : (
                                    rooms.AcademicBuilding
                                )}
                            </span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Floor Number:</span>
                            <span className="profile-value">
                                {editMode ? (
                                    <div className="am-pm-container">
                                        <label htmlFor="floorNumber">Select Floor:</label>
                                        <select
                                            id="floorNumber"
                                            value={editedRoom.FloorNumber}
                                            name="FloorNumber"
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select</option>
                                            {Array.from({ length: 10 }, (_, index) => (
                                                <option key={index} value={index + 1}>
                                                    {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    rooms.FloorNumber
                                )}
                            </span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Assign For:</span>
                            <span className="profile-value">
                                {editMode ? (
                                    <select
                                        id="assignFor"
                                        value={editedRoom.AssignFor}
                                        name="AssignFor"
                                        onChange={handleInputChange}
                                    >
                                        <option value="Academic Classes">Academic Classes</option>
                                        <option value="Faculty">Faculty</option>
                                        <option value="Others">Others</option>
                                    </select>
                                ) : (
                                    rooms.AssignFor
                                )}
                            </span>
                        </div>
                        {rooms.AssignFor === 'Academic Classes' && (
                            <div className="timeslot-info">
                                <span className="profile-label">Time Slot:</span>
                                {rooms.TimeSlot.map((timeSlot, index) => (
                                    <div key={index} className="timeslot-value">
                                        {editMode ? (
                                            <input
                                                type="text"
                                                value={editedRoom.TimeSlot[index]}
                                                name={`TimeSlot[${index}]`}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            timeSlot
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="update-button">
                            <button className="btn btn-primary" onClick={handleEditButton}>
                                {editMode ? 'Save Details' : 'Update Details'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
