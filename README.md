# js-wavela

A simple javascript state management library without any complexity. You have an action and a state attached to that action. Whenever a change is dispatched all listeners will get the updated state. Isn't this what every other state management does? Yes, but this library makes this process really simple. Check out examples below.

There is no concept of store. Everything is an action and against an action there is a state attached to it. To subscribe to an action just use subscribe method.

    import Store from "js-wavela";
	const callback = (state: YourStateInterface) => { /* Do something with this state */ }
    Store.subscribe<YourStateInterface>("Action_Name", callback);
    Store.dispatch("Action_Name", {property_in_state_to_change: "New Value"});
    Store.unsubscribe("Action_Name", callback);

## Initial State

If you don't provide initial state in `Store.subscribe` method state will be an object without any properties. But if same action is initialized with two different initial states, new state will merge with existing state and all the listeners will be called with the updated state.

    Store.subscribe("shops", callback1, {names: ["1"]});
At this point state is initialized against shops actions and state is as follows
	
    {
	    names: ["1"]
    }
Now if we subscribe again to the same action with the initial state

    Store.subscribe("shops", callback2, {addresses: ["some_address"]});
    
State for shops is now 

    {
	    names: ["1"],
	    addresses: ["some_address"]
    }
After the second subscribe call to shops, all the listeners will be called with the updated state (in this case `callback1`) except for `callback2`. Assumption here is that, since `callback2` came along with the updated state it already knows whats up as subscribe method also return the updated state.

## Unsubscribe

To unsubscribe listening to an action, just use `Store.unsubscribe` and pass the action name and callback. Callback's reference should be the same as it searches for that callback in the array. **Note that if there are no more listeners for a particular action (meaning all of them unsubscribed), state will be deleted from the store.**


Feel free to contribute or suggest any thing. Thank you.
