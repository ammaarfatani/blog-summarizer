import { useState } from "react";
import { summarizeText } from "../utils/summarizer";
import { saveSummary } from "../services/saveSummary";
import { FiCopy, FiDownload } from "react-icons/fi";
import { auth } from "../firebase";

export default function Summarizer() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mode, setMode] = useState("short");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = auth.currentUser;

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const handleSummarize = async () => {
    if (!text.trim() || !title.trim()) return;

    setLoading(true);
    setSummary("");

    setTimeout(async () => {
      const result = summarizeText(text, mode);
      setSummary(result);

      await saveSummary(title, text, result, mode);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Create Blog Summary
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.email[0].toUpperCase()}
            </div>
            <p className="text-sm text-gray-600">
              {user?.email}
            </p>
          </div>

          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded mb-3"
          />

          <textarea
            rows="9"
            className="w-full border p-3 rounded resize-none"
            placeholder="Write your blog content..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Words: {wordCount}</span>
          </div>

          <div className="mt-4">
            <label className="font-medium mr-3">
              Summary Style:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="bullets">Bullet Points</option>
            </select>
          </div>

          <button
            onClick={handleSummarize}
            disabled={loading}
            className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            {loading ? "Summarizing..." : "Publish Blog"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow relative">
          <h2 className="text-xl font-semibold mb-3">
            Generated Summary
          </h2>

          {summary && (
            <div className="absolute top-4 right-4 flex gap-3">
              <FiCopy
                onClick={handleCopy}
                className="cursor-pointer text-gray-600 hover:text-black"
              />
              <FiDownload
                onClick={handleDownload}
                className="cursor-pointer text-gray-600 hover:text-black"
              />
            </div>
          )}

          {loading ? (
            <p className="text-gray-400 animate-pulse">
              Generating summary...
            </p>
          ) : summary ? (
            <pre className="whitespace-pre-wrap">
              {summary}
            </pre>
          ) : (
            <p className="text-gray-400">
              Summary will appear here...
            </p>
          )}

          {copied && (
            <p className="text-xs text-green-600 mt-2">
              Copied to clipboard ✅
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
