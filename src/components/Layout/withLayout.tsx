import React from "react";
import Layout from "./Layout";

const withLayout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithLayout: React.FC<P> = (props) => (
    <Layout>
      <WrappedComponent {...props} />
    </Layout>
  );

  return WithLayout;
};

export default withLayout;

