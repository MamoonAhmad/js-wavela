
type ListenerCallback<T> = (state: T) => void;
declare var window: any;

interface GlobalStoreObject<T>{
    [key:string]: {
        listeners: ((state: T) => void)[];
        state: T
    }
}

export = (function(){
    const Store =  {
        _globalVar: null as any,
        subscribe: <T= any>(action: string, callback: ListenerCallback<T> , initialState?: T): T => {
            const store = Store.getStoreObject<T>();
            if(store[action]){
                if(initialState){
                    if(!Store.isObjectEqual(store[action].state, initialState)){
                        Store.dispatch<T>(action, initialState);
                    }
                }
                store[action].listeners.push(callback);
            }
            else{
                store[action] = {
                    listeners: [callback],
                    state: (initialState || ({} as T)),
                }
            }
            return store[action].state;
        },

        dispatch: <T>(action: string, state: T) => {
            const store = Store.getStoreObject<T>();

            if(store[action]){
                store[action].state = {...store[action].state, ...state};
                const newState = store[action].state;
                store[action].listeners.map(f => f(newState));
            }
        },

        unSubscribe: <T = any>(action: string, callback: ListenerCallback<T>) => {
            const store = Store.getStoreObject<T>();
            if(store[action]){
                const index = store[action].listeners.indexOf(callback);
                if(index >= 0)
                    store[action].listeners.splice(index, 1);
                if(store[action].listeners.length === 0)
                    delete store[action];
            }
        },

        getState: <T>(action: string): (T | undefined) => {
            console.log("getState Called");
            const store = Store.getStoreObject<T>();
            return store[action]?.state ||({names: []}) as unknown as T;
        },

        getStoreObject: <T>(): ( GlobalStoreObject<T> ) => {
            const global_store_key = "_______________REACT____________STORE_____________";
            // Every browser doesn't support globalThis
            // Every Node version doesn't supprt globalThis

            if(!Store._globalVar){
                try{
                    Store._globalVar = window;
                }
                catch(e){
                    Store._globalVar = global;
                }
            }

            if(!Store._globalVar[global_store_key]){
                Store._globalVar[global_store_key] = {} as GlobalStoreObject<T>;
            }

            return Store._globalVar[global_store_key];
        },

        isObjectEqual: (source: any, target: any ): boolean => {

            const checker = (sourceValue: any, targetValue: any) => {
                if(sourceValue instanceof Object && targetValue instanceof Object){
                    return Store.isObjectEqual(sourceValue, targetValue);
                }
                else
                    return sourceValue === targetValue;
            }

            if(source instanceof Array){
                return source.length !== target.length ? false : source.every((value, index) => checker(value, target[index]));
            }
            else{
                const keysSource = Object.getOwnPropertyNames(source);
                const keysTarget = Object.getOwnPropertyNames(target);
                const keysToUse: string[] = keysSource.length > keysTarget.length ? keysSource : keysTarget;
                return keysToUse.every(k => checker(source[k], target[k]));
            }
        }
    };
    return Store;
})();



