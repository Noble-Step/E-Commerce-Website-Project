# AlertModal Usage Guide

## 📚 Table of Contents
1. [Introduction](#introduction)
2. [AlertModal Features](#alertmodal-features)
3. [Basic Usage](#basic-usage)
4. [Predefined Alert Types](#predefined-alert-types)
5. [Where to Use AlertModal](#where-to-use-alertmodal)
6. [Implementation Examples](#implementation-examples)
7. [Best Practices](#best-practices)

---

## Introduction

The `AlertModal` component is a beautiful, customizable modal system designed to replace native browser `alert()`, `confirm()`, and `prompt()` dialogs. It provides a consistent user experience across your application with styled alerts, confirmations, and notifications.

**Location:** `src/modals/AlertModal.js`

---

## AlertModal Features

### ✅ What AlertModal Offers:
- **5 Alert Types**: success, error, warning, info, confirm
- **Visual Icons**: Each type has its own styled icon
- **Color-coded**: Easy to identify message types at a glance
- **Customizable**: Override predefined messages or create your own
- **Confirmation Support**: Built-in cancel/confirm buttons for confirmations
- **Consistent Styling**: Matches your app's black & yellow theme

### ❌ Why Replace `alert()`?
- Native alerts are ugly and block the entire browser
- No customization options
- Poor user experience
- Not accessible
- AlertModal provides better UX with your app's styling

---

## Basic Usage

### Step 1: Import AlertModal
```jsx
import AlertModal, { ALERT_TYPES } from '../modals/AlertModal';
```

### Step 2: Add State to Control Modal
```jsx
const [showAlert, setShowAlert] = useState(false);
const [alertConfig, setAlertConfig] = useState(null);
```

### Step 3: Show the Alert
```jsx
// Using predefined alert
const handleAction = () => {
  setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
  setShowAlert(true);
};

// Using custom alert
const handleCustomAction = () => {
  setAlertConfig({
    type: "success",
    title: "Custom Success",
    message: "This is a custom success message!"
  });
  setShowAlert(true);
};
```

### Step 4: Render the Modal
```jsx
<AlertModal
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  {...alertConfig}
  onConfirm={() => {
    // Optional: Do something when confirmed
    console.log("Confirmed!");
    setShowAlert(false);
  }}
/>
```

### Complete Example:
```jsx
import React, { useState } from 'react';
import AlertModal, { ALERT_TYPES } from '../modals/AlertModal';

const MyComponent = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const handleSuccess = () => {
    setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
    setShowAlert(true);
  };

  return (
    <>
      <button onClick={handleSuccess}>Add to Cart</button>
      
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertConfig}
      />
    </>
  );
};
```

---

## Predefined Alert Types

The `ALERT_TYPES` object contains ready-to-use alert configurations:

### 🔐 Authentication Alerts
- **`ALERT_TYPES.LOGIN_REQUIRED`** - When user tries to access protected features
- **`ALERT_TYPES.LOGIN_SUCCESS`** - After successful login
- **`ALERT_TYPES.LOGOUT_SUCCESS`** - After successful logout
- **`ALERT_TYPES.REGISTRATION_SUCCESS`** - After account creation

### 🛒 Cart Alerts
- **`ALERT_TYPES.ADDED_TO_CART`** - When item is added to cart
- **`ALERT_TYPES.REMOVED_FROM_CART`** - When item is removed
- **`ALERT_TYPES.CART_UPDATED`** - When cart quantity changes
- **`ALERT_TYPES.EMPTY_CART`** - When cart is empty

### 💳 Checkout Alerts
- **`ALERT_TYPES.ORDER_SUCCESS`** - After successful order placement
- **`ALERT_TYPES.ORDER_FAILED`** - When order fails
- **`ALERT_TYPES.PAYMENT_PROCESSING`** - During payment processing

### ❌ Error Alerts
- **`ALERT_TYPES.NETWORK_ERROR`** - Connection issues
- **`ALERT_TYPES.SOMETHING_WRONG`** - Generic errors
- **`ALERT_TYPES.INVALID_INPUT`** - Form validation errors

### ✅ Confirmation Alerts (with Cancel button)
- **`ALERT_TYPES.DELETE_CONFIRM`** - Before deleting items
- **`ALERT_TYPES.CLEAR_CART_CONFIRM`** - Before clearing cart
- **`ALERT_TYPES.LOGOUT_CONFIRM`** - Before logging out

### 📦 Product Alerts
- **`ALERT_TYPES.OUT_OF_STOCK`** - Product unavailable
- **`ALERT_TYPES.LOW_STOCK`** - Low inventory warning

### 👤 Profile Alerts
- **`ALERT_TYPES.PROFILE_UPDATED`** - After profile save
- **`ALERT_TYPES.PASSWORD_CHANGED`** - After password change

---

## Where to Use AlertModal

### 🔴 **HIGH PRIORITY - Replace These `alert()` Calls:**

#### 1. **ProductCard.js** (Line 27)
**Current:**
```jsx
if (!user) {
  alert("Please login to add items to the cart.");
  navigate("/shop");
  return;
}
```

**Replace with:**
```jsx
if (!user) {
  setAlertConfig(ALERT_TYPES.LOGIN_REQUIRED);
  setShowAlert(true);
  return;
}
```

#### 2. **ProductDetailsPage.js** (Line 50)
**Current:**
```jsx
if (!user) {
  alert("Please login to add items to the cart.");
  navigate("/shop");
  return;
}
```

**Replace with:**
```jsx
if (!user) {
  setAlertConfig(ALERT_TYPES.LOGIN_REQUIRED);
  setShowAlert(true);
  return;
}
```

**Also add after successful cart addition:**
```jsx
addToCart({ ...product }, quantity);
setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
setShowAlert(true);
```

#### 3. **OrdersPage.js** (Line 130)
**Current:**
```jsx
onClick={() => alert('Tracking is not implemented in the demo')}
```

**Replace with:**
```jsx
onClick={() => {
  setAlertConfig({
    type: "info",
    title: "Order Tracking",
    message: "Order tracking feature will be available soon. Please contact support for tracking information."
  });
  setShowAlert(true);
}}
```

#### 4. **CartPage.js** - Multiple Opportunities
**Add alerts for:**
- When removing items → `ALERT_TYPES.REMOVED_FROM_CART`
- When cart is empty → `ALERT_TYPES.EMPTY_CART` (already handled visually)
- When clearing cart → `ALERT_TYPES.CLEAR_CART_CONFIRM`

**Example:**
```jsx
const handleRemoveItem = (itemId) => {
  removeFromCart(itemId);
  setAlertConfig(ALERT_TYPES.REMOVED_FROM_CART);
  setShowAlert(true);
};
```

#### 5. **CheckoutPage.js** (Line 76)
**Current:**
```jsx
alert('Order placed successfully!');
```

**Replace with:**
```jsx
setAlertConfig(ALERT_TYPES.ORDER_SUCCESS);
setShowAlert(true);
// Then navigate
navigate('/orders');
```

#### 6. **Header.js** - Logout Confirmation
**Current:** Logout happens immediately

**Add confirmation:**
```jsx
const handleLogout = () => {
  setAlertConfig(ALERT_TYPES.LOGOUT_CONFIRM);
  setShowAlert(true);
};

// In AlertModal onConfirm:
onConfirm={() => {
  logout();
  navigate('/');
  setAlertConfig(ALERT_TYPES.LOGOUT_SUCCESS);
  setShowAlert(true);
}}
```

---

### 🟡 **MEDIUM PRIORITY - Enhance User Experience:**

#### 7. **LoginModal.js & RegisterModal.js**
**Add success notifications:**
```jsx
// After successful login
onLogin?.({ user: result });
setAlertConfig(ALERT_TYPES.LOGIN_SUCCESS);
setShowAlert(true);
```

```jsx
// After successful registration
setAlertConfig(ALERT_TYPES.REGISTRATION_SUCCESS);
setShowAlert(true);
```

#### 8. **ProfilePage.js**
**Add success notification:**
```jsx
const handleSave = () => {
  if (!validateProfile()) return;
  updateUser(profile);
  setIsEditing(false);
  setAlertConfig(ALERT_TYPES.PROFILE_UPDATED);
  setShowAlert(true);
};
```

#### 9. **ContactPage.js**
**Current:** Uses inline success message

**Could also use:**
```jsx
// After form submission
setAlertConfig({
  type: "success",
  title: "Message Sent",
  message: "We've received your message and will get back to you within 24 hours."
});
setShowAlert(true);
```

#### 10. **ShopPage.js** - After Login
**Add notification after login when adding to cart:**
```jsx
onLoginSuccess={() => {
  setShowLoginModal(false);
  if (pendingCartProduct) {
    addToCart(pendingCartProduct, 1);
    setAlertConfig(ALERT_TYPES.ADDED_TO_CART);
    setShowAlert(true);
  }
}}
```

---

### 🟢 **NICE TO HAVE - Future Enhancements:**

#### 11. **ProductDetailsPage.js** - Write Review Button
**Current:**
```jsx
onClick={() => alert('Review submission feature coming soon!')}
```

**Replace with:**
```jsx
onClick={() => {
  setAlertConfig({
    type: "info",
    title: "Review Feature",
    message: "Review submission feature is coming soon! Stay tuned."
  });
  setShowAlert(true);
}}
```

#### 12. **Footer.js** - FAQ Buttons
**Current:** Uses `alert()` for FAQ information

**Replace with:**
```jsx
<AlertModal
  isOpen={showFaqAlert}
  onClose={() => setShowFaqAlert(false)}
  type="info"
  title="Account FAQ"
  message="You can create an account to save your preferences and order history. Login to access your account anytime."
/>
```

---

## Implementation Examples

### Example 1: Cart Operations with Alerts

```jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import AlertModal, { ALERT_TYPES } from '../modals/AlertModal';

const CartPage = () => {
  const { removeFromCart, clearCart } = useCart();
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    setAlertConfig(ALERT_TYPES.REMOVED_FROM_CART);
    setShowAlert(true);
  };

  const handleClearCart = () => {
    setAlertConfig(ALERT_TYPES.CLEAR_CART_CONFIRM);
    setShowAlert(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setAlertConfig({
      type: "success",
      title: "Cart Cleared",
      message: "All items have been removed from your cart."
    });
    setShowAlert(true);
  };

  return (
    <>
      <button onClick={handleClearCart}>Clear Cart</button>
      
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertConfig}
        onConfirm={alertConfig === ALERT_TYPES.CLEAR_CART_CONFIRM ? confirmClearCart : undefined}
      />
    </>
  );
};
```

### Example 2: Login Required Alert

```jsx
import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import AlertModal, { ALERT_TYPES } from '../modals/AlertModal';
import LoginModal from '../modals/LoginModal';

const ProductCard = () => {
  const { user } = useUser();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    // Add to cart logic
  };

  const handleLoginAlertConfirm = () => {
    setShowLoginAlert(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <button onClick={handleAddToCart}>Add to Cart</button>
      
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        {...ALERT_TYPES.LOGIN_REQUIRED}
        onConfirm={handleLoginAlertConfirm}
      />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};
```

### Example 3: Order Success with Navigation

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal, { ALERT_TYPES } from '../modals/AlertModal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      // Process order...
      await createOrder(orderData);
      
      setAlertConfig(ALERT_TYPES.ORDER_SUCCESS);
      setShowAlert(true);
    } catch (error) {
      setAlertConfig(ALERT_TYPES.ORDER_FAILED);
      setShowAlert(true);
    }
  };

  const handleOrderSuccessConfirm = () => {
    navigate('/orders');
  };

  return (
    <>
      <button onClick={handlePlaceOrder}>Place Order</button>
      
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        {...alertConfig}
        onConfirm={
          alertConfig?.type === 'success' 
            ? handleOrderSuccessConfirm 
            : undefined
        }
      />
    </>
  );
};
```

### Example 4: Custom Alert with Dynamic Message

```jsx
const handleCustomAlert = (productName) => {
  setAlertConfig({
    type: "success",
    title: "Item Added",
    message: `${productName} has been added to your cart successfully!`
  });
  setShowAlert(true);
};
```

---

## Best Practices

### ✅ DO's:
1. **Use predefined types** when possible - they're consistent and tested
2. **Keep messages concise** - users should understand quickly
3. **Use appropriate alert types:**
   - `success` - Positive actions completed
   - `error` - Something went wrong
   - `warning` - Important information/actions needed
   - `info` - General information
   - `confirm` - Actions requiring confirmation
4. **Handle confirmations properly** - Use `onConfirm` callback for confirm types
5. **Auto-close success messages** - Consider auto-closing after 3-5 seconds for non-critical alerts

### ❌ DON'Ts:
1. **Don't overuse alerts** - Not every action needs an alert
2. **Don't block critical flows** - Use alerts for feedback, not blocking errors
3. **Don't use multiple alerts** - One alert at a time
4. **Don't use alerts for navigation** - Use alerts for feedback, navigate separately
5. **Don't forget to close** - Always provide a way to close the alert

---

## Quick Reference: All Current `alert()` Replacements

| File | Line | Current Usage | Recommended Replacement |
|------|------|---------------|------------------------|
| ProductCard.js | 27 | Login required | `ALERT_TYPES.LOGIN_REQUIRED` |
| ProductDetailsPage.js | 50 | Login required | `ALERT_TYPES.LOGIN_REQUIRED` |
| ProductDetailsPage.js | After addToCart | Success feedback | `ALERT_TYPES.ADDED_TO_CART` |
| OrdersPage.js | 130 | Tracking info | Custom info alert |
| CheckoutPage.js | 76 | Order success | `ALERT_TYPES.ORDER_SUCCESS` |
| Header.js | Logout | Add confirmation | `ALERT_TYPES.LOGOUT_CONFIRM` |
| CartPage.js | Remove item | Success feedback | `ALERT_TYPES.REMOVED_FROM_CART` |
| Footer.js | FAQ buttons | Info messages | Custom info alerts |

---

## Summary

The AlertModal component is a powerful tool to improve your application's user experience. It replaces ugly browser alerts with beautiful, themed modals that match your application's design.

**Start replacing alerts today!** Begin with the high-priority locations listed above, and you'll notice an immediate improvement in user experience.

**Key Benefits:**
- ✅ Better UX than native alerts
- ✅ Consistent design with your app
- ✅ More customizable
- ✅ Professional appearance
- ✅ Better accessibility

---

## Need Help?

If you need to create a custom alert that's not in the predefined types, use this template:

```jsx
const customAlert = {
  type: "success", // or "error", "warning", "info", "confirm"
  title: "Your Title",
  message: "Your message here",
  showCancel: false // Set to true for confirm type
};
```

Then use it:
```jsx
<AlertModal
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  {...customAlert}
  onConfirm={() => {
    // Optional: Handle confirmation
  }}
/>
```

