import imageCompression from 'browser-image-compression'

self.addEventListener('message', async (event) => {
  console.debug('worker receive message', event.data)
  const result = await imageCompression(event.data.image, {
    useWebWorker: false,
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
  })
  postMessage(result)
})
