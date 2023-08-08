import React, {useState} from 'react';


const GroupModal = ({target, method}) => {
    const [commit, setCommit] = useState('');

    const handleChange = (e) => {
        setCommit(e.target.value);
    }

    const handleClick = () => {
        method(commit);
        setCommit('');
    }

    const handleCancel = (e) => {
        if(e.target === e.currentTarget) {
            setCommit('');
        }
    }

    return (
        <>  

            <div id={target} uk-modal={'true'}>
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" uk-close={'true'}></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title">Warning!</h2>
                    </div>
                    <div className="uk-modal-body">
                        <p>Are you sure you want to save the changes?</p>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button 
                            className="uk-button uk-button-default uk-modal-close uk-margin-small-right" 
                            type="button">
                            Cancel
                        </button>
                        <a href="#modal-group-commit" 
                            className="uk-button uk-button-primary" 
                            uk-toggle='target: #modal-group-commit'>
                            Continue
                        </a>
                    </div>
                </div>
            </div>

            <div id="modal-group-commit" uk-modal={'true'} container={'false'} onClick={(e) => handleCancel(e)}>
                <div className="uk-modal-dialog">
                    <button 
                        className="uk-modal-close-default" 
                        type="button" 
                        uk-close={'true'}
                        onClick={(e) => handleCancel(e)}></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title">Commit you changes</h2>
                    </div>
                    <div className="uk-modal-body">
                        <div className="uk-margin">
                            <label className="uk-form-label">Use few words, but a lot of meaning (75 chars max)</label>
                            <input 
                                maxLength={76} 
                                className={`uk-input uk-margin ${commit.length >= 75 ? 'uk-form-danger' : ''}`} 
                                onChange={(e) => handleChange(e)} 
                                type="text" 
                                placeholder="Your short description..." 
                                value={commit} 
                                aria-label="Input" />
                        </div>
                    </div>
                    <div className="uk-modal-footer uk-text-right">
                        <button 
                            className="uk-button uk-button-default uk-modal-close uk-margin-small-right" 
                            type="button"
                            onClick={(e) => handleCancel(e)}
                            >Cancel</button>
                        <button className="uk-button uk-button-primary uk-modal-close" disabled={commit.length > 75 || !commit ? true : false} type="button" onClick={() => handleClick()}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GroupModal