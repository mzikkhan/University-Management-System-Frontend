import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import axios from "axios";
import "./SectionPerCourse.css";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function SectionPerCourse() {
    const [sections, setSections] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const { code } = location.state;

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://127.0.0.1:5557/api/sections/getSectionsForCourse/${code}`);
                const { data } = response;
                setSections(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        }
        fetchData();
    }, [code]);

    const navigate = useNavigate();

    const viewSection = (Course, SectionNumber) => {
        const section = {
            Course: Course,
            SectionNumber: SectionNumber
        };

        console.log(section)
        navigate('/viewSection', { state: { section: section } });
    };

    const dropHandler = async (Course, SectionNumber, FacultyInitial) => {
        try {
            const confirmDrop = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0800ff',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });
            if (confirmDrop.isConfirmed) {
                if (FacultyInitial !== "TBA") {
                    const response = await axios.delete(`http://127.0.0.1:5557/api/sections/dropSection/${Course}/${SectionNumber}`);
                    const response1 = await axios.delete(`http://127.0.0.1:5557/api/course/dropSection?CourseCode=${Course}&Section=${SectionNumber}`);
                    const response2 = await axios.get(`http://127.0.0.1:5557/api/course/getCredits/${Course}`);
                    const response3 = await axios.get(`http://127.0.0.1:5557/api/faculties/getFaculties?creditCountFor=${FacultyInitial}`);

                    let currentCreditCount = Number(response3.data.details);
                    const creditCountNumber = Number(response2.data.credits); // Parse creditCount as a number

                    if (isNaN(currentCreditCount)) {
                        Swal.fire(
                            'Invalid Credit Count!',
                            'Unable to retrieve current credit count.',
                            'warning'
                        );
                        return;
                    }

                    const updatedCreditCount = currentCreditCount - creditCountNumber;
                    const response5 = await axios.put(`http://127.0.0.1:5557/api/faculties/updateCreditCount?FacultyInitial=${FacultyInitial}&CreditCount=${updatedCreditCount}`);

                    console.log(response);
                    setSections(response.data.details && response1.data.details && response2.data.details && response3.data.details && response5.data.details);
                } else {
                    const response = await axios.delete(`http://127.0.0.1:5557/api/sections/dropSection/${Course}/${SectionNumber}`);
                    const response1 = await axios.delete(`http://127.0.0.1:5557/api/course/dropSection?CourseCode=${Course}&Section=${SectionNumber}`);
                    console.log(response);
                    setSections(response.data.details && response1.data.details && response2.data.details && response3.data.details && response5.data.details);
                }
                Swal.fire(
                    'Deleted!',
                    'Section has been deleted.',
                    'success'
                ).then(() => {
                    // Reload the page after the "OK" button is clicked
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };


    return (
        <div>
            <Navbar2 />
            <div className="content-container">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <h1 className="section-heading">Sections for Course {code}</h1>
                        {sections.length === 0 ? (
                            <p>No sections found for this course.</p>
                        ) : (
                            sections.map(section => (
                                <div key={section.id} className="searchItem">
                                    <h1 className="siLogo">{section.Course}</h1>
                                    <div className="siDesc">
                                        <h1 className="siTitle">Section Number: {section.SectionNumber}</h1>
                                        <span className="siType">Faculty: {section.FacultyInitial}</span>
                                        <span className="siSlot">Room: {section.Room}</span>
                                        <span className="siSlot">Time-Slot: {section.TimeSlot}</span>
                                        <div className="siSectionButtonsContainer">
                                            <button className="siSectionButton" onClick={() => viewSection(section.Course, section.SectionNumber)}>View Section</button>
                                            &nbsp;&nbsp;
                                            <button className="siSectionDropButton" onClick={() => dropHandler(section.Course, section.SectionNumber, section.FacultyInitial)}>Drop</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
