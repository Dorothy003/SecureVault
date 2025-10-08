import { useState } from "react";
import DownloadModal from "./DownloadModal";

const FileItem = ({ name, size, fileId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Download handler: called with password from modal
 const handleDownload = async (password) => {
  if (!password) return;

  console.log("Downloading file:", fileId, "with password:", password);

  const formData = new FormData();
  formData.append("file_id", Number(fileId)); // ensure number
  formData.append("password", password);

  try {
    const resp = await fetch("http://localhost:8000/download", {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData,
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Download failed response:", text);
      alert("Download failed. Check console for details.");
      return;
    }

    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
    alert("Download failed. Check console for details.");
  }
};


  return (
    <>
      <div className="flex justify-between items-center bg-[#0f172a] border border-gray-700 rounded px-3 py-2 w-full">
        <p className="text-white text-sm">
          {name} <span className="text-gray-400 text-xs">({size})</span>
        </p>
        <button
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          Download
        </button>
      </div>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </>
  );
};

export default FileItem;
