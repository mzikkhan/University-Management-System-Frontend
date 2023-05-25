import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import './viewCourse.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';

export default function ViewCourse() {
  const location = useLocation();
  const { course } = location.state;

  // Add new course
  const navigate = useNavigate()
  const addSection = () => {
    navigate("/addSection")
  }


  return (
    <div>
      <Navbar2 />
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              className="profile-picture"
              src="https://imgcdn.sohopathi.com/wp-content/uploads/2018/05/North-South-University-logo-03.png"
              alt="Profile"
            />
            <h2 className="profile-name">{course.title}</h2>
          </div>
          <div className="profile-details">
            <div className="profile-info">
              <span className="profile-label">Code:</span>
              <span className="profile-value">{course.code}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Credits:</span>
              <span className="profile-value">{course.credits}</span>
            </div>
            <div className="profile-info">
              <span className="profile-label">Type:</span>
              <span className="profile-value">{course.type}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={addSection}>Add Section</button>
            <button className="btn btn-primary">Update Course</button>
            <button
              className="btn btn-danger"
              style={{ backgroundColor: 'red' }}
            >Delete Course</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}