// Let's make an array to store todo list items
let todoListArray = [];

// Show the todo lists which had been added from the HTML form
function showTodoList(todoTask) {
    // Persisting the todo tasklists
    localStorage.setItem('todoListRef', JSON.stringify(todoListArray));

    // Get todo list task
    const todoList = document.querySelector('.js-todolist');

    // Get current todo list task
    const currentTask = document.querySelector(`[data-key="${todoTask.id}"]`);
    console.log(currentTask);

    const isTicked = todoTask.ticked ? 'ticked' : '';
    const liNode = document.createElement('li');
    liNode.setAttribute('class', `todo-task ${isTicked}`);
    liNode.setAttribute('data-key', todoTask.id);
    liNode.innerHTML = `
        <input id="${todoTask.id}" type="checkbox" class="input-ticklist js-ticklist"/>
        <label for="${todoTask.id}"></label>
        <span class="todo-task-text">${todoTask.text}</span>
        <button class="delete-todo-task js-delete-todo-task">Delete</button>
    `;
    if (todoTask.ticked) {
        // Get input node from li node which is in the 0th position
        const inputNode = liNode.children[todoTask.id];
        inputNode.setAttribute("checked", "checked");
    }

    // Replace the current task it is already existed else append to the end of the list
    if (currentTask) {
        todoList.replaceChild(liNode, currentTask);

    } else {
        todoList.append(liNode);
    }

    // Delete todo task
    if (todoTask.deleted) {
        // remove the item from the DOM
        liNode.remove();
        return
    }
}

// Let's make a function to create todo list object and assign to todoListArray array
function addTodo(text) {
    const todoTask = {
        id: Date.now(),
        text,
        ticked: false,
    };

    todoListArray.push(todoTask);

    // Let's show the added todoList
    showTodoList(todoTask);
}

// Method to toggle the task if ticked or not
function toggleTicked(key) {
    const index = todoListArray.findIndex(item => item.id === Number(key));
    console.log(index);
    todoListArray[index].ticked = !todoListArray[index].ticked;
    showTodoList(todoListArray[index]);
}

// Method to delete the todo task
function deleteTodoTask(key) {
    const index = todoListArray.findIndex(item => item.id === Number(key));
    const delTodo = {
        deleted: true,
        ...todoListArray[index]
    }

    delTodo.deleted = true
    todoListArray = todoListArray.filter(item => item.id !== Number(key));
    showTodoList(delTodo);
}

// Let's select the form element 
const todolistForm = document.querySelector('.todolist-form');

// Listen to the submit event
todolistForm.addEventListener('submit', event => {

    // Let's prevent the page to refresh after submitting the data from the form.
    event.preventDefault();

    // Let's get input data from the form
    const inputTodoListData = document.querySelector('.todolist-input');

    // Let's get the value from the input data
    const textData = inputTodoListData.value;

    // Let's check if there is text data and add to the todoList array.
    if (textData != '') {
        addTodo(textData);
        inputTodoListData.value = '';
        inputTodoListData.focus();
    }
});

// Take all the todo list
const todolist = document.querySelector('.js-todolist');

// Listen to click event of todolist children
todolist.addEventListener('click', event => {
    if (event.target.classList.contains('js-ticklist')) {
        const todoListKey = event.target.parentElement.dataset.key;
        toggleTicked(todoListKey);
    }

    // Delete the todo task
    // add this `if` block
    if (event.target.classList.contains('js-delete-todo-task')) {
        const todoListKey = event.target.parentElement.dataset.key;
        deleteTodoTask(todoListKey);
    }
});

// Render any persisted todo lists in the local storage
document.addEventListener('DOMContentLoaded', () => {
    const todoListRef = localStorage.getItem('todoListRef');
    if (todoListRef) {
        todoListArray = JSON.parse(todoListRef);
        todoListArray.forEach(todolist => {
            showTodoList(todolist);
        });
    }
});