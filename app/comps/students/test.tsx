"use client";
import React, { useState, useEffect } from "react";
import AddStudent from "../toggles/addStudent";
import MessageBox from "@/app/pages/Message";

interface Student {
    id: number;
    phone: string;
    email: string;
    status: string;
    created_at: string;
    first_name: string;
    second_name: string;
    district: string; 
    sector: string;
    cell: string;
    village: string;
    gender: string;
    dob: string;
    fees_status: string;
    martial_status: string;
    programs: string;
  }


  interface HeaderProps {
    onAddStudentClick: () => void;
    onSetupStudentClick: (StudentId: number) => void; // Prop for setup Student
  }
  function formatDateWithYears(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const today = new Date();

    // Format the date components
    const options: Intl.DateTimeFormatOptions = { 
        month: "short", 
        day: "numeric", 
        year: "numeric", 
        hour: "numeric", 
        minute: "numeric", 
        hour12: true 
    };
    const formattedDate = date.toLocaleString("en-US", options);

    // Calculate the difference in seconds
    const diffTimeInSeconds = Math.abs(date.getTime() - today.getTime()) / 1000;
    // Append the years difference
    return `${formattedDate}`;
}

function getTimeDifference(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const now = new Date();

    // Difference in seconds
    const diffInSeconds = Math.abs((now.getTime() - date.getTime()) / 1000);

    // Determine the time unit
    if (diffInSeconds < 60) {
        return `${Math.floor(diffInSeconds)} seconds ago`;
    } else if (diffInSeconds < 3600) { // Less than an hour
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) { // Less than a day
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) { // Less than a year
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 315360000) { // Less than a decade
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? "s" : ""} ago`;
    } else { // Decades
        const decades = Math.floor(diffInSeconds / 315360000);
        return `${decades} decade${decades > 1 ? "s" : ""} ago`;
    }
}

  const Header = ({ onAddStudentClick, onSetupStudentClick }: HeaderProps) => {
    return (
        <>
        <div className="flex justify-between py-2 items-center flex-wrap">
            <form method="get" className="flex bg-slate-100 py-1 px-2 justify-around mb-2">
                <button name="filter" value="all" className="text-sm py-1 rounded-md px-4 hover:bg-white mx-[1px] text-slate-600 bg-white">All</button>
                <button name="filter" value="unverified" className="text-sm py-1 rounded-md px-4 hover:bg-white mx-[1px] text-slate-600">Unverified</button>
                <button name="filter" value="inactive" className="text-sm py-1 rounded-md px-4 hover:bg-white mx-[1px] text-slate-600">Inactive</button>
                <button name="filter" value="active" className="text-sm py-1 rounded-md px-4 hover:bg-white mx-[1px] text-slate-600">Active</button>
            </form>
            <div className="flex justify-around items-center">
                <div className="flex py-1 px-4 text-sm text-slate-500 bStudent rounded-md bg-white">
                    <i className="bi bi-search text-base mr-1"></i>
                    <input type="search" placeholder="Search Students ..." className="outline-none" />
                </div>
                <div className="flex items-center py-1 mx-2 px-4 text-sm text-slate-500 bStudent rounded-md bg-white">
                    <i className="bi bi-filter text-base mr-1"></i>
                    <select className="outline-none">
                        <option value="">Sort by</option>
                        <option value="top-sales">Top sales</option>
                    </select>
                </div>
                <button className="text-sm py-[6px] rounded-md px-4 bg-slate-800 text-slate-50 mr-2">
                    <i className="bi bi-box-arrow-up mr-[2px]"></i>
                    <span>Export</span>
                </button>
                <button
                    onClick={onAddStudentClick}
                    className="bg-blue-500 rounded-md py-[6px] px-4 text-white text-sm"
                >
                    <i className="bi bi-plus-circle mr-1"></i>
                    <span>Add Student</span>
                </button>
               
            </div>
        </div>
        </>
    );
};
const StudentsList = ({ onSetupStudentClick }: { onSetupStudentClick: (StudentId: number) => void }) => {
  const [Students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);


  useEffect(() => {
    // Fetch the Students
    fetch("/api/students")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch Students");
            }
            return response.json();
        })
        .then((data) => {
            setStudents(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
}, []);



  const toggleDropdown = (StudentId: number) => {
      setDropdownOpen(dropdownOpen === StudentId ? null : StudentId);
  };

  const handleArchive = async (StudentId: number) => {
      const response = await fetch(`/api/students/deleteItem/cancel/${StudentId}`, {
          method: 'GET',
      });

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); // Try to parse JSON
        } catch (err) {
            // If parsing fails, handle it here
            setError("Failed to cancel Student: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to cancel Student");
        return;
    }

      // Update the Students list to remove the archived Student or update its status
      setStudents((prevStudents) => 
          prevStudents.map(Student => 
              Student.id === StudentId ? { ...Student, status: 'Canceled' } : Student
          )
      );
  };
  const handleApprove = async (StudentId: number) => {
    const response = await fetch(`/api/students/approveItem/${StudentId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to approve Student: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to approve Student");
        return;
    }

    // Update the Students list to set the approved status
    setStudents((prevStudents) => 
        prevStudents.map(Student => 
            Student.id === StudentId ? { ...Student, status: 'Approved' } : Student
        )
    );
};

