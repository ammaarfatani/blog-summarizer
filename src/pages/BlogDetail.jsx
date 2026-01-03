import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiCopy, FiDownload } from "react-icons/fi";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const snap = await getDoc(doc(db, "summaries", id));
      if (snap.exists()) {
        setBlog(snap.data());
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    );
  }

  const cleanName = (email) =>
    email
      ?.split("@")[0]
      .replace(/[^a-zA-Z0-9]/g, " ")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 bg-white mt-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-2">
          {blog.title}
        </h1>

        <p className="text-sm text-gray-500 mb-4">
          By {cleanName(blog.userEmail)} ·{" "}
          {blog.createdAt
            ?.toDate()
            .toLocaleDateString()}
        </p>

        <div className="mb-6 text-gray-800 whitespace-pre-wrap">
          {blog.originalText}
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Summary
        </h2>

        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
          {blog.summary}
        </pre>

        <div className="flex gap-4 mt-4 text-gray-600">
          <FiCopy
            className="cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(blog.summary)
            }
          />
          <FiDownload
            className="cursor-pointer"
            onClick={() => {
              const blob = new Blob(
                [blog.summary],
                { type: "text/plain" }
              );
              const url =
                URL.createObjectURL(blob);
              const a =
                document.createElement("a");
              a.href = url;
              a.download = "summary.txt";
              a.click();
              URL.revokeObjectURL(url);
            }}
          />
        </div>
      </div>
    </div>
  );
}
