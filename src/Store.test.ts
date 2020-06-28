import Store from "./Store"
import { assert } from "console";

function initStore(name: string, fn: (state:any) => void, initialstate?: any){
    Store.subscribe(name, fn, initialstate);
}
function callback(){
    assert(true, "State Action Listener Success");
}
const store_string = "_______________REACT____________STORE_____________";
function getStore(){
    return (global as any)[store_string];
}

test("Testing Store Init", () => {
    initStore("test1", callback)
    expect(getStore()).toStrictEqual({"test1": {listeners: [callback], state: {}}});
})


test("Test initial state", () => {
    initStore("test2", callback, {names: ["1"]});
    expect(getStore()["test2"]).toStrictEqual({listeners: [callback], state: {names: ["1"]}});
    initStore("test2", callback, {names: ["1", "2"]});
    expect(getStore()["test2"]).toStrictEqual({listeners: [callback, callback], state: {names: ["1", "2"]}});
})

test("Dispatch test", () => {
    initStore("dispatchtest", callback, {names: ["1"]});
    expect(getStore()["dispatchtest"]).toStrictEqual({listeners: [callback], state: {names: ["1"]}});
    Store.dispatch("dispatchtest", {names: 22})
    expect(getStore()["dispatchtest"]).toStrictEqual({listeners: [callback], state: {names: 22}});
})

test("Callback test and multiple listeners", () => {
    const fn = (state: any) => {
        expect(state).toStrictEqual({names: ["Person"]})
    }
    const fn1 = (state: any) => {
        expect(state).toStrictEqual({names: ["Person"]})
    }
    initStore("test3", fn);
    initStore("test3", fn1);
    Store.dispatch("test3", {names: ["Person"]})
    expect(getStore()["test3"]).toStrictEqual({listeners: [fn, fn1], state: {names: ["Person"]}});
})

test("Unsubscribe test", () => {
    const fn = () => {
        assert(true, "State Listener worked");}
    initStore("test4", fn);
    initStore("test4", fn);
    expect(getStore()["test4"]).toStrictEqual({listeners: [fn, fn], state: {}});
    Store.unSubscribe("test4", fn);
    expect(getStore()["test4"]).toStrictEqual({listeners: [fn], state: {}});
    Store.unSubscribe("test4", fn);
    expect(getStore()["test4"]).toBe(undefined);
})


