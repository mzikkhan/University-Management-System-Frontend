// Importing necessary libraries and classes
import React from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import "./Sections.css";

// This Page displays all the Sections

// SearchBar component
const SearchBar = () => {
  return (
    <div className="search-bar">
      {/* Add your search bar JSX here */}
      <input type="text" placeholder="Search Section Number or Course..." />
      <button>Search</button>
    </div>
  );
};


export default function Sections() {

  return (
    <div className="page-container">
      <Navbar2 />
      <div className="content-container">
        <div className="search-container">
          <SearchBar />
        </div>
        <br />
      </div>
      <Footer />
    </div>
  );
}
