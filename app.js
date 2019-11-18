
class Util {
    static arrayToClass = arr => arr.map(v => v.trim()).join(' ');
}


class TimerUI {

    constructor(node){
        this.node = node;
        this.setupUI();
    }

    _createHeaderNode = () => {
        let header = document.createElement('div');
        header.classList = Util.arrayToClass(['timer-header']);

        let title = document.createElement('span');
        title.innerText = 'Egghead Timer';
        title.classList = Util.arrayToClass(['title']);

        
        let subTitle = document.createElement('span');
        subTitle.innerText = 'Cook eggs easily';
        subTitle.classList = Util.arrayToClass(['subtitle']);

        //appending elements to the dom
        header.insertAdjacentElement("afterbegin", title);
        header.insertAdjacentElement("beforeend", subTitle);

        return header;
    }

    _createContentNode = () => {
        let content = document.createElement('div');
        content.classList = Util.arrayToClass(['timer-content']);

        let clockSpan = document.createElement('span');
        clockSpan.classList = Util.arrayToClass(['clock-text']);
        clockSpan.insertAdjacentText("afterbegin", "05:30");
        content.insertAdjacentElement('afterbegin', clockSpan);

        return content;
    }

    _createFooterNode = () => {
        let footer = document.createElement('div');
        footer.classList = Util.arrayToClass(['timer-footer']);

        let startBtn = document.createElement('button');
        startBtn.setAttribute('id', 'start');
        startBtn.classList = Util.arrayToClass(['start']);
        startBtn.insertAdjacentText('afterbegin', 'Start');

        let resetBtn = document.createElement('button');
        resetBtn.setAttribute('id', 'reset');
        resetBtn.insertAdjacentText('afterbegin', 'Reset');

        footer.insertAdjacentElement('afterbegin', startBtn);
        footer.insertAdjacentElement('beforeend', resetBtn);

        return footer;
    }

    setupUI(){
        let fragment = document.createDocumentFragment();

        let wrapper = document.createElement('section');
        wrapper.classList = Util.arrayToClass(['timer-wrapper']);

        wrapper.insertAdjacentElement('afterbegin', this._createHeaderNode());
        wrapper.insertAdjacentElement('beforeend', this._createContentNode());
        wrapper.insertAdjacentElement('beforeend', this._createFooterNode());

        fragment.appendChild(wrapper);

        while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
        this.node.appendChild(fragment);
    }

}


let timer = new TimerUI(document.getElementById('app'));