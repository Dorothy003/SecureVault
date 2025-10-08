import { useState } from "react";
import { Plus } from "lucide-react";
import axios from "../Api/axios";

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [fileId, setFileId] = useState("");
  const [message, setMessage] = useState("");

  // File selection handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      if (selectedFile.size <= 100 * 1024 * 1024) {
        setFile(selectedFile);
        setMessage(`Selected: ${selectedFile.name}`);
      } else {
        alert("File size must be under 100MB");
      }
    } else {
      alert("Only .txt files are allowed");
    }
  };

  // Upload file only
  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to upload files");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadResp = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { file_id, filename } = uploadResp.data;
      setFileId(file_id);
      setMessage(`File "${filename}" uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(
        error.response?.data?.detail || "Upload failed. Please try again."
      );
    }
  };

  // Share file only
  const handleShare = async () => {
    if (!fileId) {
      alert("No file uploaded yet. Please upload a file first.");
      return;
    }

    if (!receiver) {
      alert("Please enter a recipient email");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to share files");
        return;
      }

      const ownerPassword = prompt(`Enter your password to share the file with ${receiver}:`);
      if (!ownerPassword) {
        setMessage((prev) => prev + "Share skipped (no password provided).");
        return;
      }

      const shareResp = await axios.post(
        "/share",
        {
          file_id: fileId,
          recipent_email: receiver,
          owner_password: ownerPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage((prev) => prev + ` File shared with ${receiver} successfully!`);
    } catch (error) {
      console.error("Share failed:", error);
      setMessage(
        error.response?.data?.detail || "Share failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-6 w-full">
      <h2 className="text-lg font-semibold mb-4 text-white">Upload & Share Files</h2>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 mb-4">
        <Plus className="h-8 w-8 mb-2 text-gray-400" />
        <p>Drop your <span className="font-semibold">.txt</span> files here or click to upload</p>
        <p className="text-sm">Only text files up to 100MB</p>

        <label className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mt-4 cursor-pointer">
          Choose File
          <input type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <p className="mt-2 text-green-400 text-sm">Selected: {file.name}</p>
        )}
      </div>

      {/* Input Fields */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="File ID"
          value={fileId}
          readOnly
          className="w-full text-white px-3 py-2 bg-[#0f172a] border border-gray-700 rounded outline-none"
        />
        <input
          type="email"
          placeholder="Recipient email"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full text-white px-3 py-2 bg-[#0f172a] border border-gray-700 rounded outline-none"
        />
      </div>

      {/* Separate Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 w-1/2 py-2 rounded text-white"
        >
          Upload
        </button>
        <button
          onClick={handleShare}
          className="bg-green-600 hover:bg-green-700 w-1/2 py-2 rounded text-white"
        >
          Share
        </button>
      </div>

      {/* Message */}
      {message && <p className="mt-3 text-sm text-yellow-300 font-medium">{message}</p>}
    </div>
  );
};

export default UploadSection;
