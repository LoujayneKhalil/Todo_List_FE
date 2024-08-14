import React from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function Header() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-2xl font-bold text-white white">Todo App</h1>
            </div>
          </div>
          <div className="flex items-center pr-2 sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="flex rounded-full bg-gray-800 text-sm dark:hover:bg-blue-700">
                  <span className="sr-only">Open user menu</span>
                  <div className="relative h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center dark:hover:bg-gray-300">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </MenuButton>
              </div>
              <MenuItems className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 origin-top rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/admin"
                      className={`block px-4 py-2 text-sm text-gray-700 font-bold text-center ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Admin Screen
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/user"
                      className={`block px-4 py-2 text-sm text-gray-700 font-bold text-center ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      User Screen
                    </Link>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
