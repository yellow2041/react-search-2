# [리액트 2부] 고급 주제와 훅

## React Context 구현해보기

- 이벤트 구독 패턴

### eventEmitter

- on: 업데이트 된 상태가 들어왔을 때 실행되어야 하는 핸들러 등록
- off: 컴포넌트가 unmount 될 때 사라져야 할 핸들러 지우기
- get: 캡쳐링된 현재 value 리턴
- set: 컴포넌트들 새 상태로 업데이트?

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

## 고차컴포넌트

- 컴포넌트들에 공통적인 역할?(관심사)이 존재할 때 사용.

```jsx
class Header extends React.Component {
  render() {
    return <header>Header</header>;
  }
}
class Button extends React.Component {
  handleClick = () => {
    this.props.log("클릭");
  };

  render() {
    return <button onClick={this.handleClick}> 버튼 </button>;
  }
}

const withLogging = (WrappedComponent) => {
  function log(message) {
    console.log(`[${getComponentName(WrappedComponent)}] ${message}`);
  }
  class WithLogging extends React.Component {
    render() {
      const enhancedProps = {
        log,
      };
      return <WrappedComponent {...this.props} {...enhancedProps} />;
    }
    componentDidMount() {
      log("mount");
    }
  }
  return WithLogging;
};

const EnhancedHeader = withLogging(Header);
const EnhancedButton = withLogging(Button);

export default () => (
  <>
    <EnhancedHeader />
    <EnhancedButton />
  </>
);
```

## OrderPage 하위에 Dialog가 존재하여 발생하는 문제

- DialogContainer가 Page 하위에 존재하고 Page가 OrderPage 하위에 존재하여 발생.
- css가 OrderPage>Page>main에 상속되어 해당 margin이 적용됨.
  - 상속구조에서 벗어나야 한다.

### react-dom createPortal 활용

```jsx
export const DialogContainer = withLayout(
  ({ dialog }) =>
    dialog &&
    ReactDOM.createPortal(
      <Backdrop>{dialog}</Backdrop>,
      document.querySelector("#dialog")
    )
);
```
