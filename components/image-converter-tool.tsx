"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, Download, ImageIcon } from "lucide-react"

export default function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [convertedURL, setConvertedURL] = useState<string | null>(null)
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreviewURL(URL.createObjectURL(selected))
      setConvertedURL(null)
    }
  }

  const convertImage = () => {
    if (!file || !previewURL) return
    setLoading(true)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)

      const mimeType = `image/${format}`
      const dataURL = canvas.toDataURL(mimeType)
      setConvertedURL(dataURL)
      setLoading(false)
    }
    img.src = previewURL
  }

  const handleDownload = () => {
    if (!convertedURL) return
    const a = document.createElement("a")
    a.href = convertedURL
    a.download = `converted.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="tool-ui">
      <div className="tool-ui-header">
        <div className="tool-ui-icon">🔁</div>
        <h1 className="text-2xl font-bold">Image Format Converter</h1>
      </div>
      <div className="tool-ui-description">Convert images to PNG, JPEG, or WebP formats.</div>

      <Card className="p-6 space-y-4">
        <div>
          <Label htmlFor="image-upload">Upload Image</Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Choose Format</Label>
          <select
            className="mt-1 w-full border rounded p-2"
            value={format}
            onChange={(e) => setFormat(e.target.value as "png" | "jpeg" | "webp")}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <Button
          onClick={convertImage}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Convert Image
            </>
          )}
        </Button>

        {previewURL && (
          <div>
            <h3 className="font-semibold mb-2">Original Preview</h3>
            <img src={previewURL} alt="Original" className="w-full rounded-md border mb-4" />
          </div>
        )}

        {convertedURL && (
          <div>
            <h3 className="font-semibold mb-2">Converted Image</h3>
            <img src={convertedURL} alt="Converted" className="w-full rounded-md border mb-4" />
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
