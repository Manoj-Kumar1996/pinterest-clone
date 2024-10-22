import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { PinData } from "../context/PinContext";
import { useNavigate } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";

const Create = () => {
  const inputRef = useRef(null);
  const [file, setFile] = useState("");
  const [filePreview, setFilePreview] = useState();
  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const { addPin } = PinData();

  const handleClick = () => {
    inputRef.current.click();
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    
    // Check if a file was selected
    if (!file) return;
  
    // Convert 10MB to bytes
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  
    if (file.size > maxSize) {
      alert("File size must not exceed 10MB");
      return;
    }
  
    const reader = new FileReader();
  
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePreview(reader.result);
      setFile(file);
    };
  };
  
  const navigate = useNavigate();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("pin", pin);
  formData.append("file", file);

  const addPinHandler = (e) => {
    e.preventDefault();
    addPin(
      formData,
      setFilePreview,
      setFile,
      setTitle,
      setPin,
      navigate,
      setLoading
    );
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
        <div className="flex items-center justify-center ">
          <div className="flex flex-col items-center w-80 h-auto p-6 bg-white rounded-lg shadow-lg ">
            {filePreview && <img className="my-3" src={filePreview} alt="" />}
            <div
              className="flex flex-col items-center justify-center h-full cursor-pointer"
              onClick={handleClick}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={changeFileHandler}
              />
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                <FaPlus />
              </div>
              <p className="text-gray-500 ">Choose a file</p>
            </div>
            <p className="mt-4 text-sm text-gray-400 ">
              We recommand using high quality .JPG file but less then 10MB
            </p>
          </div>
        </div>

        <div className="">
          <div className="flex items-center justify-center bg-gray-100 ">
            <form
              onSubmit={addPinHandler}
              className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="common-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin
                </label>
                <input
                  type="text"
                  id="pin"
                  className="common-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
              <button className="common-btn" disabled={loading}>
                {loading ? <LoadingAnimation /> : "+add"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
