import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  description?: string;
}

interface LocationState {
  currentLocation: Location | null;
  searchLocation: Location | null;
}

const initialState: LocationState = {
  currentLocation: null,
  searchLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    setSearchLocation: (state, action: PayloadAction<Location>) => {
      state.searchLocation = action.payload;
    },
  },
});

export const { setCurrentLocation, setSearchLocation } = locationSlice.actions;
export default locationSlice.reducer;
