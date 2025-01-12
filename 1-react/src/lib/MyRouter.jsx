import React from "react";
import { getComponentName } from "./utils";

export const routerContext = React.createContext({});
routerContext.displayName = "RouterContext";

export const Router = ({ children }) => {
  const [path, setPath] = React.useState(window.location.pathname);

  const changePath = (path) => {
    setPath(path);
    window.history.pushState({ path }, "", path);
  };

  const handleOnPopstate = (event) => {
    const nextPath = event.state && event.state.path;
    if (!nextPath) return;
    setPath(nextPath);
  };

  React.useEffect(() => {
    window.addEventListener("popstate", handleOnPopstate);
    window.history.replaceState({ path }, "");
    return () => {
      window.removeEventListener("popstate", handleOnPopstate);
    };
  }, [path]);

  const contextValue = {
    path,
    changePath,
  };

  return (
    <routerContext.Provider value={contextValue}>
      {children}
    </routerContext.Provider>
  );
};

export const Routes = ({ children }) => {
  const { path } = React.useContext(routerContext);

  let selectedRoute = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) return;

    if (!child.props.path || !child.props.element) return;

    if (child.props.path !== path.replace(/\?.*$/, "")) return;

    selectedRoute = child.props.element;
  });
  return selectedRoute;
};

export const Route = () => null;

export const Link = ({ to, ...rest }) => {
  const { path, changePath } = React.useContext(routerContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (to !== path) changePath(to);
  };
  return <a {...rest} href={to} onClick={handleClick} />;
};

export const withRouter = (WrappedComponent) => {
  const WithRouter = (props) => (
    <routerContext.Consumer>
      {({ path, changePath }) => {
        const navigate = (nextPath) => {
          if (path !== nextPath) changePath(nextPath);
        };

        const match = (comparedPath) => path === comparedPath;

        const params = () => {
          const params = new URLSearchParams(window.location.search);
          const paramsObject = {};
          console.log(params);
          for (const [key, value] of params) {
            paramsObject[key] = value;
          }
          return paramsObject;
        };

        const enhancedProps = {
          navigate,
          match,
          params,
        };

        return <WrappedComponent {...props} {...enhancedProps} />;
      }}
    </routerContext.Consumer>
  );
  WithRouter.displayName = `WithRouter(${getComponentName(WrappedComponent)})`;

  return WithRouter;
};

export const useNavigate = () => {
  const { path, changePath } = React.useContext(routerContext);
  const navigate = (nextPath) => {
    if (path !== nextPath) changePath(nextPath);
  };
  return navigate;
};

export const useMatch = () => {
  const { path } = React.useContext(routerContext);
  const match = (comparedPath) => path === comparedPath;
  return match;
};
export const useParams = () => {
  const params = () => {
    const params = new URLSearchParams(window.location.search);
    const paramsObject = {};
    for (const [key, value] of params) {
      paramsObject[key] = value;
    }
    return paramsObject;
  };
  return params;
};
