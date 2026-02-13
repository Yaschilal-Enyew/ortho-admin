import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
    phone: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://ortho-backend-8eqv.onrender.com/api/student"; // adjust if needed

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // admin token
        const res = await axios.get(`${backendUrl}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStudents(res.data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Start editing
  const handleEdit = (student) => {
    setEditId(student._id);
    setEditForm({ ...student });
  };

  // Save edited student
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/update/${editId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setStudents((prev) =>
          prev.map((s) => (s._id === editId ? res.data.updatedUser : s))
        );
        toast.success("Student updated successfully");
        setEditId(null);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${backendUrl}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        toast.success("Student deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  };

  // Filter students by name or phone
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-md border border-yellow-400 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-x-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-700 border-b sm:border-none pb-2 sm:pb-0 border-yellow-400 text-center sm:text-left">
          Registered Students
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="🔍 Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-yellow-500 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder-gray-400 bg-white shadow-sm"
          />
          {loading && (
            <span className="text-yellow-700 font-semibold ml-4 animate-pulse">
              Loading...
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-yellow-500 text-black uppercase text-xs sm:text-sm tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s, index) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${index % 2 === 0 ? "bg-yellow-50" : "bg-white"} hover:bg-yellow-100 transition`}
                >
                  {editId === s._id ? (
                    <>
                      {["name", "email", "department", "year", "phone"].map(
                        (field) => (
                          <td key={field} className="py-2 sm:py-3 px-3 sm:px-4">
                            <input
                              className="border border-yellow-500 bg-white rounded px-2 py-1 w-full text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                              value={editForm[field]}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  [field]: e.target.value,
                                })
                              }
                            />
                          </td>
                        )
                      )}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-3 space-y-2 sm:space-y-0">
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 font-medium text-gray-800">
                        {s.name}
                      </td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600">{s.email}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600">{s.department}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600">{s.year}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-gray-600">{s.phone}</td>
                      <td className="py-2 sm:py-3 px-3 sm:px-4 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(s)}
                          className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition shadow"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 italic py-6">
                  ❌ No matching student found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-500 text-xs sm:text-sm mt-4 italic">
        Manage students.
      </p>
    </motion.div>
  );
}
