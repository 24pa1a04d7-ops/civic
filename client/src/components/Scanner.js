import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertTriangle, CheckCircle, Info, RotateCcw } from 'lucide-react';
import axios from 'axios';

function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setAnalysis(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setAnalysis(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const startCamera = async () => {
    try {
      setScanning(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('/api/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image');
    }
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysis(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 70) return 'text-success-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 70) return 'bg-success-100';
    if (score >= 40) return 'bg-warning-100';
    return 'bg-danger-100';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Food Label Scanner</h1>
        <p className="mt-2 text-gray-600">
          Scan or upload an image of a food label to analyze ingredients and get personalized health insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Interface */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan Options</h2>
            
            {/* Camera Scanner */}
            <div className="mb-6">
              <button
                onClick={scanning ? stopCamera : startCamera}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  scanning
                    ? 'bg-danger-600 text-white hover:bg-danger-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <Camera className="w-5 h-5" />
                <span>{scanning ? 'Stop Camera' : 'Use Camera'}</span>
              </button>
              
              {scanning && (
                <div className="mt-4 relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="camera-overlay">
                    <div className="scan-line"></div>
                  </div>
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button
                  onClick={resetScanner}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={analyzeImage}
                className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Analyze Image
              </button>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-danger-400" />
                <div className="ml-3">
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Product Overview */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Product</h4>
                  <p className="text-lg font-semibold text-gray-900">{analysis.product_name}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Health Score</h4>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreBg(analysis.overall_health_score)} ${getHealthScoreColor(analysis.overall_health_score)}`}>
                    {analysis.overall_health_score}/100
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients Found</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.ingredients.slice(0, 10).map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {analysis.ingredients.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{analysis.ingredients.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {analysis.warnings && analysis.warnings.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-danger-500 mr-2" />
                    Health Warnings
                  </h3>
                  <div className="space-y-3">
                    {analysis.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-4 h-4 text-danger-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-danger-800">
                              {warning.ingredient}
                            </p>
                            <p className="text-sm text-danger-700">
                              {warning.message}
                            </p>
                            {warning.severity && (
                              <span className="inline-block mt-1 px-2 py-1 bg-danger-100 text-danger-800 text-xs rounded">
                                {warning.severity} risk
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 text-primary-500 mr-2" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alternatives */}
              {analysis.alternatives && analysis.alternatives.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthier Alternatives</h3>
                  <div className="space-y-3">
                    {analysis.alternatives.map((alt, index) => (
                      <div key={index} className="p-3 bg-success-50 border border-success-200 rounded-lg">
                        <p className="text-sm font-medium text-success-800 mb-1">
                          Instead of: {alt.ingredient}
                        </p>
                        <p className="text-sm text-success-700">
                          Try: {alt.alternatives}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={resetScanner}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Scan Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default Scanner;