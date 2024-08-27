'use client';
import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);
  const [description, setDescription] = useState("");
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [verificationMethod, setVerificationMethod] = useState(null); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", ""]); 
  const [email, setEmail] = useState(""); 

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleVideoFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setVideoFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleAddFiles = (e, type) => {
    e.preventDefault();
    if (type === 'image') {
      imageInputRef.current.click();
    } else if (type === 'video') {
      videoInputRef.current.click();
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleVerificationMethodChange = (method) => {
    setVerificationMethod(method);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    
    for (const file of files) {
      formData.append('file', file);
    }
    
    for (const videoFile of videoFiles) {
      formData.append('file', videoFile);
    }
  
    formData.append('description', description);
    formData.append('reporters', email);
  
    toast.info('Uploading files...', { position: "top-center" });
  
    try {
      const uploadResponse = await fetch('/api/uploadFiles', {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Network response was not ok.');
      } 
      const uploadData = await uploadResponse.json();
      toast.success('Files uploaded successfully!', { position: "top-center" });
  
      const reportData = {
        description,
        reporters: [email], 
        photos: uploadData.urls.filter(url => url.includes('image')), 
        videos: uploadData.urls.filter(url => url.includes('video')), 
      };
      toast.info('Submitting accident report...', { position: "top-center" });
  
      const reportResponse = await fetch('/api/reportAccident', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });
  
      if (!reportResponse.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const reportDataResponse = await reportResponse.json();
      toast.success('Accident reported successfully!', { position: "top-center" });
      console.log(reportDataResponse);
  
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "top-center" });
    }
  };

  
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      <ToastContainer />
      <br/>
      <br/>
      <div className="bg-[#0D1117] text-[#C9D1D9] min-h-screen p-8 space-y-8">

        {/* Top Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#58A6FF]">Accident Reporting</h1>
          <p className="text-[#C9D1D9] mt-2">
            Use this form to report accidents by uploading relevant photos, videos, and descriptions.
          </p>
        </div>

        {/* Upload and Preview Section */}
        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">

          {/* Upload Section */}
          <div className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-2xl font-semibold mb-4 text-[#58A6FF]">Upload Images</h2>
            <p className="text-[#C9D1D9] mb-4">Please upload relevant images that describe the accident.</p>

            <button
              onClick={(e) => handleAddFiles(e, 'image')}
              className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mb-4"
            >
              Add Images
            </button>

            <input
              id="imageFileInput"
              type="file"
              accept="image/*"
              multiple
              capture="environment" 
              onChange={handleFileChange}
              ref={imageInputRef}
              className="hidden"
            />

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#58A6FF]">Upload Videos</h2>
            <p className="text-[#C9D1D9] mb-4">Please upload relevant videos that describe the accident.</p>

            <button
              onClick={(e) => handleAddFiles(e, 'video')}
              className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mb-4"
            >
              Add Videos
            </button>

            <input
              id="videoFileInput"
              type="file"
              accept="video/*"
              multiple
              capture="environment" 
              onChange={handleVideoFileChange}
              ref={videoInputRef}
              className="hidden"
            />

            <div className="mb-4 mt-8">
              <label className="block text-[#C9D1D9] text-lg font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full p-3 border rounded bg-[#0D1117] text-[#C9D1D9] h-32 resize-none"
                placeholder="Describe the content..."
              ></textarea>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-2xl font-bold mb-4 text-[#58A6FF]">Uploaded Photos</h2>
            <div className="flex flex-wrap gap-4">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover rounded-lg border border-[#0D1117]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Uploaded Videos Section */}
        <div className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">

          <div className="bg-[#161B22] p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-2xl font-bold mb-4 text-[#58A6FF]">Uploaded Videos</h2>
            <div className="flex flex-wrap gap-4">
              {videoPreviewUrls.map((url, index) => (
                <video
                  key={index}
                  src={url}
                  controls
                  className="w-32 h-32 object-cover rounded-lg border border-[#0D1117]"
                />
              ))}
            </div>
          </div>

        </div>

        {/* Verification Section */}
        <div className="bg-[#161B22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#58A6FF] mb-4">Choose a Verification Method</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleVerificationMethodChange('phone')}
              className={`w-full bg-[${verificationMethod === 'phone' ? '#58A6FF' : '#0D1117'}] hover:bg-[#1f6feb] text-[#C9D1D9] font-bold py-2 px-4 rounded transition duration-300`}
            >
              Phone Number
            </button>
            <button
              onClick={() => handleVerificationMethodChange('email')}
              className={`w-full bg-[${verificationMethod === 'email' ? '#58A6FF' : '#0D1117'}] hover:bg-[#1f6feb] text-[#C9D1D9] font-bold py-2 px-4 rounded transition duration-300`}
            >
              Email
            </button>
          </div>

          {verificationMethod === 'phone' && (
            <div className="mt-4">
              <label className="block text-[#C9D1D9] text-lg font-semibold mb-2">
                Enter Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="w-full p-3 border rounded bg-[#0D1117] text-[#C9D1D9]"
                placeholder="Phone Number"
              />
              <div className="mt-4">
                <label className="block text-[#C9D1D9] text-lg font-semibold mb-2">
                  Enter OTP
                </label>
                <div className="flex space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength="1"
                      className="w-12 p-3 border rounded bg-[#0D1117] text-[#C9D1D9] text-center"
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mt-4"
              >
                Upload
              </button>
            </div>
          )}

          {verificationMethod === 'email' && (
            <div className="mt-4">
              <label className="block text-[#C9D1D9] text-lg font-semibold mb-2">
                Enter Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-3 border rounded bg-[#0D1117] text-[#C9D1D9]"
                placeholder="Email"
              />
              {email && (
                <div>
                  <p className="mt-2 text-[#58A6FF]">
                    Go to your email to verify it.
                  </p>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-[#58A6FF] hover:bg-[#1f6feb] text-[#0D1117] font-bold py-2 px-4 rounded transition duration-300 mt-4"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="bg-[#161B22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#58A6FF] mb-4">Why is this Important?</h2>
          <p className="text-[#C9D1D9]">
            Reporting accidents promptly can save lives. 
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-[#161B22] p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-4 text-[#58A6FF]">FAQs</h2>
          <div className="space-y-4">
            <div>
              <button
                className="w-full text-left text-lg font-bold bg-[#0D1117] p-3 rounded transition duration-300 hover:bg-[#161B22]"
                onClick={() => toggleFAQ(0)}
              >
                What information do I need to provide?
              </button>
              {activeFAQ === 0 && (
                <p className="text-[#C9D1D9] mt-2">
                  You should provide any photos, videos, or voice recordings that describe the accident, along with a written description.
                </p>
              )}
            </div>
            <div>
              <button
                className="w-full text-left text-lg font-bold bg-[#0D1117] p-3 rounded transition duration-300 hover:bg-[#161B22]"
                onClick={() => toggleFAQ(1)}
              >
                How long does the reporting process take?
              </button>
              {activeFAQ === 1 && (
                <p className="text-[#C9D1D9] mt-2">
                  The process typically takes a few minutes, depending on the amount of information you're providing.
                </p>
              )}
            </div>
            <div>
              <button
                className="w-full text-left text-lg font-bold bg-[#0D1117] p-3 rounded transition duration-300 hover:bg-[#161B22]"
                onClick={() => toggleFAQ(2)}
              >
                What happens after I submit my report?
              </button>
              {activeFAQ === 2 && (
                <p className="text-[#C9D1D9] mt-2">
                  Your report will be reviewed by our team, and you will be contacted if more information is needed.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="bg-[#161B22] py-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="font-bold text-[#58A6FF]">Company</h4>
                <ul className="mt-2 text-[#C9D1D9]">
                  <li>About Us</li>
                  <li>Our Team</li>
                  <li>Careers</li>
                  <li>News</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#58A6FF]">Products</h4>
                <ul className="mt-2 text-[#C9D1D9]">
                  <li>Accident Reporting</li>
                  <li>Insurance Claims</li>
                  <li>Safety Resources</li>
                  <li>Roadside Assistance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#58A6FF]">Resources</h4>
                <ul className="mt-2 text-[#C9D1D9]">
                  <li>Blog</li>
                  <li>Community</li>
                  <li>Support</li>
                  <li>FAQs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#58A6FF]">Legal</h4>
                <ul className="mt-2 text-[#C9D1D9]">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UploadForm;
