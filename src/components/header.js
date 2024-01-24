const header = () => {
    return (
        <div className='header'>
            <div className="title">
                <div className="logo"></div>
                <h1>Melodimancer</h1>
            </div>
            <div className="secondary"><small>v{process.env.REACT_APP_VERSION}</small></div>
        </div>
    )
}

export default header