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
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

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
        <Outlet />
      </section>
    </div>
  );
};

export default Home;
