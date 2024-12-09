import React from "react";
import createEventEmitter from "shared/lib/EventEmitter";

const MyReact = (function () {
  function createContext(initialValue) {
    const emitter = createEventEmitter(initialValue);

    class Provider extends React.Component {
      componentDidMount() {
        emitter.set(this.props.value);
      }

      componentDidUpdate() {
        emitter.set(this.props.value);
      }
      render() {
        return <>{this.props.children}</>;
      }
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
    };
  }

  const memorizedStates = [];
  const isInitialized = [];
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

  return { createContext, useState };
})();

export default MyReact;
