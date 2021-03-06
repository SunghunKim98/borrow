import React, { useEffect, useState } from "react";
import "./Home.css";
import Template from "./Template";
import TodoToday from "./TodoToday";
import { MdAddCircle } from "react-icons/md";
import TodoInsert from "./TodoInsert";
//import TodoPreviewList from "./components/TodoPreviewList";
import TodoDate from "./TodoDate";
import TodoWeekly from "./TodoWeekly";


const databaseURL = "https://todo-app-67946.firebaseio.com"

let nextId = 0;

const Home = ({handleLogout, user}) => {

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedDay,setSelectedDay]=useState(new Date());
  const [insertToggle, setInsertToggle] = useState(false);
  const [dayToggle,setDayToggle] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [words, setWords] = useState([]);

  useEffect(() => {
    setTodos([]);

      fetch(`${databaseURL}/${user}/todos.json`).then(res => {
      //fetch(`${databaseURL}/todo.json`).then(res => {
        if(res.status !== 200){
            throw new Error(res.statusText);
        }
        return res.json();
      }).then(words => setWords(words))
      if(words!=null) {
      {Object.keys(words).map(id => {
        const word = words[id];
        nextId = word.id+1;
        const todo = {
            id: word.id,
            text: word.text,
            checked: word.checked,
            startdate: new Date(word.startdate),
            enddate: new Date(word.enddate),
            flag: word.flag,
            flg : word.flg
        };
    
        setTodos(todos => todos.concat(todo));
      }) 
      }
    }
  }, [words]);


  const onInsertToggle = () => {
    if (selectedTodo) {
      setSelectedTodo(null);
    }
    setInsertToggle(prev => !prev);
  };

  const onDayToggle = () => {
    setDayToggle(prev => !prev);
  };

  const onInsertTodo = (text,startdate,enddate,flag) => {
    if (text === "") {
      return alert("할 일을 입력해주세요.");
    } else {
      // console.log("flag=",flag);
      // console.log("start", startDate);
      // console.log("end", endDate);

      const todo = {
        id : nextId,
        text,
        checked: false,
        startdate,
        enddate,
        flag,
        flg : 0
      };

      console.log(todo);

      setTodos(todos => todos.concat(todo));
      nextId++;

      _post(todo);
      }
  };

  const _post = todo => {
    return fetch(`${databaseURL}/${user}/todos.json`, {
      method: 'POST',
      body: JSON.stringify(todo)
    }).then(res => {
      if(res.status != 200) throw new Error(res.statusText);  
      return res.json();
    })
  }

  const onCheckToggle = (ID) => {
    
    if(words!=null) {
      
      {Object.keys(words).map(id => {
        
        if(words[id].id == ID){
        
          fetch(`${databaseURL}/${user}/todos/${id}.json`, {
              body: `{\n  \"checked\": ${!words[id].checked}\n}`,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "PATCH"
            }).then(res => {
              if(res.status != 200) throw new Error(res.statusText);
      
              return res.json();
          }).then(() => {
            //console.log(words[id].checked);
          })
        }

      }) 
      }
    }
  };

  const onChangeSelectedTodo = todo => {
    setSelectedTodo(todo);
  };

  const onChangeSelectedDay = day => {
    setSelectedDay(day);
    console.log("change ", day.getDate());
  };

  const onRemove = selectedTodo => {
    onInsertToggle();
    
    if(words!=null) {
      
      {Object.keys(words).map(id => {
        
        if(words[id].id == selectedTodo.id){
          console.log(id)
          fetch(`${databaseURL}/${user}/todos/${id}.json`, {
            method: 'DELETE',
          }).then(res => {
              if(res.status != 200) throw new Error(res.statusText);
      
              return res.json();
          }).then(() => {
              //delete todos[id];
          })
        }

      }) 
      }
    }
    
    //setTodos(todos => todos.filter(todo => todo.id !== id));
    };

    const onUpdate = (selectedTodo,id, text,checked,start,end,flag,flg) => {

      console.log(selectedTodo)
  
      if(words!=null) {
        
        {Object.keys(words).map(id => {

          console.log(id)
          
          if(words[id].id == selectedTodo.id){
            //console.log(id)
  
            fetch(`${databaseURL}/${user}/todos/${id}.json`, {
              //body: "{\n  \"text\": \"Alan The Machine\",\n  \"startdate\": \"2020-11-20\",\n  \"enddate\": \"2020-11-20\",\n  \"flag\": \"2\"\n}",
                body: `{\n  \"text\": \"${text}\",\n  \"startdate\": \"${start}\",\n  \"enddate\": \"${end}\",\n  \"flag\": \"${flag}\"\n}`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PATCH"
              }).then(res => {
                if(res.status != 200) throw new Error(res.statusText);
        
                return res.json();
            }).then(() => {
                //delete todos[id];
            })
          }
  
        }) 
        }
      }
  
      onInsertToggle();
      setTodos(todos =>
        todos.map(todo => (todo.id === id ? {...todo,text}: todo))
      );
      setTodos(todos =>
        todos.map(todo => (todo.id === id ? {...todo,startdate:start}: todo))
      );
      setTodos(todos =>
        todos.map(todo => (todo.id === id ? {...todo,enddate:end}: todo))
      );
    };


  const onCurrentDay = (currentDay) => {
    currentDay.setHours(0,0,0,0);
    setCurrentDay(currentDay);
  }

  return (

    <Template currentDay={currentDay}>
      <button className="logout" onClick={handleLogout}>Logout</button>
      <div className="clear-left"></div>
      {/* <div className="title"> {currentDay.getFullYear()}년 {currentDay.getMonth()+1}월 {currentDay.getDate()}일</div> */}
      <TodoDate
        onCurrentDay={onCurrentDay}
        />
        <MdAddCircle className="add-todo-button" onClick={onInsertToggle} />
        <div className="clear"></div>
      {/* <TodoPreviewList
      currentdayofpreview={currentDay}
      todos={todos}
      
      /> */}
      <div className="weekly">
        <TodoWeekly
      currentDay={currentDay}
      todos={todos}
      onDayToggle={onDayToggle}
      onChangeSelectedDay={onChangeSelectedDay}
      />
      </div>
      <div className="today">
      {dayToggle && ( <TodoToday
        todos={todos}
        selectedDay={selectedDay}
        onCheckToggle={onCheckToggle}
        onInsertToggle={onInsertToggle}
        onChangeSelectedTodo={onChangeSelectedTodo}
        onDayToggle={onDayToggle}
        /> )}
      </div>
      <div className="inserToggle">
      {insertToggle && (
        <TodoInsert
        selectedTodo={selectedTodo}
        onInsertToggle={onInsertToggle}
        onInsertTodo={onInsertTodo}
        onRemove={onRemove}
        onUpdate={onUpdate}
        selectedDate={selectedDay}
        dayToggle={dayToggle}
        currentDay={currentDay}
        />
      )}
      </div>
      
    </Template>
  );
};

export default Home;