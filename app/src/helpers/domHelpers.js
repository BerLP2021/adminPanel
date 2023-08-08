export default class DOMHelpers {

    static parseStrToDOM(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    static wrapTextNodes(dom) {
        const body = dom.body;
        const textNodes = [];

        function nodeSearcher(el) {
            el.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '')){
                    textNodes.push(node);            
                } else {
                    nodeSearcher(node);
                } 
            })
        };

        nodeSearcher(body);

        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('editor-tmp');
            node.parentNode.style.overflow = 'visible';
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('nodeid', i);
        });

        return dom
    }

    static unwrapTextNodes(dom) {
        dom.body.querySelectorAll('editor-tmp').forEach(el => {
            el.parentNode.replaceChild(el.firstChild, el);
        })
    }

    static serializeDOMToStr(dom) {
        const s = new XMLSerializer();
        return s.serializeToString(dom);
    }

    static wrapImg(dom) {
        dom.body.querySelectorAll('img').forEach((img, i) => {
            img.setAttribute('imgid', i);
        }); 
        return dom;
    }

    static unwrapImg(dom) {
        dom.body.querySelectorAll('[imgid]').forEach(img => {
            img.removeAttribute('imgid');
        });
        return dom;
    }
}
