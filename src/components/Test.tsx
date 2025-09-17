import { useState, useRef, useEffect } from "react";

const AdvancedSurveyForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    feedback: "",
    signature: null,
    location: null,
    audioFile: null,
    barcodeData: null,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  // Initialize canvas for signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Signature pad functions
  const startDrawing = (e) => {
    isDrawing.current = true;
    draw(e);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing.current) {
      const canvas = canvasRef.current;
      const signature = canvas.toDataURL();
      setFormData((prev) => ({ ...prev, signature }));
      isDrawing.current = false;
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setFormData((prev) => ({ ...prev, signature: null }));
  };

  // GPS Location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setFormData((prev) => ({ ...prev, location }));
          setLocationVisible(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get location. Please check your browser permissions."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setFormData((prev) => ({ ...prev, audioFile: audioBlob }));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Unable to access microphone. Please check your browser permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, audioFile: file }));
    }
  };

  // Barcode Scanner (mock function)
  const scanBarcode = () => {
    // In a real implementation, this would use a barcode scanning library
    const mockBarcode = `BC${Date.now()}`;
    setFormData((prev) => ({ ...prev, barcodeData: mockBarcode }));
    alert(`Barcode scanned: ${mockBarcode}`);
  };

  // Drawing polygon (mock function)
  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
    if (!drawingMode) {
      alert(
        "Drawing mode activated. Click on the map to create polygon points."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  const clearForm = () => {
    setFormData({
      fullName: "",
      feedback: "",
      signature: null,
      location: null,
      audioFile: null,
      barcodeData: null,
    });
    clearSignature();
    setLocationVisible(false);
    setDrawingMode(false);

    // Reset file input
    const audioInput = document.getElementById("audio-upload");
    if (audioInput) audioInput.value = "";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <style>{`
        :root {
          --primary-color: #4285F4;
          --background-color: #F0F4F9;
        }
        .form-input {
          border: 0;
          border-bottom: 1px solid #e0e0e0;
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
          background-color: transparent;
        }
        .form-input:focus {
          border-bottom: 2px solid var(--primary-color);
          box-shadow: none;
          outline: none;
        }
        canvas {
          touch-action: none;
        }
      `}</style>

      <div className="flex min-h-screen flex-col items-center justify-start py-8 ">
        <div className="w-full ">
          {/* Header Section */}
          {/* <div className="mb-4 rounded-t-lg border-t-8 border-blue-500 bg-white p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  Customer Satisfaction Survey
                </h1>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <p className="text-right text-sm font-medium text-blue-500">
                  Step 3 of 15
                </p>
                <div className="mt-1 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              Your feedback is valuable to us. Please take a few moments to
              complete this survey and help us improve our services.
            </p>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex flex-wrap items-center text-sm text-gray-500">
                <div className="mr-6 flex items-center">
                  <span className="mr-1.5 text-base">👤</span>
                  <span>Posted by: Acme Inc.</span>
                </div>
                <div className="mr-6 flex items-center">
                  <span className="mr-1.5 text-base">📅</span>
                  <span>Created: 2023-10-26</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1.5 text-base">🔄</span>
                  <span>Modified: 2023-10-27</span>
                </div>
              </div>
            </div>
          </div> */}

          <div className="space-y-4">
            {/* Full Name Input */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label
                className="mb-1 block text-base font-medium text-gray-700"
                htmlFor="fullName"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                className="form-input w-full py-2 text-base placeholder-gray-500"
                id="fullName"
                placeholder="Your answer"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            {/* Feedback Textarea */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label
                className="mb-1 block text-base font-medium text-gray-700"
                htmlFor="feedback"
              >
                Your Feedback <span className="text-red-600">*</span>
              </label>
              <textarea
                className="form-input mt-1 block w-full py-2 placeholder-gray-500"
                id="feedback"
                placeholder="Your answer"
                rows="4"
                value={formData.feedback}
                onChange={handleInputChange}
              />
            </div>

            {/* Digital Signature */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label className="mb-1 block text-base font-medium text-gray-700">
                Digital Signature <span className="text-red-600">*</span>
              </label>
              <div className="mt-2 rounded-lg border border-gray-300 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={192}
                  className="h-48 w-full rounded-t-lg cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="border-t border-gray-300 p-2 text-right">
                  <button
                    className="text-sm font-medium text-blue-500 hover:text-blue-700"
                    type="button"
                    onClick={clearSignature}
                  >
                    Clear
                  </button>
                </div>
              </div>
              {formData.signature && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Signature captured
                </p>
              )}
            </div>

            {/* GPS Coordinates */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label className="mb-1 block text-base font-medium text-gray-700">
                GPS Coordinates
              </label>
              <div className="mt-2 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-4">
                <button
                  className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={getCurrentLocation}
                >
                  <span className="-ml-0.5 h-5 w-5">📍</span>
                  Get Current Location
                </button>
              </div>
              {locationVisible && formData.location && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Latitude: {formData.location.latitude}
                  </p>
                  <p className="text-sm text-gray-600">
                    Longitude: {formData.location.longitude}
                  </p>
                </div>
              )}
            </div>

            {/* Draw Area of Interest */}
            {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label className="mb-1 block text-base font-medium text-gray-700">
                Draw Area of Interest
              </label>
              <div
                className={`mt-2 h-64 rounded-lg border border-gray-300 bg-gray-200 ${
                  drawingMode ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl text-gray-500">✏️</span>
                    <p className="mt-2 text-sm text-gray-600">
                      {drawingMode
                        ? "Drawing mode active - Click to create polygon"
                        : "Map area for GIS Polygon drawing"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-right">
                <button
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-inset ${
                    drawingMode
                      ? "bg-blue-500 text-white ring-blue-500"
                      : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"
                  }`}
                  type="button"
                  onClick={toggleDrawingMode}
                >
                  <span className="-ml-0.5 h-5 w-5">✏️</span>
                  {drawingMode ? "Stop Drawing" : "Draw Polygon"}
                </button>
              </div>
            </div> */}

            {/* Scan Barcode */}
            {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label className="mb-1 block text-base font-medium text-gray-700">
                Scan Barcode
              </label>
              <div className="mt-2 flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-4">
                <button
                  className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  type="button"
                  onClick={scanBarcode}
                >
                  <span className="-ml-0.5 h-5 w-5">📱</span>
                  Scan Barcode
                </button>
              </div>
              {formData.barcodeData && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Barcode: {formData.barcodeData}
                </p>
              )}
            </div> */}

            {/* Audio Recording */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <label className="mb-1 block text-base font-medium text-gray-700">
                Audio Recording
              </label>
              <div className="mt-2 flex flex-col items-center justify-center space-y-4 rounded-lg border border-gray-300 bg-gray-50 p-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  className={`inline-flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-inset ${
                    isRecording
                      ? "bg-red-500 text-white ring-red-500"
                      : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"
                  }`}
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  <span className="-ml-0.5 h-5 w-5 text-red-500">🎤</span>
                  {isRecording ? "Stop Recording" : "Record Audio"}
                </button>
                <div className="text-sm text-gray-600">or</div>
                <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-600">
                  <span>Upload an audio file</span>
                  <input
                    accept="audio/*"
                    className="sr-only"
                    id="audio-upload"
                    name="audio-upload"
                    type="file"
                    onChange={handleAudioUpload}
                  />
                </label>
              </div>
              {formData.audioFile && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Audio file:{" "}
                  {formData.audioFile.name || "Recording captured"}
                </p>
              )}
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-between">
              <button
                className="rounded-md bg-blue-500 px-6 py-2 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                type="button"
                onClick={handleSubmit}
              >
                Next
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
              >
                Clear form
              </button>
            </div>
          </div>

          {/* Footer */}

          <div className="mt-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-700">Insyt Web </span>{" "}
            <span className="text-2xl font-normal text-gray-700"> Forms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSurveyForm;
