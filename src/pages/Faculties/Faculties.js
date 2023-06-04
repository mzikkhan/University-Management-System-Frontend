import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import "./Faculties.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
// This Page displays all the faculties
// SearchBar component
const SearchBar = ({ onChange }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search Faculties..." onChange={(e) => onChange(e.target.value)} />
      <button>Search</button>
    </div>
  );
};

export default function Faculties() {
  // Fetching faculty
  const [faculties, setFaculty] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Perform asynchronous operations here
        const response = await axios.get(`http://127.0.0.1:5557/api/faculties/getFaculties`)
        setFaculty(response.data.details)
        console.log(faculties)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Add new Faculty
  const navigate = useNavigate()
  const addFaculty = () => {
    navigate("/addFaculty")
  }

  // View Faculty
  const viewFaculty = (faculties) => {
    navigate('/viewFaculty', { state: { faculties: faculties } });
  };

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };
  const dropHandlerFaculty = async (initial) => {
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
        const response = await axios.delete(`http://127.0.0.1:5557/api/faculties/dropFaculty/` + initial);
        console.log(response);
        // Update the faculty state with the updated faculties data from the server
        setFaculty(response.data.details);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };
  // Filter faculties based on search value
  const filteredFaculties = faculties.filter((faculty) =>
    faculty.FacultyName.toLowerCase().includes(searchValue.toLowerCase()) ||
    faculty.FacultyInitial.toLowerCase().includes(searchValue.toLowerCase())
  );


  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <button className="siFacultyButton" onClick={addFaculty}>Add Faculty</button>
        </div>
        <div className="search-container">
          <SearchBar onChange={handleSearchValueChange} />
        </div>
        <br />
        <p className="siTotalFaculty">Total Faculty Members: {filteredFaculties.length}</p> {/* Displaying the count */}
        {filteredFaculties.map(faculties => (
          <div key={faculties.id} className="searchItem">
            <img src="" alt="" className="siImg" />
            <div className="siDesc">
              <h1 className="siTitle">{faculties.FacultyName}</h1>
              <span className="siType">{faculties.FacultyInitial}</span>
              <div className="siSlot">
                {faculties.Courses.map((course, index) => (
                  <span key={index}>{course}{index < faculties.Courses.length - 1 ? ',' : ''} </span>
                ))}
              </div>
              <div className="siButtonsContainer">
                <button className="siFacultyButton" onClick={() => viewFaculty(faculties)}>View Faculty</button>
                &nbsp;&nbsp;
                <button className="siFacultyDropButton" onClick={() => dropHandlerFaculty(faculties.FacultyInitial)}>Drop</button>
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

