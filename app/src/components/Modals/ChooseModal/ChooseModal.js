import React from 'react'

const ChooseModal = ({ target, data, method, onDelete}) => {
    
    const handleDelete = (data) => {
            onDelete(data);
        }

    const list = data.map((item, i) => {
        return !item.time ? 
            (<li key={i}>
                <a className='uk-modal-close uk-link-muted' 
                    href='#' 
                    onClick={(e) => { 
                        e.preventDefault();
                        method(item);
                    }}>
                    {item}
                </a>
            </li>) :
            (<li key={i}>
                <div className="commit-wrapper">
                    <a className='uk-modal-close uk-link-muted uk-margin-small-right' 
                        href='#' 
                        onClick={(e) => { 
                            e.preventDefault();
                            method(item.file);
                        }}>
                        {item.descr} from {item.time}
                    </a>
                    <span 
                        className='trash uk-icon-button uk-modal-close' 
                        uk-icon="icon: trash" 
                        onClick={() => handleDelete(item.file)}></span>
                </div>
            </li>)
    });

    const title = onDelete ? 
                    'Select the required backup' : 
                    'Select the required page';
    
    const content = data.length ? 
        (
            <ul className="uk-list uk-list-divider">
                {list}
            </ul>    
        ) :
        (
            <div className="commit-wrapper">
                <span className='uk-text-muted uk-margin'>No saved data yet</span>
            </div>
        );

    return (
    
        <div id={target} uk-modal='true' container='false'>
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" 
                    type="button" 
                    uk-close='true'>
                </button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">{title}</h2>
                </div>
                <div className="uk-modal-body" uk-overflow-auto='true'>
                    { content }
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button 
                        className="uk-button uk-button-default uk-modal-close" 
                        type="button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChooseModal;