import PubSub from './pubsub.js';

class Util {
    static arrToClassList = arr => arr.map(v => v.trim()).join(' ');

    static pad0 = num => {
        return num < 10 ? '0' + num : num;
    }

    static secsToClock = (time) => {
        let min = Math.floor(time/60);
        let secs = (time%60).toFixed();
        return Util.pad0(min) + ':' + Util.pad0(secs);
    }

    static updateTextNode = (selector, value) => {
        document.querySelector(selector).innerText = value;
    }
}

class Timer {

    constructor(time){
        this.time = time;
        this.runningTimer = null;
    }

    toString = () => {
        return 'To be implemented';
    }

    start = () => {
        PubSub.publish('timerStarted');

        if (this.runningTimer){
            return this.runningTimer;
        }
        
        let localTime = this.time;
        this.runningTimer = setInterval(function intervalLogic(){
            --localTime;
            PubSub.publish('timeUpdated', localTime);
            if (!!localTime)
                this.stop();
        }, 1000);

        return this.runningTimer;
    }

    stop = () => {
        PubSub.publish('timerStopped');

        if (!this.runningTimer){
            
            return this.runningTimer;
        }
        clearInterval(this.runningTimer);
        this.runningTimer = null;
        return this.runningTimer;
    }

}

class TimerUI {

    constructor(node, time){
        this.node = node;
        this.time = time || 300;
        this.createView();
        this.timer = new Timer(time);
        this.subscribed = null;
        PubSub.subscribe('timerStarted', this._updateLabels);
        PubSub.subscribe('timerStopped', () => { this._updateLabels(true) });
    }

    _createHeaderNode = () => {
        let header = document.createElement('div');
        header.classList = Util.arrToClassList(['timer-header']);

        let title = document.createElement('span');
        title.innerText = 'Egghead Timer';
        title.classList = Util.arrToClassList(['title']);

        
        let subTitle = document.createElement('span');
        subTitle.innerText = 'Cook eggs easily';
        subTitle.classList = Util.arrToClassList(['subtitle']);

        //appending elements to the dom
        header.insertAdjacentElement("afterbegin", title);
        header.insertAdjacentElement("beforeend", subTitle);

        return header;
    }

    _createContentNode = () => {
        let content = document.createElement('div');
        content.classList = Util.arrToClassList(['timer-content']);

        let clockSpan = document.createElement('span');
        clockSpan.classList = Util.arrToClassList(['clock-text']);
        clockSpan.insertAdjacentText("afterbegin", Util.secsToClock(this.time));
        content.insertAdjacentElement('afterbegin', clockSpan);

        return content;
    }

    _createFooterNode = () => {
        let footer = document.createElement('div');
        footer.classList = Util.arrToClassList(['timer-footer']);

        let startBtn = document.createElement('button');
        startBtn.setAttribute('id', 'start');
        startBtn.classList = Util.arrToClassList(['start']);
        startBtn.insertAdjacentText('afterbegin', 'Start');

        let resetBtn = document.createElement('button');
        resetBtn.setAttribute('id', 'reset');
        resetBtn.classList = Util.arrToClassList(['reset']);
        resetBtn.insertAdjacentText('afterbegin', 'Reset');

        footer.insertAdjacentElement('afterbegin', startBtn);
        footer.insertAdjacentElement('beforeend', resetBtn);

        return footer;
    }

    createView(){
        let fragment = document.createDocumentFragment();

        let wrapper = document.createElement('section');
        wrapper.classList = Util.arrToClassList(['timer-wrapper']);

        wrapper.insertAdjacentElement('afterbegin', this._createHeaderNode());
        wrapper.insertAdjacentElement('beforeend', this._createContentNode());
        wrapper.insertAdjacentElement('beforeend', this._createFooterNode());

        fragment.appendChild(wrapper);

        while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
        this.node.appendChild(fragment);
    }

    _updateLabels(toReset) {
        let startBtn = document.getElementById('start');
        let resetBtn = document.getElementById('reset');

        if (toReset) {
            if (startBtn.textContent === ('Pause' || 'Stop')) {
                startBtn.innerText = 'Start';
            }   
            if (resetBtn.textContent === 'Stop') {
                resetBtn.innerText = 'Reset';
            }
            // Util.updateTextNode('span.clock-text', Util.secsToClock(this.time));
            return;
        }
        startBtn.innerText = 'Pause';
        resetBtn.innerText = 'Stop';
    }

    start = () => {
        this.timer.start();
        this.subscribed = PubSub.subscribe('timeUpdated', (data) => {
            Util.updateTextNode('span.clock-text', Util.secsToClock(data));
        });
    }

    stop = () => {
        this.subscribed.unsubscribe();
        this.timer.stop();
    }

}


let timerUI = new TimerUI(document.getElementById('app'),330);

document.getElementById('start').addEventListener('click', timerUI.start);
document.getElementById('reset').addEventListener('click', timerUI.stop);
