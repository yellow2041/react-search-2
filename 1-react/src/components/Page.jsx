import * as MyLayout from "../lib/MyLayout";

const Page = ({ header, footer, children }) => {
  return (
    <div className="Page">
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
      <MyLayout.DialogContainer />
    </div>
  );
};

export default Page;
