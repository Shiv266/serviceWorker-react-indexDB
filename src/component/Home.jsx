import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center flex-col space-y-8">
      Home
      <button
        className="mt-16 w-48 bg-blue-300 py-2 px-8 rounded-md"
        onClick={() => navigate("/payment")}
      >
        Go To Payment
      </button>
    </div>
  );
}

export default Home;
