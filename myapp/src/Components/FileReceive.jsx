import React, { useEffect, useState } from "react";
import RecievedFiles from "./RecievedFiles";

const FileReceive = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/received", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => setFiles(data.received || []))
      .catch((err) => console.error("Error fetching received files:", err));
  }, []);

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-6 w-full space-y-6">
      <h2 className="text-lg font-semibold text-white">Received Files</h2>

      {files.length > 0 ? (
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-4 pr-2">
          {files.map((f, idx) => (
            <RecievedFiles
              key={idx}
              sender={f.owner_email || "Unknown"}
              fileId={f.file_id}
              filename={f.filename}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No files received yet</p>
      )}
    </div>
  );
};

export default FileReceive;
