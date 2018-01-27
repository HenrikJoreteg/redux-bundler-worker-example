(function () {
'use strict';

function calc(m) {
    return function(n) { return Math.round(n * m); };
}
var milliseconds = {
    seconds: calc(1e3),
    minutes: calc(6e4),
    hours: calc(36e5),
    days: calc(864e5),
    weeks: calc(6048e5),
    months: calc(26298e5),
    years: calc(315576e5)
};

var appTimeBundle = {
  name: 'appTime',
  reducer: Date.now,
  selectAppTime: function (state) { return state.appTime; }
}

var changes = {
  'START': 1,
  'SUCCESS': -1,
  'ERROR': -1
};

var re = /_(START|SUCCESS|ERROR)$/;

var asyncCount = {
  name: 'asyncCount',
  reducer: function (state, ref) {
    if ( state === void 0 ) state = 0;
    var type = ref.type;

    var result = re.exec(type);
    if (!result) { return state }
    return state + changes[result[1]]
  },
  selectAsyncActive: function (state) { return state.asyncCount > 0; }
}

function debugMiddleware (store) { return function (next) { return function (action) {
  var isDebug = store.getState().debug;

  if (isDebug) {
    console.group(action.type);
    console.info('action:', action);
  }

  var result = next(action);

  if (isDebug) {
    console.debug('state:', store.getState());
    self.logSelectors && self.logSelectors();
    self.logNextReaction && self.logNextReaction();
    console.groupEnd(action.type);
  }

  return result
}; }; }

function namedActionMiddleware (store) { return function (next) { return function (action) {
  var actionCreator = action.actionCreator;
  var args = action.args;
  if (actionCreator) {
    var found = store.meta.unboundActionCreators[actionCreator];
    if (!found) {
      throw Error(("NoSuchActionCreator: " + actionCreator))
    }
    return next(args ? found.apply(void 0, args) : found())
  }
  return next(action)
}; }; }

function thunkMiddleware (extraArgCreators) { return function (store) {
  var extraArgs = extraArgCreators.reduce(function (result, fn) { return Object.assign(result, fn(store)); }
  , {});
  return function (next) { return function (action) {
    if (typeof action === 'function') {
      var getState = store.getState;
      var dispatch = store.dispatch;
      return action(Object.assign({}, {getState: getState, dispatch: dispatch, store: store}, extraArgs))
    }
    return next(action)
  }; }
}; }

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

var Symbol = root.Symbol;

var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$2;

if (typeof self !== 'undefined') {
  root$2 = self;
} else if (typeof window !== 'undefined') {
  root$2 = window;
} else if (typeof global !== 'undefined') {
  root$2 = global;
} else if (typeof module !== 'undefined') {
  root$2 = module;
} else {
  root$2 = Function('return this')();
}

var result = symbolObservablePonyfill(root$2);

var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */

function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  var arguments$1 = arguments;

  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments$1[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

// Modified to expose all of `store` to middleware instead of just
// `getState` and `dispatch`
function customApplyMiddleware () {
  var middlewares = [], len = arguments.length;
  while ( len-- ) middlewares[ len ] = arguments[ len ];

  return function (createStore$$1) { return function (reducer, preloadedState, enhancer) {
  var store = createStore$$1(reducer, preloadedState, enhancer);
  var dispatch = store.dispatch;
  var chain = [];
  chain = middlewares.map(function (middleware) { return middleware(store); });
  dispatch = compose.apply(void 0, chain)(store.dispatch);
  return Object.assign(store, { dispatch: dispatch })
}; };
}

function defaultEqualityCheck(a, b) {
  return a === b;
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

function defaultMemoize(func) {
  var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;

  var lastArgs = null;
  var lastResult = null;
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments);
    }

    lastArgs = arguments;
    return lastResult;
  };
}

function getDependencies(funcs) {
  var dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs;

  if (!dependencies.every(function (dep) {
    return typeof dep === 'function';
  })) {
    var dependencyTypes = dependencies.map(function (dep) {
      return typeof dep;
    }).join(', ');
    throw new Error('Selector creators expect all input-selectors to be functions, ' + ('instead received the following types: [' + dependencyTypes + ']'));
  }

  return dependencies;
}

function createSelectorCreator(memoize) {
  var arguments$1 = arguments;

  for (var _len = arguments.length, memoizeOptions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    memoizeOptions[_key - 1] = arguments$1[_key];
  }

  return function () {
    var arguments$1 = arguments;

    for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      funcs[_key2] = arguments$1[_key2];
    }

    var recomputations = 0;
    var resultFunc = funcs.pop();
    var dependencies = getDependencies(funcs);

    var memoizedResultFunc = memoize.apply(undefined, [function () {
      recomputations++;
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments);
    }].concat(memoizeOptions));

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    var selector = defaultMemoize(function () {
      var arguments$1 = arguments;

      var params = [];
      var length = dependencies.length;

      for (var i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments$1));
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params);
    });

    selector.resultFunc = resultFunc;
    selector.recomputations = function () {
      return recomputations;
    };
    selector.resetRecomputations = function () {
      return recomputations = 0;
    };
    return selector;
  };
}

var createSelector = createSelectorCreator(defaultMemoize);

var ensureFn = function (obj, name) {
  if (typeof name !== 'string') {
    return name
  }
  var found = obj[name];
  if (!found) {
    throw Error('No selector ' + name + ' found on the obj.')
  }
  return found
};

var createSelector$1 = function () {
  var fns = [], len = arguments.length;
  while ( len-- ) fns[ len ] = arguments[ len ];

  var resultFunc = fns.slice(-1)[0];
  var deferredSelector = function (obj, deps) {
    var newArgs = deps.map(function (fn) { return ensureFn(obj, fn); });
    newArgs.push(resultFunc);
    return createSelector.apply(void 0, newArgs)
  };
  deferredSelector.deps = fns.slice(0, -1);
  deferredSelector.resultFunc = resultFunc;
  return deferredSelector
};

