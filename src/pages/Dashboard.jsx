import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "summaries"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      data.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );

      setSummaries(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this summary?")) return;
    await deleteDoc(doc(db, "summaries", id));
  };

  const filtered = summaries.filter((item) =>
    item.summary
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          My Blogs
        </h1>

        <button
          onClick={() => navigate("/summarizer")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          + New Blog
        </button>
      </div>

      <p className="mb-4 text-gray-600">
        Total Blogs:{" "}
        <b className="text-black">
          {summaries.length}
        </b>
      </p>

      <input
        type="text"
        placeholder="Search summaries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full md:w-1/3 p-2 border rounded"
      />

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center">
          No blogs found.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
  key={item.id}
  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition 
             border border-gray-100 flex flex-col h-[300px]"
>

  <div className="flex items-center justify-between px-5 pt-4">
    <p className="text-xs text-gray-400">
      {item.createdAt?.toDate().toLocaleDateString()}
    </p>

    <button
      onClick={() => handleDelete(item.id)}
      className="text-gray-400 hover:text-red-500 text-xs transition cursor-pointer"
    >
      Delete
    </button>
  </div>

  <div className="px-5 mt-2">
    <h2 className="font-semibold text-gray-800 text-sm line-clamp-1">
      {item.originalText || "Untitled Blog"}
    </h2>
  </div>

  <div className="px-5 mt-3 flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed">
    {item.summary}
  </div>

  <div className="px-5 py-3 border-t flex items-center justify-between text-xs">
    <span className="text-gray-400">
      {item.wordCount} words
    </span>

    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize text-[11px]">
      {item.mode}
    </span>
  </div>
</div>

        ))}
      </div>
    </div>
  );
}
