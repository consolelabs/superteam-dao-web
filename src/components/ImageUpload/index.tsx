import { IconPlus } from 'components/icons/components/IconPlus'
import { useId } from 'hooks/useId'
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'

interface ImageUploadProps {
  selectedFile?: File
  setSelectedFile: Dispatch<SetStateAction<File | undefined>>
}

export const ImageUpload = (props: ImageUploadProps) => {
  const { selectedFile, setSelectedFile } = props
  const id = `select-image-${useId()}`
  const [preview, setPreview] = useState<string>()

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.[0]) {
      setSelectedFile(e.currentTarget.files[0])
    }
  }

  return (
    <div className="w-28 h-28">
      <label htmlFor={id}>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
        />
        {selectedFile ? (
          <img
            src={preview}
            alt=""
            className="object-cover w-full h-full border-2 border-purple-600 rounded-full cursor-pointer hover:ring-purple-500 hover:border-purple-500 hover:ring-1"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-purple-600 border-2 border-purple-600 rounded-lg cursor-pointer hover:ring-purple-500 hover:border-purple-500 hover:ring-1">
            <IconPlus className="w-10 h-10" />
          </div>
        )}
      </label>
    </div>
  )
}
