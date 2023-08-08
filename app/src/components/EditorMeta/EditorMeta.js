import React, {Component} from "react";
import UIkit from 'uikit';

class EditorMeta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {
                title: '',
                description: '',
                keywords: ''
            },
            titleLenErr: false,
            descrLenErr: false
        }
        this.applyMeta = this.applyMeta.bind(this);
    }

    countTitleLen(str) {
        const _test = document.createElement('div');
        document.body.appendChild(_test);
        _test.style.cssText = "display: inline; position: absolute; opacity:0";
        _test.innerHTML = str;
        const len = _test.offsetWidth;
        document.body.removeChild(_test);
        return len;  
    }

    handleChange(e) {
        switch(e.target.getAttribute('data-target')) {
            case 'title':
                this.setState(state => ({ 
                    meta: {
                        ...state.meta,
                        title: e.target.value
                        },
                    titleLenErr: false
                }));
                break;
            case 'description':
                this.setState(state => ({
                    meta: {
                        ...state.meta,
                        description: e.target.value
                        },
                    descrLenErr: false
                }));
                break;
            case 'keywords':
                this.setState(state => ({
                    meta: {
                        ...state.meta,
                        keywords: e.target.value
                        }
                    })
                );
                break;
        }
    }

    onBlur(e) {
        let len;
        len = this.countTitleLen(e.target.value);
        switch(e.target.getAttribute('data-target')) {
            case 'title':
                if(len > 600) {
                    this.setState({ 
                        titleLenErr: true
                    });
                }
                break;
            case 'description':
                if(len > 930) {
                    this.setState({
                        descrLenErr: true
                    });
                }
                break;
        }
    }

    getInitialMeta(dom) {
        this.title = dom.head.querySelector('title') || dom.head.appendChild(dom.createElement('title'));

        this.descr = dom.head.querySelector("meta[name='description']");
        if (!this.descr) {
            this.descr = dom.head.appendChild(dom.createElement('meta'));
            this.descr.setAttribute('name', 'description');
            this.descr.setAttribute('content', '');
        } else {
            
            if(!this.descr.getAttribute('content')) {
                this.descr.setAttribute('content', '');
            }
        }

        this.keywords = dom.head.querySelector("meta[name='keywords']");
        if (!this.keywords) {
            this.keywords = dom.head.appendChild(dom.createElement('meta'));
            this.keywords.setAttribute('name', 'keywords');
            this.keywords.setAttribute('content', '');
        } else {
            if(!this.keywords.getAttribute('content')) {
                this.keywords.setAttribute('content', '');
            }
        }

        const setCurValue = () => {
            this.setState({
                meta: {
                    keywords: this.keywords.getAttribute('content'),
    
                    title: this.title.textContent,
                    
                    description: this.descr.getAttribute('content')
                },
                titleLenErr: false,
                descrLenErr: false
            });
        }
        setCurValue();
        UIkit.util.on(`#${this.props.target}`, 'hidden', () => {
            setCurValue();
        });
    }

    applyMeta() {
        const {descrLenErr, titleLenErr} = this.state;
 
        if(!descrLenErr && !titleLenErr) {
            this.title.textContent = this.state.meta.title;
            this.descr.setAttribute('content', this.state.meta.description);
            this.keywords.setAttribute('content', this.state.meta.keywords);
            UIkit.modal(`#${this.props.target}`).hide();
        }
    }

    componentDidMount() {
        this.getInitialMeta(this.props.virtualDom);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.virtualDom !== prevProps.virtualDom) {
            this.getInitialMeta(this.props.virtualDom);
        }
    }
    
    render() { 
        const {target} = this.props;
        const {titleLenErr, descrLenErr} = this.state;
        const {title, description, keywords} = this.state.meta;
        
        let titleLen, descrLen;
        titleLen =  titleLenErr ? 
            (<span className="error uk-margin-bottom">Title length exceeded 600px</span>) :
            null;
        descrLen =  descrLenErr ? 
            (<span className="error uk-margin-bottom">Description length exceeded 930px</span>) :
            null;
        
        const applyDisabled = !descrLenErr && !titleLenErr ? false :  true;

        return ( 
            
            <div id={target} uk-modal='true' container='false'>
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" 
                    type="button" 
                    uk-close='true'>
                </button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Editing meta tags</h2>
                </div>
                <div className="uk-modal-body">
                    <form className="uk-form-horizontal uk-margin-large">
                        <div className="uk-margin">
                            <label className="uk-form-label" htmlFor="title">Title</label>
                            <div className="uk-form-controls uk-margin">
                                <input 
                                    data-target='title'
                                    className={`uk-input ${titleLenErr ? "uk-form-danger" : ""}`} 
                                    id="title" 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => this.handleChange(e)}
                                    onBlur={(e) => this.onBlur(e)}
                                    placeholder="Some text" />
                                {titleLen}
                            </div>
                            
                            <label className="uk-form-label" htmlFor="descr">Description</label>
                            <div className="uk-form-controls uk-margin">
                                <textarea 
                                    data-target='description'
                                    className="uk-textarea" 
                                    id='descr'
                                    rows="5" 
                                    placeholder="Your description" 
                                    value={description} 
                                    onChange={(e) => this.handleChange(e)}
                                    onBlur={(e) => this.onBlur(e)}
                                    aria-label="Textarea"></textarea>
                                {descrLen}
                            </div>
                            <label className="uk-form-label" htmlFor="keywords">Keywords</label>
                            <div className="uk-form-controls uk-margin">
                                <textarea 
                                    data-target='keywords'
                                    id='keywords'
                                    className="uk-textarea" 
                                    rows="5" 
                                    placeholder="Your keywords"
                                    value={keywords}
                                    onChange={(e) => this.handleChange(e)}
                                    aria-label="Textarea"></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close uk-margin-small-right" 
                        type="button">
                        Cancel
                    </button> 
                    <button className="uk-button uk-button-primary" 
                        type="button"
                        disabled={applyDisabled}
                        onClick={this.applyMeta}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
        );
    }
}
 
export default EditorMeta;