import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addCategory,
  deleteCategory,
  updateCategory,
  addTask,
  updateTask,
  deleteTask,
  setCategories,
} from "../features/tasks/taskSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AdminScreen = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.tasks);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  // State for adding a new task
  const [isAddingTask, setIsAddingTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  // State for editing a task
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskDescription, setEditedTaskDescription] = useState("");
  const [editedTaskOrder, setEditedTaskOrder] = useState(null);
  const [editedTaskCategoryId, setEditedTaskCategoryId] = useState();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    // Prevent body from scrolling
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable body scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategoryIndex = categories.findIndex(
      (cat) => cat.id.toString() === source.droppableId
    );
    const destinationCategoryIndex = categories.findIndex(
      (cat) => cat.id.toString() === destination.droppableId
    );

    // Clone the categories array to avoid direct state mutation
    const updatedCategories = [...categories];
    const sourceCategory = updatedCategories[sourceCategoryIndex];
    const destinationCategory = updatedCategories[destinationCategoryIndex];

    // Clone the tasks array for source and destination categories
    const sourceTasks = sourceCategory.tasks.map((task) => ({ ...task }));
    const destinationTasks =
      sourceCategory === destinationCategory
        ? sourceTasks
        : destinationCategory.tasks.map((task) => ({ ...task }));

    // Remove the task from the source
    const [movedTask] = sourceTasks.splice(source.index, 1);
    // Add the task to the destination
    destinationTasks.splice(destination.index, 0, movedTask);

    // Ensure unique task_order within each category
    const updateTaskOrders = (tasks) => {
      tasks.forEach((task, index) => {
        task.task_order = index + 1; // Ensure task_order is mutable
      });
    };

    updateTaskOrders(sourceTasks);
    updateTaskOrders(destinationTasks);

    if (sourceCategory !== destinationCategory) {
      // Update the categories array with the modified tasks arrays
      updatedCategories[sourceCategoryIndex] = {
        ...sourceCategory,
        tasks: sourceTasks,
      };
      updatedCategories[destinationCategoryIndex] = {
        ...destinationCategory,
        tasks: destinationTasks,
      };

      movedTask.category_id = destinationCategory.id;
    } else {
      // Update the categories array with the modified tasks array for the source category
      updatedCategories[sourceCategoryIndex] = {
        ...sourceCategory,
        tasks: destinationTasks,
      };
    }

    // Update the local state with the new categories
    dispatch(setCategories(updatedCategories));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      dispatch(addCategory(newCategoryName));
      setNewCategoryName("");
      setIsAddingCategory(false); // Hide the input field after adding the category
    }
  };

  const handleEditCategory = (categoryId, name) => {
    setEditingCategoryId(categoryId);
    setEditedCategoryName(name);
  };

  const handleSaveCategory = (categoryId) => {
    if (editedCategoryName.trim()) {
      dispatch(updateCategory({ categoryId, name: editedCategoryName }));
      setEditingCategoryId(null);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  const handleAddTask = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) {
      console.error("Category not found");
      return;
    }

    const maxTaskOrder = Math.max(
      0,
      ...category.tasks.map((task) => task.task_order)
    );

    dispatch(
      addTask({
        categoryId, // Ensure categoryId is passed
        title: newTaskTitle,
        description: newTaskDescription,
        taskOrder: maxTaskOrder + 1, // Ensure taskOrder is passed
      })
    );

    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAddingTask(null); // Reset adding task state
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description);
    setEditedTaskOrder(task.task_order);
    setEditedTaskCategoryId(task.category_id);
  };

  const handleSaveTask = (taskId) => {
    dispatch(
      updateTask({
        taskId,
        title: editedTaskTitle,
        description: editedTaskDescription,
        taskOrder: editedTaskOrder,
        categoryId: editedTaskCategoryId,
      })
    );
    setEditingTaskId(null); // Reset editing task state
  };

  const handleDeleteTask = (taskId) => {
    const task = categories
      .flatMap((cat) => cat.tasks)
      .find((task) => task.id === taskId);
    dispatch(deleteTask({ taskId, categoryId: task.category_id }));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto max-w-7xl p-10">
      <div className="flex flex-row justify-between items-center my-3">
        <h1 className="text-2xl font-bold mb-4">Admin Screen</h1>
        <div className="flex items-center">
          {isAddingCategory ? (
            <div className="flex items-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name"
                className="text-sm px-4 py-2 border border-gray-300 rounded-md mr-2"
              />
              <button
                onClick={handleAddCategory}
                className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add
              </button>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="text-white bg-blue-700 hover:bg-blue-800s font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 flex justify-between items-center"
              onClick={() => setIsAddingCategory(true)}
            >
              <span className="me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              Add New Category
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-7xl h-[75vh] p-8 bg-gray-100 rounded-lg overflow-y-auto custom-scrollbar">
          <div className="flex flex-col space-y-8">
            <DragDropContext onDragEnd={onDragEnd}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white shadow-md rounded-lg"
                >
                  <div className="flex justify-between items-center p-6">
                    {editingCategoryId === category.id ? (
                      <>
                        <input
                          type="text"
                          value={editedCategoryName}
                          onChange={(e) =>
                            setEditedCategoryName(e.target.value)
                          }
                          className="text-xl font-semibold border-b-2 border-gray-300 focus:outline-none"
                        />

                        <div className="flex">
                          <button
                            onClick={() => handleSaveCategory(category.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-700 hover:text-red-800 font-medium text-sm px-5 py-2.5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 text-red-500 hover:text-red-900 deleteBtn"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold">
                          {category.name}
                        </h2>
                        <div className="flex justify-between items-center">
                          <button
                            className="flex justify-between items-center py-1 px-3 me-1 text-sm text-gray-900 rounded-md border border-gray-100 hover:bg-gray-100 dark:bg-white dark:text-gray-500 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-500 font-medium"
                            onClick={() => setIsAddingTask(category.id)}
                          >
                            <span className="me-1 ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 me-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </span>
                            Add New Task
                          </button>
                          <button
                            onClick={() =>
                              handleEditCategory(category.id, category.name)
                            }
                            className="flex justify-between items-center p-2 my-1 text-sm text-gray-900  bg-gray-100 rounded-md hover:bg-gray-100 dark:bg-white dark:text-gray-700 dark:hover:text-white dark:hover:bg-gray-400 font-medium categoryEditBtn"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <span
                            className={`transform transition-transform ${
                              expandedCategories[category.id]
                                ? "scale-y-[-1]"
                                : "scale-y-100"
                            }`}
                            onClick={() => toggleCategory(category.id)}
                          >
                            <svg
                              className="w-2.5 h-2.5 ms-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 10 6"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                              />
                            </svg>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  {expandedCategories[category.id] && (
                    <>
                      {isAddingTask === category.id && (
                        <div className="p-6 bg-gray-50 flex flex-col space-y-4">
                          <input
                            type="text"
                            placeholder="Task Title"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <textarea
                            placeholder="Task Description"
                            value={newTaskDescription}
                            onChange={(e) =>
                              setNewTaskDescription(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleAddTask(category.id)}
                              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setIsAddingTask(null)}
                              className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      <Droppable droppableId={category.id.toString()}>
                        {(provided) => {
                          // console.log("Draggable provided:", provided);
                          return (
                            <div
                              className="space-y-2 p-6 pt-0"
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {category.tasks.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id.toString()}
                                  index={index}
                                >
                                  {(provided) => {
                                    // console.log("Draggable provided 2:", provided);
                                    return (
                                      <div
                                        className={`p-4 bg-gray-100 rounded-md flex items-center justify-between transition-all duration-300 ${
                                          editingTaskId === task.id
                                            ? "h-auto"
                                            : "h-24"
                                        }`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                      >
                                        <div className="flex items-center justify-between w-full">
                                          <div
                                            className="cursor-move"
                                            {...provided.dragHandleProps}
                                          >
                                            <svg
                                              className="w-8 h-8 text-gray-500"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 20 20"
                                              stroke="currentColor"
                                              aria-hidden="true"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M4 4h.01M8 4h.01M4 8h.01M8 8h.01M4 12h.01M8 12h.01"
                                              />
                                            </svg>
                                          </div>
                                          <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                          />
                                          <div
                                            className={`ml-3 w-full ${
                                              editingTaskId === task.id
                                                ? "min-h-[200px] overflow-auto"
                                                : ""
                                            }`}
                                          >
                                            {editingTaskId === task.id ? (
                                              <>
                                                <div className="flex flex-col w-full">
                                                  <input
                                                    className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                                                    type="text"
                                                    value={editedTaskTitle}
                                                    onChange={(e) =>
                                                      setEditedTaskTitle(
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  <textarea
                                                    value={
                                                      editedTaskDescription
                                                    }
                                                    onChange={(e) =>
                                                      setEditedTaskDescription(
                                                        e.target.value
                                                      )
                                                    }
                                                    className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                                                    rows={6} // Increased rows to give more space for editing
                                                  />
                                                </div>
                                                <div className="flex justify-end mt-2">
                                                  <button
                                                    onClick={() =>
                                                      handleSaveTask(task.id)
                                                    }
                                                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                                                  >
                                                    Save
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      setEditingTaskId(null)
                                                    }
                                                    className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                                <h3 className="text-lg font-medium">
                                                  {task.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                  {task.description}
                                                </p>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          {!editingTaskId && (
                                            <button
                                              className="flex justify-between items-center p-2 my-1 text-sm text-gray-900 bg-gray-100 rounded-md hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-700 dark:hover:text-white dark:hover:bg-gray-400 font-medium taskEditBtn"
                                              onClick={() =>
                                                handleEditTask(task)
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                />
                                              </svg>
                                            </button>
                                          )}
                                          <button
                                            className="p-2.5 my-1 text-sm font-medium text-white"
                                            onClick={() =>
                                              handleDeleteTask(task.id)
                                            }
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth="1.5"
                                              stroke="currentColor"
                                              className="w-6 h-6 text-red-500 hover:text-red-900"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </>
                  )}
                </div>
              ))}
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
