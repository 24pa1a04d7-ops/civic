import Tesseract from 'tesseract.js'

export async function extractTextFromImage(fileOrUrl: File | string): Promise<string> {
  const image = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl)
  const { data } = await Tesseract.recognize(image, 'eng')
  return data.text || ''
}
