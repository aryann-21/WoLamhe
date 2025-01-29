import React, { useState } from "react"
import { useUser } from "../context/UserContext"
import { Edit2, Save, Package } from "lucide-react"

const ProfilePage = () => {
  const { user, updateUser } = useUser()
  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
    email: false,
  })
  const [editedUser, setEditedUser] = useState({ ...user })

  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true })
  }

  const handleSave = (field) => {
    updateUser({ ...user, [field]: editedUser[field] })
    setEditMode({ ...editMode, [field]: false })
  }

  const handleChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value })
  }

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-8 md:py-16 mt-[108px]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#2E2210] mb-8">Your Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Details Section */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-[#C4A381]">
              <h2 className="text-2xl font-semibold mb-6 text-[#2E2210] border-b pb-2">Personal Details</h2>
              <div className="space-y-6">
                {["name", "phone", "email"].map((field) => (
                  <div key={field} className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-[#6b543d] capitalize">{field}</label>
                    <div className="flex items-center justify-between">
                      {editMode[field] ? (
                        <input
                          type="text"
                          value={editedUser[field]}
                          onChange={(e) => handleChange(e, field)}
                          className="text-lg text-gray-700 border-b border-[#C4A381] focus:outline-none focus:border-[#2E2210] w-full py-1"
                        />
                      ) : (
                        <span className="text-lg text-gray-700">{user[field]}</span>
                      )}
                      <button
                        onClick={() => (editMode[field] ? handleSave(field) : handleEdit(field))}
                        className="text-sm text-[#C4A381] hover:text-[#2E2210] flex items-center"
                      >
                        {editMode[field] ? <Save className="w-4 h-4 mr-1" /> : <Edit2 className="w-4 h-4 mr-1" />}
                        {editMode[field] ? "Save" : "Edit"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-[#C4A381]">
              <h2 className="text-2xl font-semibold mb-6 text-[#2E2210] border-b pb-2">Order History</h2>
              <div className="space-y-6">
                {user.orderHistory && user.orderHistory.length > 0 ? (
                  user.orderHistory.map((order, index) => (
                    <div key={index} className="bg-[#FDF6F0] p-4 rounded-lg shadow-sm border border-[#C4A381]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-[#2E2210]">Order #{order.id}</h3>
                        <span className="text-sm font-medium text-[#6b543d] bg-[#ebe1d2] px-2 py-1 rounded">
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Products:</span> {order.products.join(", ")}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Date:</span> {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Total:</span> ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-[#C4A381] mx-auto mb-4" />
                    <p className="text-gray-500">No order history available.</p>
                    <p className="text-gray-500">Your orders will appear here once you make a purchase.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage

