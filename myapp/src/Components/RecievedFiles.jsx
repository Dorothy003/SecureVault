import React from "react";
import FileItem from "./FileItem";

const RecievedFiles = ({ sender, fileId, filename }) => {
  return (
    <div className="space-y-2 p-3 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-white">{sender}</p>
          <p className="text-sm text-gray-400">File ID: {fileId}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <FileItem name={filename} size="N/A" fileId={fileId} />
      </div>
    </div>
  );
};

export default RecievedFiles;
