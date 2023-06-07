import { React, useState, useRef } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addCourse.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function AddCourse() {
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCredits, setCourseCredits] = useState();
  const [courseType, setCourseType] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
  const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data
  const csvDataRef = useRef(null);

  // Add new course
  const navigate = useNavigate();

  const addNewCourse = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the button is clicked

      // Check if required fields are filled up
      if (!courseCode || !courseTitle || !courseCredits || !courseType) {
        message.error('All fields are required.');
        return;
      }

      // Validate course code
      const codeRegex = /^[a-zA-Z]{3}[0-9]{3}$/;
      if (!codeRegex.test(courseCode)) {
        message.warning('Course code should be 6 characters long and have 3 letters followed by 3 digits.');
      }

      // Validate course title
      const titleRegex = /^([A-Z][a-z]+)+(\s[A-Z][a-z]+)*$/;
      if (!titleRegex.test(courseTitle)) {
        message.info('Course title should follow upper camel case and can have spaces in between words.');
      }

      if (!courseType) {
        message.error('Course type is required.');
      }

      // Check if course with provided code or title already exists
      const codeExists = await axios.get(`http://127.0.0.1:5557/api/course/getCourses?code=${courseCode}`);
      const titleExists = await axios.get(`http://127.0.0.1:5557/api/course/getCourses?title=${courseTitle}`);

      if (codeExists.data.success && codeExists.data.details.length > 0) {
        message.error(`A course with code ${courseCode} already exists.`);
      } else if (titleExists.data.success && titleExists.data.details.length > 0) {
        message.error(`A course with title ${courseTitle} already exists.`);
      } else {
        // Add new course to database
        const res = await axios.post(`http://127.0.0.1:5557/api/course/addCourse`, {
          code: courseCode,
          title: courseTitle,
          credits: courseCredits,
          type: courseType,
        });
        message.success('Course Added Successfully!');
        navigate('/courses');
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleDownloadAndView = () => {
    const csvContent = `code,title,credits,type,parallel,sections
CSE115,Programming Language I *,3,Core,,
CSE115L,Programming Language I Lab,1,Core,,
CSE173,Discrete Mathematics,3,MC,,`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    csvDataRef.current = url;
    window.open(url);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: true,
      confirmButtonColor: '#0800ff',
      cancelButtonColor: '#ff0000',
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'This will upload your CSV file & Make sure you dont have any Sections value in your CSV file. Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, upload it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true); // Set loading state to true when the upload is confirmed
        reader.onload = async () => {
          const result = reader.result;
          setCsvData(result);

          // Upload CSV file to server
          try {
            const res = await axios.post(`http://127.0.0.1:5557/api/course/importCSV`, {
              data: result,
            });
            message.loading('Please wait while the CSV file is being uploaded.');
            message.success('CSV file uploaded successfully!');
          } catch (err) {
            message.error('Error uploading CSV file.');
          }
          setIsLoading(false); // Set loading state to false when the upload is complete
        };
        reader.readAsText(file);
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'CSV file upload cancelled',
          'error'
        )
      }
    })
  };




  return (
    <>
      <div className='main-container'>
        <Navbar2 />
        <div className="container">
          <br />
          <h1 className="heading">Create New Course <br /></h1>
          <br />
          <div className="container2">
            <div className="input-container">
              <label htmlFor="timing">Enter Course Code:</label>
              <input
                type="text"
                id="code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="input-container">
              <label htmlFor="timing">Enter Course Title:</label>
              <input
                type="text"
                id="title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <div className="am-pm-container">
              <label htmlFor="credits">Enter Course Credits:</label>
              <select id="credits" value={courseCredits} onChange={(e) => setCourseCredits(e.target.value)}>
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="am-pm-container">
              <label htmlFor="type">Enter Course Type:</label>
              <select id="type" value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                <option value="">Select</option>
                <option value="Core">Core - CSE Core Courses</option>
                <option value="MC">MC - CSE Major Compulsory</option>
                <option value="ME">ME - CSE Major Elective</option>
                <option value="MCD">MCD - Major Capstone Design</option>
                <option value="I/C">I/C- Internship/Co-op</option>
                <option value="OD">OD - Offered for Other Departments</option>
              </select>
            </div>
            <button className="btn btn-primary custom-button button2" onClick={addNewCourse}>
              Add Course
            </button>
            <br />
            <button className="custom-file-upload">
              <label htmlFor="csv-file">Upload Course Data(.csv):</label>
              <input type="file" id="csv-file" onChange={handleFileUpload} accept=".csv" />
            </button>
          </div>
          <br />
          <div className="container3">
            <button className="custom-file-download" onClick={handleDownloadAndView}>
              Download CSV Format *
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
