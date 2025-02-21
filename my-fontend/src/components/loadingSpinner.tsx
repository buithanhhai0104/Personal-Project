import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <ClipLoader color="#007bff" size={100} />
    </div>
  );
};

export default LoadingSpinner;
