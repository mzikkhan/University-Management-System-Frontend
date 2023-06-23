import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

const FacultyRoutineTable = (props) => {
  const [routineData, setRoutineData] = useState([]);
  const facultyInitial = props.facultyInitial;

  useEffect(() => {
    // Fetch room routine data from API
    async function fetchRoutineData() {
      try {
        const response = await axios.get(`http://127.0.0.1:5557/api/faculties/getRoutine/${facultyInitial}`);
        setRoutineData(response.data);
      } catch (error) {
        console.error('Error fetching room routine data:', error);
      }
    }

    fetchRoutineData();
  }, []);

  const handleDownloadPDF = () => {
    const headers = [['Class Time', '08:00 AM - 09:00 AM', '09:10 AM - 10:10 AM', '10:20 AM - 11:20 AM', '11:30 AM - 12:30 PM', '12:40 PM - 01:40 PM', '01:50 PM - 02:50 PM', '03:00 PM - 04:00 PM', '04:10 PM - 05:10 PM', '05:20 PM - 06:20 PM']];

    const sortedArray = []
    routineData.forEach((data) => {
        const array1 = []
        array1.push(data.Course_Section)
        array1.push(data.TimeSlot)
        sortedArray.push(array1)
    })

    // //  Generate table rows dynamically
    const generateRows = (array, headers) => {
      const timeSlots = headers[0].slice(1);
      const checkerArray = []
      array.forEach((val) => {
        checkerArray.push(val[1])
      })
      const rows = ['ST', 'MW', 'RA'].map((prefix) => {
        const row = [prefix];
        timeSlots.forEach((timeSlot) => {
          const time = prefix + ' ' + timeSlot;
          if (checkerArray.includes(time)) {
            array.forEach((val) => {
                if(time == val[1]){
                    row.push(val[0]);
                }
            })
          } else {
            row.push('x');
          }
        });
        
        return row;
      });
      
      return rows;
    };
    
    const rows = generateRows(sortedArray, headers);
    
    const doc = new jsPDF('p', 'pt');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Faculty Routine: ${facultyInitial}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
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
    
    doc.save('faculty_routine.pdf');
  };
  
  

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download Routine</button>
    </div>
  );
};

export default FacultyRoutineTable;
