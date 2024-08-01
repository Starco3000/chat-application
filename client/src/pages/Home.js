import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';
import axios from 'axios';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('Redux user', user);

  const fetchUserDetails = async() => {
    try {
      //Lấy URL từ biến môi trường
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      // Thực hiện yêu cầu HTTP GET đến URL.
      const response = await axios({
        url: URL,
        withCredentials: true, // Gửi cookie cùng với yêu cầu
      });

      // Cập nhập state user với data từ response
      dispatch(setUser(response.data.data)); 

      // Nếu server trả về dữ liệu yêu cầu logout, thực hiện logout và điều hướng đến trang email
      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
      console.log('current user details', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div>
      Home
      {/* Message Component */}
      <section>
        {/* render các component con */}
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
