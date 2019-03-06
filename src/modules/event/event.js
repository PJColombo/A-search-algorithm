import { threadId } from "worker_threads";

class Event {
    constructor(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    attach(listener) {
        this._listeners.push(listener);
    }
    
    notify(args) {
        this._listeners.forEach(l => {
            l(this._sender, args);
        });
    }
}