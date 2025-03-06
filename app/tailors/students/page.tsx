"use client";
import Header, { StudentsList } from "@/app/comps/students/indexPage";
import AddStudent from "@/app/comps/toggles/addStudent";
import { useState } from "react";

const Students = () => {
 
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [setupStudentId, setSetupStudentId] = useState<number | null>(null);

  const toggleAddStudent = () => {
    setShowAddStudent(true);
  };

  const closeAddStudent = () => {
    setShowAddStudent(false);
  };

  const handleSetupStudentClick = (StudentId: number) => {
    setSetupStudentId(StudentId); // Set the ID for the setup form
  };

  const closeSetupStudent = () => {
    setSetupStudentId(null); // Close the setup Student form
  };

  return (
    <>
      <div>
        <Header/>
      </div>
      {showAddStudent && (
        <div className="block">
          <AddStudent onClose={closeAddStudent} />
        </div>
      )}
      <div className="bg-white h-[73vh] w-full rounded-lg bStudent">
        <StudentsList onSetupStudentClick={handleSetupStudentClick} />
      </div>
    </>
  );
}
export default Students
