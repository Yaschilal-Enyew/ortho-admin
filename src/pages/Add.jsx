import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  CloudUpload, 
  Type, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Sparkles 
} from "lucide-react";

export default function Add() {
  const [post, setPost] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000/api/news/add";

  const handleChange = (e) =>
    setPost({ ...post, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost({ ...post, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPost({ ...post, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.title || !post.description || !post.image) {
      toast.error("Please fill all fields and select an image!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      formData.append("image", post.image);

      const token = localStorage.getItem("token");
      const res = await axios.post(backendUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("News post created successfully!");
        setPost({ title: "", description: "", image: null });
        setPreview(null);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      toast.error(error.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-200">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Create <span className="text-amber-600 font-light italic text-2xl">News & Events</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Content Publishing Engine</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        
        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">
            <Type size={14} className="text-amber-600" /> Post Headline
          </label>
          <input
            name="title"
            placeholder="E.g. Annual Cathedral Celebration 2026"
            value={post.title}
            onChange={handleChange}
            className="w-full p-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:font-normal placeholder:text-slate-300"
          />
        </div>

        {/* DESCRIPTION TEXTAREA */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">
            <FileText size={14} className="text-amber-600" /> Full Narrative
          </label>
          <textarea
            name="description"
            placeholder="Describe the event or news in detail..."
            value={post.description}
            onChange={handleChange}
            className="w-full p-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-slate-300"
            rows="5"
          ></textarea>
        </div>

        {/* MEDIA UPLOADER */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">
            <ImageIcon size={14} className="text-amber-600" /> Featured Image
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-8 transition-all duration-300 ${
              preview 
                ? "border-amber-500 bg-amber-50/30" 
                : "border-slate-200 bg-slate-50 hover:border-amber-400 hover:bg-white"
            }`}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-2xl shadow-xl shadow-amber-900/20"
                />
                <button 
                  type="button"
                  onClick={() => setPreview(null)}
                  className="absolute -top-3 -right-3 bg-slate-900 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-slate-300 group-hover:text-amber-500 group-hover:scale-110 transition-all">
                  <CloudUpload size={32} />
                </div>
                <p className="text-slate-400 font-bold text-sm">
                  Drag & drop media here
                </p>
                <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">
                  Supported: JPG, PNG, WEBP
                </p>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            {!preview && (
              <label
                htmlFor="fileInput"
                className="mt-4 px-6 py-2 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm"
              >
                Browse Files
              </label>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
            loading 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300 active:scale-[0.98]"
          }`}
        >
          {loading ? (
            "Publishing..."
          ) : (
            <>
              Publish to Board <Plus size={18} />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}