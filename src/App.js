import React,{ useEffect, useState } from 'react';
import './App.css';
import api from './api';
import {TiDelete} from 'react-icons/ti'
import { BsFillCheckCircleFill } from 'react-icons/bs';

function App() {
  const [todos, makingTodos] = useState([]);
  const [TodoSubmitForm, setTodoSubmitForm] = useState({
    TodoId: ' ',
    desc: ' ',
    name: ' ',
    status: ' ',
  });
  const fetchTodos = async()=> {
    const response = await api.get('/todo');
    makingTodos(response.data)
  };
  useEffect(() =>{
    fetchTodos();
  },[]);
  const [completedLayout, setCompleted] = useState(false);
  const [ToDos,setTodos] = useState([]);
  const [Title, setTitles] = useState("");
  const [Description, setDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const DeleteCompletedTodos = index => {
    let deletingToDos =[...completedTodos];
    deletingToDos.splice(index);
    localStorage.setItem('completedTodos',JSON.stringify(deletingToDos));
    setCompletedTodos(deletingToDos);
  }
  const completedHandler = (index) =>{
    let time = new Date();
    let dd = time.getDate();
    let mm = time.getMonth();
    let yy = time.getFullYear();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    let TimeFormat = dd + '/' + mm + '/' + yy + 'at ' + h + ':' +m + ':' +s;
    let TimeCompleted = {
      ...ToDos[index],
      completedOn:TimeFormat
    }
    let ArrangeTimeCompleted = [...completedTodos];
    ArrangeTimeCompleted.push(TimeCompleted);
    setCompletedTodos(ArrangeTimeCompleted);
    DeleteToDosHandler(index);
    localStorage.setItem('completedTodos',JSON.stringify(ArrangeTimeCompleted));
  }
  const ToDosHandler =()=>{
    let newToDos ={
      title:Title,
      description:Description
    }
    let ArrangeTodos =[...ToDos];
    ArrangeTodos.push(newToDos);
    setTodos(ArrangeTodos);
    localStorage.setItem('todos',JSON.stringify(ArrangeTodos));
  }
  const DeleteToDosHandler =index=>{
    let deletingToDos =[...ToDos];
    deletingToDos.splice(index);
    localStorage.setItem('todos',JSON.stringify(deletingToDos));
    setTodos(deletingToDos);
  }
  useEffect(()=>{
    let savedToDos = JSON.parse(localStorage.getItem('todos'));
    let savedCompletedTodos = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedToDos){
      setTodos(savedToDos)
    }
    if(savedCompletedTodos){
      setCompletedTodos(savedCompletedTodos)
    }
  },[])
  return (
    <div className="App">
      <h1>San's ToDoList by Nicholaus Santo - 2602174415</h1>
      <div className="wrapper">
        <div className="inputs">
          <div className="inputing-items">
            <label>Task</label>
            <input type="text" value={Title} onChange={(e)=>setTitles(e.target.value)} placeholder="What tasks?"/>
          </div>
          <div className="inputing-items">
            <label>Task Description</label>
            <input type="text" value={Description} onChange={(e)=>setDescription(e.target.value)} placeholder="..."/>
          </div>
          <div className="inputing-items">
            <button type="button" onClick={ToDosHandler} className="AddTaskButton">Add Task</button>
          </div>
        </div>
        <div className="filters">
         <button className={`filterButtons ${completedLayout===false&&'active'}`}onClick={()=>setCompleted(false)}>Incomplete</button>
         <button className={`filterButtons ${completedLayout===true&&'active'}`}onClick={()=> setCompleted(true)}>Completed</button> 
        </div>
        <div className="todo-list">
          {completedLayout===false&&ToDos.map((item,index)=>{
            return(
              <div className="todo-list-items"key={index}>
               <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <TiDelete className="icon-delete" onClick={()=>DeleteToDosHandler(index)} />
                  <BsFillCheckCircleFill className="icon-check" onClick={()=>completedHandler(index)}/>
                </div>
              </div>
            )
          })}
          {completedLayout===true&&completedTodos.map((item,index)=>{
            return(
              <div className="todo-list-items"key={index}>
               <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on {item.completedOn}</small></p>
                </div>
                <div>
                  <TiDelete className="icon-delete" onClick={()=>DeleteCompletedTodos(index)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
