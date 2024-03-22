// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const titleInput = $('#tasktitle');
const dateInput = $('#datepicker');
const descriptionInput = $('#taskdescription');
const taskToDo = document.querySelector("#todo-cards");
const taskInProgress = document.querySelector("#in-progress-cards");
const addTaskButton = document.querySelector("#add-task");

// const tasks = [];
// Todo: create a function to generate a unique task id
function generateTaskId() {

    // Increment nextId for the new task
    let taskId = nextId;
    //add unix time to avoid duplicates of random numbers
    const index = Math.floor(Math.random() * 100) + 1 + dayjs().unix();
    // // Update nextId for future tasks
    // nextId++;

    // // Save the updated nextId to localStorage
    // localStorage.setItem("nextId", JSON.stringify(nextId));

    // Return the generated taskId
    return index;

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
// console.log(createTaskCard({
//     title: "sfsf",
//     date: "122111",
//     descrition: "descriptionInput.value",
//   }));

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks===null){
        return
    }
    for (let i = 0; i < tasks.length; i++) {
        const currentTask = tasks[i];


        const newSection = document.createElement("div");
        // newSection.setAttribute('id', 'draggable')
        newSection.classList.add("draggable");
        newSection.classList.add("card");
        newSection.classList.add("text-white");
        newSection.classList.add("bg-danger");
        newSection.classList.add("mb-3");
        newSection.classList.add("card-size");
        newSection.setAttribute("card-id",currentTask.id);
        // <div card-id="currentTask.id"></div> 
        // document.getElementById(".draggable").style.maxWidth="18rem";
        


        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.textContent = currentTask.title;
        newSection.append(cardHeader);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        // cardBody.textContent = currentTask.datepicker;
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
        cardBody.append(buttonDelete);

        
        const a =  Math.floor(Math.random()*2);
        if (a===0){
            taskInProgress.append(newSection);
        } else {
            taskToDo.append(newSection);
        }
        
        /*
        <div id ="draggable" class="card text-white bg-danger mb-3" style="max-width: 18rem;">
            <div class="card-header">Header</div>
            <div class="card-body">
                <h5 class="card-title">Danger card title</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            </div>
            </div>
            */

            // $(function () {
            //     $(".draggable").draggable();
            // });
            // $( function() {
            //     $( ".draggable" ).draggable({ revert: true });
            //     // $( "#draggable2" ).draggable({ revert: true, helper: "clone" });
            //   } );
            

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
        status: "TO_DO"
    }
    // console.log(createTaskCard(task));
    // $('#formModal').modal('hide')

}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let destination = ui.item[0].offsetParent.id; 
    let taskId = ui.item[0].attributes["card-id"].value;
   // Access the dragged task element
    console.log(draggedTask.title());
}

// Todo: when the page loads, render the task list, 
//add event listeners, make lanes droppable, and make 
//the due date field a date picker
addTaskButton.addEventListener("click", handleAddTask);

console.log(generateTaskId());

$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker({
            changeMonth: true,
            changeYear: true
        });
    });
});

renderTaskList();
$( function() {
    $( "#sortable1, #sortable2, #sortable3" ).sortable({
      connectWith: ".connectedSortable",
      items: ".draggable",
      update: function(event, ui) {
        handleDrop(event, ui)
      }
    }).disableSelection();
    
  } );

