import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const CoursesTable = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch course data from API
        async function fetchCourses() {
            try {
                const response = await axios.get('your-api-endpoint');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        }

        fetchCourses();
    }, []);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Define table headers
        const headers = [['Name', 'Description', 'Duration', 'Instructor']];

        // Generate table rows dynamically
        const rows = courses.map(course => [
            course.name,
            course.description,
            course.duration,
            course.instructor
        ]);

        // Insert table headers and rows into the PDF document
        doc.autoTable({
            head: headers,
            body: rows,
        });

        // Save the PDF document
        doc.save('courses.pdf');
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Instructor</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>{course.duration}</td>
                            <td>{course.instructor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleDownloadPDF}>Download as PDF</button>
        </div>
    );
};

export default CoursesTable;