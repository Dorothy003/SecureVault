// src/components/DownloadModal.jsx
import { useState } from "react";

const DownloadModal = ({ isOpen, onClose, onDownload }) => {
  const [fileId, setFileId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock check (replace with backend verification)
    if (fileId === "12345" && password === "secret") {
      onDownload();
      onClose();
    } else {
      setError("Invalid File ID or Password!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-white mb-4">File Verification</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter File ID"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#0f172a] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Verify & Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DownloadModal;
