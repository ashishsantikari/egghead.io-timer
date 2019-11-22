class PubSub {

    constructor() {
        this._subscribers = {};
    }

    publish = (event, data) => {
        if (!this._subscribers[event]) return;
        this._subscribers[event].forEach(subscriberCallback => {
            subscriberCallback(data);
        });
    }

    subscribe = (event, callback) => {
        if (!this._subscribers[event]){
            this._subscribers[event] = [];
        }
        let index = this._subscribers[event].push(callback) - 1;
        return {
            unsubscribe:  () => {
                this._subscribers[event].splice(index, 1);
            }
        }
    }
}

export default new PubSub();