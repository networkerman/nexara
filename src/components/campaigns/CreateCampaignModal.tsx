import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
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
  Check
} from 'lucide-react';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'start' | 'channels' | 'setup' | 'audience';

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
}

const businessNumbers = [
  {
    id: 'netcore',
    name: 'Netcore Solutions Support (+91 2249757637)',
    quality: 'HIGH',
    messagingLimit: '10000 Messaging limit per 24hrs',
    lastUpdated: 'Sep 09, 2025 12:03 PM'
  }
];

const adobeSegments = [
  {
    id: '66',
    name: 'Test 32 Africa',
    users: 295,
    lastRefreshed: '2025-09-09 11:50:50'
  },
  {
    id: '68', 
    name: 'test-segs',
    users: 43,
    lastRefreshed: '2025-09-09 11:21:31'
  },
  {
    id: '164',
    name: 'Unique-RCS-Sent',
    users: 0,
    lastRefreshed: '2025-09-09 01:39:08'
  }
];

const startOptions = [
  {
    id: 'engage',
    title: 'Engage with users',
    description: 'Create personalized campaigns and user journeys',
    icon: MessageSquare,
  },
  {
    id: 'analyze',
    title: 'Analyze user behaviour',
    description: 'Create funnels, cohorts, and RFM to measure performance',
    icon: Search,
  },
  {
    id: 'template',
    title: 'Create template',
    description: 'Customize reusable templates for your campaigns',
    icon: MessageSquareText,
  },
  {
    id: 'contacts',
    title: 'Manage contacts',
    description: 'Add contacts, import list or create segment',
    icon: Users,
  },
];

