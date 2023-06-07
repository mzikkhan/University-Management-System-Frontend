// Importing necessary libraries and classes
import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import "./Sections.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

// This Page displays all the Sections

// SearchBar component
const SearchBar = () => {
  return (
    <div className="search-bar">
      {/* Add your search bar JSX here */}
      <input type="text" placeholder="Search Section Number or Course..." />
      <button className='search-button'>Search</button>
    </div>
  );
};


export default function Sections() {
  // Fetching courses
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:5557/api/sections/getAllSections');
        const details = response.data.details
        if (Array.isArray(details) && details.length > 0) {
          setSections(details);
          console.log(details)
        } else {
          setSections([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // // Add new course
  // const navigate = useNavigate()
  // const addCourse = () => {
  //   navigate("/addCourse")
  // }

  // // View Course
  // const viewSection = (course) => {
  //   navigate('/viewSection', { state: { course: course } });
  // };

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  // Filter courses based on search value
  // const filteredSections = sections.filter(
  //   (Course) =>
  //     Course.code.includes(searchValue)
  // );

  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <SearchBar onChange={handleSearchValueChange} />
        </div>
        <br />
        <p className="siTotalCourse">Total Sections: {sections.length}</p> {/* Displaying the count */}
        {sections.map(section => (
          <div key={section.Course} className="searchItem">
            <h1 className="siLogo">{section.Course}</h1>
            <div className="siDesc">
              <h1 className="siTitle">Section No. {section.SectionNumber}</h1>
              <span className="siType">{section.FacultyInitial}</span>
              <span className="siSlot">Timing: {section.TimeSlot}</span>
              <span className="siSlot">Academic Building: {section.AcademicBuilding}</span>
              <span className="siSlot">Room: {section.Room}</span>
              <div className="siButtonsContainer">
                {/* <button className="siCourseButton" onClick={() => viewCourse(course)}>View Course</button> */}
                {/* &nbsp;&nbsp; */}
                {/* <button className="siCourseDropButton" onClick={() => dropHandler(course.code)}>Drop</button> */}
              </div>
            </div>
          </div>
        ))}
        <br />
      </div>
      <Footer />
    </div>
  );
}