var resolveSelectors = function (obj) {
  // an item is resolved if it is either a
  // function with no dependencies or if
  // it's on the object with no dependencies
  var isResolved = function (name) { return (name.call && !name.deps) || !obj[name].deps; };

  // flag for checking if we have *any*
  var hasAtLeastOneResolved = false;

  // extract all deps and any resolved items
  var loop = function ( selectorName ) {
    var fn = obj[selectorName];
    if (!isResolved(selectorName)) {
      fn.deps = fn.deps.map(function (val, index) {
        // if it is a function not a string
        if (val.call) {
          // look for it already on the object
          for (var key in obj) {
            if (obj[key] === val) {
              // return its name if found
              return key
            }
          }
          // we didn't find it and it doesn't have a name
          // but if it's a fully resolved selector that's ok
          if (!val.deps) {
            hasAtLeastOneResolved = true;
            return val
          }
        }

        // the `val` is a string that exists on the object return the string
        // we'll resolve it later
        if (obj[val]) { return val }

        // if we get here, its a string that doesn't exist on the object
        // which won't work, so we throw a helpful error
        throw Error(("The input selector at index " + index + " for '" + selectorName + "' is missing from the object passed to resolveSelectors()"))
      });
    } else {
      hasAtLeastOneResolved = true;
    }
  };

  for (var selectorName in obj) loop( selectorName );

  if (!hasAtLeastOneResolved) {
    throw Error("You must pass at least one real selector. If they're all string references there's no")
  }

  var depsAreResolved = function (deps) { return deps.every(isResolved); };

  var resolve = function () {
    var hasUnresolved = false;
    for (var selectorName in obj) {
      var fn = obj[selectorName];
      if (!isResolved(selectorName)) {
        hasUnresolved = true;
        if (depsAreResolved(fn.deps)) {
          obj[selectorName] = fn(obj, fn.deps);
        }
      }
    }
    return hasUnresolved
  };

  var startTime;
  while (resolve()) {
    if (!startTime) { startTime = Date.now(); }
    var duration = Date.now() - startTime;
    if (duration > 500) {
      throw Error('Could not resolve selector dependencies.')
    }
  }

  return obj
};

var debug = false;
try { debug = !!window.localStorage.debug; } catch (e) {}
var HAS_DEBUG_FLAG = debug;
var HAS_WINDOW = typeof window !== 'undefined';
var IS_BROWSER = HAS_WINDOW || typeof self !== 'undefined';

var fallback = function (func) { setTimeout(func, 0); };
var raf = IS_BROWSER && self.requestAnimationFrame || fallback;
var ric = IS_BROWSER && self.requestIdleCallback || fallback;

var startsWith = function (string, searchString) { return string.substr(0, searchString.length) === searchString; };





var addGlobalListener = function (eventName, handler) {
  if (IS_BROWSER) {
    self.addEventListener(eventName, handler);
  }
};

var selectorNameToValueName = function (name) {
  var start = name[0] === 's' ? 6 : 5;
  return name[start].toLowerCase() + name.slice(start + 1)
};

var debounce = function (fn, wait) {
  var timeout;
  var debounced = function () {
    var ctx = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(ctx, args);
    }, wait);
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
  };
  return debounced
};

var obj;
var normalizeBundle = function (bundle) {
  var name = bundle.name;
  if (!name) { throw TypeError('bundles must have a "name" property') }
  var result = {
    name: name,
    reducer: bundle.reducer || (bundle.getReducer && bundle.getReducer()) || null,
    init: bundle.init || null,
    extraArgCreators: bundle.getExtraArgs || null,
    middlewareCreators: bundle.getMiddleware,
    actionCreators: null,
    selectors: null,
    reactorNames: null,
    rawBundle: bundle
  };
  Object.keys(bundle).forEach(function (key) {
    if (startsWith(key, 'do')) {
      (result.actionCreators || (result.actionCreators = {}))[key] = bundle[key];
      return
    }
    var isSelector = startsWith(key, 'select');
    var isReactor = startsWith(key, 'react');
    if (isSelector || isReactor) {
      (result.selectors || (result.selectors = {}))[key] = bundle[key];
      if (isReactor) {
        (result.reactorNames || (result.reactorNames = [])).push(key);
      }
      return
    }
  });
  return result
};

var createChunk = function (rawBundles) {
  var normalizedBundles = rawBundles.map(normalizeBundle);
  var result = {
    bundleNames: [],
    reducers: {},
    selectors: {},
    actionCreators: {},
    rawBundles: [],
    processedBundles: [],
    initMethods: [],
    middlewareCreators: [],
    extraArgCreators: [],
    reactorNames: []
  };
  normalizedBundles.forEach(function (bundle) {
    result.bundleNames.push(bundle.name);
    Object.assign(result.selectors, bundle.selectors);
    Object.assign(result.actionCreators, bundle.actionCreators);
    if (bundle.reducer) { Object.assign(result.reducers, ( obj = {}, obj[bundle.name] = bundle.reducer, obj)); }
    if (bundle.init) { result.initMethods.push(bundle.init); }
    if (bundle.middlewareCreators) { result.middlewareCreators.push(bundle.middlewareCreators); }
    if (bundle.extraArgCreators) { result.extraArgCreators.push(bundle.extraArgCreators); }
    if (bundle.reactorNames) { (ref = result.reactorNames).push.apply(ref, bundle.reactorNames); }
    result.processedBundles.push(bundle);
    result.rawBundles.push(bundle.rawBundle);
    var ref;
  });
  return result
};

function addBindingMethods (store) {
  store.subscriptions = {
    watchedValues: {}
  };
  var subscriptions = store.subscriptions.set = new Set();
  var watchedSelectors = store.subscriptions.watchedSelectors = {};

  var watch = function (selectorName) {
    watchedSelectors[selectorName] = (watchedSelectors[selectorName] || 0) + 1;
  };
  var unwatch = function (selectorName) {
    var count = watchedSelectors[selectorName] - 1;
    if (count === 0) {
      delete watchedSelectors[selectorName];
    } else {
      watchedSelectors[selectorName] = count;
    }
  };

  // add single store subscription for tracking watched changes
  store.subscribe(function () {
    var newValues = watchedSelectors.all ? store.selectAll() : store.select(Object.keys(watchedSelectors));
    var ref = store.subscriptions;
    var watchedValues = ref.watchedValues;

    // the only diffing in the app happens here
    var changed = {};
    for (var key in newValues) {
      var val = newValues[key];
      if (val !== watchedValues[key]) {
        changed[key] = val;
      }
    }

    store.subscriptions.watchedValues = newValues;

    // look through subscriptions to trigger
    subscriptions.forEach(function (subscription) {
      var relevantChanges = {};
      var hasChanged = false;
      if (subscription.names === 'all') {
        Object.assign(relevantChanges, changed);
        hasChanged = !!Object.keys(relevantChanges).length;
      } else {
        subscription.names.forEach(function (name) {
          if (changed.hasOwnProperty(name)) {
            relevantChanges[name] = changed[name];
            hasChanged = true;
          }
        });
      }
      if (hasChanged) {
        subscription.fn(relevantChanges);
      }
    });
  });

  // this exists separately in order to support
  // subscribing to all changes even after lazy-loading
  // additional bundles
  store.subscribeToAllChanges = function (callback) { return store.subscribeToSelectors('all', callback); };

  // given an array of selector names, it will call the
  // callback any time those have changed with an object
  // containing only changed values
  store.subscribeToSelectors = function (keys, callback) {
    var isAll = keys === 'all';
    // re-use loop for double duty
    // extract names, but also ensure
    // selector actually exists on store
    var subscription = {
      fn: callback,
      names: isAll ? 'all' : keys.map(selectorNameToValueName)
    };
    subscriptions.add(subscription);
    isAll ? watch('all') : keys.forEach(watch);

    // make sure starting values are in watched so we can
    // track changes
    Object.assign(store.subscriptions.watchedValues, isAll ? store.selectAll() : store.select(keys));

    // return function that can be used to unsubscribe
    return function () {
      subscriptions.delete(subscription);
      isAll ? unwatch('all') : keys.forEach(unwatch);
    }
  };
}

