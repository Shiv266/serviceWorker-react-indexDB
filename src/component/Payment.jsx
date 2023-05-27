import { sendDataToWorker } from "../swDev";

function Payment() {
  return (
    <div className="flex justify-center items-center flex-col space-y-8">
      Payment
      <button
        className="mt-16 w-48 bg-blue-300 py-2 px-8 rounded-md"
        onClick={() =>
          sendDataToWorker({ type: "FETCH_ORDER_ID", orderId: Math.random() })
        }
      >
        Data Submit
      </button>
      <button
        className="mt-16 w-48 bg-blue-300 py-2 px-8 rounded-md"
        onClick={() => sendDataToWorker({ type: "DELETE_ORDER_ID" })}
      >
        Delete order ID
      </button>
    </div>
  );
}

export default Payment;
