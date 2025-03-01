"use client"

import { useState, useEffect } from "react"
import { useUser } from "../context/UserContext"
import { Edit2, Save, Package, Calendar, DollarSign, ShoppingBag, Loader, UserIcon, Phone, Mail } from "lucide-react"
import axios from "axios"

// Create a consistent base URL
const API_BASE_URL = "http://localhost:5000"

const ProfilePage = () => {
  const { user, updateUser } = useUser()
  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
  })
  const [editedUser, setEditedUser] = useState({ ...user })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({
    name: false,
    phone: false,
  })

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user })
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token || !user?.id) return

      const response = await axios.get(`${API_BASE_URL}/api/orders/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (field) => {
    // Only allow editing for name and phone
    if (field !== "email") {
      setEditMode({ ...editMode, [field]: true })
    }
  }

  const handleSave = async (field) => {
    try {
      setUpdating({ ...updating, [field]: true })
      // Use the updateUser function from UserContext
      const result = await updateUser({ [field]: editedUser[field] })

      if (result.success) {
        setEditMode({ ...editMode, [field]: false })
      }
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setUpdating({ ...updating, [field]: false })
    }
  }

  const handleChange = (e, field) => {
    setEditedUser({ ...editedUser, [field]: e.target.value })
  }

  const getFieldIcon = (field) => {
    switch (field) {
      case "name":
        return <UserIcon className="w-5 h-5 text-[#6b543d]" />
      case "phone":
        return <Phone className="w-5 h-5 text-[#6b543d]" />
      case "email":
        return <Mail className="w-5 h-5 text-[#6b543d]" />
      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF6F0] mt-[108px]">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <Loader className="w-10 h-10 text-[#C4A381] animate-spin mb-4" />
          <p className="text-[#2E2210] font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-[#FDF6F0] min-h-screen py-8 md:py-16 mt-[108px]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-[#2E2210] mb-8 flex items-center">
          <UserIcon className="w-8 h-8 mr-3 text-[#C4A381]" />
          Your Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Details Section */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-[#C4A381] transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-[#2E2210] border-b border-[#ebe1d2] pb-2 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-[#C4A381]" />
                Personal Details
              </h2>

              <div className="space-y-6">
                {["name", "phone", "email"].map((field) => (
                  <div key={field} className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-[#6b543d] capitalize flex items-center">
                      {getFieldIcon(field)}
                      <span className="ml-2">{field}</span>
                    </label>

                    <div className="flex items-center justify-between">
                      {editMode[field] ? (
                        <input
                          type={field === "email" ? "email" : "text"}
                          value={editedUser[field]}
                          onChange={(e) => handleChange(e, field)}
                          className="text-lg text-gray-700 border-b-2 border-[#C4A381] focus:outline-none focus:border-[#2E2210] w-full py-1 bg-[#FDF6F0] px-2 rounded-t-md transition-all duration-200"
                          autoFocus
                        />
                      ) : (
                        <span className="text-lg text-gray-700 py-1">{user[field]}</span>
                      )}

                      {field !== "email" && (
                        <button
                          onClick={() => (editMode[field] ? handleSave(field) : handleEdit(field))}
                          disabled={updating[field]}
                          className={`ml-2 px-3 py-1.5 rounded-md flex items-center transition-all duration-200 ${
                            editMode[field]
                              ? "bg-[#2E2210] text-white hover:bg-[#5c4421]"
                              : "text-[#2E2210] hover:bg-[#ebe1d2]"
                          } ${updating[field] ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {updating[field] ? (
                            <Loader className="w-4 h-4 mr-1 animate-spin" />
                          ) : editMode[field] ? (
                            <Save className="w-4 h-4 mr-1" />
                          ) : (
                            <Edit2 className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-sm">{editMode[field] ? "Save" : "Edit"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-[#C4A381] transition-all duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-[#2E2210] border-b border-[#ebe1d2] pb-2 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-[#C4A381]" />
                Order History
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-[#C4A381] animate-spin mr-3" />
                  <p className="text-[#6b543d]">Loading your orders...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-[#FDF6F0] p-5 rounded-lg shadow-sm border border-[#ebe1d2] hover:border-[#C4A381] transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                          <h3 className="text-lg font-semibold text-[#2E2210] flex items-center">
                            <Package className="w-5 h-5 mr-2 text-[#C4A381] " />
                            Order #{order._id.substring(order._id.length - 8)}
                          </h3>
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800`}
                          >
                            Placed
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <p className="text-gray-700 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-2 text-[#6b543d]" />
                              <span className="font-semibold">Products:</span>
                              <span className="ml-1 line-clamp-1">
                                {order.products.map((product) => product.name).join(", ").substring(0, 30)}
                              </span>
                            </p>
                            <p className="text-gray-700 flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-[#6b543d]" />
                              <span className="font-semibold">Date:</span>
                              <span className="ml-1">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-gray-700 flex items-center">
                              {/* <DollarSign className="w-4 h-4 mr-2 text-[#6b543d]" /> */}
                              <span className="font-medium">Total:</span>
                              <span className="ml-1 font-semibold text-[#2E2210]">₹{order.total.toFixed(2)}</span>
                            </p>
                            {/* <button className="text-[#2E2210] hover:text-[#C4A381] transition-colors text-sm font-medium underline">
                              View Details
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-[#FDF6F0] rounded-lg border border-dashed border-[#C4A381]">
                      <Package className="w-16 h-16 text-[#C4A381] mx-auto mb-4 opacity-70" />
                      <h3 className="text-xl font-medium text-[#2E2210] mb-2">No Orders Yet</h3>
                      <p className="text-[#6b543d] max-w-md mx-auto mb-4">
                        Your order history will appear here once you make a purchase.
                      </p>
                      <button
                        className="px-4 py-2 bg-[#2E2210] text-white rounded-md hover:bg-[#5c4421] transition-colors"
                        onClick={() => (window.location.href = "/")}
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage