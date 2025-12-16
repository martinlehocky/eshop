<script setup>
import { ref } from 'vue'

const newTodo = ref('')
const todos = ref([])

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.value.push({
    id: crypto.randomUUID(),
    text: newTodo.value.trim(),
    completed: false
  })
  newTodo.value = ''
}

function removeTodo(todo) {
  todos.value = todos.value.filter(t => t.id !== todo.id)
}

function completeTodo(todo) {
  todo.completed = true
}
</script>

<template>
  <div class="todo-app">
    <h1 class="title">TODO List</h1>

    <section class="active-tasks">
      <h2>Active Tasks</h2>
      <ul v-if="todos.filter(t => !t.completed).length">
        <li v-for="todo in todos.filter(t => !t.completed)" :key="todo.id" class="todo-item">
          <span>{{ todo.text }}</span>
          <div class="actions">
            <button class="complete-btn" @click="completeTodo(todo)">Complete</button>
            <button class="delete-btn" @click="removeTodo(todo)">Delete</button>
          </div>
        </li>
      </ul>
      <p v-else>No active tasks!</p>
    </section>

    <section class="add-section">
      <h2>Add New Task</h2>
      <form @submit.prevent="addTodo" class="add-form">
        <input v-model="newTodo" placeholder="Enter a new task..." class="input-task" />
        <button>Add</button>
      </form>
    </section>

    <section class="completed-tasks">
      <h2>Completed Tasks</h2>
      <ul v-if="todos.filter(t => t.completed).length">
        <li v-for="todo in todos.filter(t => t.completed)" :key="todo.id" class="todo-item completed">
          <span>{{ todo.text }}</span>
          <button class="delete-btn" @click="removeTodo(todo)">Delete</button>
        </li>
      </ul>
      <p v-else>No completed tasks yet!</p>
    </section>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 40px auto;
  padding: 25px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
}

h1, h2 {
  text-align: center;
}

.active-tasks, .completed-tasks, .add-section {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  margin-bottom: 8px;
  padding: 10px 14px;
  border-radius: 8px;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: gray;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
}

.complete-btn {
  background-color: #28a745;
  color: white;
}


.delete-btn {
  background-color: #dc3545;
  color: white;
}


.add-form {
  display: flex;
  gap: 10px;
}

.input-task {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button[type="submit"] {
  background: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background: #0069d9;
}
</style>
