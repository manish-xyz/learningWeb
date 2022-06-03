import React, {useState} from "react";

function App() {

    let [listItem, setListItem] = useState("");
    let [todoLists, setTodoLists] = useState([]);

function changeHandler(event) {

    let value = event.target.value;
    setListItem(value);
    console.log(value);
}

function clickHandler() {

    setTodoLists( (prevValue) => {
        return [...prevValue, listItem]
    });
    setListItem("")
}

    return (
        <div className="container">
            <div className="heading">
                <h1>To-Do List</h1>
            </div>
            <div className="form">
                <input value={listItem} onChange={changeHandler} type="text" />
                <button onClick={clickHandler}>
                    <span>Add</span>
                </button>
            </div>
            <div>
                <ul>
                   { todoLists.map(item => <li> {item} </li> ) } 
                </ul>
            </div>
        </div>
    );
}

export default App;
