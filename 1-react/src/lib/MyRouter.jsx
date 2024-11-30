import React from "react";
import { getComponentName } from "./utils";

export const routerContext = React.createContext({});
routerContext.displayName = "RouterContext";

export class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: window.location.pathname,
    };
    this.handleChangePath = this.handleChangePath.bind(this);
    this.handleOnPopstate = this.handleOnPopstate.bind(this);
  }

  handleChangePath(path) {
    this.setState({ path });
    window.history.pushState("", "", path);
  }

  handleOnPopstate(event) {
    const nextPath = event.state && event.state.path;
    if (!nextPath) return;
    this.setState({ path: nextPath });
  }

  componentDidMount() {
    window.addEventListener("popstate", this.handleOnPopstate);
    window.history.replaceState({ path: this.state.path }, "");
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handleOnPopstate);
  }

  render() {
    const contextValue = {
      path: this.state.path,
      changePath: this.handleChangePath,
    };

    return (
      <routerContext.Provider value={contextValue}>
        {this.props.children}
      </routerContext.Provider>
    );
  }
}

export const Routes = ({ children }) => {
  return (
    <routerContext.Consumer>
      {({ path }) => {
        let selectedRoute = null;
        React.Children.forEach(children, (child) => {
          if (!React.isValidElement(child)) return;

          if (child.type === React.Fragment) return;

          if (!child.props.path || !child.props.element) return;

          if (child.props.path !== path.replace(/\?.*$/, "")) return;

          selectedRoute = child.props.element;
        });
        return selectedRoute;
      }}
    </routerContext.Consumer>
  );
};

export const Route = () => null;

export const Link = ({ to, ...rest }) => (
  <routerContext.Consumer>
    {({ path, changePath }) => {
      const handleClick = (e) => {
        e.preventDefault();
        if (to !== path) changePath(to);
      };
      return <a {...rest} href={to} onClick={handleClick} />;
    }}
  </routerContext.Consumer>
);

export const withRouter = (WrappedComponent) => {
  const WithRouter = (props) => (
    <routerContext.Consumer>
      {({ path, changePath }) => {
        const navigate = (nextPath) => {
          if (path !== nextPath) changePath(nextPath);
        };

        const enhancedProps = {
          navigate,
        };

        return <WrappedComponent {...props} {...enhancedProps} />;
      }}
    </routerContext.Consumer>
  );
  WithRouter.displayName = `WithRouter(${getComponentName(WrappedComponent)})`;

  return WithRouter;
};
