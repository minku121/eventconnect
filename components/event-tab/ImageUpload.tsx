import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  onUploadStart: () => void
  onUploadEnd: () => void
  onProgress: (progress: number) => void
  onError?: (error: string) => void
}

export default function ImageUpload({ 
  onImageUpload, 
  onUploadStart,
  onUploadEnd,
  onProgress,
  onError
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        onUploadStart()
        onProgress(0)
        
        const formData = new FormData()
        formData.append('file', file)

        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(progress)
            onProgress(progress)
          }
        })

        xhr.open('POST', '/api/upload')
        xhr.responseType = 'json'

        xhr.onload = () => {
          if (xhr.status === 200) {
            const result = xhr.response
            onImageUpload(result.url)
            setPreviewUrl(result.url)
          } else {
            const error = xhr.response?.error || 'Upload failed'
            console.error('Upload failed:', error)
            onError?.(error)
          }
          setIsUploading(false)
          onUploadEnd()
        }

        xhr.onerror = () => {
          const error = 'Network error during upload'
          console.error('Upload error:', error)
          onError?.(error)
          setIsUploading(false)
          onUploadEnd()
        }

        xhr.send(formData)

      } catch (error) {
        console.error('Upload failed:', error)
        onError?.(error instanceof Error ? error.message : 'Upload failed')
        setIsUploading(false)
        onUploadEnd()
      }
    }
  }

  const handleButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="coverImage">Event Cover Image</Label>
      <input
        type="file"
        id="coverImage"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isUploading}
      />
      <Button 
        type="button" 
        onClick={handleButtonClick}
        className="w-full relative"
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="w-full flex items-center justify-center">
            <span className="mr-2">Uploading...</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          </div>
        ) : (
          'Upload Image'
        )}
      </Button>
    </div>
  )
}

