import { React, useState, useRef } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './addRoom.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { message } from 'antd'
import Swal from 'sweetalert2';

export default function AddRoom() {
    const [Rooms, setRooms] = useState('');
    const [RoomNumber, setRoomNumber] = useState();
    const [AcademicBuilding, setAcademicBuilding] = useState('');
    const [FloorNumber, setFloorNumber] = useState('');
    const [AssignFor, setAssignFor] = useState('Academic Classes'); // Set initial value to "Academic Classes"
    const [TimeSlot, setTimeSlot] = useState('');
    const [csvData, setCsvData] = useState(null); // Add a state variable to store the uploaded CSV data
    const [isLoading, setIsLoading] = useState(false); // Add a state variable to track loading state
    const csvDataRef = useRef(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState([]);
    // Add new course
    const navigate = useNavigate();

    const addNewRoom = async () => {
        try {
            setIsLoading(true); // Set loading state to true when the button is clicked

            // Check if required fields are filled up
            if (!RoomNumber || !FloorNumber || !AcademicBuilding || !AssignFor) {
                message.error('All fields are required.');
                return;
            }

            // Validate room number format
            let roomNumberRegex;
            if (FloorNumber == 10) {
                roomNumberRegex = new RegExp(`^${FloorNumber}\\d{2}?$`); // Regular expression to match exactly 4 digits
            } else if (FloorNumber >= 1 && FloorNumber <= 9) {
                roomNumberRegex = new RegExp(`^${FloorNumber}\\d{2}[A-Za-z]?$`); // Regular expression to match floor number followed by 2 digits and an optional letter
            } else {
                message.error('Invalid floor selection.');
                return;
            }

            if (!roomNumberRegex.test(RoomNumber)) {
                message.error('Room number format is invalid.');
                message.error('Invalid floor selection.');
                return;
            }

            const roomName = `${AcademicBuilding}${RoomNumber}`; // Combine academic building and room number

            // Check if the room name already exists
            const existingRooms = await axios.get(`http://127.0.0.1:5557/api/rooms/getRooms`);
            if (existingRooms.data.success) {
                const rooms = existingRooms.data.details;
                if (rooms.some(rooms => rooms.Rooms === roomName)) {
                    message.error('Room name already exists.');
                    return;
                }
            }

            // Add new course to database
            const res = await axios.post(`http://127.0.0.1:5557/api/rooms/addRoom`, {
                Rooms: roomName,
                RoomNumber: RoomNumber,
                AcademicBuilding: AcademicBuilding,
                FloorNumber: FloorNumber,
                AssignFor: AssignFor,
                TimeSlot: selectedTimeSlot,
            });
            message.success('Room Added Successfully!');
            navigate('/rooms');
        } catch (err) {
            message.error(err.message);
        }
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
            text: 'This will upload your CSV file. Continue?',
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
                    console.log(result); // Print CSV data in console
                    setCsvData(result);

                    // Upload CSV file to server
                    try {
                        const res = await axios.post(`http://127.0.0.1:5557/api/rooms/importCSV`, {
                            data: result,
                        });
                        message.loading('Please wait while the CSV file is being uploaded.');
                        message.success('CSV file uploaded successfully!');
                    } catch (err) {
                        message.error(err.response.data.message || 'Error uploading CSV file.'); // Display the error message
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

    const handleDownloadAndView = () => {
        const csvContent = `Rooms,RoomNumber,AcademicBuilding,FloorNumber,AssignFor,TimeSlot
        SAC331,331,SAC,3,Faculty,
        SAC330,330,SAC,3,Academic Classes,MW 10:20 AM - 11:20 AM
        SAC329,329,SAC,3,Others,
        SAC1000,1000,SAC,3,Academic Classes,ST 10:20 AM - 11:20 AM
        SAC990A,990A,SAC,3,Academic Classes,ST 09:10 AM - 10:10 AM
        NAC331,331,NAC,3,Faculty,`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        csvDataRef.current = url;
        window.open(url);
    };

    const handleAddTimeSlot = () => {
        if (TimeSlot.trim() !== "") {
            // Check if the time slot already exists
            if (selectedTimeSlot.includes(TimeSlot)) {
                message.error('Time slot already exists.');
                return;
            }

            setSelectedTimeSlot([...selectedTimeSlot, TimeSlot]);
            setTimeSlot("");
        }
    };


    const handleDropTimeSlot = (index) => {
        const updatedTimeSlot = [...selectedTimeSlot];
        updatedTimeSlot.splice(index, 1);
        setSelectedTimeSlot(updatedTimeSlot);
    };
    return (
        <>
            <div className='main-container'>
                <Navbar2 />
                <div className="container">
                    <br />
                    <h1 className="heading">Create New Room <br /></h1>
                    <br />
                    <div className="container2">
                        <div className="input-container">
                            <label htmlFor="timing">Enter Room Number:</label>
                            <input
                                type="text"
                                id="code"
                                value={RoomNumber}
                                placeholder="e.g. 301, 302 or 507B, 1029"
                                onChange={(e) => setRoomNumber(e.target.value.toUpperCase())}
                            />
                        </div>

                        <div className="am-pm-container">
                            <label htmlFor="type">Academic Building:</label>
                            <select id="type" value={AcademicBuilding} onChange={(e) => setAcademicBuilding(e.target.value)}>
                                <option value="">Select</option>
                                <option value="SAC">SAC (South Academic Building)</option>
                                <option value="NAC">NAC (North Academic Building)</option>
                                <option value="LIB">LIB (Library Building)</option>
                            </select>
                        </div>

                        <div className="am-pm-container">
                            <label htmlFor="credits">Select Floor:</label>
                            <select id="credits" value={FloorNumber} onChange={(e) => setFloorNumber(e.target.value)}>
                                <option value="">Select</option>
                                {Array.from({ length: 10 }, (_, index) => (
                                    <option key={index} value={index + 1}>{index + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="am-pm-container">
                            <label htmlFor="type">Assign For:</label>
                            <select id="type" value={AssignFor} onChange={(e) => setAssignFor(e.target.value)}>
                                <option value="Academic Classes">Academic Classes</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        {AssignFor === "Academic Classes" && (
                            <div className="am-pm-container">
                                <label htmlFor="timeslot">Select Timeslot:</label>
                                <select id="timeslot" value={TimeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="ST 08:00 AM - 09:00 AM">ST 08:00 AM - 09:00 AM</option>
                                    <option value="ST 09:10 AM - 10:10 AM">ST 09:10 AM - 10:10 AM</option>
                                    <option value="ST 10:20 AM - 11:20 AM">ST 10:20 AM - 11:20 AM</option>
                                    <option value="ST 11:30 AM - 12:30 PM">ST 11:30 AM - 12:30 PM</option>
                                    <option value="ST 12:40 PM - 01:40 PM">ST 12:40 PM - 01:40 PM</option>
                                    <option value="ST 01:50 PM - 02:50 PM">ST 01:50 PM - 02:50 PM</option>
                                    <option value="ST 03:00 PM - 04:00 PM">ST 03:00 PM - 04:00 PM</option>
                                    <option value="ST 04:10 PM - 05:10 PM">ST 04:10 PM - 05:10 PM</option>
                                    <option value="MW 08:00 AM - 09:00 AM">MW 08:00 AM - 09:00 AM</option>
                                    <option value="MW 09:10 AM - 10:10 AM">MW 09:10 AM - 10:10 AM</option>
                                    <option value="MW 10:20 AM - 11:20 AM">MW 10:20 AM - 11:20 AM</option>
                                    <option value="MW 11:30 AM - 12:30 PM">MW 11:30 AM - 12:30 PM</option>
                                    <option value="MW 12:40 PM - 01:40 PM">MW 12:40 PM - 01:40 PM</option>
                                    <option value="MW 01:50 PM - 02:50 PM">MW 01:50 PM - 02:50 PM</option>
                                    <option value="MW 03:00 PM - 04:00 PM">MW 03:00 PM - 04:00 PM</option>
                                    <option value="MW 04:10 PM - 05:10 PM">MW 04:10 PM - 05:10 PM</option>
                                    <option value="RA 08:00 AM - 09:00 AM">RA 08:00 AM - 09:00 AM</option>
                                    <option value="RA 09:10 AM - 10:10 AM">RA 09:10 AM - 10:10 AM</option>
                                    <option value="RA 10:20 AM - 11:20 AM">RA 10:20 AM - 11:20 AM</option>
                                    <option value="RA 11:30 AM - 12:30 PM">RA 11:30 AM - 12:30 PM</option>
                                    <option value="RA 12:40 PM - 01:40 PM">RA 12:40 PM - 01:40 PM</option>
                                    <option value="RA 01:50 PM - 02:50 PM">RA 01:50 PM - 02:50 PM</option>
                                    <option value="RA 03:00 PM - 04:00 PM">RA 03:00 PM - 04:00 PM</option>
                                    <option value="RA 04:10 PM - 05:10 PM">RA 04:10 PM - 05:10 PM</option>
                                </select>
                            </div>)}
                        {AssignFor === "Academic Classes" && (
                            <button className="btn btn-primary" onClick={handleAddTimeSlot}>Add</button>)}
                        {AssignFor === "Academic Classes" && (<div className="input-container">
                            <p>Selected TimeSlot:</p>
                            <ul>
                                {selectedTimeSlot.map((course, index) => (
                                    <li key={index}>
                                        {course}
                                        <button className="ul li button" onClick={() => handleDropTimeSlot(index)}>Drop</button>
                                    </li>
                                ))}
                            </ul>
                        </div>)}
                        <button className="btn btn-primary custom-button button2" onClick={addNewRoom}>
                            Add Room
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
