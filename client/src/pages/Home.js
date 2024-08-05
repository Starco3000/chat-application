import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/userSlice';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Redux user', user);

  const fetchUserDetails = async () => {
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

  console.log('location', location);
  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar />
      </section>

      {/* Message Component */}
      <section className={`${basePath && 'hidden'}`}>
        {/* render các component con */}
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 ${
          !basePath ? 'hidden' : 'lg:flex'
        }`}
      >
        <div>
          <img src={logo} width={250} alt='logo' />
        </div>
        <p className='text-lg mt-2 text-slate-500'>
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
