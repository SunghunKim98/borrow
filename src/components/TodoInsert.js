import React, { useState, useEffect } from "react";
import { MdAddCircle } from "react-icons/md";
import { TiTrash, TiPencil } from "react-icons/ti";
import Calendar from "./Calendar";
import "./TodoInsert.css";

const TodoInsert = ({
  onInsertToggle,
  onInsertTodo,
  selectedTodo,
  onRemove,
  onUpdate,
  selectedDate,
  dayToggle,
  currentDay
}) => {
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [flag,setFlag] = useState(0);

  const onChange = e => {
    setValue(e.target.value);
  };


  
  const onChangeDate = (startDate, endDate) => {
    startDate.setHours(0,0,0,0);
    endDate.setHours(0,0,0,0);
    setStartDate(startDate);
    setEndDate(endDate);
    // console.log("start", startDate);
    // console.log("end", endDate);
  };

  const handleSelectChange = e => {
    setFlag((Number)(e.target.value));
  }

  const onSubmit = e => {
    e.preventDefault();
    onInsertTodo(value,startDate,endDate,flag);
    setValue("");
    onInsertToggle();
  };

  useEffect(() => {
    if (selectedTodo) {
      setValue(selectedTodo.text);
    }
  }, [selectedTodo]);

  return (
    <div className="todo-insert">
      <div className="insertbackground" onClick={onInsertToggle}></div>
      <div className="insert-toggle">
      <form
        onSubmit={
          selectedTodo
            ? () => {
                onUpdate(selectedTodo,selectedTodo.id, value,selectedTodo.checked,startDate,endDate,selectedTodo.flag,selectedTodo.flg);
            }
            : onSubmit
        }
      >
        <input
          placeholder="Things that have to do"
          value={value}
          onChange={onChange}
        ></input>
        <div className="text">기간</div><Calendar getCalendarDate={onChangeDate} isWeek={false} 
           start={selectedTodo ? selectedTodo.startdate : (dayToggle ? startDate:currentDay)} end={selectedTodo ? selectedTodo.enddate : (dayToggle ? endDate:currentDay)}/>
        <div>
        </div>
        {selectedTodo ? (
        
          <div className="rewrite">
            <TiPencil
              onClick={() => {
                onUpdate(selectedTodo,selectedTodo.id, value,selectedTodo.checked,startDate,endDate,selectedTodo.flag,selectedTodo.flg);
              }}
            />
            <TiTrash
              onClick={() => {
                onRemove(selectedTodo);
              }}
            />
          </div>
        ) : (
          <button type="submit">
            <MdAddCircle />
          </button>
        )}
      </form>
      </div>
    </div>
  );
};

export default TodoInsert;