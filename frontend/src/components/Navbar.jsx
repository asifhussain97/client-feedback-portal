import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector(state => state.auth.user?.role);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate('/auth');
      }
    });
  };

  return (
    <nav className="navbar">
      <ul>
        {role === 'client' && (
          <>
            <li><Link to="/">Feedback History</Link></li>
            <li><Link to="/feedback">Provide Feedback</Link></li>
          </>
        )}
        {role === 'admin' && (
          <li><Link to="/admin">Admin Dashboard</Link></li>
        )}
      </ul>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
