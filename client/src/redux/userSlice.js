import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  _id: '',
  name: '',
  email: '',
  profile_pic: '',
  token: '',
  onlineUser: [],
  // CHỗ này bị bug không thể edit user details, chưa có cách khắc phục
  socketConnection: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //Cập nhập thông tin user từ action.payload vào state
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    //Đặt token cho user
    setToken: (state, action) => {
      state.token = action.payload;
    },
    //Đặt lại tất cả thuộc tính của user về giá trị mặc đinh khi logout
    logout: (state, action) => {
      state._id = '';
      state.name = '';
      state.email = '';
      state.profile_pic = '';
      state.token = '';
      // CHỗ này bị bug không thể edit user details, chưa có cách khắc phục
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    // CHỗ này bị bug không thể edit user details, chưa có cách khắc phục
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } =
  userSlice.actions;

export default userSlice.reducer;