const handleDelete = async (StudentId: number) => {
    const response = await fetch(`/api/students/deleteItem/${StudentId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to delete Student: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to delete Student");
        return;
    }

    // Update the Students list to remove the deleted Student
    setStudents((prevStudents) => 
        prevStudents.filter(Student => Student.id !== StudentId)
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading Students...</div>;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6"> {error}</div>;
  }
  if(Students.length <= 0){
    return <div className="flex w-full h-full items-center justify-center italic">No Students yet!</div>
  }
  return (
      <>
          <h4 className="text-lg font-semibold text-slate-700 bStudent-b p-4">Students ({Students.length})</h4>
          <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white">
                  <thead className="bStudent-b px-4">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-3 px-6 text-left">Name</th>
                          <th className="py-3 px-6 text-left">Phone</th>
                          <th className="py-3 px-6 text-left">Email</th>
                          <th className="py-3 px-6 text-left">Address</th>
                          <th className="py-3 px-6 text-left">Martial_Status</th>
                          <th className="py-3 px-6 text-left">Gender</th>
                          <th className="py-3 px-6 text-left">DateOfBirth</th>
                          <th className="py-3 px-6 text-left">Account_status</th>
                          <th className="py-3 px-6 text-left">Programs</th>
                          <th className="py-3 px-6 text-left">CreatedAt</th>
                          <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {Students.map((Student) => (
                          <tr
                              key={Student.id}
                              className="bStudent-b bStudent-gray-200 hover:bg-gray-50 text-center capitalize"
                          >
                            
                              <td className="py-2 px-6 capitalize text-nowrap">
                                 <span className="">{Student.first_name +" "+Student.second_name}</span>
                              </td>
                              <td className="py-2 px-6 text-nowrap ">{Student.phone}</td>
                              <td className="py-2 px-6 lowercase">{Student.email}</td>
                              <td className="py-2 px-6 capitalize text-nowrap">{Student.district+", "+Student.sector}</td>
                              <td className="py-2 px-6">{Student.martial_status}</td>
                              <td className="py-2 px-6">{Student.gender}</td>
                              <td className="py-2 px-6">{Student.dob}</td>
                              <td className="py-2 px-6">
                                <span
                                      className={`py-1 px-3 rounded text-xs text-nowrap  ${
                                          (Student.status != "Inactive" && Student.status != "Unverified")
                                              ? "bg-green-100 text-green-600"
                                              : "bg-orange-100 text-orange-500"
                                      }`}
                                  >
                                      {Student.status || "Unverified"}
                                </span>
                              </td>
                              <td className="py-2 px-6">{Student.programs}</td>
                              <td className="py-2 px-6 text-nowrap">{getTimeDifference(Student.created_at)}</td>
                              <td className="py-2 px-6 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(Student.id)}
                                  ></i>
                                  {dropdownOpen === Student.id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white bStudent rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              <li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    handleApprove(Student.id); // Approve the Student
                                                    toggleDropdown(Student.id); // Close the dropdown
                                                }}
                                              >
                                                  <i className="bi bi-eye mr-2 text-green-500 hover:bg-slate-100"></i> View
                                              </li>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onSetupStudentClick(Student.id); // Trigger the setup Student click
                                                      toggleDropdown(Student.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-slash-circle mr-2 text-red-500 hover:bg-slate-100"></i> Block
                                              </li>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleArchive(Student.id); // Archive the Student
                                                      toggleDropdown(Student.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-archive-fill mr-2 text-orange-500 hover:bg-slate-100"></i> Delete
                                              </li>
                                             
                                          </ul>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <div className="flex justify-between items-center">
                  <button className="bStudent rounded-2xl py-1 px-4 mx-4 my-1">
                      <i className="bi bi-arrow-left"></i> <span>Previous</span>
                  </button>
                  <div>
                      <span className="p-1 font-semibold">1</span>
                      <span className="p-1 font-semibold">2</span>
                      <span className="p-1 font-semibold">3</span>
                      <span className="p-1 font-semibold">4</span>
                      <span className="p-1 font-semibold">... </span>
                  </div>
                  <button className="bStudent rounded-2xl py-1 px-4 mx-4 my-1">
                      <i className="bi bi-arrow-right"></i> <span>Next</span>
                  </button>
              </div>
          </div>
      </>
  );
};

export default Header;
export {StudentsList};
