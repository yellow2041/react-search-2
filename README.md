# [리액트 2부] 고급 주제와 훅

## React Context 구현해보기

- 이벤트 구독 패턴

### eventEmitter

```javascript
const createEventEmitter = (value) => {
  let handlers = [];

  const on = (handler) => handlers.push(handler);
  const off = (handler) => {
    handlers = handler.filter((h) => h !== handler);
  };

  const get = () => value;
  const set = (newValue) => {
    value = newValue;
    handlers.forEach((handler) => handler(value));
  };

  return { on, off, get, set };
};

export default createEventEmitter;
```

### Provider, Consumer

- `createContext()`로 rerender 필요한 상태와 컴포넌트 셋팅
- Provider value로 rerender 필요한 상태 등록
- Consumer에서 상태 업데이트 정의, 상태 업데이트 할 컴포넌트 정의.

```jsx
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
  return { createContext };
})();

export default MyReact;
```

### 사용

```jsx
import MyReact from "./lib/MyReact";
import React from "react";

const countContext = MyReact.createContext({
  count: 0,
  setCount: () => {},
});

class CountProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  render() {
    const value = {
      count: this.state.count,
      setCount: (nextValue) => this.setState({ count: nextValue }),
    };
    return (
      <countContext.Provider value={value}>
        {this.props.children}
      </countContext.Provider>
    );
  }
}

const Count = () => {
  return (
    <countContext.Consumer>
      {(value) => <div>{value.count}</div>}
    </countContext.Consumer>
  );
};

const PlusButton = () => {
  return (
    <countContext.Consumer>
      {(value) => (
        <button onClick={() => value.setCount(value.count + 1)}>
          + 카운트 올리기
        </button>
      )}
    </countContext.Consumer>
  );
};

export default () => (
  <CountProvider>
    <Count />
    <PlusButton />
  </CountProvider>
);
```