var bindSelectorsToStore = function (store, selectors) {
  var loop = function ( key ) {
    var selector = selectors[key];
    if (!store[key]) {
      store[key] = function () { return selector(store.getState()); };
    }
  };

  for (var key in selectors) loop( key );
};

var decorateStore = function (store, processed) {
  if (!store.meta) {
    store.meta = {
      chunks: [],
      unboundSelectors: {},
      unboundActionCreators: {},
      reactorNames: []
    };
  }

  var meta = store.meta;

  // attach for reference
  meta.chunks.push(processed);

  // grab existing unbound (but resolved) selectors, combine with new ones
  var combinedSelectors = Object.assign(meta.unboundSelectors, processed.selectors);

  // run resolver
  resolveSelectors(combinedSelectors);

  // update collection of resolved selectors
  meta.unboundSelectors = combinedSelectors;

  // make sure all selectors are bound (won't overwrite if already bound)
  bindSelectorsToStore(store, combinedSelectors);

  // build our list of reactor names
  meta.reactorNames = meta.reactorNames.concat(processed.reactorNames);

  // extend global collections with new stuff
  Object.assign(meta.unboundActionCreators, processed.actionCreators);

  // bind and attach only the next action creators to the store
  Object.assign(store, bindActionCreators(processed.actionCreators, store.dispatch));

  // run any new init methods
  processed.initMethods.forEach(function (fn) { return fn(store); });
};

var enableBatchDispatch = function (reducer) { return function (state, action) {
  if (action.type === 'BATCH_ACTIONS') {
    return action.actions.reduce(reducer, state)
  }
  return reducer(state, action)
}; };

var composeBundles = function () {
  var bundles = [], len = arguments.length;
  while ( len-- ) bundles[ len ] = arguments[ len ];

  // build out object of extracted bundle info
  var firstChunk = createChunk(bundles);
  return function (data) {
    // actually init our store
    var store = createStore(
      enableBatchDispatch(combineReducers(firstChunk.reducers)),
      data,
      customApplyMiddleware.apply(void 0, [
        namedActionMiddleware,
        thunkMiddleware(firstChunk.extraArgCreators),
        debugMiddleware ].concat( firstChunk.middlewareCreators.map(function (fn) { return fn(firstChunk); })
      ))
    );

    // upgrade dispatch to take multiple and automatically
    // batch dispatch in that case
    var dispatch = store.dispatch;
    store.dispatch = function () {
        var actions = [], len = arguments.length;
        while ( len-- ) actions[ len ] = arguments[ len ];

        return dispatch(actions.length > 1 ? {type: 'BATCH_ACTIONS', actions: actions} : actions[0]);
    };

    // get values from an array of selector names
    store.select = function (selectorNames) { return selectorNames.reduce(function (obj, name) {
        if (!store[name]) { throw Error(("SelectorNotFound " + name)) }
        obj[selectorNameToValueName(name)] = store[name]();
        return obj
      }, {}); };

    // get all values from all available selectors (even if added later)
    store.selectAll = function () { return store.select(Object.keys(store.meta.unboundSelectors)); };

    // add support for dispatching an action by name
    store.action = function (name, args) { return store[name].apply(store, args); };

    // add all the gathered bundle data into the store
    decorateStore(store, firstChunk);

    // adds support for subscribing to changes from an array of selector strings
    addBindingMethods(store);

    // defines method for integrating other bundles later
    store.integrateBundles = function () {
      var bundlesToIntegrate = [], len = arguments.length;
      while ( len-- ) bundlesToIntegrate[ len ] = arguments[ len ];

      decorateStore(store, createChunk(bundlesToIntegrate));
      var allReducers = store.meta.chunks.reduce(function (accum, chunk) { return Object.assign(accum, chunk.reducers); }, {});
      store.replaceReducer(enableBatchDispatch(combineReducers(allReducers)));
    };

    return store
  }
};

// regexes borrowed from backbone
var optionalParam = /\((.*?)\)/g;
var namedParam = /(\(\?)?:\w+/g;
var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
var splatParam = /\*/g;

// Parses a URL pattern such as `/users/:id`
// and builds and returns a regex that can be used to
// match said pattern. Credit for these
// regexes belongs to Jeremy Ashkenas and the
// other maintainers of Backbone.js
//
// It has been modified for extraction of
// named paramaters from the URL
var parsePattern = function (pattern) {
  var names = [];
  pattern = pattern
    .replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, function (match, optional) {
      names.push(match.slice(1));
      return optional ? match : '([^/?]+)'
    })
    .replace(splatParam, function (match, optional) {
      names.push('path');
      return '([^?]*?)'
    });

  return {
    regExp: new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$'),
    namedParams: names
  }
};

var featherRouteMatcher = function (routes, fallback) {
  var keys = Object.keys(routes);

  // loop through each route we're
  // and build the shell of our
  // route cache.
  for (var item in routes) {
    routes[item] = {
      value: routes[item]
    };
  }

  // main result is a function that can be called
  // with the url
  return function (url) {
    var params;
    var route;

    // start looking for matches
    var matchFound = keys.some(function (key) {
      var parsed;

      // fetch the route pattern from the cache
      // there will always be one
      route = routes[key];

      // if the route doesn't already have
      // a regex we never generated one
      // so we do that here lazily.
      // Parse the pattern to generate the
      // regex once, and store the result
      // for next time.
      if (!route.regExp) {
        parsed = parsePattern(key);
        route.regExp = parsed.regExp;
        route.namedParams = parsed.namedParams;
        route.pattern = key;
      }

      // run our cached regex
      var result = route.regExp.exec(url);

      // if null there was no match
      // returning falsy here continues
      // the `Array.prototype.some` loop
      if (!result) {
        return
      }

      // remove other cruft from result
      result = result.slice(1, -1);

      // reduce our match to an object of named paramaters
      // we've extracted from the url
      params = result.reduce(function (obj, val, index) {
        if (val) {
          obj[route.namedParams[index]] = val;
        }
        return obj
      }, {});

      // stops the loop
      return true
    });

    // no routes matched
    if (!matchFound) {
      if (fallback) {
        return {
          page: fallback,
          url: url,
          params: null
        }
      }
      return null
    }

    return {
      page: route.value,
      params: params,
      url: url,
      pattern: route.pattern
    }
  }
};

