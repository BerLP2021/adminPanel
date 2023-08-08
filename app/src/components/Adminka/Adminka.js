import React, { Component } from 'react'
import axios from 'axios';
import '../../helpers/iframeLoader.js';

import DOMHelpers from '../../helpers/domHelpers.js';
import EditorText from '../EditorText';
import EditorImg from '../EditorImg';
import AdminPanel from '../AdminPanel';
import UIkit from 'uikit';
import ConfirmModal from '../Modals/ConfirmModal';
import Spinner from '../Spinner';
import ChooseModal from '../Modals/ChooseModal';
import GroupModal from '../Modals/GroupModal';
import Icons from 'uikit/dist/js/uikit-icons';
import EditorMeta from '../EditorMeta';
import Login from '../Login';
UIkit.use(Icons);

export class Adminka extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pagesList: [],
            loading: true,
            newPageName: '',
            backupsList: [],
            auth: false,
            passValid: true
        }
        this.open = this.open.bind(this);
        this.init = this.init.bind(this);
        this.savePage = this.savePage.bind(this);
        this.loadBackupsList = this.loadBackupsList.bind(this);
        this.restoreBackups = this.restoreBackups.bind(this);
        this.onRemoveBackup = this.onRemoveBackup.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.checkAuth();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.auth !== prevState.auth) {
            if(this.state.auth) this.init();
        }
    }
    
    loadPagesList() {
        axios
            .get('./api/pageList.php')
            .then(res => this.setState({
                pagesList: res.data
        }));
    }
    
    init(page = this.currentPage) {
        this.iframe = document.querySelector('iframe');
        // this.currentPage = 'index.html';
        this.open(page);
        this.loadPagesList();
        this.loadBackupsList();
    }

    async open(page) {
        this.currentPage = page;
        this.isLoading();

        await axios
            .get(`../../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelpers.parseStrToDOM(res.data))
            .then(DOMHelpers.wrapTextNodes)
            .then(DOMHelpers.wrapImg)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelpers.serializeDOMToStr)
            .then(html => axios.post('./api/saveTempPage.php', { html }))
            .then(() => this.iframe.load('../../zye9w8yHdfw3542LB8noihhoH89ygU6ffyh65.html'))
            .then(() => axios.post('./api/deleteTempFile.php'))
            .then(() => this.enableEditing())
            .then(() => this.isLoaded());
        this.loadBackupsList();
    }

    enableEditing() {
        this.injectStyles();

        const wrappers = this.iframe.contentDocument.querySelectorAll('editor-tmp');

        wrappers.forEach(el => {
            const id = el.getAttribute('nodeid');
            const elCopied = this.virtualDom.body.querySelector(`[nodeid='${id}']`);

            new EditorText(el, elCopied);
        });

        const images = this.iframe.contentDocument.querySelectorAll('img');

        images.forEach(el => {
            const id = el.getAttribute('imgid');
            const elCopied = this.virtualDom.body.querySelector(`[imgid='${id}']`);

            new EditorImg(el, elCopied, this.isLoading, this.isLoaded, this.showNotification);
        });
    }

    async savePage(descr = '') {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(true);
        DOMHelpers.unwrapTextNodes(newDom);
        DOMHelpers.unwrapImg(newDom);
        const html = DOMHelpers.serializeDOMToStr(newDom);
        await axios
            .post('./api/savePage.php', {html, pageName: this.currentPage, descr})
            .then(() => this.showNotification('success'))
            .catch((err) => this.showNotification(err.message))
            .finally(() => this.isLoaded());
        this.loadBackupsList();
        
    }

    injectStyles() {
        const styles = this.iframe.contentDocument.createElement('style');
        styles.innerHTML = `
            editor-tmp:hover {
                outline: 2px solid orange;
                outline-offset: 4px;
            }
            editor-tmp:focus {
                outline: 2px solid red;
                outline-offset: 4px;
            }
            [imgid]:hover {
                outline: 2px solid orange;
                outline-offset: 4px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(styles);
    }

    showNotification(msg) {
        if(msg === 'success') {
            UIkit.notification("Successfully sent", {status: 'success', timeout: 1000});
            
        } else UIkit.notification(`Send error: ${msg}`, {status: 'danger', timeout: 1000});
    }

    isLoaded() {
        this.setState({
            loading: false
        });
    }

    isLoading() { 
        this.setState({
            loading: true
        });
    }

    loadBackupsList() {
        axios
            .get('./api/getBackupsList.php')
            .then((res) => this.setState({
                backupsList: res.data.filter(item => item.pageName === this.currentPage)
            }))
            
    }

    restoreBackups(backup) {
        this.isLoading();
        UIkit.modal.confirm("Confirm opening the previously saved file. All unsaved data will be lost", {i18n: {ok: 'Restore'}})
            .then(() => axios.post('./api/restoreBackups.php', {'file': backup, 'pageName': this.currentPage}))
            .then(() => this.isLoaded())
            .then(() => this.showNotification('success'))
            .then(() => this.open(this.currentPage))
            .catch((err) => {
                this.isLoaded();
                this.showNotification(err.message);
            })
    }

    async onRemoveBackup(file) {
        this.isLoading();
        await UIkit.modal.confirm('Are you sure you want to delete this backup?', {i18n: {ok: 'Delete'}})
            .then(() => axios.post('./api/deletePage.php', {"file": file}))
            .then(() => this.isLoaded())
            .then(() => this.showNotification('success'))
            // .catch((err) => alert(`Page isn't consist: ${err}` ))
            .catch((err) => {
                if(err) {
                    this.showNotification(err.message);
                }
            })
            .finally(() => this.isLoaded());
        this.loadBackupsList();
    }

    checkAuth() {
        axios.get('./api/checkAuth.php')
            .then(res => {
                this.setState({
                    auth: res.data.auth
                })
            })
    }

    async login(pass) {
        await this.setState({
            passValid: true
        });
        axios.post('./api/login.php', {"password": pass})
            .then(res => {
                this.setState({
                    auth: res.data.auth,
                    passValid: res.data.auth ? true : false
                })
            })
    }

    logout() {
        axios.get('./api/logout.php')
            .then(() => {
                window.location.replace('/');
            })

    }
  
    render() {
        const {pagesList, loading, backupsList, auth } = this.state;
        const spinner = loading ? <Spinner active /> : <Spinner />;
        
        if(!auth) {
            return (<Login login={this.login} passValid={this.state.passValid}/>); 
        }

        return (
            <>
                
                <AdminPanel />

                <iframe src=''></iframe>

                {/* <ConfirmModal 
                        method={this.savePage} 
                        target='modal-save'
                        text={{
                            title: "Warning!",
                            descr: "Are you sure you want to save the changes?",
                            btn: "Save"
                        }}
                        /> */}
                <GroupModal target="modal-group-save" method={this.savePage} />

                <ChooseModal 
                    data={pagesList} 
                    method={this.init} 
                    target="modal-open"/>
                <ChooseModal 
                    data={backupsList} 
                    method={this.restoreBackups} 
                    target="modal-backups" 
                    onDelete={this.onRemoveBackup}/>
                <ConfirmModal 
                    method={this.logout} 
                    target='modal-logout'
                    text={{
                        title: "Logout",
                        descr: "Do you really want to logout?",
                        btn: "Logout"
                    }} />

                { 
                    this.virtualDom ? 
                    <EditorMeta target="modal-meta" virtualDom={this.virtualDom}/> : 
                    null
                }

                {spinner}

                <input id='uploadInput' type='file' accept='image/*' style={{display: 'none'}}/>

            </>
        )
    }
} 

export default Adminka