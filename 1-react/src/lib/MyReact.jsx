import React from "react";
import createEventEmitter from "shared/lib/EventEmitter";

const MyReact = (function () {
  const memorizedStates = [];
  let deps = [];
  const isInitialized = [];
  const cleanups = [];
  let cursor = 0;

  function useState(initialValue = "") {
    const { forceUpdate } = useForceUpdate();

    if (!isInitialized[cursor]) {
      memorizedStates[cursor] = initialValue;
      isInitialized[cursor] = true;
    }

    const state = memorizedStates[cursor];

    const setStateAt = (_cursor) => (nextState) => {
      if (state === nextState) return;
      memorizedStates[_cursor] = nextState;
      forceUpdate();
    };
    const setState = setStateAt(cursor);

    cursor = cursor + 1;

    return [state, setState];
  }

  function useForceUpdate() {
    const [value, setValue] = React.useState(1);
    const forceUpdate = () => {
      setValue(value + 1);
      cursor = 0;
    };
    return { forceUpdate };
  }

  function useEffect(effect, nextDeps) {
    function runDeferedEffect() {
      function runEffect() {
        const cleanup = effect();
        if (cleanup) cleanup[cursor] = cleanup;
      }
      const ENOUGH_TIME_TO_RENDER = 1;
      setTimeout(effect, ENOUGH_TIME_TO_RENDER);
    }
    if (!isInitialized[cursor]) {
      isInitialized[cursor] = true;
      deps[cursor] = nextDeps;
      cursor = cursor + 1;
      runDeferedEffect();
      return;
    }
    const prevDeps = deps[cursor];
    const depsSame = prevDeps.every(
      (prevDep, index) => prevDep === nextDeps[index]
    );
    if (depsSame) {
      cursor = cursor + 1;
      return;
    }
    deps[cursor] = nextDeps;
    cursor = cursor + 1;
    runDeferedEffect();
  }

  function resetCursor() {
    cursor = 0;
  }

  function cleanupEffects() {
    cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup());
  }
  function createContext(initialValue) {
    const emitter = createEventEmitter(initialValue);

    function Provider({ value, children }) {
      React.useEffect(() => {
        emitter.set(value);
      }, [value]);
      return <>{children}</>;
    }

    class Consumer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: emitter.get(),
        };
        this.setValue = this.setValue.bind(this);
      }

      setValue(nextValue) {
        this.setState({ value: nextValue });
      }

      componentDidMount() {
        emitter.on(this.setValue);
      }

      componentWillUnmount() {
        emitter.off(this.setValue);
      }
      render() {
        return <>{this.props.children(this.state.value)}</>;
      }
    }

    return {
      Provider,
      Consumer,
      emitter,
    };
  }
  function useContext(context) {
    const [value, setValue] = React.useState(context.emitter.get());

    React.useEffect(() => {
      context.emitter.on(setValue);
      return () => context.emitter.off(setValue);
    }, [context]);
    context.emitter.on(setValue);

    return value;
  }

  return {
    createContext,
    useState,
    useEffect,
    resetCursor,
    cleanupEffects,
    useContext,
  };
})();

export default MyReact;
