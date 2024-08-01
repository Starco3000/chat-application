import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: '',
    userId: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Ktra nếu không có name trong location.state, điều hướng người dùng đến trang /email
  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
      console.log('location', location.state.name);
    }
  }, []);

  //Cập nhật trạng thái data khi người dùng nhập vào trường mật khẩu.
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  //Hàm gọi API để xác thực mật khẩu người dùng khi biểu mẫu được gửi.
  const handleSubmit = async (e) => {
    e.preventDefault(); //Ngăn chặn hành vi mặc định của form
    e.stopPropagation();

    //Lấy URL từ biến môi trường
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      //Thực hiện yêu cầu HTTP POST với password và userId.
      const response = await axios({
        method: 'POST',
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      toast.success(response.data.message);

      //Nếu response trả về data thành công thì lưu token vào Redux store và localStorage.
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem('token', response?.data?.token);

        setData({
          password: '',
        });
        navigate('/'); // go to /email page
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          {/* Hiển thị Avatar người đùng đã được xử lý ngăn chặn re-render */}
          <MemorizedAvatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className='font-semibold text-lg mt-1'>
            {location?.state?.name}
          </h2>
        </div>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='enter your password'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Login
          </button>
        </form>

        <p className='my-3 text-center'>
          <Link
            to={'/forgot-password'}
            className='hover:text-primary font-semibold '
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

const MemorizedAvatar = React.memo(Avatar); // help memoize the Avatar component not to re-render on every state change

export default CheckPasswordPage;
