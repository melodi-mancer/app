import authHelpers from "../authHelpers";

const footer = (props) => {
  const { logged } = props;
  return (
    <footer>
      {logged ? <div className="logout"><button onClick={e => authHelpers.logout()}>&gt; log out</button></div> : <div className="logout"></div>}
      <div className="github"><button onClick={footer.goToRepo}></button></div>
    </footer>
  )
}

footer.goToRepo = () => {
  let url = 'https://github.com/melodi-mancer/app'
  window.open(url, '_blank');
}

export default footer