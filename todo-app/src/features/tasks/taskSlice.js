import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Function to load tasks from localStorage or fallback to fetching from JSON file
const loadTasks = async () => {
  const savedTasks = localStorage.getItem("tasksData");
  if (savedTasks) {
    return JSON.parse(savedTasks);
  } else {
    const response = await fetch("/data/tasks.json");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    return data;
  }
};

// Function to save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasksData", JSON.stringify(tasks));
};

// Async thunk to fetch tasks from localStorage or JSON file
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await loadTasks();
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    categories: [], // Array to hold categories and tasks
    status: "idle", // Status of the fetch operation
    error: null, // Error message if the fetch fails
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      saveTasks(state.categories); // Save to localStorage
    },
    addCategory(state, action) {
      const maxId = state.categories.length > 0 
        ? Math.max(...state.categories.map(cat => cat.id)) 
        : 0;
    
      const newCategory = {
        category_order: state.categories.length + 1, // Place it at the end of the list
        id: maxId + 1, // Increment the ID by one
        name: action.payload, // The name passed from the action
        tasks: [], // Initialize with an empty task list
      };
    
      state.categories.push(newCategory);
      saveTasks(state.categories); // Save to localStorage
    },
    updateCategory(state, action) {
      const { categoryId, name } = action.payload;
      const existingCategory = state.categories.find(
        (cat) => cat.id === categoryId
      );
      if (existingCategory) {
        existingCategory.name = name;
        saveTasks(state.categories); // Save to localStorage
      }
    },
    deleteCategory(state, action) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      saveTasks(state.categories); // Save to localStorage
    },
    addTask(state, action) {
      const { categoryId, title, description, taskOrder } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        const maxTaskId = category.tasks.length > 0 
          ? Math.max(...category.tasks.map(task => task.id)) 
          : 0;
    
        const newTask = {
          id: maxTaskId + 1, // Increment the ID by one
          title,
          description,
          task_order: taskOrder,
          category_id: categoryId,
        };
        category.tasks.push(newTask);
        saveTasks(state.categories); // Save to localStorage
      }
    },
    updateTask(state, action) {
      const { taskId, title, description, taskOrder, categoryId } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        const task = category.tasks.find((task) => task.id === taskId);
        if (task) {
          task.title = title;
          task.description = description;
          task.task_order = taskOrder;
          saveTasks(state.categories); // Save to localStorage
        }
      }
    },
    deleteTask(state, action) {
      const { taskId, categoryId } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        category.tasks = category.tasks.filter((task) => task.id !== taskId);
        saveTasks(state.categories); // Save to localStorage
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addTask,
  updateTask,
  deleteTask,
} = taskSlice.actions;

export default taskSlice.reducer;
