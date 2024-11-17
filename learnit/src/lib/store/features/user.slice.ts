import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profilePhoto: "",
    displayName: "",
    email: "",
    reputation: 0,
  },
  reducers: {
    setProfilePhoto: (state, action) => {
      state.profilePhoto = action.payload;
    },
    setUserDetails: (state, action) => {
      state.displayName = action.payload.displayName;
      state.profilePhoto = action.payload.profilePhoto;
      state.email = action.payload.email;
      state.reputation = action.payload.reputation;
    },
  },
});

export const { setProfilePhoto, setUserDetails } = userSlice.actions;
export default userSlice.reducer;