function createRoutingBundle (routes) { return ({
  name: 'routes',
  selectRouteInfo: createSelector$1('selectPathname', featherRouteMatcher(routes)),
  selectRouteParams: createSelector$1('selectRouteInfo', function (ref) {
    var params = ref.params;

    return params;
  }),
  selectCurrentComponent: createSelector$1('selectRouteInfo', function (ref) {
    var page = ref.page;

    return page;
  })
}); }

var OFFLINE = 'OFFLINE';
var ONLINE = 'ONLINE';

var onlineBundle = {
  name: 'online',
  selectIsOnline: function (state) { return state.online; },
  reducer: function (state, ref) {
    if ( state === void 0 ) state = true;
    var type = ref.type;

    if (type === OFFLINE) { return false }
    if (type === ONLINE) { return true }
    return state
  },
  init: function (store) {
    addGlobalListener('online', function () { return store.dispatch({type: ONLINE}); });
    addGlobalListener('offline', function () { return store.dispatch({type: OFFLINE}); });
  }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var idbKeyval = createCommonjsModule(function (module) {
(function() {
  var db;

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open('keyval-store', 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          openreq.result.createObjectStore('keyval');
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction('keyval', type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore('keyval'));
      });
    });
  }

  var idbKeyval = {
    get: function(key) {
      var req;
      return withStore('readonly', function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(key, value) {
      return withStore('readwrite', function(store) {
        store.put(value, key);
      });
    },
    delete: function(key) {
      return withStore('readwrite', function(store) {
        store.delete(key);
      });
    },
    clear: function() {
      return withStore('readwrite', function(store) {
        store.clear();
      });
    },
    keys: function() {
      var keys = [];
      return withStore('readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) { return; }
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    }
  };

  if ('object' != 'undefined' && module.exports) {
    module.exports = idbKeyval;
  } else if (typeof undefined === 'function' && undefined.amd) {
    undefined('idbKeyval', [], function() {
      return idbKeyval;
    });
  } else {
    self.idbKeyval = idbKeyval;
  }
}());
});

// Thin layer on top of idb-keyval with support for versioning and
// max age
var defaultOpts$1 = {maxAge: Infinity, version: 0, lib: idbKeyval};

var getCachedItem = function (key, opts) {
  var ref = Object.assign({}, defaultOpts$1, opts);
  var maxAge = ref.maxAge;
  var version = ref.version;
  var lib = ref.lib;
  return lib.get(key)
    .then(JSON.parse)
    .then(function (parsed) {
      var age = Date.now() - parsed.time;
      if (age > maxAge || version !== parsed.version) {
        lib.delete(key);
        return null
      }
      return {
        age: age,
        data: parsed.data
      }
    })
    .catch(function () { return null; })
};

var getAllCached = function (spec) {
  var opts = Object.assign({}, defaultOpts$1, spec);
  var keys;
  return opts.lib.keys()
    .then(function (retrievedKeys) {
      keys = retrievedKeys;
      return Promise.all(keys.map(function (key) { return getCachedItem(key, opts)
          .then(function (res) { return res.data; }); }
      ))
    })
    .then(function (data) { return data.reduce(function (acc, bundleData, index) {
      if (bundleData) {
        acc[keys[index]] = bundleData;
      }
      return acc
    }, {}); })
    .catch(function () {})
};



var cacheItem = function (key, data, spec) {
  var opts = Object.assign({}, defaultOpts$1, spec);
  return opts.lib.set(key, JSON.stringify({
    version: opts.version,
    time: Date.now(),
    data: data
  }))
  .catch(function () { return null; })
};

var defaults = { version: 0, cacheFunction: cacheItem };
function caching (spec) {
  var opts = Object.assign({}, defaults, spec);

  return {
    name: 'localCache',
    getMiddleware: function (chunk) {
      var combinedActions = {};
      chunk.rawBundles.forEach(function (bundle) {
        if (bundle.persistActions) {
          bundle.persistActions.forEach(function (type) {
            combinedActions[type] || (combinedActions[type] = []);
            combinedActions[type].push(bundle.name);
          });
        }
      });

      return function (ref) {
        var getState = ref.getState;

        return function (next) { return function (action) {
        var keys = combinedActions[action.type];
        var res = next(action);
        var state = getState();
        if (keys) {
          if (IS_BROWSER) {
            ric(function () {
              Promise.all(keys.map(function (key) { return opts.cacheFunction(key, state[key], {version: opts.version}); }
              )).then(function () {
                if (state.debug) {
                  console.info(("persisted " + (keys.join(', ')) + " because of action " + (action.type)));
                }
              });
            });
          }
        }
        return res
      }; };
      }
    }
  }
}

var defaults$1 = {
  idleTimeout: 30000,
  idleAction: 'APP_IDLE',
  doneCallback: null,
  stopWhenTabInactive: true
};

var ricOptions = {timeout: 500};
var getIdleDispatcher = function (stopWhenInactive, timeout, fn) { return debounce(function () {
  // the requestAnimationFrame ensures it doesn't run when tab isn't active
  stopWhenInactive ? raf(function () { return ric(fn, ricOptions); }) : ric(fn, ricOptions);
}, timeout); };

function reactors (opts) { return ({
  name: 'reactors',
  init: function (store) {
    opts || (opts = {});
    Object.assign(opts, defaults$1);
    var idleAction = opts.idleAction;
    var idleTimeout = opts.idleTimeout;
    var idleDispatcher;
    if (idleTimeout) {
      idleDispatcher = getIdleDispatcher(opts.stopWhenTabInactive, idleTimeout, function () { return store.dispatch({type: idleAction}); });
    }

    var cancelIfDone = function () {
      if (!IS_BROWSER && !store.nextReaction && (!store.selectAsyncActive || !store.selectAsyncActive())) {
        idleDispatcher && idleDispatcher.cancel();
        opts.doneCallback && opts.doneCallback();
      }
    };

    var dispatchNext = function () {
      // one at a time
      if (store.nextReaction) {
        return
      }
      // look for the next one
      store.meta.reactorNames.some(function (name) {
        var result = store[name]();
        if (result) {
          store.activeReactor = name;
          store.nextReaction = result;
        }
        return result
      });
      if (store.nextReaction) {
        // let browser chill
        ric(function () {
          var nextReaction = store.nextReaction;
          store.activeReactor = null;
          store.nextReaction = null;
          store.dispatch(nextReaction);
        }, ricOptions);
      }
    };

    var callback = function () {
      dispatchNext();
      if (idleDispatcher) {
        idleDispatcher();
        cancelIfDone();
      }
    };

    store.subscribe(callback);
    callback();
  }
}); }

