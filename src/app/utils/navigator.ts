const ua = navigator.userAgent

const getBrowser = (): 'Opera' | 'Chrome' | 'Firefox' | 'Safari' | 'IE' | 'Edge' | 'Unknown' | undefined => {
  if (ua.indexOf('Opera') > -1) {
    return 'Opera';
  }
  if (ua.indexOf('Edge') > -1) {
    return 'Edge';
  }
  if (ua.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (ua.indexOf('Firefox') > -1) {
    return 'Firefox';
  }
  if (ua.indexOf('Safari') > -1) {
    return 'Safari';
  }
  if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
    return 'IE';
  }
  return 'Unknown';
};


const getOS = (): 'Windows' | 'Mac' | 'Linux' | 'Android' | 'iOS' | 'Unknown' => {
  if (ua.indexOf('Windows') > -1) {
    return 'Windows'
  }
  if (ua.indexOf('Mac') > -1) {
    return 'Mac'
  }
  if (ua.indexOf('Linux') > -1) {
    return 'Linux'
  }
  if (ua.indexOf('Android') > -1) {
    return 'Android'
  }
  if (ua.indexOf('iPhone') > -1) {
    return 'iOS'
  }
  if (ua.indexOf('iPad') > -1) {
    return 'iOS'
  }
  if (ua.indexOf('iPod') > -1) {
    return 'iOS'
  }
  return 'Unknown'
}

export { getBrowser, getOS }
