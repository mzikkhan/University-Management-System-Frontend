import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import './ViewSection.css';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';

export default function ViewSection() {
    const location = useLocation();
    const navigate = useNavigate();
    const [section, setSection] = useState(null);

    useEffect(() => {
        const fetchSection = async () => {
            const { section } = location.state; // Accessing the section from location state
            try {
                const response = await fetch(`http://127.0.0.1:5557/api/sections/getSectionByCodeAndNumber/${section.Course}/${section.SectionNumber}`);
                const data = await response.json();
                setSection(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchSection();
    }, [location.state]);

    const updateSection = (Course, SectionNumber) => {
        const section = {
            Course: Course,
            SectionNumber: SectionNumber
        };

        navigate('/updateSection', { state: { section: section } });
    };

    return (
        <div>
            <Navbar2 />
            <div className="container">
                {section ? (
                    <div className="section-card">
                        <div className="section-header">
                            <Avatar
                                className="section-picture"
                                src="https://imgcdn.sohopathi.com/wp-content/uploads/2018/05/North-South-University-logo-03.png"
                                alt="section"
                            />
                            <h2 className="section-name">{section.Course_Section}</h2>
                        </div>
                        <div className="section-details">
                            <div className="section-info">
                                <span className="section-label">Section Number:</span>
                                <span className="section-value">{section.SectionNumber}</span>
                            </div>
                            <div className="section-info">
                                <span className="section-label">Faculty Initial:</span>
                                <span className="section-value">{section.FacultyInitial}</span>
                            </div>
                            <div className="section-info">
                                <span className="section-label">Section Room:</span>
                                <span className="section-value">{section.Room}</span>
                            </div>
                            <div className="timeslot-info">
                                <span className="section-label">Time-Slot:</span>
                                <span className="section-value">{section.TimeSlot}</span>
                            </div>
                            <div className="update-button-section">
                                <button className="btn btn-primary" onClick={() => updateSection(section.Course, section.SectionNumber)}>
                                    Update Details
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <Footer />
        </div>
    );
}
