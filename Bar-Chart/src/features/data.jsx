import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk('fetchData', async () => {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
    return response.json();
})

const initialStateValue = {loaded: false, isLoading: false, isError: false, value: {}}

export const dataSlice = createSlice({
    name: 'data',
    initialState: initialStateValue,
    extraReducers: (getData) => {
        getData.addCase(fetchData.pending, (state) => {
            state.loaded = false;
            state.isError = false;
            state.isLoading = true;
        });
        getData.addCase(fetchData.rejected, (state, action) => {
            console.log('uh-oh:', action.payload);
            state.isError = true;
        });
        getData.addCase(fetchData.fulfilled, (state, action) => {
            state.loaded = true;
            state.isLoading = false;
            state.value = Object.assign({}, state.value, action.payload);
        })
    }
});


export default dataSlice.reducer;