var has = Object.prototype.hasOwnProperty;

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?&]+)=?([^&]*)/g
    , result = {}
    , part;

  //
  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
  // the lastIndex property so we can continue executing this loop until we've
  // parsed all results.
  //
  for (;
    part = parser.exec(query);
    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
  ){  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = [];

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) { prefix = '?'; }

  for (var key in obj) {
    if (has.call(obj, key)) {
      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
var stringify = querystringify;
var parse = querystring;

var querystringify_1 = {
	stringify: stringify,
	parse: parse
};

var isDefined = function (thing) { return typeof thing !== 'undefined'; };
var ensureString = function (input) { return typeof input === 'string' ? input : querystringify_1.stringify(input); };
var IPRE = /^[0-9\.]+$/;
var parseSubdomains = function (hostname, getBareHost) {
  if (IPRE.test(hostname)) { return [] }
  var parts = hostname.split('.');
  if (getBareHost) {
    return parts.slice(-2).join('.')
  }
  return hostname.split('.').slice(0, -2)
};
var removeLeading = function (char, string) { return string.charAt(0) === char ? string.slice(1) : string; };
var ensureLeading = function (char, string) {
  if (string === char || string === '') {
    return ''
  }
  return string.charAt(0) !== char ? char + string : string
};
var loc = (function () {
  if (!HAS_WINDOW) { return {} }
  return window.location
})();
var defaults$2 = {
  name: 'url',
  inert: !HAS_WINDOW,
  actionType: 'UPDATE_URL'
};

function url (opts) {
  var config = Object.assign({}, defaults$2, opts);
  var actionType = config.actionType;

  var selectUrlRaw = function (state) { return state[config.name]; };
  var selectUrlObject = createSelector$1(selectUrlRaw, function (urlState) { return new URL(urlState.url); });
  var selectQueryObject = createSelector$1(selectUrlObject, function (urlObj) { return querystringify_1.parse(urlObj.search); });
  var selectQueryString = createSelector$1(selectQueryObject, function (queryObj) { return querystringify_1.stringify(queryObj); });
  var selectPathname = createSelector$1(selectUrlObject, function (urlObj) { return urlObj.pathname; });
  var selectHash = createSelector$1(selectUrlObject, function (urlObj) { return removeLeading('#', urlObj.hash); });
  var selectHashObject = createSelector$1(selectHash, function (hash) { return querystringify_1.parse(hash); });
  var selectHostname = createSelector$1(selectUrlObject, function (urlObj) { return urlObj.hostname; });
  var selectSubdomains = createSelector$1(selectHostname, function (hostname) { return parseSubdomains(hostname); });

  var doUpdateUrl = function (newState, opts) {
    if ( opts === void 0 ) opts = {replace: false};

    return function (ref) {
    var dispatch = ref.dispatch;
    var getState = ref.getState;

    var state = newState;
    if (typeof newState === 'string') {
      var parsed = new URL(newState.charAt(0) === '/' ? 'http://example.com' + newState : newState);
      state = {
        pathname: parsed.pathname,
        query: parsed.search || '',
        hash: parsed.hash || ''
      };
    }
    var url = new URL(selectUrlRaw(getState()).url);
    if (isDefined(state.pathname)) { url.pathname = state.pathname; }
    if (isDefined(state.hash)) { url.hash = ensureString(state.hash); }
    if (isDefined(state.query)) { url.search = ensureString(state.query); }
    dispatch({ type: actionType, payload: { url: url.href, replace: opts.replace } });
  };
  };
  var doReplaceUrl = function (url) { return doUpdateUrl(url, {replace: true}); };
  var doUpdateQuery = function (query, opts) {
      if ( opts === void 0 ) opts = {replace: true};

      return doUpdateUrl({ query: ensureString(query) }, opts);
  };
  var doUpdateHash = function (hash, opts) {
      if ( opts === void 0 ) opts = {replace: false};

      return doUpdateUrl({ hash: ensureLeading('#', ensureString(hash)) }, opts);
  };

  return {
    name: config.name,
    init: function (store) {
      if (config.inert) {
        return
      }

      var lastState = store.selectUrlRaw();

      var setCurrentUrl = function () {
        store.doUpdateUrl({
          pathname: loc.pathname,
          hash: loc.hash,
          query: loc.search
        });
      };

      window.addEventListener('popstate', setCurrentUrl);

      store.subscribe(function () {
        var newState = store.selectUrlRaw();
        var newUrl = newState.url;
        if (lastState !== newState && newUrl !== loc.href) {
          try {
            window.history[newState.replace ? 'replaceState' : 'pushState']({}, null, newState.url);
            document.body.scrollTop = 0;
          } catch (e) {
            console.error(e);
          }
        }
        lastState = newState;
      });
    },
    getReducer: function () {
      var initialState = {
        url: !config.inert && HAS_WINDOW
          ? loc.href
          : '/',
        replace: false
      };

      return function (state, ref) {
        if ( state === void 0 ) state = initialState;
        var type = ref.type;
        var payload = ref.payload;

        if (type === '@@redux/INIT' && typeof state === 'string') {
          return {
            url: state,
            replace: false
          }
        }
        if (type === actionType) {
          return Object.assign({
            url: payload.url || payload,
            replace: !!payload.replace
          })
        }
        return state
      }
    },
    doUpdateUrl: doUpdateUrl,
    doReplaceUrl: doReplaceUrl,
    doUpdateQuery: doUpdateQuery,
    doUpdateHash: doUpdateHash,
    selectUrlRaw: selectUrlRaw,
    selectUrlObject: selectUrlObject,
    selectQueryObject: selectQueryObject,
    selectQueryString: selectQueryString,
    selectPathname: selectPathname,
    selectHash: selectHash,
    selectHashObject: selectHashObject,
    selectHostname: selectHostname,
    selectSubdomains: selectSubdomains
  }
}

var version = "16.1.0";

var ENABLE = 'ENABLE_DEBUG';
var DISABLE = 'DISABLE_DEBUG';

var debug$1 = {
  name: 'debug',
  reducer: function (state, ref) {
    if ( state === void 0 ) state = HAS_DEBUG_FLAG;
    var type = ref.type;

    if (type === ENABLE) {
      return true
    }
    if (type === DISABLE) {
      return false
    }
    return state
  },
  doEnableDebug: function () { return ({ type: ENABLE }); },
  doDisableDebug: function () { return ({ type: DISABLE }); },
  selectIsDebug: function (state) { return state.debug; },
  init: function (store) {
    if (store.selectIsDebug()) {
      var names = store.meta.chunks[0].bundleNames;
      self.store = store;
      var actionCreators = [];
      for (var key in store) {
        if (key.indexOf('do') === 0) {
          actionCreators.push(key);
        }
      }
      actionCreators.sort();
      var colorTitle = 'color: #1676D2;';
      var black = 'color: black;';
      var colorGreen = 'color: #4CAF50;';
      var colorOrange = 'color: #F57C00;';

      store.logSelectors = self.logSelectors = function () {
        if (!store.selectAll) { return }
        console.log('%cselectors:', colorGreen, store.selectAll());
      };

      store.logBundles = self.logBundles = function () {
        console.log('%cinstalled bundles:\n  %c%s', colorTitle, black, names.join('\n  '));
      };

      store.logActionCreators = self.logActionCreators = function () {
        console.groupCollapsed('%caction creators', colorOrange);
        actionCreators.forEach(function (name$$1) { return console.log(name$$1); });
        console.groupEnd();
      };

      store.logReactors = self.logReactors = function () {
        console.groupCollapsed('%creactors', colorOrange);
        var ref = store.meta;
        var reactorNames = ref.reactorNames;
        reactorNames.forEach(function (name$$1) { return console.log(name$$1); });
        console.groupEnd();
      };

      store.logNextReaction = self.logNextReaction = function () {
        var nextReaction = store.nextReaction;
        var activeReactor = store.activeReactor;
        if (nextReaction) {
          console.log(
            ("%cnext reaction:\n  %c" + activeReactor),
            colorOrange,
            black,
            nextReaction
          );
        }
      };

      console.groupCollapsed('%credux bundler v%s', colorTitle, version);
      store.logBundles();
      store.logSelectors();
      store.logReactors();
      console.groupEnd();
      if (store.isReacting) {
        console.log("%cqueuing reaction:", colorOrange);
      }
    }
  }
}

var cachingBundle = caching;
var createRouteBundle = createRoutingBundle;








var composeBundles$1 = function () {
  var userBundles = [], len = arguments.length;
  while ( len-- ) userBundles[ len ] = arguments[ len ];

  userBundles || (userBundles = []);
  var bundles = [
    appTimeBundle,
    asyncCount,
    onlineBundle,
    url(),
    reactors(),
    debug$1 ].concat( userBundles
  );
  return composeBundles.apply(void 0, bundles)
};

/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/**
 * JSX/hyperscript reviver.
 * @see http://jasonformat.com/wtf-is-jsx
 * Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *
 * Note: this is exported as both `h()` and `createElement()` for compatibility reasons.
 *
 * Creates a VNode (virtual DOM element). A tree of VNodes can be used as a lightweight representation
 * of the structure of a DOM tree. This structure can be realized by recursively comparing it against
 * the current _actual_ DOM structure, and applying only the differences.
 *
 * `h()`/`createElement()` accepts an element name, a list of attributes/props,
 * and optionally children to append to the element.
 *
 * @example The following DOM tree
 *
 * `<div id="foo" name="bar">Hello!</div>`
 *
 * can be constructed using this function as:
 *
 * `h('div', { id: 'foo', name : 'bar' }, 'Hello!');`
 *
 * @param {string} nodeName	An element name. Ex: `div`, `a`, `span`, etc.
 * @param {Object} attributes	Any attributes/props to set on the created element.
 * @param rest			Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
 *
 * @public
 */
function h(nodeName, attributes) {
	var arguments$1 = arguments;

	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments$1[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) { stack.push(attributes.children); }
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') { child = null; }

			if (simple = typeof nodeName !== 'function') {
				if (child == null) { child = ''; }else if (typeof child === 'number') { child = String(child); }else if (typeof child !== 'string') { simple = false; }
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) { options.vnode(p); }

	return p;
}

/**
 *  Copy all properties from `props` onto `obj`.
 *  @param {Object} obj		Object onto which properties should be copied.
 *  @param {Object} props	Object from which to copy properties.
 *  @returns obj
 *  @private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {VNode} vnode		The virutal DOM element to clone
 * @param {Object} props	Attributes/props to add when cloning
 * @param {VNode} rest		Any additional arguments will be used as replacement children.
 */
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) { renderComponent(p); }
	}
}

