import React from "react";
import Modal from "../components/Modal";

const OrderTrackingModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const steps = [
    { status: "Processing", date: order.date, completed: true },
    {
      status: "In Transit",
      date: "Est. Arrival: 3-5 business days",
      completed: order.status === "In Transit" || order.status === "Delivered",
    },
    {
      status: "Delivered",
      date: "",
      completed: order.status === "Delivered",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-900 text-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          Track Order
        </h2>
        <p className="text-gray-400 mb-6">Order ID: {order.id}</p>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {step.completed ? "✓" : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 mt-2 ${
                      step.completed ? "bg-yellow-400" : "bg-gray-700"
                    }`}
                  ></div>
                )}
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    step.completed ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.status}
                </h3>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default OrderTrackingModal;
