import React from "react";
import ReactDOM from "react-dom";
import Dialog from "../components/Dialog";
import Backdrop from "../components/Backdrop";
import { getComponentName } from "./utils";

export const layoutContext = React.createContext({});
layoutContext.displayName = "LayoutContext";

export const Layout = ({ children }) => {
  const [dialog, setDialog] = React.useState(null);

  return (
    <layoutContext.Provider value={{ dialog, setDialog }}>
      {children}
    </layoutContext.Provider>
  );
};

export const withLayout = (WrappedComponent) => {
  const WithLayout = (props) => (
    <layoutContext.Consumer>
      {({ dialog, setDialog }) => {
        const openDialog = setDialog;
        const closeDialog = () => setDialog(null);

        const startLoading = (message) =>
          openDialog(<Dialog>{message}</Dialog>);
        const finishLoading = closeDialog;

        const enhancedProps = {
          dialog,
          openDialog,
          closeDialog,
          startLoading,
          finishLoading,
        };

        return <WrappedComponent {...props} {...enhancedProps} />;
      }}
    </layoutContext.Consumer>
  );
  WithLayout.displayName = `WithLayout(${getComponentName(WrappedComponent)})`;
  return WithLayout;
};

export const DialogContainer = withLayout(
  ({ dialog }) =>
    dialog &&
    ReactDOM.createPortal(
      <Backdrop>{dialog}</Backdrop>,
      document.querySelector("#dialog")
    )
);
