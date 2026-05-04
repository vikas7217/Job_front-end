import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { parseResume, applicantProfileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UploadResume: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Check file size (10MB limit to match backend)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    toast.success('File selected successfully!');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (!user) {
      toast.error('User not found. Please try signing in again.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Parse resume using the new parser
      const parsedData = await parseResume(uploadedFile);
      
      // Save resumeUrl to applicant profile if available
      if (parsedData.resumeUrl) {
        await applicantProfileAPI.updateProfile({ resumeUrl: parsedData.resumeUrl });
      }
      
      // Update user state to mark resume as uploaded
      const updatedUserData = {
        ...user,
        resumeUploaded: true,
      };
      
      updateUser(updatedUserData);
      
      toast.success('Resume parsed successfully!');
      
      // Navigate to edit profile with parsed data
      navigate('/edit-profile', { state: { parsedData } });
    } catch (error: any) {
      console.error('Failed to parse resume:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to parse resume. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFromScratch = () => {
    // Navigate to edit profile page with fromScratch flag
    navigate('/edit-profile', { state: { fromScratch: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="font-visa drop-shadow-md text-[#ee2389]">Upload Your Resume</span>
            </h2>
            <p className="text-sm text-gray-600">
              <span className="text-[#7c0bb3]">PDF or DOCX only. Max size 2MB.</span>
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (You can edit your profile later)
              </label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : uploadedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 text-gray-400">
                    {uploadedFile ? (
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xl">📄</span>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-xl">📁</span>
                      </div>
                    )}
                  </div>
                  
                  {uploadedFile ? (
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Drag and drop your resume here, or
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          Upload Resume
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileInputChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="mt-2 text-xs text-gray-500 text-right">
                PDF, DOC, DOCX | Max 10 MB
              </p>
            </div>

            {/* Upload Button */}
            {uploadedFile && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Parsing Resume...
                  </span>
                ) : (
                  'Parse & Continue'
                )}
              </button>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Create from Scratch */}
            <button
              onClick={handleCreateFromScratch}
              disabled={isUploading}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create from Scratch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume; 