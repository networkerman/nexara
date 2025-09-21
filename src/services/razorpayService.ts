import Razorpay from 'razorpay';

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RKGIiOpJ5YvWRB';
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'bm7Eh4jc3qM9rR2RUT4NHR1h';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// Payment options interface
export interface PaymentOptions {
  amount: number; // Amount in paise (₹2000 = 200000 paise)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

// Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  item: {
    name: string;
    amount: number;
    currency: string;
    description: string;
  };
  period: string;
  interval: number;
  notes?: Record<string, string>;
}

// Subscription options interface
export interface SubscriptionOptions {
  plan_id: string;
  customer_notify: number;
  quantity: number;
  total_count: number;
  start_at: number;
  expire_by: number;
  notes?: Record<string, string>;
}

// Order creation interface
export interface OrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export class RazorpayService {
  /**
   * Create a Razorpay order
   */
  static async createOrder(options: PaymentOptions): Promise<OrderResponse> {
    try {
      const order = await razorpay.orders.create({
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        notes: options.notes || {},
      });

      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  /**
   * Verify payment signature
   */
  static verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      const crypto = require('crypto');
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(paymentId: string) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  /**
   * Get order details
   */
  static async getOrderDetails(orderId: string) {
    try {
      const order = await razorpay.orders.fetch(orderId);
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw new Error('Failed to fetch order details');
    }
  }

  /**
   * Refund payment
   */
  static async refundPayment(paymentId: string, amount?: number) {
    try {
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount, // If not provided, full refund
      });
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Create a subscription plan
   */
  static async createSubscriptionPlan(planData: SubscriptionPlan) {
    try {
      const plan = await razorpay.plans.create(planData);
      return plan;
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw new Error('Failed to create subscription plan');
    }
  }

  /**
   * Create a subscription
   */
  static async createSubscription(subscriptionData: SubscriptionOptions) {
    try {
      const subscription = await razorpay.subscriptions.create(subscriptionData);
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new Error('Failed to fetch subscription details');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Pause subscription
   */
  static async pauseSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.pause(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      throw new Error('Failed to pause subscription');
    }
  }

  /**
   * Resume subscription
   */
  static async resumeSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.resume(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw new Error('Failed to resume subscription');
    }
  }
}

// Frontend Razorpay integration
export class RazorpayFrontend {
  /**
   * Open Razorpay payment modal
   */
  static async openPaymentModal(options: {
    orderId: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    onSuccess?: (paymentId: string, orderId: string, signature: string) => void;
    onError?: (error: any) => void;
  }) {
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: options.prefill || {},
      theme: options.theme || { color: '#3399cc' },
      handler: function (response: any) {
        if (options.onSuccess) {
          options.onSuccess(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
        }
      },
      modal: {
        ondismiss: function () {
          if (options.onError) {
            options.onError(new Error('Payment cancelled by user'));
          }
        },
      },
    };

    // Use preloaded Razorpay script
    if (typeof (window as any).Razorpay !== 'undefined') {
      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.open();
    } else {
      throw new Error('Razorpay script not loaded');
    }
  }

  /**
   * Open Razorpay subscription payment modal
   */
  static async openSubscriptionModal(options: {
    subscriptionId: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    onSuccess?: (paymentId: string, subscriptionId: string, signature: string) => void;
    onError?: (error: any) => void;
  }) {
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      subscription_id: options.subscriptionId,
      name: options.name,
      description: options.description,
      prefill: options.prefill || {},
      theme: options.theme || { color: '#3399cc' },
      handler: function (response: any) {
        if (options.onSuccess) {
          options.onSuccess(response.razorpay_payment_id, response.razorpay_subscription_id, response.razorpay_signature);
        }
      },
      modal: {
        ondismiss: function () {
          if (options.onError) {
            options.onError(new Error('Subscription payment cancelled by user'));
          }
        },
      },
    };

    // Use preloaded Razorpay script
    if (typeof (window as any).Razorpay !== 'undefined') {
      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.open();
    } else {
      throw new Error('Razorpay script not loaded');
    }
  }
}

export default RazorpayService;
