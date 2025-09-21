import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';
import { RazorpayService, RazorpayFrontend } from '@/services/razorpayService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '3 campaigns',
        '1,000 audience max per campaign',
        '5 WhatsApp templates',
        'Basic analytics',
        'Email support'
      ],
      limitations: [
        'Limited customization',
        'Basic reporting'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹2,000',
      period: 'per month',
      description: 'Best for growing businesses',
      features: [
        '10 campaigns',
        '10,000 audience max per campaign',
        '100 WhatsApp templates',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'A/B testing',
        'Advanced automation'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      features: [
        'Unlimited campaigns',
        'Unlimited audience',
        'Unlimited templates',
        'Advanced analytics & reporting',
        '24/7 dedicated support',
        'Custom integrations',
        'White-label solution',
        'SLA guarantee',
        'Custom training'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      // Redirect to campaigns page for free users
      navigate('/engage/campaigns');
    } else if (planId === 'pro') {
      await handleProPlanPayment();
    } else if (planId === 'enterprise') {
      // Show contact form or redirect to contact
      navigate('/contact');
    }
  };

  const handleProPlanPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create Razorpay order
      const order = await RazorpayService.createOrder({
        amount: 200000, // ₹2000 in paise
        currency: 'INR',
        receipt: `pro_plan_${user.id}_${Date.now()}`,
        notes: {
          plan: 'pro',
          user_id: user.id,
          user_email: user.email || '',
        },
      });

      // Open Razorpay payment modal
      await RazorpayFrontend.openPaymentModal({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'Nexara',
        description: 'Pro Plan - Monthly Subscription',
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#3399cc',
        },
        onSuccess: async (paymentId: string, orderId: string, signature: string) => {
          try {
            // Verify payment signature
            const isValid = RazorpayService.verifyPaymentSignature(orderId, paymentId, signature);
            
            if (isValid) {
              toast({
                title: "Payment Successful!",
                description: "Welcome to Nexara Pro! You now have access to all Pro features.",
              });
              
              // Redirect to campaigns page
              navigate('/engage/campaigns');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if you were charged.",
              variant: "destructive",
            });
          }
        },
        onError: (error: any) => {
          console.error('Payment error:', error);
          toast({
            title: "Payment Failed",
            description: error.message || "Payment was cancelled or failed. Please try again.",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error('Payment setup error:', error);
      toast({
        title: "Payment Setup Failed",
        description: "Unable to initialize payment. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <img 
            src="/Nexara_logo.png" 
            alt="Nexara" 
            className="mx-auto h-12 w-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. Start free and upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'} ${
                selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Features included:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Limitations:</h4>
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.buttonVariant}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isProcessingPayment && plan.id === 'pro'}
                >
                  {isProcessingPayment && plan.id === 'pro' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need help choosing?
              </h3>
              <p className="text-blue-700 mb-4">
                Our team is here to help you find the perfect plan for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleContactSales}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Sales
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContactSales}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/engage/campaigns')}
            className="text-gray-600 hover:text-gray-900"
          >
            Skip for now - Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
