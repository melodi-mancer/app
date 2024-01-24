const footer = () => {
  return (
    <footer>
      <div className="github"><button onClick={footer.goToRepo}></button></div>
    </footer>
  )
}

footer.goToRepo = () => {
  let url = 'https://github.com/melodi-mancer/app'
  window.open(url, '_blank');
}

export default footer