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
const SearchBar = ({ onChange }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search Courses..." onChange={(e) => onChange(e.target.value)} />
      <button>Search</button>
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

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  // View Sections
  const navigate = useNavigate()
  const viewSection = (section) => {
    navigate('/viewSection', { state: { section: section } });
  };

  // Delete Section
  const dropHandler = async (code, section) => {
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
        const response = await axios.delete(`http://127.0.0.1:5557/api/sections/dropSection/${code}/${section}`)
          .catch((error) => {
            console.error('Error deleting sections:', error);
          });

        console.log(response);

        // Check if response has valid data
        if (response.data && response.data.details) {

          Swal.fire(
            'Deleted!',
            'Section has been deleted.',
            'success'
          );
          window.location.reload()
        } else {
          Swal.fire(
            'Deleted!',
            'Section has been deleted.',
            'success'
          );
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Error deleting Section:', error);
    }
  };

  const filteredSections = sections.filter(
    (section) =>
      section.Course.toLowerCase().includes(searchValue.toLowerCase()) ||
      section.FacultyInitial.toLowerCase().includes(searchValue.toLowerCase()) ||
      section.TimeSlot.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <SearchBar onChange={handleSearchValueChange} />
        </div>
        <br />
        <p className="siTotalCourse">Total Sections:  {filteredSections.length}</p> {/* Displaying the count */}
        {filteredSections.map(section => (
          <div key={section.id} className="searchItem">
            <h1 className="siLogo">{section.Course}</h1>
            <div className="siDesc">
              <h1 className="siTitle">Section No. {section.SectionNumber}</h1>
              <span className="siType">{section.FacultyInitial}</span>
              <span className="siSlot">Timing: {section.TimeSlot}</span>
              <span className="siSlot">Academic Building: {section.AcademicBuilding}</span>
              <span className="siSlot">Room: {section.Room}</span>
              <div className="siButtonsContainer">
                <button className="siCourseButton" onClick={() => viewSection(section)}>View Section</button>
                &nbsp;&nbsp;
                <button className="siCourseDropButton" onClick={() => dropHandler(section.Course, section.SectionNumber)}>Delete</button>
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

