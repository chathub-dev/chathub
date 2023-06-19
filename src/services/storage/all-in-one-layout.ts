function getAllInOneLayout() {
  const v = localStorage.getItem('allInOneLayout') || ''
  return parseInt(v) || 2
}

function setAllInOneLayout(v: number) {
  localStorage.setItem('allInOneLayout', v.toString())
}

export { getAllInOneLayout, setAllInOneLayout }
