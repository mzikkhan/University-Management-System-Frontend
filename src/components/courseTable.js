import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

const CourseRoutineTable = (props) => {
  const [routineData, setRoutineData] = useState([]);
  const courseCode = props.courseCode;

  useEffect(() => {
    // Fetch room routine data from API
    async function fetchRoutineData() {
      try {
        const response = await axios.get(`http://127.0.0.1:5557/api/course/getRoutine/${courseCode}`);
        setRoutineData(response.data);
      } catch (error) {
        console.error('Error fetching room routine data:', error);
      }
    }

    fetchRoutineData();
  }, []);

  const handleDownloadPDF = () => {
    const headers = [['Section', 'Time']];

    const sortedArray = []
    routineData.forEach((data) => {
        const array1 = []
        array1.push(data.Course_Section)
        array1.push(data.TimeSlot)
        sortedArray.push(array1)
    })
    console.log(sortedArray)

    // //  Generate table rows dynamically
    // const generateRows = (array) => {
    //     const rows = 
    // };
    // const rows = generateRows(sortedArray);
    const rows = sortedArray
    
    const doc = new jsPDF('p', 'pt');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Course: ${courseCode}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Set equal widths for each header column
    const columnWidths = Array(headers[0].length).fill('*');
    
    doc.autoTable({
      head: headers,
      body: rows,
      columnStyles: {
        0: { cellWidth: 'auto' }, // Adjust the cell width as needed
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' },
        9: { cellWidth: 'auto' },
      },
      margin: { top: 30 },
      startY: 30,
      headerWidths: columnWidths,
    });
    
    doc.save('course_sections_routine.pdf');
  };
  
  

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download Routine</button>
    </div>
  );
};

export default CourseRoutineTable;
