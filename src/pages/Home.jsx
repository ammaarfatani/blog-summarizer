import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  FiCopy,
  FiDownload,
  FiShare2,
  FiEye,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "summaries"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setBlogs(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const cleanName = (email) =>
    email
      ?.split("@")[0]
      .replace(/[^a-zA-Z0]/g, " ")
      .toUpperCase();

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownload = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      await navigator.share({
        title: "Blog Summary",
        text,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Latest Blog Summaries
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col h-[420px]"
            >
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {blog.userEmail?.[0]?.toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {cleanName(blog.userEmail)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {blog.createdAt
                      ?.toDate()
                      .toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* TITLE */}
              {blog.title && (
                <h2 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
              )}

              {/* SUMMARY (SCROLLABLE) */}
              <div className="text-sm text-gray-700 mb-4 overflow-y-auto flex-1 pr-1">
                <pre className="whitespace-pre-wrap">
                  {blog.summary}
                </pre>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex gap-4 text-gray-600">
                  <button
                    onClick={() =>
                      handleCopy(blog.summary, blog.id)
                    }
                    title="Copy"
                  >
                    <FiCopy />
                  </button>

                  <button
                    onClick={() =>
                      handleShare(blog.summary)
                    }
                    title="Share"
                  >
                    <FiShare2 />
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(blog.summary)
                    }
                    title="Download"
                  >
                    <FiDownload />
                  </button>
                </div>

                <button
                  onClick={() =>
                    navigate(`/blog/${blog.id}`)
                  }
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <FiEye /> View
                </button>
              </div>

              {copiedId === blog.id && (
                <p className="text-xs text-green-600 mt-2">
                  Copied ✅
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
