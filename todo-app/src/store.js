// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import taskReducer, { fetchTasks } from './features/tasks/taskSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

// Fetch the tasks once the store is initialized
store.dispatch(fetchTasks());

export default store;
