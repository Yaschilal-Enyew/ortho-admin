import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

export default function List() {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "https://ortho-backend-8eqv.onrender.com/api/news"; // adjust to your backend

  // Fetch all posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${backendUrl}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token"); // fixed here
      await axios.delete(`${backendUrl}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Start editing
  const handleEdit = (id) => {
    const post = posts.find((p) => p._id === id);
    setEditPost({ ...post, imageFile: null });
  };

  // Save edited post
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", editPost.title);
      formData.append("description", editPost.description);
      if (editPost.imageFile) formData.append("image", editPost.imageFile);

      const res = await axios.put(
        `${backendUrl}/update/${editPost._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post updated successfully");
      setPosts(
        posts.map((p) => (p._id === editPost._id ? res.data.post : p))
      );
      setEditPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  const handleCancel = () => setEditPost(null);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-md border border-yellow-400 rounded-2xl shadow-2xl p-6 overflow-x-auto"
    >
      <h2 className="text-3xl font-extrabold text-yellow-700 mb-4 border-b pb-2 border-yellow-400">
        All Posts
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-yellow-500 rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 placeholder-gray-400 bg-white shadow-sm"
        />
        {loading && (
          <span className="text-yellow-700 font-semibold ml-4 animate-pulse">
            Loading...
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] text-left border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-yellow-500 text-black uppercase text-sm tracking-wider">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((p, index) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${
                      index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                    } hover:bg-yellow-100 transition`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {editPost?._id === p._id ? (
                        <input
                          type="text"
                          value={editPost.title}
                          onChange={(e) =>
                            setEditPost({ ...editPost, title: e.target.value })
                          }
                          className="border border-yellow-400 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        p.title
                      )}
                    </td>

                    <td className="py-3 px-4 text-gray-600">
                      {editPost?._id === p._id ? (
                        <textarea
                          value={editPost.description}
                          onChange={(e) =>
                            setEditPost({
                              ...editPost,
                              description: e.target.value,
                            })
                          }
                          className="border border-yellow-400 rounded px-2 py-1 w-full"
                          rows="2"
                        />
                      ) : (
                        p.description
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {editPost?._id === p._id ? (
                        <div className="border border-yellow-400 rounded px-2 py-1 w-full text-gray-400">
                          <label className="cursor-pointer flex items-center justify-between">
                            {editPost.imageFile ? (
                              <span className="text-gray-800 truncate">
                                {editPost.imageFile.name}
                              </span>
                            ) : (
                              "Select new image..."
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setEditPost({
                                  ...editPost,
                                  imageFile: e.target.files[0],
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-20 h-20 object-cover rounded-lg border border-yellow-300 shadow-sm"
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/100x100?text=No+Image")
                          }
                        />
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      {editPost?._id === p._id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={handleSave}
                            className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 rounded-md bg-gray-400 hover:bg-gray-500 text-white font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(p._id)}
                            className="px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 italic py-6"
                  >
                    ❌ No posts found.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