const channelOptions = [
  {
    category: 'Journey',
    items: [
      { id: 'journey', name: 'Journey', icon: MessageSquare, color: 'text-blue-600' }
    ]
  },
  {
    category: 'Campaigns',
    items: [
      { id: 'email', name: 'Email', icon: Mail, color: 'text-blue-600' },
      { id: 'sms', name: 'SMS', icon: MessageCircle, color: 'text-purple-600' },
      { id: 'app-push', name: 'App push', icon: Smartphone, color: 'text-purple-600' },
      { id: 'web-push', name: 'Web push', icon: Globe, color: 'text-gray-600' },
    ]
  },
  {
    category: 'Messaging',
    items: [
      { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', badge: 'New' },
      { id: 'rcs', name: 'RCS', icon: MessageCircle, color: 'text-blue-600', badge: 'New' },
    ]
  },
  {
    category: 'On-site',
    items: [
      { id: 'in-app', name: 'In-app message', icon: Smartphone, color: 'text-blue-600' },
      { id: 'web-message', name: 'Web message', icon: Monitor, color: 'text-gray-600' },
    ]
  }
];

const SummaryPanel = ({ formData }: { formData: CampaignFormData }) => {
  const getSelectedSegmentData = () => {
    return adobeSegments.filter(segment => 
      formData.selectedSegments.includes(segment.id)
    );
  };

  return (
    <div className="w-80 bg-muted/20 p-6 border-l border-border">
      <h3 className="text-lg font-semibold mb-6">Summary</h3>
      
      <div className="space-y-4">
        {/* Setup Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Setup</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Campaign name:</span>
              <div>{formData.campaignName}</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium text-foreground">Conversion activity:</span>
              <div>{formData.eventName}</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Conversion window:</span>
              <div>{formData.conversionWindow} Days</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Revenue parameter:</span>
              <div>{formData.revenueParameter}</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Business number:</span>
              <div>Netcore Solutions Support (+91 2249757637)</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Link tracking:</span>
              <div>{formData.linkTracking ? 'Enabled' : 'Disabled'}</div>
            </div>
            <div>
              <span className="font-medium text-foreground">Deduplication:</span>
              <div>{formData.deduplication ? 'On' : 'Off'}</div>
            </div>
          </div>
        </div>

        {/* Audience Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Audience</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Target audience:</span>
              <div>{formData.targetAudience === 'all' ? 'All contacts' : 'Lists/Segments'}</div>
            </div>
            {formData.targetAudience === 'segments' && formData.selectedSegments.length > 0 && (
              <div>
                <span className="font-medium text-foreground">Selected segments:</span>
                {getSelectedSegmentData().map(segment => (
                  <div key={segment.id} className="flex items-center space-x-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {segment.name}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div>
              <span className="font-medium text-foreground">Excluded audience:</span>
              <div>Exclude list/segment</div>
              <div>{formData.excludeContacts ? 'On' : 'Off'}</div>
            </div>
          </div>
        </div>

        {/* Content Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Content</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Schedule Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Schedule</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function CreateCampaignModal({ open, onClose }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('start');
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: 'Adobe',
    tags: ['Adobe'],
    businessNumber: 'netcore',
    linkTracking: true,
    conversionGoal: true,
    eventName: 'Add To Cart',
    conversionWindow: 1,
    revenueParameter: 'price',
    deduplication: true,
    targetAudience: 'segments',
    selectedSegments: [],
    excludeContacts: false
  });

  const handleStartOptionClick = (optionId: string) => {
    if (optionId === 'engage') {
      setCurrentStep('channels');
    }
  };

  const handleChannelClick = (channelId: string) => {
    if (channelId === 'whatsapp') {
      setCurrentStep('setup');
    }
  };

  const handleBack = () => {
    if (currentStep === 'channels') {
      setCurrentStep('start');
    } else if (currentStep === 'setup') {
      setCurrentStep('channels');
    } else if (currentStep === 'audience') {
      setCurrentStep('setup');
    }
  };

  const handleNext = () => {
    if (currentStep === 'setup') {
      setCurrentStep('audience');
    }
  };

  const handleClose = () => {
    setCurrentStep('start');
    setFormData({
      campaignName: 'Adobe',
      tags: ['Adobe'],
      businessNumber: 'netcore',
      linkTracking: true,
      conversionGoal: true,
      eventName: 'Add To Cart',
      conversionWindow: 1,
      revenueParameter: 'price',
      deduplication: true,
      targetAudience: 'segments',
      selectedSegments: [],
      excludeContacts: false
    });
    onClose();
  };

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const renderStartStep = () => (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">How would you like to start?</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        {startOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleStartOptionClick(option.id)}
            className="p-6 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-foreground">{option.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderChannelsStep = () => (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <DialogTitle className="text-xl font-semibold">
            How do you want to engage with your users?
          </DialogTitle>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {channelOptions.map((category) => (
          <div key={category.category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {category.category}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleChannelClick(item.id)}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left flex items-center space-x-3"
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium text-foreground">{item.name}</span>
                  {item.badge && (
                    <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Personalization
        </h3>
        <div className="text-center text-muted-foreground text-sm">
          Additional personalization options available
        </div>
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <div className="flex">
      <div className="flex-1 p-6">
        <DialogHeader className="mb-6">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-primary">Setup</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Audience</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm text-muted-foreground">Content</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm">
              4
            </div>
            <span className="text-sm text-muted-foreground">Schedule</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Campaign Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Campaign details</h3>
            <p className="text-sm text-muted-foreground mb-4">Provide basic details about your campaign</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign name *</Label>
                <Input
                  id="campaignName"
                  value={formData.campaignName}
                  onChange={(e) => updateFormData({ campaignName: e.target.value })}
                  placeholder="Campaign name"
                  className="mt-1"
                />
                <div className="flex justify-end text-xs text-muted-foreground mt-1">
                  {formData.campaignName.length}/100
                </div>
              </div>

              <div>
                <Label htmlFor="businessNumber">Business number *</Label>
                <Select 
                  value={formData.businessNumber} 
                  onValueChange={(value) => updateFormData({ businessNumber: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {businessNumbers.map((number) => (
                      <SelectItem key={number.id} value={number.id}>
                        {number.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="mt-2 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quality rating:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">HIGH</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Messaging limit:</span>
                    <span className="text-foreground">10000 Messaging limit per 24hrs.</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span className="text-foreground">Sep 09, 2025 12:03 PM</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Add tags <Info className="w-4 h-4 inline ml-1 text-muted-foreground" /></Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Select upto 5 tags</p>
              </div>
            </div>
          </div>

          {/* Link Tracking */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Link tracking</h4>
                <p className="text-sm text-muted-foreground">Link tracking has been enabled</p>
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="domain">Domain name</Label>
              <Input
                id="domain"
                value="nctrckg.com"
                disabled
                className="mt-1 bg-muted"
              />
            </div>
          </div>

          {/* Conversion Goal */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Set conversion goal</h4>
                <p className="text-sm text-muted-foreground">Select the event you would like to count as a conversion</p>
              </div>
              <Switch 
                checked={formData.conversionGoal}
                onCheckedChange={(checked) => updateFormData({ conversionGoal: checked })}
              />
            </div>
            
            {formData.conversionGoal && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Event name</Label>
                  <Select 
                    value={formData.eventName} 
                    onValueChange={(value) => updateFormData({ eventName: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Add To Cart">Add To Cart</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Sign Up">Sign Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="payloadParams"
                    className="mt-1"
                  />
                  <Label htmlFor="payloadParams" className="text-sm">
                    Specify payload parameters
                  </Label>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="conversionWindow">Conversion window</Label>
                    <div className="flex mt-1">
                      <Input
                        id="conversionWindow"
                        type="number"
                        value={formData.conversionWindow}
                        onChange={(e) => updateFormData({ conversionWindow: Number(e.target.value) })}
                        className="rounded-r-none"
                      />
                      <Select value="Days">
                        <SelectTrigger className="w-20 rounded-l-none border-l-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Days">Days</SelectItem>
                          <SelectItem value="Hours">Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="revenueParameter">Revenue parameter</Label>
                    <Select 
                      value={formData.revenueParameter} 
                      onValueChange={(value) => updateFormData({ revenueParameter: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">price</SelectItem>
                        <SelectItem value="amount">amount</SelectItem>
                        <SelectItem value="total">total</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deduplication */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Deduplication</h4>
                <p className="text-sm text-muted-foreground">Avoid duplicate communication to contacts</p>
              </div>
              <Switch 
                checked={formData.deduplication}
                onCheckedChange={(checked) => updateFormData({ deduplication: checked })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline">FINISH LATER</Button>
          <Button onClick={handleNext}>NEXT STEP</Button>
        </div>
      </div>
      
      <SummaryPanel formData={formData} />
    </div>
  );

  const renderAudienceStep = () => (
    <div className="flex">
      <div className="flex-1 p-6">
        <DialogHeader className="mb-6">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-primary">Setup</span>
          </div>
          <div className="flex-1 h-px bg-primary"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-primary">Audience</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-sm text-muted-foreground">Content</span>
          </div>
          <div className="flex-1 h-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm">
              4
            </div>
            <span className="text-sm text-muted-foreground">Schedule</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Target Audience */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Target audience</h3>
                <p className="text-sm text-muted-foreground">Select your target audience for the campaign</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Reachable contacts</span>
                <span className="font-medium">3</span>
                <Info className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="allContacts"
                  name="targetAudience"
                  checked={formData.targetAudience === 'all'}
                  onChange={() => updateFormData({ targetAudience: 'all' })}
                  className="w-4 h-4"
                />
                <Label htmlFor="allContacts">All contacts</Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="segments"
                  name="targetAudience"
                  checked={formData.targetAudience === 'segments'}
                  onChange={() => updateFormData({ targetAudience: 'segments' })}
                  className="w-4 h-4"
                />
                <Label htmlFor="segments">Lists/Segments</Label>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {formData.targetAudience === 'segments' && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Adobe Campaign -segment 31
                  <X className="w-3 h-3 ml-1 cursor-pointer" />
                </Badge>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input 
                  placeholder="Search" 
                  className="pl-10"
                />
              </div>

              <div className="border border-border rounded-lg">
                <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30 text-sm font-medium text-muted-foreground border-b border-border">
                  <div>Name</div>
                  <div>ID No.</div>
                  <div>No. of Users</div>
                  <div>Last refreshed on</div>
                </div>
                
                {adobeSegments.map((segment) => (
                  <div key={segment.id} className="grid grid-cols-4 gap-4 p-3 border-b border-border last:border-b-0 hover:bg-muted/20">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={segment.id}
                        checked={formData.selectedSegments.includes(segment.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData({
                              selectedSegments: [...formData.selectedSegments, segment.id]
                            });
                          } else {
                            updateFormData({
                              selectedSegments: formData.selectedSegments.filter(id => id !== segment.id)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{segment.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{segment.id}</div>
                    <div className="text-sm text-muted-foreground">{segment.users}</div>
                    <div className="text-sm text-muted-foreground">{segment.lastRefreshed}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>List selected: {formData.selectedSegments.length}</span>
                  <span>Segment selected: {formData.selectedSegments.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exclude Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Exclude contacts</h3>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Exclude list/segment</span>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <Switch 
                checked={formData.excludeContacts}
                onCheckedChange={(checked) => updateFormData({ excludeContacts: checked })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline">FINISH LATER</Button>
          <Button>NEXT STEP</Button>
        </div>
      </div>
      
      <SummaryPanel formData={formData} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`${currentStep === 'setup' || currentStep === 'audience' ? 'max-w-6xl' : 'max-w-2xl'} p-0`}>
        {currentStep === 'start' && renderStartStep()}
        {currentStep === 'channels' && renderChannelsStep()}
        {currentStep === 'setup' && renderSetupStep()}
        {currentStep === 'audience' && renderAudienceStep()}
      </DialogContent>
    </Dialog>
  );
}