import axios from "axios";

class EditorImg {
    constructor(el, elCopied, isLoading, isLoaded, showNotification) {
        this.el = el;
        this.elCopied = elCopied;
        this.isLoading = isLoading;
        this.isLoaded = isLoaded;
        this.showNotification = showNotification;
        this.el.addEventListener('click', () => this.onClick());
        this.uploadInput = document.querySelector('#uploadInput');
        this.postImg = this.postImg.bind(this);
    }

    onClick() {
        this.uploadInput.click();
        this.uploadInput.addEventListener('change', this.postImg, {once: true});
        
    }

    postImg() {
        const formData = new FormData();
        if (this.uploadInput.files && this.uploadInput.files[0]) {
            formData.append('image', this.uploadInput.files[0]);
            this.isLoading();

            axios.post('./api/uploadImage.php', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
                .then((res) => {
                    this.showNotification('success');
                    this.elCopied.src = this.el.src = res.data;
                })
                .catch((err) => this.showNotification(err.message))
                .finally(() => {
                    this.isLoaded();
                    this.uploadInput.value = '';
                    // this.uploadInput.removeEventListener('change', this.postImg);

                })
        }
    }
    
}
 
export default EditorImg;