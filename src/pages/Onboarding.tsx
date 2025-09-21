import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, User, Building, Globe, Users, Briefcase } from 'lucide-react';

interface OnboardingData {
  fullName: string;
  companyName: string;
  companyDomain: string;
  numberOfEmployees: string;
  organizationSize: string;
  userRole: string;
}

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    companyName: '',
    companyDomain: '',
    numberOfEmployees: '',
    organizationSize: '',
    userRole: '',
  });
  
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User,
      fields: ['fullName']
    },
    {
      title: 'Company Details',
      description: 'Information about your organization',
      icon: Building,
      fields: ['companyName', 'companyDomain']
    },
    {
      title: 'Organization Size',
      description: 'Help us understand your company scale',
      icon: Users,
      fields: ['numberOfEmployees', 'organizationSize']
    },
    {
      title: 'Your Role',
      description: 'What\'s your position in the organization?',
      icon: Briefcase,
      fields: ['userRole']
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data (in a real app, you'd save this to your database)
      localStorage.setItem('onboardingData', JSON.stringify(data));
      navigate('/welcome');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    return currentStepData.fields.every(field => data[field as keyof OnboardingData].trim() !== '');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={data.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter your company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDomain">Company Domain</Label>
              <Input
                id="companyDomain"
                value={data.companyDomain}
                onChange={(e) => handleInputChange('companyDomain', e.target.value)}
                placeholder="e.g., example.com"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">Number of Employees</Label>
              <Select value={data.numberOfEmployees} onValueChange={(value) => handleInputChange('numberOfEmployees', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organizationSize">Organization Size</Label>
              <Select value={data.organizationSize} onValueChange={(value) => handleInputChange('organizationSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="small-business">Small Business</SelectItem>
                  <SelectItem value="medium-business">Medium Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userRole">Your Role</Label>
              <Select value={data.userRole} onValueChange={(value) => handleInputChange('userRole', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="cto">CTO</SelectItem>
                  <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                  <SelectItem value="product-manager">Product Manager</SelectItem>
                  <SelectItem value="sales-manager">Sales Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/Nexara_logo.png" 
            alt="Nexara" 
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Nexara!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's get to know you better
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <currentStepData.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepComplete()}
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
