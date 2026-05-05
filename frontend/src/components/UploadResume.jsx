import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import api from "../api/axios.js";

export default function UploadResume({ onUploaded }) {
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileInput.current?.files?.[0];

    if (!file) {
      setError("Choose a PDF resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    setError("");
    setProgress(0);
      setStatus("Uploading resume...");

    try {
      const { data } = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
          setStatus(percent === 100 ? "Parsing resume..." : `Uploading resume... ${percent}%`);
        }
      });
      onUploaded(data.resume);
      setProgress(100);
      setStatus("Resume uploaded and parsed.");
    } catch (err) {
      setProgress(0);
      setStatus("");
      setError(err.response?.data?.message || "Resume upload failed. Check that the backend is running and the file is a PDF or DOCX.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setFileName(file?.name || "");
    setError("");
    setStatus(file ? "Ready to upload." : "");
    setProgress(0);
  };

  return (
    <form className="upload-panel" onSubmit={handleUpload}>
      <label className="drop-zone">
        <UploadCloud size={30} />
        <span>{fileName || "Select PDF resume"}</span>
        <input
          ref={fileInput}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          type="file"
          onChange={handleFileChange}
        />
      </label>
      {status ? (
        <div className="upload-status">
          <div className="progress-track" aria-label="Upload progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span>{status}</span>
        </div>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      <button disabled={loading} type="submit">
        {loading ? "Parsing..." : "Upload Resume"}
      </button>
    </form>
  );
}
