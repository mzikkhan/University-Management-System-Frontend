// Importing neccessary libraries and classes
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import Courses from './pages/Courses/Courses';
import Faculties from './pages/Faculties/Faculties';
import Sections from './pages/Sections/Sections';
import Room from './pages/Room/Room';
import AddCourse from './pages/Courses/addCourse';
import ViewCourse from './pages/Courses/viewCourse';
import ImportCourses from './pages/Courses/importCourses';
import ViewFaculty from './pages/Faculties/viewFaculty';
import AddFaculty from './pages/Faculties/addFaculty';
// The structure holds the building, this file is our building that hosts the flats which are our pages

function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <>
      {loading ? <Spinner /> :
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} ></Route>
          </Routes>
          <Routes>
            <Route path="/" element={<ProtectedRoutes Cmp={Sections} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/courses" element={<ProtectedRoutes Cmp={Courses} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/faculties" element={<ProtectedRoutes Cmp={Faculties} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/sections" element={<ProtectedRoutes Cmp={Sections} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/room" element={<ProtectedRoutes Cmp={Room} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/addCourse" element={<ProtectedRoutes Cmp={AddCourse} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/viewCourse" element={<ProtectedRoutes Cmp={ViewCourse} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/importCourses" element={<ProtectedRoutes Cmp={ImportCourses} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/addFaculty" element={<ProtectedRoutes Cmp={AddFaculty} />} ></Route>
          </Routes>
          <Routes>
            <Route path="/viewFaculty" element={<ProtectedRoutes Cmp={ViewFaculty} />} ></Route>
          </Routes>
        </BrowserRouter>
      }
    </>
  );
}

export default App;