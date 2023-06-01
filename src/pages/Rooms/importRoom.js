import React from 'react';
import { useState } from 'react';
import { message, Upload, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar2 from '../../components/NavBar/Navbar2';
import Footer from '../../components/Footer/Footer';
import './importRoom.css';


export default function ImportRoom() {


    return (
        <div className='main-container'>
            <Navbar2 />
            <div className="container">
                <br />
                <h1 className="heading"> Import the file from your Device<br /></h1>
                <br />
                <div className="container2">
                    <br />
                    <div className="am-pm-container">
                        <input type="file" onChange={""} accept=".csv" />
                        <Button onClick={""}>
                            Click to Upload
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
