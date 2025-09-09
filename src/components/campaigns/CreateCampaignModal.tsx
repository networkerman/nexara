import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft,
  MessageSquare, 
  Search, 
  Mail, 
  MessageCircle, 
  Smartphone, 
  Globe,
  MessageSquareText,
  Monitor,
  Users,
  X,
  Info,
  RefreshCw,
  ChevronDown,
  Check,
  Send,
  Calendar,
  Clock,
  Settings,
  Edit,
  ChevronRight,
  Palette,
  Target,
  Zap
} from 'lucide-react';

// Import carousel images
import odImage from '@/assets/od.png';
import savingsImage from '@/assets/savings.png';
import creditcardImage from '@/assets/creditcard.png';
import fdImage from '@/assets/fd.png';
import insuranceImage from '@/assets/insurance.png';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'start' | 'channels' | 'setup' | 'audience' | 'content' | 'schedule' | 'preview';

interface CampaignFormData {
  campaignName: string;
  tags: string[];
  businessNumber: string;
  linkTracking: boolean;
  conversionGoal: boolean;
  eventName: string;
  conversionWindow: number;
  revenueParameter: string;
  deduplication: boolean;
  targetAudience: 'all' | 'segments';
  selectedSegments: string[];
  excludeContacts: boolean;
  selectedTemplate: string;
  scheduleType: 'now' | 'later' | 'optimize';
  startTime: string;
  endTime: string;
  timezone: string;
  frequencyCap: boolean;
  controlGroup: boolean;
  controlGroupPercentage: number;
  specificTime: string;
  isPublished: boolean;
  sendLimit: boolean;
  maxRecipients: number;
  samplingMethod: 'random' | 'priority';
  retryEnabled: boolean;
  retryDuration: number;
  stopOnConversion: boolean;
  stopOnManualPause: boolean;
  stopOnTemplateChange: boolean;
}

interface CarouselCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  altText: string;
  buttons: {
    text: string;
    url: string;
  }[];
}

interface HDFCCarouselTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Marketing' | 'Promotional' | 'Utility';
  status: 'Active' | 'Paused' | 'Disabled';
  cards?: CarouselCard[];
}

const whatsappTemplates: HDFCCarouselTemplate[] = [
  {
    id: 'static_carousel_recs_url',
    name: 'static_carousel_recs_url',
    description: 'Carousel template for product recommendations',
    category: 'Marketing',
    status: 'Active'
  },
  {
    id: 'HDFC_Carousel_BFSI_Q3',
    name: 'HDFC_Carousel_BFSI_Q3',
    description: 'HDFC Banking and Financial Services carousel template for Q3 marketing campaigns',
    category: 'Promotional',
    status: 'Active',
    cards: [
      {
        id: 'smartbiz_od',
        title: 'SmartBiz OD',
        subtitle: 'Get OD up to ₹10L against QR collections.',
        image: odImage,
        altText: 'SmartBiz Overdraft facility icon',
        buttons: [
          { text: 'Apply now', url: '/od/apply?cid={{campaign_id}}' },
          { text: 'Know more', url: '/od/info' }
        ]
      },
      {
        id: 'savings_account',
        title: 'Open Savings A/c',
        subtitle: 'Zero-balance a/c, UPI-ready in minutes.',
        image: savingsImage,
        altText: 'Savings account opening icon',
        buttons: [
          { text: 'Open account', url: '/acct/open' },
          { text: 'View benefits', url: '/acct/benefits' }
        ]
      },
      {
        id: 'credit_card',
        title: 'Activate Credit Card',
        subtitle: 'Activate & get ₹500 cashback on first spend.',
        image: creditcardImage,
        altText: 'Credit card activation icon',
        buttons: [
          { text: 'Activate now', url: '/card/activate' },
          { text: 'Offer T&C', url: '/offers/cc-tnc' }
        ]
      },
      {
        id: 'fixed_deposit',
        title: 'FD @ 7.5% p.a.',
        subtitle: 'Lock in guaranteed returns.',
        image: fdImage,
        altText: 'Fixed deposit investment icon',
        buttons: [
          { text: 'Book FD', url: '/fd/book' },
          { text: 'Calculate returns', url: '/fd/calc' }
        ]
      },
      {
        id: 'insurance',
        title: 'Insurance Protection',
        subtitle: 'Secure your business with health cover.',
        image: insuranceImage,
        altText: 'Business insurance protection icon',
        buttons: [
          { text: 'Get quote', url: '/ins/quote' },
          { text: 'Talk to RM', url: '/rm/connect' }
        ]
      }
    ]
  }
];

