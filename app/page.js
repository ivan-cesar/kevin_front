import Image from 'next/image'
import ImageUploader from "@/app/upload-image";

export default function Home() {
  return (
      <div className="min-h-full min-w-full">
        <ImageUploader />
      </div>
  )
}
