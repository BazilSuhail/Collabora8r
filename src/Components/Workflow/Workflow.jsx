import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { MdTask } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Assets/Loader';
import decodeJWT from '../../decodeJWT';

const STATUS_TYPES = ['Not Started', 'In Progress', 'Completed'];

 
const TaskCard = ({ task,usersId }) => {
  const navigate = useNavigate();
  const [, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, status: task.status },
  });

  return (
    <div
      ref={drag}
      onClick={() => {
        navigate(`/task/${usersId}/${task._id}`);
      }}
      className="px-4 pt-4 pb-[-12px] bg-white border-[2px] rounded-lg transform transition duration-300 hover:scale-[1.01] mb-6 shadow-lg"
    >
      <div className="flex xsx:flex-row flex-col xsx:items-center xsx:justify-between">
        <h3 className="text-[17px] xsx:text-[19px] flex items-center font-[600]">
          <span className="bg-gray-400 p-[5px] xsx:p-[8px] rounded-full">
            <MdTask className="text-white text-[17px] xsx:text-[20px]" />
          </span>
          <span className="ml-[8px] mt-[-3px]">{task.title.slice(0,30) || 'Untitled Task'}{task.title.length > 30 && "..."}</span>
        </h3>
      </div>

      <p className="text-[15px] ml-[35px] xsx:ml-[45px]">
        <span className="text-red-500 mr-[5px]">Due:</span>
        <span className="text-red-700 underline font-[600] rounded-xl">
          {task.dueDate ? new Date(task.dueDate.$date || task.dueDate).toLocaleDateString() : 'N/A'}
        </span>
      </p>

      <div className="h-[2px] w-full bg-[#eeeeee] rounded-xl mt-[8px]"></div>

      <div className='py-[12px] flex justify-between items-center'>
        <p className='text-[12px] xsx:ml-[45px] text-center px-[12px] rounded-xl py-[3px] text-white font-[600]  bg-blue-800'>
          {task.projectName}
        </p>
        <FaArrowRight className="text-[22px] text-gray-400 xsx:text-[25px]" />
      </div>
    </div>

  );
};

const Column = ({ status, tasks,usersId, moveTask }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => moveTask(item.id, status),
    canDrop: (item) => item.status !== status,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div ref={drop} className={`w-full py-4 pr-[15px] border-r-[3px] ${isOver && canDrop ? 'bg-green-200' : ''}`}>
      <h2 className={`text-[14px] md:text-[15px] rounded-[25px] py-[2px] font-semibold mb-4
       ${status === 'Not Started'
          ? 'bg-blue-100 text-blue-600 w-[110px] md:w-[120px] text-center'
          : status === 'Completed'
            ? 'text-green-600 bg-green-100 w-[110px] md:w-[120px] text-center'
            : 'text-yellow-600 bg-yellow-100 w-[110px] md:w-[120px] text-center'
        }`}>
        {status}
      </h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} usersId={usersId} task={task} moveTask={moveTask} />
      ))}
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white py-8 px-4 rounded-[18px] shadow-lg">
        <h2 className="text-[18px] font-[500] mb-8">Are you sure you want to update the tasks' status?</h2>
        <div className="flex justify-end">
          <button className="bg-red-500 mr-[8px] text-white px-4 py-2 rounded-xl" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Workflow = () => {
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedTasks, setUpdatedTasks] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  
  const [usersId, setUsersId] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, please sign in again.');

        const userId = decodeJWT(token);
        setUsersId(userId);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/overview/assigned-tasks/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const initialTasks = STATUS_TYPES.reduce((acc, status) => {
          acc[status] = response.data.tasks.filter(task => task.status === status);
          return acc;
        }, {});

        setTasks(initialTasks);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const moveTask = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const task = Object.values(prevTasks).flat().find(t => t._id === taskId);
      const updatedTask = { ...task, status: newStatus };

      setUpdatedTasks((prev) => ({ ...prev, [taskId]: newStatus }));

      const updatedTasks = { ...prevTasks };
      updatedTasks[task.status] = updatedTasks[task.status].filter(t => t._id !== taskId);
      updatedTasks[newStatus] = [...(updatedTasks[newStatus] || []), updatedTask];

      return updatedTasks;
    });
  };

  const handleUpdate = async () => {
    setModalOpen(true);
  };

  const confirmUpdate = async () => {
    const updates = Object.entries(updatedTasks).map(([taskId, newStatus]) => ({ id: taskId, status: newStatus }));

    updates.forEach(({ id, status }) => {
      console.log(`Task ID: ${id}, New Status: ${status}`);
    });

    try {
      await axios.patch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/projecttasks/tasks/update`, { updates });
      console.log('All tasks updated successfully');
    } catch (error) {
      console.error('Error updating tasks:', error);
    } finally {
      setUpdatedTasks({});
      setModalOpen(false);
    }
  };
  
  if (loading) return  <Loader/>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen xsx:pl-[280px] pl-[15px] xl:pl-[287px] py-6 bg-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Task Workflow Manager</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STATUS_TYPES.map((status) => (
            <Column key={status} usersId={usersId} status={status} tasks={tasks[status] || []} moveTask={moveTask} />
          ))}
        </div>

        <button
          onClick={handleUpdate}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={Object.keys(updatedTasks).length === 0}
        >
          Update Tasks
        </button>

        <ConfirmationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmUpdate} />
      </div>
    </DndProvider>
  );
};



export default Workflow;
