import Loader from "components/Loader";
import { ENV_KEYS } from "constants/env.constant";
import React from "react";

type ImportIndexModule = () => Promise<{
  default: React.ComponentType;
  namedExport?: string;
}>;

interface AsyncComponentProps {}

interface AsyncComponentState {
  component: React.ComponentType | null;
}

const sleep = (m?: number) => new Promise((r) => setTimeout(r, m));

export default function asyncComponent(importComponent: ImportIndexModule) {
  class AsyncComponent extends React.Component<
    AsyncComponentProps,
    AsyncComponentState
  > {
    constructor(props: AsyncComponentState) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      await sleep(ENV_KEYS.NODE_ENV === "development" ? 150 : 0);

      const { default: component } = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : <Loader />;
    }
  }

  return AsyncComponent;
}
