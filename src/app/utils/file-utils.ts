export async function file2base64(file: File, keepHeader = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (keepHeader) {
        resolve(reader.result as string)
      } else {
        const base64String = (reader.result as string).replace('data:', '').replace(/^.+,/, '')
        resolve(base64String)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}