// Importing neccessary libraries and classes
import {createSlice} from "@reduxjs/toolkit"

// Manages our state
export const alertSlice = createSlice({
    name:"alerts",
    initialState: {
        loading: false,
    },
    reducers: {
        showLoading: (state) => {
            state.loading = true
        },
        hideLoading: (state) => {
            state.loading = false
        }
    },
})

export const { showLoading, hideLoading } = alertSlice.actions