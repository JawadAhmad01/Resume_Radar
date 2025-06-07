import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { File, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept: string
  maxSize?: number
  label: string
  description?: string
  id: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  description,
  id
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState<boolean>(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      onFileChange(selectedFile)
    }
  }, [onFileChange])
  
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    onFileChange(null)
  }

  // Convert comma-separated MIME types string to the expected format
  const acceptTypes = accept.split(',').reduce((acc, type) => {
    acc[type.trim()] = [];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptTypes,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  })

  const formatFileSize = (size: number): string => {
    return (size / 1024).toFixed(0) + 'KB'
  }
  
  return (
    <div className="file-upload-container">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={cn(
            "file-drop-area p-6 bg-neutral-50 rounded-lg cursor-pointer flex flex-col items-center justify-center",
            isDragActive && "active"
          )}
          id={id}
        >
          <File className="h-10 w-10 text-primary/60 mb-4" />
          <p className="text-center text-neutral-600 mb-2">Drag & drop your {label} here</p>
          <p className="text-center text-neutral-500 text-sm mb-4">{description || `Supports PDF, DOC, DOCX (Max ${maxSize/1024/1024}MB)`}</p>
          <button className="bg-white border border-neutral-300 hover:border-primary text-foreground py-2 px-4 rounded-md text-sm transition flex items-center">
            <Upload className="h-4 w-4 mr-2" /> Browse Files
          </button>
          <input {...getInputProps()} className="hidden" />
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className="cursor-pointer"
        >
          <div className="mt-3">
            <div className="flex items-center p-3 bg-primary/5 rounded-md">
              <File className="h-5 w-5 text-primary mr-3" />
              <div className="flex-grow">
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>
              </div>
              <button 
                className="text-neutral-400 hover:text-accent"
                onClick={removeFile}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <input {...getInputProps()} className="hidden" />
        </div>
      )}
    </div>
  )
}
