// Importing neccessary libraries and classes
import { configureStore } from "@reduxjs/toolkit"
import { alertSlice } from "./features/alertSlice"

// Stores our state
export default configureStore({
    reducer: {
        alerts: alertSlice.reducer,
    }
})