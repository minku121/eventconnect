import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageUpload(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
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
      />
      <Button 
        type="button" 
        onClick={handleButtonClick}
        className="w-full transition-all duration-200 ease-in-out hover:bg-primary-dark"
      >
        Upload Image
      </Button>
      {previewUrl && (
        <div className="mt-4">
          <Image 
            src={previewUrl || "/placeholder.svg"} 
            alt="Preview" 
            width={400} 
            height={200} 
            className="rounded-lg object-cover w-full h-48"
          />
        </div>
      )}
    </div>
  )
}

