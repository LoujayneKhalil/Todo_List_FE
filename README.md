# Task Management App

A simple task management application built with React and Redux, allowing users to manage tasks within different categories. This project is designed to work entirely on the frontend, using local storage to persist data.

## Features

- **Drag and Drop**: Easily reorder tasks within categories or move tasks between categories using drag and drop functionality.
- **CRUD Operations**: Create, Read, Update, and Delete tasks and categories.
- **Local Storage**: All data is saved in the browser's local storage, so changes persist even after refreshing the page.


## Getting Started

### Prerequisites

- Node.js and npm should be installed on your machine.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/LoujayneKhalil/Todo_List_FE.git
   cd todo-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Application**:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Project Structure

```
src/
|__ components/
|    |___ AdminScreen.js     # Main screen for task management
|    |___ UserScreen.js     # Main screen for task management
|__ features/
|    |___ tasks/
|          |___ taskSlice.js  # Redux slice handling task state
|__ App.js                    # Main App component
|__ index.js                  # Entry point for the React app
|__ store.js                  # redux store
public/
|__ index.html                # Main HTML file
|__ data/
|    |___ tasks.json          # JSON file with task data
```

### Local Storage

- **Data Persistence**: The app uses local storage to save the state of tasks and categories. When the app is loaded, it first checks if there is any saved data in local storage. If not, it loads the data from `tasks.json`.
- **Initial Data**: The initial tasks and categories are loaded from `public/data/tasks.json`. This file is not modified by the application during runtime, so any changes made in the app are stored in local storage.

### Customization

You can customize the initial data by editing the `public/data/tasks.json` file. This allows you to set up your own tasks and categories that will be loaded when the app is first launched.

### Limitations

- **No Backend**: This project is frontend-only and does not include a backend server. All data is stored in the browser's local storage.
- **Persistence**: Data is persistent within the same browser and on the same device. Clearing the browser's cache or local storage will result in loss of data.
