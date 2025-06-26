// 📁 src/pages/UploadAsset.tsx
import { useState } from "react";
import { uploadFile } from "../utils/uploadFile";

export const UploadAsset = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (file) {
      const url = await uploadFile(file, `sabong/assets/${file.name}`);
      alert("Uploaded: " + url);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded">Upload</button>
    </div>
  );
};
