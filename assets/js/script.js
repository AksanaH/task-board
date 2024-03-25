// Retrieve tasks and nextId from localStorage
const titleInput = $('#tasktitle');
const dateInput = $('#datepicker');
const descriptionInput = $('#taskdescription');
const taskToDo = document.querySelector("#sortable1");
const taskInProgress = document.querySelector("#sortable2");
const taskDone = document.querySelector("#sortable3");
const addTaskButton = document.querySelector("#add-task");
const statusToDo = "TO_DO";
const statusInProgress = "IN_PROGRESS";
const statusDone = "DONE";
const closeButton = document.querySelector(".close");


// Todo: create a function to generate a unique task id
function generateTaskId() {

    // Increment nextId for the new task
    //add unix time to avoid duplicates of random numbers
    return Math.floor(Math.random() * 100) + 1 + dayjs().unix();
}


// Todo: create a function to create a task card
function createTaskCard(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks === null) {
        //.setItem to store object in storage
        //JSON.stringify to convert it as a string
        localStorage.setItem("tasks", JSON.stringify([task]));
    } else {
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    console.log(task);
    renderTaskList(task);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    if (tasks === null) {
        return
    }
    taskToDo.innerHTML = null;
    taskInProgress.innerHTML = null;
    taskDone.innerHTML = null;

    for (let i = 0; i < tasks.length; i++) {
        const currentTask = tasks[i];


        const newSection = document.createElement("div");
        newSection.classList.add("draggable");
        newSection.classList.add("card");
        
        // newSection.classList.add("bg-danger");
        newSection.classList.add("mb-3");
        newSection.classList.add("card-size");
        newSection.setAttribute("card-id", currentTask.id);



        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.textContent = currentTask.title;
        newSection.append(cardHeader);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        newSection.append(cardBody);


        const due = document.createElement("h5");
        due.classList.add("card-title");
        due.textContent = currentTask.date;
        cardBody.append(due);

        const description = document.createElement("p");
        description.classList.add("card-text");
        description.textContent = currentTask.description;
        cardBody.append(description);

        const buttonDelete = document.createElement("button");
        
        buttonDelete.textContent = "Delete";
        buttonDelete.classList.add("delete");
        cardBody.append(buttonDelete);

        if (currentTask.status === statusToDo){
            // newSection.classList.add("bg-danger");
            taskToDo.append(newSection);
            
        } else if (currentTask.status === statusInProgress){
            // newSection.classList.add("bg-success");
            taskInProgress.append(newSection);
        } else {
            newSection.classList.add("bg-light");
            newSection.classList.add("text-dark");
            taskDone.append(newSection);
        }

        if (currentTask.status !== statusDone) {
            const targetDay = dayjs(currentTask.date);
            const today = dayjs();
            const days = targetDay.diff(today, 'days');
            console.log(days);
            if (days<0) {
                newSection.classList.add("bg-danger");
                newSection.classList.add("text-white");
            } else if (days===0) {
                newSection.classList.add("bg-warning");
                newSection.classList.add("text-white");
            } else {
                newSection.classList.add("bg-light");
                newSection.classList.add("text-dark");
            }
        }
        buttonDelete.addEventListener("click", handleDeleteTask);
    }
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const task = {
        title: titleInput.val(),
        date: dateInput.val(),
        description: descriptionInput.val(),
        id: generateTaskId(),
        status: statusToDo,
    }
    createTaskCard(task);
    $('#formModal').modal('hide')

}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    let taskId = parseInt(event.currentTarget.offsetParent.attributes["card-id"].value);
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    
    for (let i =0; i<tasks.length; i++) {
        
        if (tasks[i].id === taskId) {

            tasks.splice(i, 1);
            break
        } 
        
    }
 
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList();
    
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let destination = ui.item[0].offsetParent.id;
    let taskId = ui.item[0].attributes["card-id"].value;
    // Access the dragged task element

    let taskArray = updateTaskStatusById(parseInt(taskId),destination);
    localStorage.setItem("tasks", JSON.stringify(taskArray));
   
}

function updateTaskStatusById(id, destination) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {   
            if (destination === "done") {
                tasks[i].status = statusDone;
            } else if (destination ==="in-progress") {
                tasks[i].status = statusInProgress;
            }
            else {
                tasks[i].status = statusToDo;
            }
            return tasks; 
        }
    }
}

function handleCloseModal (event) {
    event.preventDefault();
    $('#formModal').modal('hide')
}

// Todo: when the page loads, render the task list, 
//add event listeners, make lanes droppable, and make 
//the due date field a date picker
addTaskButton.addEventListener("click", handleAddTask);
closeButton.addEventListener("click", handleCloseModal);

$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true
        });
    });
});

renderTaskList();

$(function () {
    $("#sortable1, #sortable2, #sortable3").sortable({
        connectWith: ".connectedSortable",
        items: ".draggable",
        remove: function (event, ui) {
            handleDrop(event, ui);
            renderTaskList();
        }
    }).disableSelection();

});

