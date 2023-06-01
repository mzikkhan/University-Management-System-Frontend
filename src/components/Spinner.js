// Importing neccessary libraries and classes
import React from 'react'

// Loading spinner for our pages
function Spinner() {
  return (
    <div className='d-flex justify-content-center spinner'>
        <div className='spinner-border' role="status">
            <span className='visually-hidden'>Loading...</span>
        </div>
    </div>
  )
}

export default Spinner