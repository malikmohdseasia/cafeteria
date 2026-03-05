import ErrorBoundary from "./ErrorBoundary";

const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return function WrappedComponent(props: any) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

export default withErrorBoundary;