// Personalization tokens
const personalizationTokens = {
  first_name: 'Rajesh',
  rm_name: 'Priya Sharma', 
  city: 'Mumbai'
};

const processPersonalization = (text: string) => {
  return text
    .replace(/\{\{first_name\}\}/g, personalizationTokens.first_name)
    .replace(/\{\{rm_name\}\}/g, personalizationTokens.rm_name)
    .replace(/\{\{city\}\}/g, personalizationTokens.city);
};

export default function CreateCampaignModal({ open, onClose }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('start');
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: '',
    tags: [],
    businessNumber: '',
    linkTracking: false,
    conversionGoal: false,
    eventName: '',
    conversionWindow: 7,
    revenueParameter: '',
    deduplication: true,
    targetAudience: 'all',
    selectedSegments: [],
    excludeContacts: false,
    selectedTemplate: '',
    scheduleType: 'now',
    startTime: '',
    endTime: '',
    timezone: 'Asia/Kolkata',
    frequencyCap: false,
    controlGroup: false,
    controlGroupPercentage: 10,
    specificTime: '',
    isPublished: false,
    sendLimit: false,
    maxRecipients: 1000,
    samplingMethod: 'random',
    retryEnabled: false,
    retryDuration: 3,
    stopOnConversion: false,
    stopOnManualPause: false,
    stopOnTemplateChange: false
  });

  const navigate = useNavigate();
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Template Dropdown Component
  const TemplateDropdown = ({ selectedTemplate, onTemplateChange }: { 
    selectedTemplate: string;
    onTemplateChange: (template: string) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, 300);
      return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredTemplates = useMemo(() => {
      return whatsappTemplates.filter(template =>
        template.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }, [debouncedQuery]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedTemplate || "Select template"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search templates..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No templates found.</CommandEmpty>
            <CommandGroup>
              {filteredTemplates.map((template) => (
                <CommandItem
                  key={template.id}
                  onSelect={() => {
                    onTemplateChange(template.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedTemplate === template.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {template.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // HDFC Carousel Preview Component
  const HDFCCarouselPreview = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const template = whatsappTemplates.find(t => t.id === 'HDFC_Carousel_BFSI_Q3');
    const cards = template?.cards || [];

    const handleSwipe = (direction: 'left' | 'right') => {
      if (direction === 'left' && currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (direction === 'right' && currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    };

    if (!cards.length) return null;

    const currentCard = cards[currentCardIndex];

    return (
      <div className="bg-white rounded-lg p-3 max-w-[220px] ml-auto shadow-sm">
        <p className="text-sm mb-3 text-gray-700">
          Hi {personalizationTokens.first_name}! 👋 Explore our latest banking solutions from {personalizationTokens.city}.
        </p>
        
        {/* Carousel Card */}
        <div className="border rounded-lg overflow-hidden mb-3">
          <div className="relative">
            <img 
              src={currentCard.image} 
              alt={currentCard.altText}
              className="w-full h-24 object-cover"
            />
            {/* Swipe indicators */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-1">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentCardIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-sm mb-1">{processPersonalization(currentCard.title)}</h4>
            <p className="text-xs text-gray-600 mb-2">{processPersonalization(currentCard.subtitle)}</p>
            <div className="flex flex-col space-y-1">
              {currentCard.buttons.map((button, index) => (
                <Button 
                  key={index}
                  variant="link" 
                  size="sm" 
                  className="text-xs p-0 h-auto text-blue-600 justify-start"
                >
                  🔗 {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleSwipe('right')}
            disabled={currentCardIndex === 0}
          >
            ←
          </Button>
          <span className="text-xs text-gray-500">
            {currentCardIndex + 1} of {cards.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleSwipe('left')}
            disabled={currentCardIndex === cards.length - 1}
          >
            →
          </Button>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 mb-2">
          Contact your RM {personalizationTokens.rm_name} for assistance.
        </div>
        
        <div className="text-xs text-gray-400 border-t pt-2">
          T&C apply. Banking services by HDFC Bank.
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>😊</span>
          <span>🗂️</span>
          <span>📎</span>
          <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
            ↓
          </span>
        </div>
      </div>
    );
  };

  const renderContentStep = () => (
    <div className="h-screen flex gap-6">
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="p-6 pb-4">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentStep('audience')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setCurrentStep('preview')}>
                    Preview
                  </Button>
                  <Button onClick={() => setCurrentStep('schedule')}>
                    Next: Schedule
                  </Button>
                </div>
              </div>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-6">
            <div>
              <Label className="text-base font-medium">Template</Label>
              <p className="text-sm text-muted-foreground mb-3">Choose your template</p>
              <div className="mt-1">
                <TemplateDropdown
                  selectedTemplate={formData.selectedTemplate}
                  onTemplateChange={(template) => updateFormData({ selectedTemplate: template })}
                />
              </div>
            </div>

            {/* HDFC Compliance Note */}
            {formData.selectedTemplate === 'HDFC_Carousel_BFSI_Q3' && (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Meta-approved marketing template preview</strong> - Copy is illustrative. 
                    No PII/balance shown. T&C apply. Banking services by HDFC Bank.
                  </AlertDescription>
                </Alert>

                {/* Personalization Tokens */}
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <h4 className="font-medium mb-2 text-green-800">Personalization Preview</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <div><code>{"{{first_name}}"}</code> → {personalizationTokens.first_name}</div>
                    <div><code>{"{{rm_name}}"}</code> → {personalizationTokens.rm_name}</div>
                    <div><code>{"{{city}}"}</code> → {personalizationTokens.city}</div>
                  </div>
                </div>
              </>
            )}

            {/* Template Status Warning */}
            {formData.selectedTemplate && whatsappTemplates.find(t => t.id === formData.selectedTemplate)?.status === 'Paused' && (
              <Alert className="mb-4 border-warning bg-warning/10">
                <Info className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  Warning: Selected template is paused by Meta. Template will be blocked until reactivated.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Phone Mockup */}
      <div className="w-80 bg-muted/20 p-6 border-l border-border">
        {/* Phone Mockup */}
        <div className="flex justify-center">
          <div className="relative w-64 h-[500px] bg-black rounded-[2rem] p-2">
            <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/770b7510-d3df-445b-b9b0-7971f7f8105b.png" 
                    alt="Netcore Logo" 
                    className="w-5 h-5 rounded-sm"
                  />
                </div>
                <span className="font-medium">
                  {formData.selectedTemplate === 'HDFC_Carousel_BFSI_Q3' ? 'HDFC Bank' : 'Netcore Cloud'}
                </span>
              </div>
              
              {/* Message Content */}
              <div className="p-4 bg-gray-50 flex-1 h-full overflow-y-auto">
                {formData.selectedTemplate === 'HDFC_Carousel_BFSI_Q3' ? (
                  <HDFCCarouselPreview />
                ) : formData.selectedTemplate ? (
                  <div className="bg-white rounded-lg p-3 max-w-[200px] ml-auto shadow-sm">
                    <p className="text-sm mb-2">
                      Check out our top deals and grab your favorites before the stock runs out!
                    </p>
                    
                    <div className="flex space-x-2 mb-3">
                      <div className="flex-1 bg-green-100 rounded-lg p-2">
                        <div className="w-full h-16 bg-orange-200 rounded mb-2"></div>
                        <p className="text-xs font-medium">Flat 30% OFF on our best-selling sneakers.</p>
                        <div className="flex flex-col space-y-1 mt-2">
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto text-blue-600">
                            🔗 Visit Website
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>😊</span>
                      <span>🗂️</span>
                      <span>📎</span>
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ↓
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-sm">
                    Select a template to see preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Send Test Message */}
        {formData.selectedTemplate && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full">
              📱 Send test message
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const handlePublish = () => {
    // Validation: Check if template is disabled/paused for HDFC
    const selectedTemplate = whatsappTemplates.find(t => t.id === formData.selectedTemplate);
    
    if (formData.selectedTemplate === 'HDFC_Carousel_BFSI_Q3' && selectedTemplate?.status !== 'Active') {
      return; // Blocked by compliance
    }

    updateFormData({ isPublished: true });
    setShowProgressPopup(true);
    setCurrentProgressStep(0);

    // Simulate progress steps
    const steps = ['Validating template', 'Processing audience', 'Scheduling delivery', 'Publishing campaign'];
    
    steps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentProgressStep(index + 1);
        
        if (index === steps.length - 1) {
          // Final step - redirect with success
          setTimeout(() => {
            setShowProgressPopup(false);
            onClose();
            
            // Generate campaign ID for redirect
            const campaignId = 'camp_' + Date.now();
            navigate(`/engage/campaigns?published=true&id=${campaignId}`, { 
              replace: true 
            });
          }, 1000);
        }
      }, (index + 1) * 1000);
    });
  };

  // Simple content step render for this focused implementation
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen p-0 gap-0">
        {currentStep === 'content' && renderContentStep()}
        {currentStep !== 'content' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">Campaign Creation</h2>
              <p className="text-muted-foreground">Navigate through the campaign creation steps</p>
              <Button onClick={() => setCurrentStep('content')}>
                Go to Content Step
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}