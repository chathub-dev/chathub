export async function getImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const size = { width: img.width, height: img.height }
      URL.revokeObjectURL(img.src)
      resolve(size)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
