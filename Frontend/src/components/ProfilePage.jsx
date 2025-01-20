import React from "react";
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Personal Details Section */}
          <div className="col-span-1">
            <div className="bg-[#ebe1d2] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-[#2E2210]">Personal Details</h2>
              <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
                {/* Display user's name, phone, email dynamically */}
                <div className="flex items-center space-x-3">
                  <span className="text-lg text-[#2E2210] w-1/4 font-semibold">Name:</span>
                  <div className="flex items-center w-3/4 justify-between">
                    <span className="text-lg text-gray-700">{user.name}</span>
                    <button
                      className="text-sm text-[#6b543d] hover:text-[#2E2210]"
                      disabled // Disabled the button temporarily
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-[#2E2210] w-1/4">Phone:</span>
                  <div className="flex items-center w-3/4 justify-between">
                    <span className="text-lg text-gray-700">{user.phone}</span>
                    <button
                      className="text-sm text-[#6b543d] hover:text-[#2E2210]"
                      disabled // Disabled the button temporarily
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-[#2E2210] w-1/4">Email:</span>
                  <div className="flex items-center w-3/4 justify-between">
                    <span className="text-lg text-gray-700">{user.email}</span>
                    <button
                      className="text-sm text-[#6b543d] hover:text-[#2E2210]"
                      disabled // Disabled the button temporarily
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="col-span-2">
            <div className="bg-[#ebe1d2] p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-[#2E2210]">Order History</h2>
              <div className="space-y-4">
                {/* Repeat this structure for each order */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-[#2E2210]">Order #1</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">Product: Polaroid Prints</p>
                    <p className="text-gray-700">Date: January 5, 2025</p>
                    <p className="text-gray-700">Status: Delivered</p>
                    <p className="text-gray-700">Total: $25.00</p>
                  </div>
                </div>
                {/* Add more orders here */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-[#2E2210]">Order #2</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">Product: Postcards</p>
                    <p className="text-gray-700">Date: January 10, 2025</p>
                    <p className="text-gray-700">Status: Shipped</p>
                    <p className="text-gray-700">Total: $30.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
