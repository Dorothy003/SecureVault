import { useState } from "react";
import { Plus } from "lucide-react"; // replacing raw svg with Lucide icon

const UploadSection = () => {
  const [file, setFile] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [fileId, setFileId] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      if (selectedFile.size <= 100 * 1024 * 1024) {
        setFile(selectedFile);
      } else {
        alert("File size must be under 100MB");
      }
    } else {
      alert("Only .txt files are allowed");
    }
  };

  // Handle send button
  const handleSend = () => {
    if (!file || !receiver || !privateKey || !fileId) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    // For now, just log details (replace with API call later)
    console.log("Uploading File:", file);
    console.log("Receiver:", receiver);
    console.log("Private Key:", privateKey);
    console.log("File ID:", fileId);

    alert(`File "${file.name}" sent successfully to ${receiver}`);
    setFile(null);
    setReceiver("");
    setPrivateKey("");
    setFileId("");
  };

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-6 w-full">
      <h2 className="text-lg font-semibold mb-4 text-white">Upload & Send Files</h2>

      <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 mb-4">
        <Plus className="h-8 w-8 mb-2 text-gray-400" />
        <p>
          Drop your <span className="font-semibold">.txt</span> files here or click to upload
        </p>
        <p className="text-sm">Only text files up to 100MB</p>

        <label className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mt-4 cursor-pointer">
          Choose File
          <input type="file" accept=".txt" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <p className="mt-2 text-green-400 text-sm">Selected: {file.name}</p>
        )}
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="1/2/3"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          className="w-full text-white px-3 py-2 bg-[#0f172a] border border-gray-700 rounded outline-none"
        />
        <input
          type="email"
          placeholder="receiver@example.com"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full text-white px-3 py-2 bg-[#0f172a] border border-gray-700 rounded outline-none"
        />
        <input
          type="password"
          placeholder="private key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          className="w-full text-white px-3 py-2 bg-[#0f172a] border border-gray-700 rounded outline-none"
        />
      </div>

      <button
        onClick={handleSend}
        className="bg-green-600 hover:bg-green-700 w-full py-2 mt-4 rounded text-white"
      >
        Send Files
      </button>
    </div>
  );
};

export default UploadSection;
