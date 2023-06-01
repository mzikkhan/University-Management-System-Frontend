import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import "./Rooms.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
// This Page displays all the rooms
// SearchBar component
const SearchBar = ({ onChange }) => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search Rooms..." onChange={(e) => onChange(e.target.value)} />
      <button>Search</button>
    </div>
  );
};

export default function Rooms() {
  // Fetching room
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Perform asynchronous operations here
        const response = await axios.get(`http://127.0.0.1:5557/api/rooms/getRooms`)
        setRooms(response.data.details)
        console.log(rooms)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Add new Room
  const navigate = useNavigate()
  const addRoom = () => {
    navigate("/addRoom")
  }

  // View Room
  const viewRoom = (rooms) => {
    navigate('/viewRoom', { state: { rooms: rooms } });
  };

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };
  const dropHandlerRoom = async (roomName) => {
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
        const response = await axios.delete(`http://127.0.0.1:5557/api/rooms/dropRoom/` + roomName);
        console.log(response);
        // Update the room state with the updated faculties data from the server
        setRooms(response.data.details);
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
  // Filter rooms based on search value
  const filteredRooms = rooms.filter(
    (rooms) =>
      rooms.Rooms.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <button className="siRoomButton" onClick={addRoom}>Add Room</button>
        </div>
        <div className="search-container">
          <SearchBar onChange={handleSearchValueChange} />
        </div>
        <br />
        <p className="siTotalRoom">Total Rooms: {filteredRooms.length}</p> {/* Displaying the count */}
        {filteredRooms.map(rooms => (
          <div key={rooms.id} className="searchItem">
            <img src="" alt="" className="siImg" />
            <div className="siDesc">
              <h1 className="siTitle">{rooms.Rooms}</h1>
              <span className="siSlot">{rooms.AssignFor}</span>
              <span className="siType">{rooms.AcademicBuilding}</span>

              <div className="siButtonsContainer">
                <button className="siRoomButton" onClick={() => viewRoom(rooms)}>View Room</button>
                &nbsp;&nbsp;
                <button className="siRoomDropButton" onClick={() => dropHandlerRoom(rooms.Rooms)}>Drop</button>
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

