import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  BookOpen, 
  Video, 
  Plus, 
  Trash2, 
  CheckCircle, 
  PlusCircle, 
  Layout, 
  ChevronRight,
  FileQuestion,
  X,
  UploadCloud
} from "lucide-react";

export default function CourseManagement({ token }) {
  const apiBase = "https://ortho-backend-8eqv.onrender.com/api"; 

  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [quizzes, setQuizzes] = useState({}); 
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeLessonForQuiz, setActiveLessonForQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    questions: [{ questionText: "", choices: [{ text: "", isCorrect: false }] }]
  });

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [submittingCourse, setSubmittingCourse] = useState(false);
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const [courseForm, setCourseForm] = useState({ title: "", description: "", image: null });
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", video: null });

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await axios.get(`${apiBase}/courses`);
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      setLoadingLessons(true);
      const res = await axios.get(`${apiBase}/lessons/${courseId}`);
      setLessons(res.data);
      res.data.forEach(lesson => fetchQuizForLesson(lesson._id));
    } catch (err) {
      toast.error("Failed to load lessons");
    } finally {
      setLoadingLessons(false);
    }
  };

  const fetchQuizForLesson = async (lessonId) => {
    try {
      const res = await axios.get(`${apiBase}/quizzes/${lessonId}`);
      setQuizzes(prev => ({ ...prev, [lessonId]: res.data }));
    } catch (err) {
      setQuizzes(prev => ({ ...prev, [lessonId]: null }));
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { questionText: "", choices: [{ text: "", isCorrect: false }] }]
    });
  };

  const handleAddChoice = (qIndex) => {
    const newQuestions = [...quizForm.questions];
    newQuestions[qIndex].choices.push({ text: "", isCorrect: false });
    setQuizForm({ ...quizForm, questions: newQuestions });
  };

  const handleQuizSubmit = async () => {
    try {
      const payload = { ...quizForm, lessonId: activeLessonForQuiz };
      const res = await axios.post(`${apiBase}/quizzes`, payload);
      setQuizzes(prev => ({ ...prev, [activeLessonForQuiz]: res.data.data }));
      setShowQuizModal(false);
      setQuizForm({ title: "", questions: [{ questionText: "", choices: [{ text: "", isCorrect: false }] }] });
      toast.success("Quiz created!");
    } catch (err) {
      toast.error("Failed to create quiz");
    }
  };

  const handleDeleteQuiz = async (quizId, lessonId) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await axios.delete(`${apiBase}/quizzes/${quizId}`);
      setQuizzes(prev => ({ ...prev, [lessonId]: null }));
      toast.success("Quiz removed");
    } catch (err) {
      toast.error("Failed to delete quiz");
    }
  };

  const handleAddCourse = async () => {
    try {
      setSubmittingCourse(true);
      const formData = new FormData();
      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      if (courseForm.image) formData.append("image", courseForm.image);
      const res = await axios.post(`${apiBase}/courses`, formData);
      setCourses(prev => [res.data.data, ...prev]);
      setCourseForm({ title: "", description: "", image: null });
      toast.success("Course added!");
    } catch (err) { toast.error("Error creating course"); } finally { setSubmittingCourse(false); }
  };

  const handleAddLesson = async () => {
    if (!lessonForm.title) return toast.warning("Lesson title is required");
    try {
      setSubmittingLesson(true);
      const formData = new FormData();
      formData.append("title", lessonForm.title);
      formData.append("description", lessonForm.description);
      formData.append("courseId", selectedCourse._id);
      if (lessonForm.video) formData.append("video", lessonForm.video);
      const res = await axios.post(`${apiBase}/lessons`, formData);
      setLessons(prev => [res.data.data, ...prev]);
      setLessonForm({ title: "", description: "", video: null });
      toast.success("Lesson added!");
    } catch (err) { toast.error("Error creating lesson"); } finally { setSubmittingLesson(false); }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 space-y-12 max-w-7xl mx-auto bg-[#FBFBFB] min-h-screen text-slate-800"
    >
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-200">
          <Layout className="text-white" size={28} />
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Course <span className="text-amber-600 font-light italic">Management</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: CREATION & COURSE LIST */}
        <div className="lg:col-span-5 space-y-10">
          
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle size={20} className="text-amber-600" />
              <h3 className="font-black uppercase tracking-widest text-sm text-slate-500">Create New Course</h3>
            </div>
            
            <input 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
              placeholder="Title of the course" 
              value={courseForm.title} 
              onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} 
            />
            
            <textarea 
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
              placeholder="Provide a detailed description..." 
              rows="4"
              value={courseForm.description} 
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})} 
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Course Artwork</label>
              <input 
                type="file" 
                onChange={(e) => setCourseForm({...courseForm, image: e.target.files[0]})} 
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all cursor-pointer" 
              />
            </div>

            <button 
              onClick={handleAddCourse} 
              disabled={submittingCourse}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {submittingCourse ? "Processing..." : <>Confirm & Add Course <Plus size={18} /></>}
            </button>
          </section>

          <section>
            <h3 className="font-black uppercase tracking-widest text-sm text-slate-400 mb-6 px-2">Existing Curriculums</h3>
            <div className="grid gap-4">
              {courses.map(course => (
                <motion.div 
                  key={course._id} 
                  whileHover={{ x: 10 }}
                  onClick={() => { setSelectedCourse(course); fetchLessons(course._id); }} 
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center group ${selectedCourse?._id === course._id ? "bg-amber-50 border-amber-500 shadow-lg shadow-amber-100" : "bg-white border-transparent hover:border-slate-200 shadow-sm"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedCourse?._id === course._id ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600"}`}>
                      <BookOpen size={20} />
                    </div>
                    <span className={`font-black text-lg ${selectedCourse?._id === course._id ? "text-amber-900" : "text-slate-700"}`}>{course.title}</span>
                  </div>
                  <ChevronRight size={18} className={selectedCourse?._id === course._id ? "text-amber-500" : "text-slate-300"} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: LESSONS & QUIZZES */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedCourse ? (
              <motion.section 
                key={selectedCourse._id}
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 space-y-10 sticky top-10"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Selected Module</span>
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedCourse.title}</h3>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-full text-[10px] font-mono text-slate-400 border border-slate-100">
                    UID: {selectedCourse._id.slice(-8)}
                  </div>
                </div>
                
                {/* LESSON ADD FORM - UPDATED WITH DESCRIPTION AND VIDEO */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200/60 space-y-6">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500" />
                     <h4 className="font-black uppercase tracking-widest text-xs text-slate-600">Quick Add Lesson</h4>
                   </div>
                   
                   <div className="space-y-4">
                      <input 
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-bold outline-none focus:ring-2 focus:ring-amber-500/20" 
                        placeholder="Lesson Title" 
                        value={lessonForm.title} 
                        onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} 
                      />

                      <textarea 
                        className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20" 
                        placeholder="Lesson Description (What will they learn?)" 
                        rows="2"
                        value={lessonForm.description} 
                        onChange={(e) => setLessonForm({...lessonForm, description: e.target.value})} 
                      />

                      <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Upload Video</label>
                           <div className="relative group">
                              <input 
                                type="file" 
                                accept="video/*"
                                onChange={(e) => setLessonForm({...lessonForm, video: e.target.files[0]})} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="w-full p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-3 group-hover:border-amber-400 transition-colors">
                                <UploadCloud size={20} className="text-slate-400 group-hover:text-amber-500" />
                                <span className="text-xs font-bold text-slate-500">
                                  {lessonForm.video ? lessonForm.video.name : "Select video file..."}
                                </span>
                              </div>
                           </div>
                        </div>

                        <button 
                          onClick={handleAddLesson} 
                          disabled={submittingLesson}
                          className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg disabled:opacity-50"
                        >
                          {submittingLesson ? "Uploading..." : "Push Lesson"}
                        </button>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {lessons.map((lesson, idx) => (
                    <div key={lesson._id} className="group p-6 border border-slate-100 rounded-[1.5rem] bg-white hover:bg-slate-50/50 transition-all flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-slate-100 group-hover:text-amber-200 transition-colors">0{idx + 1}</span>
                            <span className="font-black text-slate-800 uppercase tracking-wide">{lesson.title}</span>
                          </div>
                          {lesson.description && (
                            <p className="text-xs text-slate-400 mt-1 ml-11 line-clamp-1 italic">{lesson.description}</p>
                          )}
                        </div>
                        <Video size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        {quizzes[lesson._id] ? (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-[10px] rounded-full font-black uppercase tracking-widest border border-green-200">
                              <CheckCircle size={12} /> Quiz Live
                            </div>
                            <button 
                              onClick={() => handleDeleteQuiz(quizzes[lesson._id]._id, lesson._id)} 
                              className="text-[10px] text-red-400 font-black uppercase hover:text-red-600 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setActiveLessonForQuiz(lesson._id); setShowQuizModal(true); }} 
                            className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:bg-amber-600 hover:text-white border border-amber-600 px-5 py-2 rounded-xl transition-all flex items-center gap-2"
                          >
                            <Plus size={12} /> Create Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 border-4 border-dashed border-slate-100 rounded-[3rem]">
                <Layout size={60} strokeWidth={1} />
                <p className="mt-4 font-black uppercase tracking-[0.3em] text-xs">Select a curriculum to manage lessons</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showQuizModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              className="bg-white w-full max-w-2xl rounded-[3rem] p-10 max-h-[85vh] overflow-y-auto shadow-3xl shadow-slate-900/20 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Quiz <span className="text-amber-600">Builder</span></h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lesson Specific Assessment</p>
                </div>
                <button 
                  onClick={() => setShowQuizModal(false)} 
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quiz Header</label>
                  <input 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg text-slate-900 outline-none focus:border-amber-500/50" 
                    placeholder="Enter Assessment Title..." 
                    value={quizForm.title} 
                    onChange={(e) => setQuizForm({...quizForm, title: e.target.value})} 
                  />
                </div>
                
                {quizForm.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] space-y-6 relative group">
                    <div className="flex items-center gap-3">
                       <div className="bg-amber-100 text-amber-700 w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs">{qIdx + 1}</div>
                       <input 
                          className="flex-1 p-2 bg-transparent border-b-2 border-slate-100 focus:border-amber-500 outline-none font-bold text-slate-800" 
                          placeholder="What is the question?" 
                          value={q.questionText} 
                          onChange={(e) => {
                            const updated = [...quizForm.questions];
                            updated[qIdx].questionText = e.target.value;
                            setQuizForm({...quizForm, questions: updated});
                          }} 
                        />
                    </div>
                    
                    <div className="grid gap-3 pl-11">
                      {q.choices.map((c, cIdx) => (
                        <div key={cIdx} className="flex gap-4 items-center">
                          <input 
                            type="radio" 
                            name={`q-${qIdx}`}
                            className="w-5 h-5 accent-amber-600 cursor-pointer" 
                            checked={c.isCorrect} 
                            onChange={() => {
                              const updated = [...quizForm.questions];
                              updated[qIdx].choices.forEach((choice, i) => choice.isCorrect = i === cIdx);
                              setQuizForm({...quizForm, questions: updated});
                            }} 
                          />
                          <input 
                            className="flex-1 p-3 text-sm bg-slate-50 border border-slate-100 rounded-xl text-slate-700 outline-none focus:border-amber-500/30" 
                            placeholder={`Option ${cIdx + 1}`} 
                            value={c.text} 
                            onChange={(e) => {
                              const updated = [...quizForm.questions];
                              updated[qIdx].choices[cIdx].text = e.target.value;
                              setQuizForm({...quizForm, questions: updated});
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleAddChoice(qIdx)} className="ml-11 text-[10px] font-black uppercase text-amber-600 hover:text-amber-800">+ Add Choice</button>
                  </div>
                ))}
                
                <button 
                  onClick={handleAddQuestion} 
                  className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black text-xs uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/30 transition-all flex items-center justify-center gap-2"
                >
                  <FileQuestion size={16} /> New Question Plate
                </button>
                
                <button 
                  onClick={handleQuizSubmit} 
                  className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-amber-200 transform active:scale-[0.98] transition-all"
                >
                  Publish Assessment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
