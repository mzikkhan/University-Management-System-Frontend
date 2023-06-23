import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

const RoomRoutineTable = (props) => {
  const [routineData, setRoutineData] = useState([]);
  // Access the rooms._id prop
  const roomId = props.roomId;
  const roomName = props.roomName;

  useEffect(() => {
    // Fetch room routine data from API
    async function fetchRoutineData() {
      try {
        const response = await axios.get(`http://127.0.0.1:5557/api/rooms/getRoutine/${roomId}`);
        setRoutineData(response.data);
      } catch (error) {
        console.error('Error fetching room routine data:', error);
      }
    }

    fetchRoutineData();
  }, []);

  const handleDownloadPDF = () => {
    const headers = [['Class Time', '08:00 AM - 09:00 AM', '09:10 AM - 10:10 AM', '10:20 AM - 11:20 AM', '11:30 AM - 12:30 PM', '12:40 PM - 01:40 PM', '01:50 PM - 02:50 PM', '03:00 PM - 04:00 PM', '04:10 PM - 05:10 PM', '05:20 PM - 06:20 PM']];

    const sortedArray = routineData.sort((a, b) => {
        const pattern = /^(ST|MW|RA)/; // Regular expression pattern to match the prefixes
        const prefixA = a.match(pattern)[0]; // Extract prefix from string a
        const prefixB = b.match(pattern)[0]; // Extract prefix from string b
      
        if (prefixA < prefixB) {
          return -1; // a should come before b
        } else if (prefixA > prefixB) {
          return 1; // a should come after b
        } else {
          return 0; // a and b are equal
        }
      });

    //  Generate table rows dynamically
    const generateRows = (array, headers) => {
      const timeSlots = headers[0].slice(1);
      
      const rows = ['ST', 'MW', 'RA'].map((prefix) => {
        const row = [prefix];
        timeSlots.forEach((timeSlot) => {
          const time = prefix + ' ' + timeSlot;
          if (array.includes(time)) {
            row.push('Class');
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
    doc.text(`ROOM: ${roomName}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
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
    
    doc.save('room_routine.pdf');
  };
  
  

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download Routine</button>
    </div>
  );
};

export default RoomRoutineTable;
