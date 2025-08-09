import { createCache } from 'async-cache-dedupe'
import CompressionWorker from './worker?worker'

async function compressImageFileViaWorker(image: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const worker = new CompressionWorker()
    worker.addEventListener('message', (event) => {
      const blob: Blob = event.data
      console.debug('worker result', blob)
      resolve(new File([blob], image.name, { type: blob.type }))
      worker.terminate()
    })
    worker.addEventListener('error', (err) => {
      worker.terminate()
      reject(err)
    })
    worker.postMessage({ image })
  })
}

async function _compressImageFile(image: File): Promise<File> {
  try {
    const result = await compressImageFileViaWorker(image)
    console.debug('image compression', image.size, '=>', result.size)
    return result
  } catch (err) {
    console.error(err)
    return image
  }
}

const cache = createCache({
  ttl: 60,
  storage: { type: 'memory' },
})

const cacheInstance = cache.define(
  'compressImageFile',
  {
    serialize: (image: File) => image.name,
  },
  _compressImageFile,
)

export const compressImageFile = cacheInstance.compressImageFile.bind(cacheInstance)
