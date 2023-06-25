import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import Navbar2 from '../../components/NavBar/Navbar2';
import Footer from '../../components/Footer/Footer';
//import './updateCourse.css';
import Swal from 'sweetalert2';
import './addCourse.css'

export default function UpdateCourse() {
    const { code } = useParams();
    const navigate = useNavigate();

    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [courseCredits, setCourseCredits] = useState('');
    const [courseType, setCourseType] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
    const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data
    const csvDataRef = useRef(null);

    useEffect(() => {
        fetchCourseDetails();
    }, []);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5557/api/course/getCourses/${code}`);
            const course = response.data.details[0];
            setCourseCode(course.code);
            setCourseTitle(course.title);
            setCourseCredits(course.credits);
            setCourseType(course.type);
        } catch (error) {
            message.error('Failed to fetch course details.');
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

    const updateCourse = async (courseCode) => {
        try {
            console.log(courseCode)
            const response = await axios.put(`http://127.0.0.1:5557/api/course/updateCourse/${courseCode}`, {
                code: courseCode,
                title: courseTitle,
                credits: courseCredits,
                type: courseType,
            });
            message.success('Course updated successfully!');
            navigate('/courses');
        } catch (error) {
            message.error('Failed to update course.');
        }
    };

    return (
        <div className='main-container'>
            <Navbar2 />
            <div className="container">
                <br />
                <h1 className="heading">Update Course <br /></h1>
                <br />
                <div className="container2">
                    <div className="input-container">
                        <label htmlFor="timing">Course Code:</label>
                        <input
                            type="text"
                            id="code"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                            disabled
                        />
                    </div>


                    {/* <label htmlFor="title">Course Title:</label>
                <input type="text" id="title" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} /><br /><br /> */}

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

                    <button className="btn btn-primary custom-button button2" onClick={() => updateCourse(courseCode)}>Update Course</button>
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
    );
}

