import { toast } from "react-toastify";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../App";
import LoadingImg from "../assets/loader.gif";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTask, setCompletedTask] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState({ name: "", completed: false });
  const [isEditing, setisEditing] = useState(false);
  const [taskId, settaskId] = useState("");
  const { name } = formData;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const getTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/gettasks`);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);
  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input Field cannot be Empty");
    }
    try {
      await axios.post(`${URL}/api/createtasks`, formData);
      toast.success("Task Added Successfully");
      setformData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const DeleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/deletetask/${id}`);
      toast.success("Task deleted Successfully");
      getTasks();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(()=>{
    const ctask = tasks.filter((task)=>{
        return task.completed === true
    })
    setCompletedTask(ctask)
  },[tasks])

  const getSingleTask = async (task) => {
    setformData({ name: task.name, completed: false });
    settaskId(task._id);
    setisEditing(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input Field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/updatetask/${taskId}`, formData);
      setformData({ ...formData, name: "" });
      setisEditing(false);
      getTasks();
    } catch ({ error }) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newformData = {
      name: task.name,
      completed: true,
    };
    try {
      await axios.put(`${URL}/api/updatetask/${task._id}`, newformData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="--flex-between --pb">
          <p>
            <b>Total Task:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Task:</b> {completedTask.length}
          </p>
        </div>
      )}
      <hr />
      {isLoading && (
        <div className="--flex-center">
          <img src={LoadingImg} alt="Loading" />
        </div>
      )}
      {!isLoading && tasks.length === 0 ? (
        <p className="--py">No Task Added. Please Add a Task</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task._id}
                task={task}
                index={index}
                DeleteTask={DeleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
