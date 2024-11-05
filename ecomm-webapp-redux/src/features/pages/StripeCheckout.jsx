import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../../features/order/orderSlice";
import "../../../src/Stripe.css";

const stripePromise = loadStripe('pk_test_51PKzPtSAoLjQrsQnvGjP24OPJCRWQdiuatYk3xEIHjgON0A4rv0e6Pu4FAvEy9soi0v3mtDSKFhQPz1D72oMj39C00mRDyyFp9');

const StripeCheckout = () => {
  const currentOrder = useSelector(selectCurrentOrder);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const makePayment = async () => {
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      const response = await fetch("http://localhost:8080/create-checkout-session", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          currentOrder,
          customerName,
          customerAddress
        })
      });

      const session = await response.json();

      console.log("response from payment",session)
      const stripe = await stripePromise;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error making payment:", error);
    }
  };

  return (
    <div className="Stripe">
      <div>
        <label>
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Customer Address:
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={makePayment}>Make Payment</button>
    </div>
  );
};

export default StripeCheckout;
