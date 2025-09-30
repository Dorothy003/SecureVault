// components/FileReceive.jsx
// src/components/FileReceive.jsx
import RecievedFiles from "./RecievedFiles"
const FileReceive=()=> {
  const filesData = [
    {
      sender: "Mika Singh",
      email: "Mika.com",
      time: "2 hours ago",
      files: [
        { name: "asx.txt", size: "1.2 MB" },
        { name: "laila.txt", size: "856 KB" },
      ],
    },
    {
      sender: "Kendal Jenner",
      email: "Kendal.co",
      time: "1 day ago",
      files: [{ name: "kylie products.txt", size: "3.4 MB" }],
    },
    {
      sender: "Prabhas",
      email: "pra.com",
      time: "3 days ago",
      files: [{ name: "Bahubali.txt", size: "2.1 MB" }],
    },
  ];

  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-lg p-6 w-full space-y-6">
      <h2 className="text-lg font-semibold text-white">Received Files</h2>
      {filesData.map((item, idx) => (
        <RecievedFiles key={idx} {...item} />
      ))}
    </div>
  );
}
export default FileReceive;