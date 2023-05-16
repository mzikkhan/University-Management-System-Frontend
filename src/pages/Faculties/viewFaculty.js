import { React, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './viewFaculty.css';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from 'antd'

export default function ViewFaculty() {
    const location = useLocation();
    const { faculties } = location.state;

    return (
        <>
            <div className='main-container'>
                <Navbar2 />
                <br />
                <h1 className="heading">Name: {faculties.FacultyName} <br /></h1>
                <h1 className="heading">Initial: {faculties.FacultyInitial} <br /></h1>
                <h1 className="heading">Courses: {faculties.Courses.join(', ')} <br /></h1>
                <h1 className="heading">E-mail: {faculties.Email} <br /></h1>
                <h1 className="heading">Extention: {faculties.EXT} <br /></h1>
                <h1 className="heading">Room: {faculties.Room} <br /></h1>
                <h1 className="heading">Phone: +880{faculties.Mobile} <br /></h1>
                <Footer />
            </div>
        </>
    );
}