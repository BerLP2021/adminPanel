import React from 'react'

const AdminPanel = () => {

    return (
        <nav className="uk-navbar-container uk-padding-small uk-width-1-1 panel " uk-navbar="true">
            <div className='uk-navbar-right '>
                <button 
                    className="uk-button uk-button-primary uk-margin-small-right"
                    uk-toggle="target: #modal-meta">
                    Edit meta
                </button>
                <button 
                    className="uk-button uk-button-primary uk-margin-small-right"
                    uk-toggle="target: #modal-backups">
                    Restore
                </button>
                <button 
                    className="uk-button uk-button-primary uk-margin-small-right"
                    uk-toggle="target: #modal-open">
                    Open page
                </button>
                <button 
                    className="uk-button uk-button-default uk-margin-small-right"
                    // uk-toggle="target: #modal-save"
                    uk-toggle="target: #modal-group-save"
                    >
                    Save changes
                </button>
                <button 
                    className="uk-button uk-button-danger"
                    uk-toggle="target: #modal-logout"
                    >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default AdminPanel