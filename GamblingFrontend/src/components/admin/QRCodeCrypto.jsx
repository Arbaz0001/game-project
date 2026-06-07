import { UploadCloudIcon, FileIcon, XIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const QRCodeCrypto = () => {
  const [qrImage, setQrImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const inputRef = useRef(null);

  // ✅ Fetch existing QR Codes
  const fetchQrCodes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcodecrypto/qr-codes`
      );
      const data = await res.json();
      console.log("data", data);
      if (data.success) setQrCodes(data.data);
    } catch (err) {
      console.log("Failed to fetch QR Codes", err);
    }
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  // Handle drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setQrImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle normal file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setQrImage(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  // ✅ Delete QR Code
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this QR code?"))
      return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcodecrypto/delete-qr/${id}`,
        {
          method: "DELETE",
        }
      );

      console.log(res);
      if (res.status === 200) {
        toast.success("🗑️ Deleted successfully");
      }
      fetchQrCodes();
    } catch (err) {
      toast.error("❌ Failed to delete");
    }
  };

  // ✅ Submit form (upload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!qrImage) {
      toast("Please select a QR Code image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("qrCodeCrypto", qrImage);
      formData.append("title", "Admin QR");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/qrcodecrypto/qr`,
        {
          method: "POST",
          body: formData,
        }
      );

      // 🔍 Read response safely
      const contentType = res.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON: ${text}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      toast.success("✅ QR Code uploaded successfully!");
      handleRemoveImage();
      fetchQrCodes(); // reload list
    } catch (error) {
      console.log("❌ Upload error:", error);
      toast.error("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full p-8 items-center">
      {/* Upload Form */}

      {qrCodes.length < 1 ? (
        <>
          <h2 className="text-2xl font-bold mb-4 w-full text-white text-left">
            📋 Add QR Code
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md mb-8"
          >
            {/* Drag & Drop Upload Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 mb-4 cursor-pointer transition ${
                isDragging ? "border-blue-500 bg-gray-700" : "border-gray-600"
              }`}
              onClick={() => inputRef.current.click()}
            >
              {!qrImage ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <UploadCloudIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-gray-400">
                    Drag & drop or click to upload QR Code
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Max size: 10 MB
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-6 h-6 text-blue-400" />
                    <p className="text-sm text-white">{qrImage.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-400 hover:text-red-600"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Preview */}
            {preview && (
              <div className="mb-4 flex justify-center">
                <img
                  src={preview}
                  alt="QR Code Preview"
                  className="w-40 h-40 object-contain rounded-lg border border-gray-600"
                />
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold py-2 rounded-lg`}
            >
              {loading ? "Uploading..." : "Save QR Code"}
            </button>
          </form>
        </>
      ) : (
        <div className="w-full max-w-2x max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-white">
            📋 Uploaded QR Code
          </h2>
          <div className="">
            {qrCodes.map((qr) => (
              <div
                key={qr._id}
                className="bg-gray-800 p-3 rounded-lg flex flex-col items-center"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${qr.imageUrl}`}
                  alt={qr.title}
                  className="w-auto object-contain mb-2"
                />
                <button
                  onClick={() => handleDelete(qr._id)}
                  className="bg-red-600 mt-3 hover:bg-red-700 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                >
                  <Trash2Icon className="w-4 h-4" /> Delete
                </button>
              </div>
            ))}
            {qrCodes.length === 0 && (
              <p className="col-span-full text-gray-400 text-center">
                No QR Codes uploaded yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* QR Codes List */}
    </div>
  );
};

export default QRCodeCrypto;