/**
 * Check if two nodes are equivalent.
 *
 * @param {Node} node			DOM Node to compare
 * @param {VNode} vnode			Virtual DOM node to compare
 * @param {boolean} [hyrdating=false]	If true, ignores component constructors when comparing.
 * @private
 */
function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }
  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }
  return hydrating || node._componentConstructor === vnode.nodeName;
}

/**
 * Check if an Element has a given nodeName, case-insensitively.
 *
 * @param {Element} node	A DOM Element to inspect the name of.
 * @param {String} nodeName	Unnormalized name to compare against.
 */
function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 *
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;

  var defaultProps = vnode.nodeName.defaultProps;
  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) { parentNode.removeChild(node); }
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') { name = 'class'; }

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) { old(null); }
		if (value) { value(node); }
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) { node.style[i] = ''; }
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) { node.innerHTML = value.__html || ''; }
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) { node.addEventListener(name, eventProxy, useCapture); }
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) { node.removeAttribute(name); }
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) { node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); }else { node.removeAttribute(name); }
		} else if (typeof value !== 'function') {
			if (ns) { node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); }else { node.setAttribute(name, value); }
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) { options.afterMount(c); }
		if (c.componentDidMount) { c.componentDidMount(); }
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) { parent.appendChild(ret); }

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) { flushMounts(); }
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') { vnode = ''; }

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) { dom.parentNode.replaceChild(out, dom); }
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) { dom.parentNode.replaceChild(out, dom); }

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) { childrenLen--; }
							if (j === min) { min++; }
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) { recollectNodeTree(keyed[i], false); }
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) { recollectNodeTree(child, false); }
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) { node['__preactattr_'].ref(null); }

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) { return; }
	component._disable = true;

	if (component.__ref = props.ref) { delete props.ref; }
	if (component.__key = props.key) { delete props.key; }

	if (!component.base || mountAll) {
		if (component.componentWillMount) { component.componentWillMount(); }
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) { component.prevContext = component.context; }
		component.context = context;
	}

	if (!component.prevProps) { component.prevProps = component.props; }
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) { component.__ref(component); }
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) { return; }

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) { cbase._component = null; }
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) { options.afterUpdate(component); }
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) { flushMounts(); }
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) { options.beforeUnmount(component); }

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) { component.componentWillUnmount(); }

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) { base['__preactattr_'].ref(null); }

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) { component.__ref(null); }
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) { this.prevState = extend({}, s); }
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) { (this._renderCallbacks = this._renderCallbacks || []).push(callback); }
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) { (this._renderCallbacks = this._renderCallbacks || []).push(callback); }
		renderComponent(this, 2);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */

//# sourceMappingURL=preact.esm.js.map

