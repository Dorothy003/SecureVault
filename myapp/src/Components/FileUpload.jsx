import React, { useState } from "react";
import axios from "../Api/axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload response:", response.data);

     
      const { file_id, filename, sha256 } = response.data;

      
      setFileId(file_id);
      setReceiver("receiver@example.com"); 
      setPrivateKey(sha256.slice(0, 16));

      setMessage(`File "${filename}" uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(" Upload failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4 mb-6 text-white">
      <h2 className="text-lg font-bold mb-3">Upload & Send Files</h2>

     
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

     
      <input
        type="text"
        placeholder="File ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
        className="w-full text-white bg-gray-700 px-3 py-2 rounded mb-2"
      />

      <input
        type="email"
        placeholder="Receiver Email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="w-full text-white bg-gray-700 px-3 py-2 rounded mb-2"
      />

      <input
        type="text"
        placeholder="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        className="w-full text-white bg-gray-700 px-3 py-2 rounded mb-2"
      />

      <button
        onClick={handleUpload}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full"
      >
        Send Files
      </button>

      {message && (
        <p className="mt-3 text-sm text-yellow-300 font-medium">{message}</p>
      )}
    </div>
  );
};

export default FileUpload;
