"use client";
import { useEffect, useState } from "react";
import { PasswordChangeModal } from "../../auth/change_password";

const PersonalDetails = () => {
   
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [userInitials, setUserInitials] = useState<string | null>(null);

  const getUserIdFromSession = (): string | null => {
    try {
        const session = JSON.parse(localStorage.getItem("adminSession") || "null");
        console.log("Session from localStorage:", session); // Debugging
        return session && session.id ? session.id : null;
    } catch (error) {
        console.error("Error parsing user session:", error);
        return null;
    }
};

const [userId, setUserId] = useState<string | null>(getUserIdFromSession());

  // Fetch default data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/auth/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          nationality: data.nationality || "",
        });

        const name = data.first_name +" "+data.last_name;
        const initials = name.split(" ").map((part: string) => part[0]).join('').toUpperCase();
        setUserInitials(initials);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const updatedFormData = {
            ...formData,
            userId, // Include userId in the submission payload
          };
      
          const response = await fetch("/api/auth/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
          });
      const result = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update profile. Please try again.");
      }

      alert(result.message); // Display success message
    } catch (error: any) {
        console.error(error);
        alert(error.message || "An unexpected error occurorange. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div className="p-4 w-full m:w-[70%] bg-white border-t border-slate-50">
      <h4 className="text-xl font-semibold">Personal informations</h4>
      <div className="py-8 w-full">
        <div className="flex flex-wrap items-center space-x-10">
            <div className="p-1 border-2 border-orange-400 w-20 h-20 rounded-full flex justify-center items-center text-3xl font-semibold text-white bg-orange-300">
              {userInitials}
            </div>
          <label
            htmlFor="updateProfilePicture"
            className="py-2 px-4 bg-orange-300 text-white rounded-lg cursor-not-allowed"
          >
            <i className="bi bi-trash mr-1"></i> Delete
          </label>
          <label
            htmlFor="updateProfilePicture"
            onClick={() => setChangePassword(true)}
            className="py-2 px-4 bg-emerald-300 text-white rounded-lg cursor-pointer"
          >
            <i className="bi bi-key mr-1"></i> Change Password
          </label>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="py-8 w-full">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full md:w-[48%]">
                  <label
                    htmlFor="firstName"
                    className="text-gray-700 font-semibold my-1 text-sm"
                  >
                    First legal name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Update first name"
                    className="py-3 px-4 border-slate-200 bg-transparent border rounded-lg text-slate-400 text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                  <label
                    htmlFor="lastName"
                    className="text-gray-700 font-semibold my-1 text-sm"
                  >
                    Last legal name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Update last name"
                    className="py-3 px-4 border-slate-200 bg-transparent border rounded-lg text-slate-400 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full md:w-[48%]">
                  <label
                    htmlFor="email"
                    className="text-gray-700 font-semibold my-1 text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Update email"
                    className="py-3 px-4 border-slate-200 bg-transparent border rounded-lg text-slate-400 text-sm outline-none"
                    disabled
                  />
                </div>
                <div className="flex flex-col w-full md:w-[48%]">
                  <label
                    htmlFor="phone"
                    className="text-gray-700 font-semibold my-1 text-sm"
                  >
                    Phone number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Update phone number"
                    className="py-3 px-4 border-slate-200 bg-transparent border rounded-lg text-slate-400 text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col w-full md:w-[48%]">
                  <label
                    htmlFor="nationality"
                    className="text-gray-700 font-semibold my-1 text-sm"
                  >
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    placeholder="Update nationality"
                    className="py-3 px-4 border-slate-200 bg-transparent border rounded-lg text-slate-400 text-sm outline-none"
                  />
                </div>
               </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-3 px-4 bg-orange-300 text-white w-full md:w-[15vw] rounded-lg ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : <><i className="bi bi-pencil mr-3"></i>Update Profile</>}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {changePassword && (<PasswordChangeModal onClose={() => setChangePassword(false)}/>)}
    </div>
  );
};

export default PersonalDetails;
