const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.innerHTML = `<span>${task.text}</span>
                    <div>
                      <button onclick="toggleTask(${index})">✔</button>
                      <button onclick="removeTask(${index})">✖</button>
                    </div>`;
    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return; 

  tasks.push({ text: text, completed: false });
  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

addBtn.addEventListener("click", addTask);
renderTasks();

window.toggleTask = toggleTask;
window.removeTask = removeTask;
