import React, { useState } from 'react';
import { PiUserCircle } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: '',
  });

  const navigate = useNavigate();

  //  //Cập nhật trạng thái data khi người dùng nhập vào trường email.
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
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);

      toast.success(response.data.message);

      //Nếu server trả về dữ liệu thành công, điều hướng người dùng đến trang /password
      if (response.data.success) {
        setData({
          email: '',
        });
        navigate('/password', {
          state: response?.data?.data,
        }); // go to /email page
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2'>
          <PiUserCircle size={80} />
        </div>

        <h3>Welcome to Chat application</h3>
        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='enter your email'
              className='bg-slate-100 px-2 py-1 focus:outline-primary'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
            Let's Go
          </button>
        </form>

        <p className='my-3 text-center'>
          New User ?{' '}
          <Link to={'/register'} className='hover:text-primary font-semibold '>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
