import { useState } from 'react'
import { extractTextFromImage } from '../lib/ocr'
import { useNavigate } from 'react-router-dom'

export default function Scan() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onFileChange(file: File) {
    setError(null)
    setLoading(true)
    try {
      setImagePreview(URL.createObjectURL(file))
      const text = await extractTextFromImage(file)
      const params = new URLSearchParams({ text })
      navigate(`/results?${params.toString()}`)
    } catch (e: any) {
      setError(e?.message || 'Failed to process image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Scan Label</h1>
        <p className="text-gray-600">Upload a clear photo of the ingredients list.</p>
      </header>

      <div className="card space-y-3">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFileChange(file)
          }}
        />
        {imagePreview && (
          <img src={imagePreview} alt="preview" className="max-h-64 rounded-md" />
        )}
        <button className="btn" disabled={loading} onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()}>
          {loading ? 'Scanning…' : 'Choose Photo'}
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <p className="text-sm text-gray-500">Camera capture support varies by device/browser.</p>
    </div>
  )
}
