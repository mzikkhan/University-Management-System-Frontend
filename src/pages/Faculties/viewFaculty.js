import React from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar } from 'antd';
import './viewFaculty.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';

export default function ViewFaculty() {
  const location = useLocation();
  const { faculties } = location.state;

  return (
    <div>
      <Navbar2 />
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <Avatar
              className="profile-picture"
              src={faculties.Image}
              alt="Profile"
            />
            <h2 className="profile-name">{faculties.FacultyName}</h2>
          </div>
          <div className="profile-details">
            <div className="profile-info">
              <span className="profile-label">Initial:</span>
              <span className="profile-value">{faculties.FacultyInitial}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Courses:</span>
              <span className="profile-value">{faculties.Courses.join(', ')}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{faculties.Email}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Extension:</span>
              <span className="profile-value">{faculties.EXT}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Room:</span>
              <span className="profile-value">{faculties.Room}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Office Hour:</span>
              <span className="profile-value">{faculties.OfficeHour.map((hour, index) => <React.Fragment key={index}>{hour}<br /></React.Fragment>)}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Preferred Days :</span>
              <span className="profile-value">{faculties.PreferredDays.join(', ')}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Phone:</span>
              <span className="profile-value">+880{faculties.Mobile}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">CreditCount:</span>
              <span className="profile-value">{faculties.CreditCount}</span>
            </div>
            <div className="profile-actions">
              <button className="btn btn-primary">Update Details</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
