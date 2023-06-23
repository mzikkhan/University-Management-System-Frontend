import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './viewCourse.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import CourseRoutineTable from '../../components/courseTable';

export default function ViewCourse() {
  const location = useLocation();
  const { course } = location.state;

  // Add new course
  const navigate = useNavigate()
  const addSection = () => {
    navigate("/addSection", { state: { code: course.code, credits: course.credits } });
  }

  // Update course
  const updateSection = () => {
    navigate("/updateCourse", { state: { code: course.code, credits: course.credits, title: course.title, type: course.type } });
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
            <div className="profile-info">
              <span className="profile-label">Sections:</span>
              <span className="profile-value">{course.sections.join(', ')}</span>
            </div>
          </div>
          <div className="profile-actions" >
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '10px 10px' }} onClick={addSection}>Add Section</button>
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '10px 10px', backgroundColor: 'blue' }} onClick={updateSection}>Update Course</button>
          </div>
        </div>
        <CourseRoutineTable courseCode={course.code}/>
      </div>
      <Footer />
    </div >
  );
}