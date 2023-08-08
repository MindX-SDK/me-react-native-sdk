export default class MyEventEmitter<T extends string = string, TData extends any = any> {
    private _events: any;
    constructor() {
      this._events = {};
    }
  
    on(name: T, listener: (data: TData) => any) {
      if (!this._events[name]) {
        this._events[name] = [];
      }
  
      this._events[name].push(listener);

      return listener;
    }
  
    emit(name: T, data: TData) {
      // if (!this._events[name]) {
      //   throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
      // }
      if (!this._events[name]) {
        this._events[name] = [];
      }
  
      const fireCallbacks = (callback: (data: TData) => any) => {
        callback(data);
      };
  
      this._events[name].forEach(fireCallbacks);

      return this;
    }

    removeListener(name: T, listenerToRemove: ((data: TData) => any) | undefined) {
      if (!listenerToRemove) {
        return this;
      }

      if (!this._events[name]) {
        throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
      }
  
      const filterListeners = (listener: (data: TData) => any) => listener !== listenerToRemove;
  
      this._events[name] = this._events[name].filter(filterListeners);

      return this;
    }

    removeAllListeners() {

      this._events = {};

      return this;
    }
  }