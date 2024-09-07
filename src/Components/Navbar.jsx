import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { IoMenu, IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineFolderShared, } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";


import { FaBell, FaCubes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

import texleathlogo from "../texleathlogo.svg";
import { RxDashboard } from "react-icons/rx";
import { BsGraphUp } from "react-icons/bs";
import { GoPeople, GoProjectRoadmap } from "react-icons/go";
import { RiLogoutBoxRLine } from 'react-icons/ri';


const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];


const Navbar = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [projectColors, setProjectColors] = useState({});
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isArrowOpen, setisArrowOpen] = useState(true);
    const toggleOpen = () => setisArrowOpen(!isArrowOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, config);
                setProfile(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchJoinedProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedProjects = response.data; // Assuming this is an array of project objects

                // Assign a random color to each project and store it in the projectColors state
                const colorMapping = {};
                fetchedProjects.forEach(project => {
                    colorMapping[project._id] = getRandomColor();
                });

                setProjects(fetchedProjects);
                setProjectColors(colorMapping);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
        fetchJoinedProjects();
    }, []);


    const handleProjectClick = (projectId) => {
        navigate(`/joinedprojects/${projectId}`);
    };


    return (
        <nav>

            <div className=" hidden bg-[#ffffff] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
                <div className="flex text-red-50 flex-col w-[95%]">
                    <div className="flex justify-between">
                        <div className="text-[22px] font-bold text-[#363636]">Collabora8r</div>
                        <FaBell className="mt-[10px] text-[#363636] text-[20px]" />
                    </div>

                    <div className="flex items-center px-[8px] py-[5px] mt-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
                        <IoMdSearch className=" text-[#8c8c8c] text-[24px]" />
                        <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
                    </div>

                    <div className='  mt-[15px] flex items-center justify-between'>
                        <p className="text-[#6a6a6a] font-bold ml-[5px]">Account</p>
                        <RiLogoutBoxRLine onClick={handleLogout} className='text-[22px] text-[#ff5555]' />
                    </div>

                    <NavLink to="/profile" className="flex items-center pl-[20px] py-[12px] mt-[8px] shadow-profile-navbar rounded-lg">
                        {loading || !profile?.avatar ? (
                            <p className='text-[#363636]'>Login To Continue</p>
                        ) : (
                            <img src={`/Assets/${profile.avatar}.jpg`} alt="Profile" className="w-[25px] h-[25px] rounded-full" />
                        )}
                        {loading || !profile?.name ? (
                            <p className='text-white'>L</p>
                        ) : (
                            <div className="text-[17px] ml-[10px] font-medium text-[#7f7f7f]">{profile.name}</div>
                        )}
                    </NavLink>

                    <div className="border-t-2 mt-[20px] pl-[4px] pt-[15px] border-gray-300 ">
                        <NavLink to="/" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <RxDashboard className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Dashboard</p>
                        </NavLink>
                        <NavLink to="/overview" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <MdOutlineFolderShared className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Overview</p>
                        </NavLink>
                        <NavLink to="/usage" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <BsGraphUp className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Usage</p>
                        </NavLink>
                        <NavLink to="/joinedprojects/" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <FaCubes className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Snacks</p>
                        </NavLink>
                        <NavLink to="/associated-projects" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <GoPeople className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Associated Projects</p>
                        </NavLink>

                        <div className="pl-[8px]  my-[5px]">
                            <div className="text-lg text-[#363636] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                                <div className="flex items-center">
                                    <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
                                    <p className="font-[500] text-[16px]">Projects</p>
                                </div>
                                {isArrowOpen ? (
                                    <MdKeyboardArrowDown className="ml-2" />
                                ) : (
                                    <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className='flex flex-col pt-[15px] items-start text-[#363636]'>
                                    {projects.map((project) => (
                                        <div key={project._id} className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
                                            <div className={`w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-white font-[700] rounded-full ${projectColors[project._id]}`}>
                                                {project.name.charAt(0)}
                                            </div>
                                            <button className='ml-[8px] font-[600]' onClick={() => handleProjectClick(project._id)}>
                                                {project.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="relative text-white xsx:hidden">
                <div className="flex items-center h-[70px]  justify-between bg-white border-b-2 border-[#a4a4a4] px-4 py-3 z-50 relative">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
                        </motion.div>
                        <motion.div
                            className="text-[28px] font-bold"
                            initial={{ x: 40 }}
                            animate={{ x: isMenuOpen ? -40 : 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-[#575757] ml-[4px] md:text-[25px] text-[22px] font-[700]">Collabora<span className='font-[800] text-red-600'>8</span>r</div>
                        </motion.div>
                    </div>
                    <motion.div
                        key={isMenuOpen ? 'close' : 'menu'}
                        initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }}
                        transition={{ duration: 0.3 }}
                        className="cursor-pointer text-gray-500"
                        onClick={handleMenuToggle}
                    >

                        {isMenuOpen ? (
                            <IoClose size={35} />
                        ) : (
                            <IoMenu size={35} />
                        )}
                    </motion.div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70vw", transition: { duration: 0.5 } }}
                            exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
                            className="fixed inset-0 bg-navbar-color bg-white shadow-xl shadow-[#363636]  flex w-[70vw] flex-col h-screen px-[5px] py-3 z-30"
                        >
                            <div className='my-[25px]'></div>
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                                className="flex flex-col mt-[25px]"
                            >
                                <button  onClick={handleMenuToggle} className='flex items-center justify-between'>
                                    <p className="text-[#6a6a6a] font-bold ml-[18px]">Account</p>
                                    <RiLogoutBoxRLine onClick={handleLogout} className='text-[22px] text-[#ff5555]' />
                                </button>

                                <NavLink  onClick={handleMenuToggle} to="/profile" className="flex items-center pl-[20px] py-[12px] mt-[8px] bg-[#d3d3d3] rounded-lg">
                                    {loading || !profile?.avatar ? (
                                        <p className='text-[#363636]'>Login To Continue</p>
                                    ) : (
                                        <img src={`/Assets/${profile.avatar}.jpg`} alt="Profile" className="w-[30px] h-[30px] rounded-full" />
                                    )}
                                    {loading || !profile?.name ? (
                                        <p className='text-white'>L</p>
                                    ) : (
                                        <div className="text-[20px] ml-[10px] font-medium text-[#5c5c5c]">{profile.name}</div>
                                    )}
                                </NavLink>

                                <button onClick={handleMenuToggle} className="flex items-center px-[8px] py-[5px] my-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
                                    <IoMdSearch className=" text-[#8c8c8c] text-[24px]" />
                                    <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
                                </button>

                                <NavLink to="/" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                                    <RxDashboard className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Dashboard</p>
                                </NavLink>
                                <NavLink to="/overview" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                                    <MdOutlineFolderShared className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Overview</p>
                                </NavLink>
                                <NavLink to="/usage" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                                    <BsGraphUp className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Usage</p>
                                </NavLink>
                                <NavLink to="/joinedprojects/" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                                    <FaCubes className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Snacks</p>
                                </NavLink>
                                <NavLink to="/associated-projects" onClick={handleMenuToggle} className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                                    <GoPeople className="text-[25px] mb-[3px] mr-[12px]" /><p className="mb-[4px] text-[18px]">Associated Projects</p>
                                </NavLink>

                                <div className="pl-[8px]  my-[5px]">
                                    <div className="text-[#363636] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                                        <div className="flex items-center">
                                            <GoProjectRoadmap className="text-[25px] mt-[4px] mr-[12px]" />
                                            <p className="font-[500] text-[19px]">Projects</p>
                                        </div>
                                        {isArrowOpen ? (
                                            <MdKeyboardArrowDown className="ml-4 text-[25px] font-bold" />
                                        ) : (
                                            <MdKeyboardArrowUp className="ml-4 text-[25px] font-bold" />
                                        )}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className='flex flex-col pt-[15px] items-start text-[#363636]'>
                                            {projects.map((project) => (
                                                <div key={project._id} className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
                                                    <div className={`w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-white font-[700] rounded-full ${projectColors[project._id]}`}>
                                                        {project.name.charAt(0)}
                                                    </div>
                                                    <button className='ml-[8px] text-[17px] font-[600]' onClick={() => handleProjectClick(project._id)}>
                                                        {project.name}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
export default Navbar; 