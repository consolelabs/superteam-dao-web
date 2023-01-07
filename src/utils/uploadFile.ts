import Moralis from 'moralis'

const convertBase64 = (file: File) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

export const uploadFile = async (file: File) => {
  try {
    const fileBase64 = await convertBase64(file)
    const fileContent = fileBase64?.toString() || ''

    if (!fileContent) {
      return undefined
    }

    const abi = [
      {
        path: file.name,
        content: fileContent,
      },
    ]

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi })
    const paths = await response.toJSON()

    return paths[0]?.path
  } catch (error: any) {
    return undefined
  }
}
