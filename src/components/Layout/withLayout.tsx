import React from "react";
import Layout from "./Layout";

const withLayout = (WrappedComponent: React.ComponentType) => {
  return (props: any) => (
    <Layout>
      <WrappedComponent {...props} />
    </Layout>
  );
};

export default withLayout;