var e=function(){
var arguments$1 = arguments;
for(var o=[],e=arguments.length;e--;){ o[e]=arguments$1[e]; }var n=o.slice(-1)[0],i=[],c=[];return(o.length>1?o.slice(0,-1):[]).forEach(function(t){if("select"!==t.slice(0,6)){if("do"!==t.slice(0,2)){ throw Error("CanNotConnect "+t); }i.push(t);}else { c.push(t); }}), function(t){function o(r,o){var e=this;t.call(this,r,o);var n=o.store;this.state=n.select(c), this.unsubscribe=n.subscribeToSelectors(c,this.setState.bind(this)), this.actionCreators={}, i.forEach(function(t){e.actionCreators[t]=function(){
var arguments$1 = arguments;
for(var r=[],o=arguments.length;o--;){ r[o]=arguments$1[o]; }return n.action?n.action(t,r):n[t].apply(n,r)};});}return t&&(o.__proto__=t), o.prototype=Object.create(t&&t.prototype), o.prototype.constructor=o, o.prototype.componentWillUnmount=function(){this.unsubscribe();}, o.prototype.render=function(t,o){return h(n,Object.assign({},t,o,this.actionCreators))}, o}(Component)};
//# sourceMappingURL=index.m.js.map

var HomePage = function (ref) {
  var baseDataStatus = ref.baseDataStatus;
  var baseData = ref.baseData;

  return (
  h( 'article', null,
    h( 'p', null, "Open dev tools to see output of debug bundle. The current version of redux-bundler you're running, the list of installed bundles, etc." ),
    h( 'p', null, "This app uses the awesome ", h( 'a', { href: 'https://swapi.co/' }, "SWAPI"), " as an API to demonstrate how you can reactively trigger data fetching due to the the application's current state rather than by some arbitrary component being displayed." ),

    h( 'p', null, "It will never fetch unless its data is stale, or it needs to retry to do a failed attempt to fetch" ),

    h( 'p', null, "This entire app with all dependencies and without any tree-shaking is approx 18.5 kbs min + gzip" ),

    h( 'h3', null, "Things to try" ),
    h( 'ul', null,
      h( 'li', { class: 'mb2' }, "Leave this page open, and watch the log output in the console. The data will be refreshed if its older than one minute."),
      h( 'li', { class: 'mb2' }, "While you have the page loaded, use devtools to force the app to go offline. It will keep showing the data it has, but will now retry more actively. These fetches will fail, but it will still show the data it has. Now, make it go online again, and you should see the data getting refreshed rather quickly."),
      h( 'li', { class: 'mb2' }, "The \"APP_IDLE\" actions will only be dispatched when the tab is in focus. Test this out by opening the network tab in devtools and clearing it, now switching away to a different tab for a while. When you switch back you'll notice no fetches occured while you were away, but as soon as you switch back to this tab a fetch is immediately triggered."),
      h( 'li', { class: 'mb3' }, "Whenever there has been a successful fetch, the data is persisted to indexedDB via the localCaching bundle (including metadata about the fetch). So if you refresh and it successfully fetched data recentl enough, no fetch is triggered at all.")
    ),

    h( 'div', { class: 'ph3 ba br3 bg-lightest-blue' },
      h( 'h3', null, "Dynamically Fetched Data:" ),
      h( 'p', null, "Source: https://swapi.co/api/" ),
      h( 'p', null, "Status: ", baseDataStatus ),
      h( 'p', null, "result: ", h( 'pre', null, h( 'code', null, JSON.stringify(baseData, null, 2) ) )
      )
    )
  )
);
};

e(
  'selectBaseDataStatus',
  'selectBaseData',
  HomePage
)

var PersonDetailPage = function (ref) {
  var routeParams = ref.routeParams;
  var activePerson = ref.activePerson;

  return (
  h( 'article', null,
    h( 'h1', null, "Demo of an item detail view" ),
    h( 'p', null, "the route parameters that are available in redux with this URL open: ", h( 'pre', null, h( 'code', null, JSON.stringify(routeParams, null, 2) ) )
    ),
    h( 'p', null, "We can use this in our selectors to determine if this is data we have or need to fetch." ),
    h( 'p', null,
      h( 'pre', null, h( 'code', null, JSON.stringify(activePerson, null, 2) ) )
    )
  )
);
};

e(
  'selectRouteParams',
  'selectActivePerson',
  PersonDetailPage
)

var PeopleListPage = function (ref) {
  var peopleData = ref.peopleData;

  return (
  h( 'article', null,
    h( 'h1', null, "People Data" ),
    !peopleData && (
      h( 'p', null, "No data yet" )
    ),
    peopleData && peopleData.map(function (person) { return (
      h( 'ul', null,
        h( 'li', null, h( 'a', { href: ("/people/" + (person.id)) }, person.name) )
      )
    ); })
  )
);
};

e(
  'selectPeopleData',
  PeopleListPage
)

var routes = createRouteBundle({
  '/': 'home',
  '/people': 'people',
  '/people/:id': 'personDetail'
})

