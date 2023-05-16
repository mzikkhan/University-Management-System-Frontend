import {React, useState} from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar2 from '../../components/NavBar/Navbar2';
import './viewCourse.css';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from 'antd'

export default function ViewCourse() {
  const location = useLocation();
  const { course } = location.state;

  return (
    <>
    <div className='main-container'>
      <Navbar2 />
        <br />
        <h1 className="heading">{course.code} <br /></h1>
        <h1 className="heading">{course.title} <br /></h1>
        <h1 className="heading">{course.credits} <br /></h1>
        <h1 className="heading">{course.type} <br /></h1>
      <Footer />
      </div>
    </>
  );
}
