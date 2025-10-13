// pages/Dashboard.jsx
// src/pages/Dashboard.jsx
import Header from "../Components/Header";
import UploadSection from "../Components/UploadSection";
import FileReceive from "../Components/FileReceive";

export default function Dashboard() {
  return (
    <div className="p-6 bg-[#0b1220] min-h-screen">
      <Header />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <UploadSection />
        <FileReceive />
      </div>
    </div>
  );
}
