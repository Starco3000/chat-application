import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    _id: user?._id,
    name: '',
    profile_pic: user?.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        ...user,
      };
    });
  }, [user]);

  const handleOnChange = (e) => {
    // const { name, value } = e.target;

    // setData((preve) => {
    //   return {
    //     ...preve,
    //     [name]: value,
    //   };
    // });
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  // Handle upload photo
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true,
      });
      console.log('response', response);
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white px-4 py-11 m-1 rounded w-full max-w-sm'>
        <h2 className='font-semibold'>Profile Detail</h2>
        <p className='text-sm'>Edit user details</p>

        <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full py-1 px-2 focus:outline-primary border-0.5 '
            />
          </div>

          <div>
            <div>Photo:</div>
            <div className='my-1 flex items-center gap-4'>
              <Avatar
                width={40}
                height={40}
                name={data?.name}
                imageUrl={data?.profile_pic}
                userId={data?._id}
              />
              <label htmlFor='profile_pic'>
                <button
                  className='font-semibold'
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type='file'
                  id='profile_pic'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider />

          {/* Button Save & Cancel */}
          <div className='flex gap-2 w-fit ml-auto'>
            <button
              className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
