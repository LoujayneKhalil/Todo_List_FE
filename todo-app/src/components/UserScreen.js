// src/components/UserScreen.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/tasks/taskSlice";

function UserScreen() {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector((state) => state.tasks);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Prevent body from scrolling
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable body scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
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
        <h1 className="text-2xl font-bold mb-4">User Screen</h1>
      </div>
      <div className="flex justify-center min-h-screen">
        <div className="w-full max-w-xl h-[75vh] p-8 bg-gray-100 rounded-lg overflow-y-auto custom-scrollbar">
          <div className="flex flex-col space-y-8">
            {categories.map((category) => (
              <div key={category.id} className="bg-white shadow-md rounded-lg">
                <div
                  className="flex justify-between items-center p-6 cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <span
                    className={`transform transition-transform ${
                      expandedCategories[category.id]
                        ? "scale-y-[-1]"
                        : "scale-y-100"
                    }`}
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
                {expandedCategories[category.id] && (
                  <div className="space-y-2 p-6 pt-0">
                    {category.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center p-4 bg-gray-100 rounded-md h-24"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <div className="ml-3 overflow-hidden">
                          <h3 className="text-lg font-medium">{task.title}</h3>
                          <p className="text-gray-600">{task.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserScreen;
