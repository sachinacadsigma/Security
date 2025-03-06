import { useState } from 'react';
import { FaCog, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/ALTA-logo-horizontal.png';
import { Question, ShieldCheck, SignOut } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import useApp from '../hooks/useApp';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { apiMode } = useApp();
  const { name, group, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/');
  };

  // Define the link based on apiMode
  const shieldLink =
    apiMode === 'azure'
      ? 'https://learn.microsoft.com/en-us/legal/cognitive-services/translator/data-privacy-security'
      : 'https://www.deepl.com/en/pro-data-security';

  const showSettings = group === 'admin';

  return (
    <header className='sticky top-0 flex items-center justify-between p-7 bg-white z-50 text-black shadow-md'>
      {/* Left Side: Logo */}
      <div className='flex items-center'>
        <Link to='/'>
          <img src={logo} alt='Logo' className='w-full max-w-48 mr-2' />
        </Link>
      </div>

      {/* Center: App Title */}
      <div className='flex-grow text-center'>
        <h1 className='md:text-4xl text-gray-600 font-bold'></h1>
      </div>

      {/* Right Side: Icons */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-3 cursor-pointer text-[#a9d9f5] hover:bg-gray-100 rounded-md p-2 px-3'>
          <h1 className='text-xl font-medium text-gray-700'>{name}</h1>
          <FaUserCircle title='Profile' className='h-7 w-7' />
        </div>

        <a
          title='View privacy policy'
          href={shieldLink}
          className='p-0 flex items-center gap-1 font-semibold text-base'
          target='_blank'
          rel='noopener noreferrer'
        >
          <ShieldCheck
            weight='fill'
            title='Check'
            className='cursor-pointer text-green-500 hover:text-gray-400 h-7 w-7'
          />
          Privacy
        </a>
        {showSettings && (
          <Link to='/settings' className='p-2' title='Settings'>
            <FaCog className='cursor-pointer text-[#a9d9f5] hover:text-gray-400 h-7 w-7' />
          </Link>
        )}

        {/* Question Icon with Dropdown */}
        <div
          className='relative group'
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className='flex items-center gap-1 font-semibold'>
            <Question className='w-7 h-7 text-[#a9d9f5] hover:text-gray-400' />
            FAQs
          </button>
          {isDropdownOpen && (
            <div className='menu-dropdown border absolute right-0 mt-0 w-40 bg-white shadow-lg rounded-md z-10'>
              <div className='menu-caret'></div>

              <Link
                to='/help'
                target='_blank'
                className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                onClick={() => setIsDropdownOpen(false)}
              >
                Help
              </Link>
              <a
                href='https://forms.office.com/r/iG5vQRmAGe'
                target='_blank'
                className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                onClick={() => setIsDropdownOpen(false)}
              >
                Report an Issue
              </a>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className='flex items-center gap-1 font-semibold'
        >
          <SignOut
            title='Log out'
            weight='fill'
            className='h-7 w-7 text-[#a9d9f5] hover:text-gray-400'
          />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
