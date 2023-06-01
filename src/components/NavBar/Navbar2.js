// Importing necessary libraries and classes
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css';

// This JS file is for our Navigation Bar component

function Navbar2() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const history = useNavigate();
  const logout = () => {
    localStorage.clear();
    history('/');
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            <img src='./nsu-logo.ico' alt='NSU Logo' className='navbar-logo-icon' />
            <span className="navbar-logo-text">NSU ADMIN</span>
            <i className="fa-sharp fa-solid fa-futbol"></i>
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link
                to='/faculties'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                FACULTIES
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/courses'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                COURSES
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/rooms'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                ROOM
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/'
                className='nav-links'
                onClick={logout}
              >
                LOGOUT
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar2
