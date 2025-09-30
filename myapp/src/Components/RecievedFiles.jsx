// src/components/RecievedItem.jsx
import FileItem from "./FileItem";

const RecievedFiles=({ sender, email, time, files })=> {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-white">{sender}</p>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
        <p className="text-xs text-gray-400">{time}</p>
      </div>

      <div className="space-y-2">
        {files.map((file, i) => (
          <FileItem key={i} name={file.name} size={file.size} />
        ))}
      </div>
    </div>
  );
}
export default RecievedFiles;