var baseData = {
  name: 'baseData',
  getReducer: function () {
    var initialState = {
      loading: false,
      lastError: null,
      lastFetch: null,
      data: null
    };
    // this is just a normal redux reducer
    return function (state, ref) {
      if ( state === void 0 ) state = initialState;
      var type = ref.type;
      var payload = ref.payload;

      if (type === 'FETCH_BASE_START') {
        return Object.assign({}, state, {
          loading: true
        })
      }
      // In the case of an error, we store
      // a timestamp of the error so we can
      // chose to automatically retry later
      // if we want
      if (type === 'FETCH_BASE_ERROR') {
        return Object.assign({}, state, {
          lastError: Date.now(),
          loading: false
        })
      }
      // we also store metadata about the fetch
      // along with the resulting data
      if (type === 'FETCH_BASE_SUCCESS') {
        return Object.assign({}, state, {
          lastFetch: Date.now(),
          loading: false,
          lastError: null,
          data: Object.keys(payload).map(function (key) { return ({id: key, url: payload[key]}); })
        })
      }

      return state
    }
  },
  // see /src/bundles/extra-args to see how swapiFetch becomes
  // available here
  doFetchBaseData: function () { return function (ref) {
    var dispatch = ref.dispatch;
    var swapiFetch = ref.swapiFetch;

    dispatch({type: 'FETCH_BASE_START'});
    swapiFetch('/')
      .then(function (payload) {
        dispatch({type: 'FETCH_BASE_SUCCESS', payload: payload});
      })
      .catch(function (error) {
        dispatch({type: 'FETCH_BASE_ERROR', error: error});
      });
  }; },
  // selector for the whole contents of the reducer
  // including metadata about fetches
  selectBaseDataRaw: function (state) { return state.baseData; },
  // selector for just the actual data if we have it
  selectBaseData: function (state) { return state.baseData.data; },

  // we'll extract a status string here, for display, just to show
  // the type of information available about the data
  selectBaseDataStatus: createSelector$1(
    'selectBaseDataRaw',
    function (baseData) {
      var data = baseData.data;
      var lastError = baseData.lastError;
      var lastFetch = baseData.lastFetch;
      var loading = baseData.loading;

      var result = '';

      if (data) {
        result += 'Has data';
      } else {
        result += 'Does not have data';
      }

      if (loading) {
        return result + ' and is fetching currently'
      }

      if (lastError) {
        return result + " but had an error at " + lastError + " and will retry after ~30 seconds"
      }

      if (lastFetch) {
        return result + " that was fetched at " + lastFetch + " but will updated a minute later"
      }
    }
  ),

  // here's our first "reactor"
  reactShouldFetchBaseData: createSelector$1(
    // this is the selector we defined above, note that we can
    // just reference it by it's string name, but we could have
    // also assigned the function to a variable and passed that
    // function directly here instead.
    'selectBaseDataRaw',
    // this is one of the selectors that is made available by
    // one of the included bundles called 'appTime' this bundle
    // timestamps all actions and we also run an "app idle"
    // dispatch every 30 seconds if there have been no actions
    // dispatched and using requestAnimationFrame, this will
    // only happen if the tab is visible.
    // All this to say, we have a self-updating timestamp in our
    // redux state that we can use to see how long it's been.
    'selectAppTime',
    function (baseData, appTime) {
      // never trigger another fetch if we're already fetching
      if (baseData.loading) {
        return null
      }

      // for readability in this example I'm going to break out
      // and comment on the various conditions here. In reality
      // you'd likely want to write an abstraction that lets you describe
      // all this at a higher level. One such, abstraction is
      // included in the "/bundles" dir of the redux-bundler repo
      var shouldFetch = false;

      // if we don't have data at all we definitely want to fetch
      if (!baseData.data) {
        shouldFetch = true;
      }

      // was there an error last time we tried to fetch?
      // if it's been 15 seconds, give it another go...
      else if (baseData.lastError) {
        var timePassed = appTime - baseData.lastError;
        if (timePassed > 15000) {
          shouldFetch = true;
        }
      }

      // maybe our data is just stale?
      // I've made this arbitrarily short at just 1 minute
      // so you can see it working.
      // Note that we don't wipe out existing data if we have
      // it.
      else if (baseData.lastFetch) {
        var timePassed$1 = appTime - baseData.lastFetch;
        if (timePassed$1 > 60000) {
          shouldFetch = true;
        }
      }

      // here we can either return an actual action object to dispatch
      // by using `{type: 'SOME_ACTION'}` or we can just specify the
      // name of the action creator function we want to run, and optionally
      // any args we want to pass to it.
      if (shouldFetch) {
        return {actionCreator: 'doFetchBaseData'}
      }
    }
  ),
  persistActions: ['FETCH_BASE_SUCCESS']
}

var people$1 = {
  name: 'people',
  getReducer: function () {
    var initialData = {
      data: null,
      loading: false
    };

    return function (state, ref) {
      if ( state === void 0 ) state = initialData;
      var type = ref.type;
      var payload = ref.payload;

      if (type === 'FETCH_PEOPLE_START') {
        return Object.assign({}, state, {
          loading: true
        })
      }
      if (type === 'FETCH_PEOPLE_SUCCESS') {
        return Object.assign({}, state, {
          loading: false,
          // we'll just extract an ID here and insert it as a property
          // on the data for this person.
          // Normally API will include an id attribute of some kind
          // for each object in the results, but not so for this API.
          data: payload.results.map(function (person) {
            var split = person.url.split('/');
            var id = split[split.length - 2];
            return Object.assign(person, {id: id})
          })
        })
      }

      return state
    }
  },
  doFetchPeople: function () { return function (ref) {
    var dispatch = ref.dispatch;
    var swapiFetch = ref.swapiFetch;

    dispatch({type: 'FETCH_PEOPLE_START'});
    swapiFetch('/people')
      .then(function (payload) {
        dispatch({type: 'FETCH_PEOPLE_SUCCESS', payload: payload});
      });
  }; },
  selectPeopleRaw: function (state) { return state.people; },
  selectPeopleData: function (state) { return state.people.data; },
  selectActivePerson: createSelector$1(
    'selectRouteParams',
    'selectPathname',
    'selectPeopleData',
    function (routeParams, pathname, peopleData) {
      if (!pathname.includes('/people') || !routeParams.id || !peopleData) {
        return null
      }
      return peopleData.find(function (person) { return person.id === routeParams.id; }) || null
    }
  ),
  reactShouldFetchPeople: createSelector$1(
    'selectPeopleRaw',
    function (peopleData) {
      if (peopleData.loading || peopleData.data) {
        return false
      }
      return {actionCreator: 'doFetchPeople'}
    }
  )
}

/* global fetch */

var extraArgs = {
  name: 'extra-args',
  // note that the store gets passed in here:
  getExtraArgs: function (store) {
    return {
      swapiFetch: function (urlPath) { return fetch(("https://swapi.co/api" + urlPath))
          .then(function (res) { return res.json(); })
          .catch(function (err) {
            // if you wanted to, you could look for errors caused
            // by failed authentication to trigger something
            // else on the store here if it existed. Such as redirecting
            // the user to a login page, or whatnot. You have access
            // to the store object itself.
            //
            // The store has all the action creators on it so you
            // can call `store.doWhatever()`
            // but for our purposes we'll just throw here
            throw err
          }); }
    }
  }
}

var createStore$1 = composeBundles$1(
  routes,
  baseData,
  people$1,
  cachingBundle({version: 1}),
  extraArgs
)

if (!self.fetch) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js');
}

var dataPromise = getAllCached({ version: 1, maxAge: milliseconds.weeks(1) });
var store;

var selectedState = {
  before: {},
  after: {}
};

var getChanged = function () {
  var changed = {};
  var before = selectedState.before;
  var after = selectedState.after;
  for (var item in after) {
    if (before[item] !== after[item]) {
      changed[item] = after[item];
    }
  }
  return changed
};

self.onmessage = function (ref) {
  var data = ref.data;

  console.log('🔃 from main', data);
  var cbId = data.cbId;
  var type = data.type;
  var payload = data.payload;
  var name = data.name;

  if (type === 'callback') {
    self[cbId](data);
    delete self[cbId];
  }

  if (type === 'initial') {
    dataPromise.then(function (cached) {
      store = createStore$1(Object.assign({}, cached, payload));
      var update = function () {
        selectedState.after = store.selectAll();
        var changed = getChanged();
        delete changed.urlObject;
        self.postMessage(changed);
        selectedState.before = selectedState.after;
      };
      store.subscribe(update);
      update();
    });
    return
  }

  if (type === 'action') {
    var args = payload || [];
    var fn = store[name];
    if (!fn) {
      throw Error(("💥 no action " + name + " on store"))
    }
    fn.apply(void 0, args);
    return
  }
};

}());
