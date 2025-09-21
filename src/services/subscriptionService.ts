import { RazorpayService, SubscriptionPlan, SubscriptionOptions } from './razorpayService';

// Pro Plan Configuration
export const PRO_PLAN_CONFIG = {
  name: 'Nexara Pro Plan',
  amount: 200000, // ₹2000 in paise
  currency: 'INR',
  description: 'Pro Plan - Monthly Subscription with advanced features',
  interval: 1, // Monthly
  period: 'monthly'
};

export class SubscriptionService {
  private static planId: string | null = null;

  /**
   * Get or create the Pro plan
   */
  static async getOrCreateProPlan(): Promise<string> {
    if (this.planId) {
      return this.planId;
    }

    try {
      // Try to find existing plan first
      // For now, we'll create a new plan each time
      // In production, you'd want to store the plan ID and reuse it
      
      const planData: SubscriptionPlan = {
        id: `plan_pro_${Date.now()}`, // Unique plan ID
        item: {
          name: PRO_PLAN_CONFIG.name,
          amount: PRO_PLAN_CONFIG.amount,
          currency: PRO_PLAN_CONFIG.currency,
          description: PRO_PLAN_CONFIG.description,
        },
        period: PRO_PLAN_CONFIG.period,
        interval: PRO_PLAN_CONFIG.interval,
        notes: {
          plan_type: 'pro',
          created_by: 'nexara_app'
        }
      };

      const plan = await RazorpayService.createSubscriptionPlan(planData);
      this.planId = plan.id;
      return plan.id;
    } catch (error) {
      console.error('Error creating Pro plan:', error);
      throw new Error('Failed to create subscription plan');
    }
  }

  /**
   * Create a Pro subscription for a user
   */
  static async createProSubscription(userId: string, userEmail: string): Promise<string> {
    try {
      const planId = await this.getOrCreateProPlan();
      
      const subscriptionData: SubscriptionOptions = {
        plan_id: planId,
        customer_notify: 1, // Notify customer
        quantity: 1,
        total_count: 12, // 12 months subscription
        start_at: Math.floor(Date.now() / 1000), // Start immediately
        expire_by: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // Expire in 1 year
        notes: {
          user_id: userId,
          user_email: userEmail,
          plan_type: 'pro',
          created_at: new Date().toISOString()
        }
      };

      const subscription = await RazorpayService.createSubscription(subscriptionData);
      return subscription.id;
    } catch (error) {
      console.error('Error creating Pro subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscriptionDetails(subscriptionId: string) {
    try {
      return await RazorpayService.getSubscription(subscriptionId);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      throw new Error('Failed to fetch subscription details');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      return await RazorpayService.cancelSubscription(subscriptionId);
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
      return await RazorpayService.pauseSubscription(subscriptionId);
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
      return await RazorpayService.resumeSubscription(subscriptionId);
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw new Error('Failed to resume subscription');
    }
  }

  /**
   * Check if subscription is active
   */
  static isSubscriptionActive(subscription: any): boolean {
    return subscription && subscription.status === 'active';
  }

  /**
   * Get subscription status text
   */
  static getSubscriptionStatusText(subscription: any): string {
    if (!subscription) return 'No subscription';
    
    switch (subscription.status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      case 'halted':
        return 'Halted';
      default:
        return subscription.status || 'Unknown';
    }
  }

  /**
   * Get next billing date
   */
  static getNextBillingDate(subscription: any): string | null {
    if (!subscription || !subscription.current_end) return null;
    
    const nextBilling = new Date(subscription.current_end * 1000);
    return nextBilling.toLocaleDateString();
  }

  /**
   * Get subscription amount in rupees
   */
  static getSubscriptionAmountInRupees(subscription: any): number {
    if (!subscription || !subscription.plan) return 0;
    return subscription.plan.item.amount / 100; // Convert from paise to rupees
  }
}

export default SubscriptionService;
