import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import './viewRoom.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import RoomRoutineTable from '../../components/roomTable';

export default function ViewRoom() {
    const location = useLocation();
    const { rooms } = location.state;

    const navigate = useNavigate()

    const updateRoom = (rooms) => {
        navigate('/updateRoom', { state: { rooms: rooms } });
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
                        <h2 className="profile-name">{rooms.Rooms}</h2>
                    </div>
                    <div className="profile-details">
                        <div className="profile-info">
                            <span className="profile-label">Room Number:</span>
                            <span className="profile-value">{rooms.RoomNumber}</span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Academic Building:</span>
                            <span className="profile-value">{rooms.AcademicBuilding}</span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Floor Number:</span>
                            <span className="profile-value">{rooms.FloorNumber}</span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-label">Assign For:</span>
                            <span className="profile-value">{rooms.AssignFor}</span>
                        </div>
                        {rooms.AssignFor === 'Academic Classes' || rooms.AssignFor === 'Academic Labs' ? (
                            <div className="timeslot-info">
                                <span className="profile-label">Time Slot:</span>
                                {rooms.TimeSlot.map((timeSlot, index) => (
                                    <div key={index} className="timeslot-value">
                                        {timeSlot}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        <div className="update-button">
                            <button className="btn btn-primary" onClick={() => updateRoom(rooms)}>
                                Update Details
                            </button>
                        </div>
                    </div>
                </div>
            <RoomRoutineTable roomId={rooms._id} roomName={rooms.Rooms}/>
            </div>
            <Footer />
        </div>
    );
}
