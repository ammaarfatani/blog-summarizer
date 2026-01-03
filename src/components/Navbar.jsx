import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const cleanName = (email) =>
    email
      ?.split("@")[0]
      .replace(/[^a-zA-Z0-9]/g, " ");

  const handleLogout = async () => {
    await logout();
    setShowConfirm(false);
    navigate("/login");
  };

  const handleMakePost = () => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      navigate("/summarizer");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          AI Blog Summarizer
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* MAKE POST (ALWAYS SHOW) */}
          <button
            onClick={handleMakePost}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Make Your Post
          </button>

          {user ? (
            <>
              {/* AVATAR + NAME */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold uppercase">
                  {user.email[0]}
                </div>

                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {cleanName(user.email)}
                </span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={() => setShowConfirm(true)}
                className="text-red-500 font-medium hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* LOGIN REQUIRED POPUP */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Login Required
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Please login first to create your post.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM POPUP */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
