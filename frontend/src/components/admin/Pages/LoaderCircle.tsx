
const LoadingCircle = ({ size = 20 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-white border-t-transparent rounded-full animate-spin"
    />
  );
};

export default LoadingCircle;