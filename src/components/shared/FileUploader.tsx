import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = 'application/pdf,.doc,.docx',
  maxSize = 5242880, // 5MB
  label = 'Upload your resume'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept as any,
    maxSize,
    multiple: false
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`
          p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200
          ${isDragActive ? 'border-[#ee2389] bg-[#fce4f2]' : 'border-[#ee2389] hover:border-[#7c0bb3]'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-[#ee2389]"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M24 8v20m0-20L16 16m8-8l8 8m-8 20h8a8 8 0 008-8V20M24 36h-8a8 8 0 01-8-8V20"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-[#ee2389]">
            <label className="relative cursor-pointer rounded-md font-medium text-[#ee2389] hover:text-[#7c0bb3] focus-within:outline-none">
              <span>{label}</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, DOC up to {maxSize / 1024 / 1024}MB</p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-600">
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name}>
              {errors.map(error => (
                <p key={error.code}>{error.message}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader; 