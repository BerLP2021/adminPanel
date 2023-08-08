import React from 'react'

const Spinner = ({active}) => {
    return (
        <div className={`spinner-overlay ${active ? 'active' : ''}`}>
            <div uk-spinner="ratio: 3"></div>
        </div>
    )
}

export default Spinner;