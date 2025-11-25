
const simulatePayment = async (paymentDetails) => {
  const { method } = paymentDetails;

  if (!method) {
    return {
      success: false,
      transactionId: null,
      message: "Payment method is required",
    };
  }

  const delay = Math.random() * 500 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (method === "card") {
    const { cardNumber, cvv, expiry, cardName } = paymentDetails;

    if (!cardNumber || !cvv || !expiry || !cardName) {
      return {
        success: false,
        transactionId: null,
        message: "Missing required card payment information",
      };
    }

    return {
      success: true,
      transactionId: generateTransactionId("CARD"),
      message: "Card payment processed successfully",
      status: "completed",
    };
  } else if (method === "digitalWallet") {
    const { walletType, walletEmail } = paymentDetails;

    if (!walletType || !walletEmail) {
      return {
        success: false,
        transactionId: null,
        message: "Missing required digital wallet information",
      };
    }

    return {
      success: true,
      transactionId: generateTransactionId("WALLET"),
      message: "Digital wallet payment processed successfully",
      status: "completed",
    };
  } else if (method === "bankTransfer") {
    const { bankName, accountNumber, routingNumber } = paymentDetails;

    if (!bankName || !accountNumber || !routingNumber) {
      return {
        success: false,
        transactionId: null,
        message: "Missing required bank transfer information",
      };
    }

    return {
      success: true,
      transactionId: generateTransactionId("BANK"),
      message: "Bank transfer initiated successfully",
      status: "pending",
    };
  } else if (method === "cashOnDelivery") {
    return {
      success: true,
      transactionId: generateTransactionId("COD"),
      message: "Cash on delivery order confirmed",
      status: "pending",
    };
  }

  return {
    success: false,
    transactionId: null,
    message: "Unknown payment method",
  };
};

const generateTransactionId = (prefix = "TXN") => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};

const getLast4Digits = (cardNumber) => {
  const clean = cardNumber.replace(/\s+/g, "").replace(/-/g, "");
  return clean.slice(-4);
};

module.exports = {
  simulatePayment,
  generateTransactionId,
  getLast4Digits,
};
