// src/components/FileItem.jsx
import { useState } from "react";
import { Download } from "lucide-react";
import DownloadModal from "./DownloadModal";

const FileItem = ({ name, size, fileUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    // Start actual file download after verification
    const link = document.createElement("a");
    link.href = fileUrl; // file URL should come from props/backend
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-between items-center bg-[#0f172a] border border-gray-700 rounded px-3 py-2">
        <p className="text-white text-sm">
          {name} <span className="text-gray-400 text-xs">({size})</span>
        </p>
        <button
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Download size={16} /> Download
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
