import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import "./Courses.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
// This Page displays all the Courses

// SearchBar component
const SearchBar = ({ onChange }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search Courses..." onChange={(e) => onChange(e.target.value)} />
      <button>Search</button>
    </div>
  );
};

export default function Courses() {
  // Fetching courses
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:5557/api/course/getCourses');
        const { details } = response.data;
        if (Array.isArray(details) && details.length > 0) {
          setCourses(details);
        } else {
          setCourses([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Add new course
  const navigate = useNavigate()
  const addCourse = () => {
    navigate("/addCourse")
  }

  // View Course
  const viewCourse = (course) => {
    navigate('/viewCourse', { state: { course: course } });
  };

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  // Filter courses based on search value
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.title.toLowerCase().includes(searchValue.toLowerCase())
  );
  // Go to sections page
  const goToSectionsPage = (code) => {
    navigate("/sections", { state: { code: code } });
  };

  const dropHandler = async (code, courseSections) => {
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

      if (courseSections.length !== 0) {
        Swal.fire(
          'Failed to delete sections',
          'Please delete the sections manually before deleting the course.',
          'error'
        );
        return; // Exit the function since sections cannot be deleted
      }
      if (confirmDrop.isConfirmed) {
        const response = await axios.delete(`http://127.0.0.1:5557/api/course/dropCourse/` + code);
        const response1 = await axios.delete(`http://127.0.0.1:5557/api/sections/dropSectionByCourseCode/` + code)
          .catch((error) => {
            console.error('Error deleting sections:', error);
          });

        console.log(response);
        console.log(response1);

        // Check if response has valid data
        if (response.data && response.data.details) {
          // Update the courses state with the updated courses data from the server
          setCourses(response.data.details);

          Swal.fire(
            'Deleted!',
            'Course has been deleted.',
            'success'
          );
        } else {
          Swal.fire(
            'Deleted!',
            'Course has been deleted.',
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };




  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <button className="siCourseButton" onClick={addCourse}>Add Course</button>
        </div>
        <div className="search-container">
          <SearchBar onChange={handleSearchValueChange} />
        </div>
        <br />
        <p className="siTotalCourse">Total Courses: {filteredCourses.length}</p> {/* Displaying the count */}
        {filteredCourses.map(course => (
          <div key={course.id} className="searchItem">
            <h1 className="siLogo">{course.code}</h1>
            <div className="siDesc">
              <h1 className="siTitle">{course.title}</h1>
              <span className="siType">{course.type}</span>
              <span className="siSlot">Credits: {course.credits}</span>
              <div className="link-button-container">
                <button className="link-button" onClick={() => goToSectionsPage(course.code)}>
                  Sections: {course.sections.length > 1 ? course.sections.join(', ') : course.sections}
                </button>
              </div>
              <div className="siButtonsContainer">
                <button className="siCourseButton" onClick={() => viewCourse(course)}>View Course</button>
                &nbsp;&nbsp;
                <button className="siCourseDropButton" onClick={() => dropHandler(course.code, course.sections)}>Drop</button>
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
