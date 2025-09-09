import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Edit
} from 'lucide-react';

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
}

interface AdobeSegment {
  id: string;
  name: string;
  users: number;
  lastRefreshed: string;
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

const whatsappTemplates = [
  {
    id: 'static_carousel_recs_url',
    name: 'static_carousel_recs_url',
    description: 'Carousel template for product recommendations'
  },
  {
    id: 'welcome_message',
    name: 'welcome_message',
    description: 'Welcome message template'
  },
  {
    id: 'promotional_offer',
    name: 'promotional_offer', 
    description: 'Promotional offer template'
  }
];

const bfsiConversionEvents = [
  'Account Opened (Savings)',
  'Account Opened (Current)', 
  'Credit Card Approved',
  'Credit Card Activated',
  'Loan Application Submitted',
  'Loan Approved',
  'Loan Disbursed',
  'Overdraft Activated',
  'First Transaction (UPI)',
  'First Transaction (QR)',
  'First Transaction (Netbanking)',
  'Bill Payment Completed',
  'Mandate Set Up (eMandate/SIP/Insurance)',
  'Card Spend ₹1,000 Reached',
  'Insurance Purchased (Life)',
  'Insurance Purchased (Health)',
  'Insurance Purchased (General)',
  'Investment Started (FD)',
  'Investment Started (RD)',
  'Investment Started (MF/SIP)',
  'Account Upgrade Accepted',
  'Card Upgrade Accepted'
];

const adobeSegments: AdobeSegment[] = [
  {
    id: '66',
    name: 'Test 32 Africa',
    users: 295,
    lastRefreshed: '2025-09-09 12:42:05'
  },
  {
    id: '68', 
    name: 'test-segs',
    users: 43,
    lastRefreshed: '2025-09-09 12:11:04'
  },
  {
    id: '164',
    name: 'Unique-RCS-Sent',
    users: 0,
    lastRefreshed: '2025-09-09 01:39:08'
  }
];

// Segments Dropdown Component
const SegmentsDropdown = ({ 
  selectedSegments, 
  onSelectionChange 
}: { 
  selectedSegments: string[];
  onSelectionChange: (segments: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredSegments = useMemo(() => {
    return adobeSegments.filter(segment =>
      segment.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      segment.id.includes(debouncedQuery)
    );
  }, [debouncedQuery]);

  const selectedSegmentsData = useMemo(() => {
    return adobeSegments.filter(segment => selectedSegments.includes(segment.id));
  }, [selectedSegments]);

  const handleToggleSegment = useCallback((segmentId: string) => {
    const newSelection = selectedSegments.includes(segmentId)
      ? selectedSegments.filter(id => id !== segmentId)
      : [...selectedSegments, segmentId];
    onSelectionChange(newSelection);
  }, [selectedSegments, onSelectionChange]);

  const handleSelectAll = useCallback(() => {
    onSelectionChange(filteredSegments.map(s => s.id));
  }, [filteredSegments, onSelectionChange]);

  const handleClearAll = useCallback(() => {
    onSelectionChange([]);
  }, [onSelectionChange]);

  const handleRemoveSegment = useCallback((segmentId: string) => {
    onSelectionChange(selectedSegments.filter(id => id !== segmentId));
  }, [selectedSegments, onSelectionChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between min-h-[40px] h-auto p-3"
        >
          <div className="flex flex-wrap gap-1 items-center flex-1">
            {selectedSegmentsData.length === 0 ? (
              <span className="text-muted-foreground">List / Segment</span>
            ) : (
              selectedSegmentsData.map((segment) => (
                <Badge
                  key={segment.id}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 flex items-center space-x-1"
                >
                  <span>{segment.name}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:bg-blue-200 rounded-full" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveSegment(segment.id);
                    }}
                  />
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[600px] p-0" align="start">
        <div className="flex flex-col max-h-[400px]">
          {/* Search Input */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search segments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Segments Table */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30 text-sm font-medium text-muted-foreground border-b sticky top-0">
              <div>Name</div>
              <div>ID No.</div>
              <div>No. of Users</div>
              <div>Last refreshed on</div>
            </div>
            
            {/* Rows */}
            {filteredSegments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No segments found
              </div>
            ) : (
              filteredSegments.map((segment) => (
                <div 
                  key={segment.id} 
                  className="grid grid-cols-4 gap-4 p-3 border-b hover:bg-muted/20 cursor-pointer"
                  onClick={() => handleToggleSegment(segment.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedSegments.includes(segment.id)}
                      onChange={() => handleToggleSegment(segment.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">{segment.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{segment.id}</div>
                  <div className="text-sm text-muted-foreground">{segment.users}</div>
                  <div className="text-sm text-muted-foreground">{segment.lastRefreshed}</div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t bg-muted/20">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>List selected: 0</span>
              <span>Segment selected: {selectedSegments.length}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                disabled={filteredSegments.length === 0}
              >
                Select all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                disabled={selectedSegments.length === 0}
              >
                Clear all
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

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

const SummaryPanel = ({ formData, currentStep }: { formData: CampaignFormData; currentStep: Step }) => {
  const getSelectedSegmentData = () => {
    return adobeSegments.filter(segment => 
      formData.selectedSegments.includes(segment.id)
    );
  };

  return (
    <div className="bg-muted/20 p-6 border-l border-border h-full">
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
          <div className="space-y-2 text-sm text-muted-foreground">
            {formData.selectedTemplate && (
              <div>
                <span className="font-medium text-foreground">Template:</span>
                <div>{formData.selectedTemplate}</div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Schedule</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            {currentStep === 'schedule' && (
              <>
                <div>
                  <span className="font-medium text-foreground">When to send:</span>
                  <div>{formData.scheduleType === 'optimize' ? 'Optimize with Co-marketer' : formData.scheduleType}</div>
                </div>
                {formData.scheduleType === 'optimize' && (
                  <>
                    <div>
                      <span className="font-medium text-foreground">Start time:</span>
                      <div>{formData.startTime}</div>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">End time:</span>
                      <div>{formData.endTime}</div>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Send at end time:</span>
                      <div>{formData.endTime}</div>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Control group:</span>
                      <div>{formData.controlGroupPercentage}%</div>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Specific time:</span>
                      <div>{formData.specificTime}</div>
                    </div>
                  </>
                )}
              </>
            )}
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
    eventName: 'Account Opened (Savings)',
    conversionWindow: 1,
    revenueParameter: 'price',
    deduplication: true,
    targetAudience: 'segments',
    selectedSegments: [],
    excludeContacts: false,
    selectedTemplate: '',
    scheduleType: 'optimize',
    startTime: 'Sep 09, 2025 01:00 pm',
    endTime: 'Sep 10, 2025 12:00 pm',
    timezone: 'Asia/Calcutta | Sep 09, 2025 12:57 pm',
    frequencyCap: true,
    controlGroup: true,
    controlGroupPercentage: 5,
    specificTime: 'Sep 09, 2025 02:00 pm',
    isPublished: false
  });

  const updateFormData = useCallback((updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

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
    } else if (currentStep === 'content') {
      setCurrentStep('audience');
    } else if (currentStep === 'schedule') {
      setCurrentStep('content');
    } else if (currentStep === 'preview') {
      setCurrentStep('schedule');
    }
  };

  const handleNext = () => {
    if (currentStep === 'setup') {
      setCurrentStep('audience');
    } else if (currentStep === 'audience') {
      setCurrentStep('content');
    } else if (currentStep === 'content') {
      setCurrentStep('schedule');
    } else if (currentStep === 'schedule') {
      setCurrentStep('preview');
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
      eventName: 'Account Opened (Savings)',
      conversionWindow: 1,
      revenueParameter: 'price',
      deduplication: true,
      targetAudience: 'segments',
      selectedSegments: [],
      excludeContacts: false,
      selectedTemplate: '',
      scheduleType: 'optimize',
      startTime: 'Sep 09, 2025 01:00 pm',
      endTime: 'Sep 10, 2025 12:00 pm',
      timezone: 'Asia/Calcutta | Sep 09, 2025 12:57 pm',
      frequencyCap: true,
      controlGroup: true,
      controlGroupPercentage: 5,
      specificTime: 'Sep 09, 2025 02:00 pm',
      isPublished: false
    });
    onClose();
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Template Selection Dropdown Component
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
        <PopoverContent className="w-full p-0">
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
                  value={template.name}
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

  const renderContentStep = () => (
    <div className="h-screen flex gap-6">
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="p-6 pb-4">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">FINISH LATER</Button>
                  <Button onClick={handleNext}>NEXT STEP</Button>
                </div>
              </div>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Setup</span>
              </div>
              <div className="flex-1 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Audience</span>
              </div>
              <div className="flex-1 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Content</span>
              </div>
              <div className="flex-1 h-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-muted-foreground rounded-full flex items-center justify-center text-sm">
                  4
                </div>
                <span className="text-sm text-muted-foreground">Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-6 pt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select template</h3>
              <p className="text-sm text-muted-foreground mb-4">Select pre-approved message for whatsapp campaign</p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Template *</Label>
                  <div className="mt-1">
                    <TemplateDropdown
                      selectedTemplate={formData.selectedTemplate}
                      onTemplateChange={(template) => updateFormData({ selectedTemplate: template })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="w-80 border-l border-border bg-muted/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Preview</h3>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>SEND TEST MESSAGE</span>
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">See how your customers will receive it! 😊</h4>
          <p className="text-sm text-muted-foreground">
            Note: Test your template post-approval by Meta to confirm accuracy before sending it to users.
          </p>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center">
          <div className="relative w-64 h-[500px] bg-black rounded-[2rem] p-2">
            <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-green-600 text-white p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium">Netcore Cloud</span>
              </div>
              
              {/* Message Content */}
              <div className="p-4 bg-gray-50 flex-1 h-full">
                {formData.selectedTemplate ? (
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
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto text-blue-600">
                            🔗 View Product
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 bg-green-100 rounded-lg p-2">
                        <div className="w-full h-16 bg-orange-200 rounded mb-2"></div>
                        <p className="text-xs font-medium">Flat 30% OFF on our best-selling sneakers.</p>
                        <div className="flex flex-col space-y-1 mt-2">
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto text-blue-600">
                            🔗 Visit Website
                          </Button>
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto text-blue-600">
                            🔗 View Product
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
      </div>
    </div>
  );

  const renderScheduleStep = () => (
    <div className="h-screen flex gap-6">
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="p-6 pb-4">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">FINISH LATER</Button>
                  <Button onClick={handleNext}>SAVE AND PREVIEW</Button>
                </div>
              </div>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Setup</span>
              </div>
              <div className="flex-1 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Audience</span>
              </div>
              <div className="flex-1 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Content</span>
              </div>
              <div className="flex-1 h-px bg-primary"></div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-primary">Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-6 pt-6">
            {/* Schedule Campaign */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Schedule campaign</h3>
                <div className="text-sm text-muted-foreground">
                  Timezone: {formData.timezone}
                </div>
              </div>

              {/* Frequency Cap */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-orange-50 border-orange-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Frequency cap</span>
                  </div>
                  <Switch 
                    checked={formData.frequencyCap}
                    onCheckedChange={(checked) => updateFormData({ frequencyCap: checked })}
                  />
                </div>
                {formData.frequencyCap && (
                  <p className="text-sm text-orange-600 mt-2">
                    Running 2 consecutive campaigns within 30 minutes time-frame could potentially bypass the frequency cap check due to data synchronisation delay.
                  </p>
                )}
              </div>

              {/* When to send */}
              <div>
                <h4 className="font-medium mb-4">When to send</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="sendNow"
                      name="scheduleType"
                      checked={formData.scheduleType === 'now'}
                      onChange={() => updateFormData({ scheduleType: 'now' })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="sendNow">Send now</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="sendLater"
                      name="scheduleType"
                      checked={formData.scheduleType === 'later'}
                      onChange={() => updateFormData({ scheduleType: 'later' })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="sendLater">Send later</Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="optimize"
                      name="scheduleType"
                      checked={formData.scheduleType === 'optimize'}
                      onChange={() => updateFormData({ scheduleType: 'optimize' })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="optimize">Optimize with Co-marketer</Label>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {(formData.scheduleType === 'later' || formData.scheduleType === 'optimize') && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start time *</Label>
                      <Input
                        id="startTime"
                        value={formData.startTime}
                        onChange={(e) => updateFormData({ startTime: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End time *</Label>
                      <Input
                        id="endTime"
                        value={formData.endTime}
                        onChange={(e) => updateFormData({ endTime: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    For unpredictable users and users whose preferred time doesn't fall in the selected time range
                  </p>
                  <Select value="end">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="end">Send at end time</SelectItem>
                      <SelectItem value="start">Send at start time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Control Group */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">Control group</h4>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <Switch 
                    checked={formData.controlGroup}
                    onCheckedChange={(checked) => updateFormData({ controlGroup: checked })}
                  />
                </div>
                
                {formData.controlGroup && (
                  <div>
                    <div className="mb-4">
                      <Label>Select control group</Label>
                      <div className="mt-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">1%</span>
                          <Slider
                            value={[formData.controlGroupPercentage]}
                            onValueChange={(value) => updateFormData({ controlGroupPercentage: value[0] })}
                            max={99}
                            min={1}
                            step={1}
                            className="flex-1"
                          />
                          <span className="text-sm">99%</span>
                        </div>
                        <div className="text-center text-sm text-muted-foreground mt-1">
                          {formData.controlGroupPercentage}%
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-medium">Specific time</h5>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="specificTime">Set default time *</Label>
                        <Input
                          id="specificTime"
                          value={formData.specificTime}
                          onChange={(e) => updateFormData({ specificTime: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-80 overflow-y-auto max-h-screen" style={{ WebkitOverflowScrolling: 'touch' }}>
        <SummaryPanel formData={formData} currentStep={currentStep} />
      </div>
    </div>
  );

  const handlePublish = () => {
    updateFormData({ isPublished: true });
  };

  const renderPreviewStep = () => (
    <div className="flex flex-col h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-semibold">Preview of Adobe</DialogTitle>
            </div>
            <Button onClick={handlePublish}>SAVE & PUBLISH</Button>
          </div>
        </DialogHeader>
      </div>

      {/* Adobe Sync Banner - Shows after publish */}
      {formData.isPublished && (
        <Alert className="mx-6 mt-4 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Execution handed off to Adobe Commerce. Delivery, read, click, fail metrics auto-sync to Adobe. No customer data stored on Netcore.
          </AlertDescription>
        </Alert>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Left Column - Scrollable */}
          <div className="overflow-y-auto max-h-screen space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Setup Details */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <CardTitle className="text-sm">Setup details</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4 mr-1" />
                  EDIT
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign ID:</span>
                    <span>263</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign name:</span>
                    <span>{formData.campaignName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business number:</span>
                    <span>Netcore Solutions Support (+91 2249757637)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Link tracking:</span>
                    <span>Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tags:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {formData.tags[0]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <CardTitle className="text-sm">Audience</CardTitle>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Reachable contacts</span>
                    <span className="font-medium">{formData.selectedSegments.length > 0 ? 
                      adobeSegments.filter(s => formData.selectedSegments.includes(s.id))
                        .reduce((sum, s) => sum + s.users, 0) : 0}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4 mr-1" />
                    EDIT
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Selected contacts</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Segments/Lists:</span>
                    {formData.selectedSegments.length > 0 && (
                      <div className="mt-1">
                        {adobeSegments
                          .filter(s => formData.selectedSegments.includes(s.id))
                          .map(segment => (
                            <Badge key={segment.id} variant="secondary" className="mr-1">
                              ID: {segment.id} Test {segment.name}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <CardTitle className="text-sm">Schedule</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4 mr-1" />
                  EDIT
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Schedule campaign</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency cap:</span>
                    <span>{formData.frequencyCap ? 'On' : 'Off'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">When to send:</span>
                    <span className="capitalize">{formData.scheduleType === 'optimize' ? 'Optimize with Co-marketer' : formData.scheduleType}</span>
                  </div>
                  {formData.scheduleType === 'optimize' && (
                    <>
                      <div className="text-xs text-muted-foreground">
                        Start time - {formData.startTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        End time - {formData.endTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Send at end time - {formData.endTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Control group - {formData.controlGroupPercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Specific time - {formData.specificTime}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scrollable */}
          <div className="overflow-y-auto max-h-screen" style={{ WebkitOverflowScrolling: 'touch' }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquareText className="w-4 h-4" />
                  <CardTitle className="text-sm">Content</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <Edit className="w-4 h-4 mr-1" />
                  EDIT
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Template Name:</span>
                    <div className="font-medium">{formData.selectedTemplate}</div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Note: Test your template post-approval by Meta to confirm accuracy before sending it to users.
                  </div>

                  {/* Phone Preview */}
                  <div className="flex justify-center">
                    <div className="relative w-48 h-80 bg-black rounded-2xl p-1">
                      <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                        <div className="bg-green-600 text-white p-2 flex items-center space-x-2 text-xs">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium">Netcore Cloud</span>
                        </div>
                        
                        <div className="p-2 bg-gray-50 h-full">
                          <div className="bg-white rounded-lg p-2 text-xs shadow-sm">
                            <p className="mb-2">Check out our top deals and grab your favorites before the stock runs out!</p>
                            
                            <div className="grid grid-cols-2 gap-1 mb-2">
                              <div className="bg-green-100 rounded p-1">
                                <div className="w-full h-8 bg-orange-200 rounded mb-1"></div>
                                <p className="text-[10px] font-medium">Flat 30% OFF on our best-selling sneakers.</p>
                                <div className="flex flex-col space-y-0.5 mt-1">
                                  <div className="text-[8px] text-blue-600">🔗 Visit Website</div>
                                  <div className="text-[8px] text-blue-600">🔗 View Product</div>
                                </div>
                              </div>
                              <div className="bg-green-100 rounded p-1">
                                <div className="w-full h-8 bg-orange-200 rounded mb-1"></div>
                                <p className="text-[10px] font-medium">Flat 30% OFF on our best-selling sneakers.</p>
                                <div className="flex flex-col space-y-0.5 mt-1">
                                  <div className="text-[8px] text-blue-600">🔗 Visit Website</div>
                                  <div className="text-[8px] text-blue-600">🔗 View Product</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-[8px] text-gray-500">
                              <span>😊</span>
                              <span>📎</span>
                              <span className="bg-green-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                ✓
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

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
    <div className="h-screen flex gap-6">
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="p-6 pb-4">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">FINISH LATER</Button>
                  <Button onClick={handleNext}>NEXT STEP</Button>
                </div>
              </div>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-6 pt-6">
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
                        {bfsiConversionEvents.map((event) => (
                          <SelectItem key={event} value={event}>{event}</SelectItem>
                        ))}
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
        </div>
      </div>
      
      <div className="w-80 overflow-y-auto max-h-screen" style={{ WebkitOverflowScrolling: 'touch' }}>
        <SummaryPanel formData={formData} currentStep={currentStep} />
      </div>
    </div>
  );

  const renderAudienceStep = () => (
    <div className="h-screen flex gap-6">
      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="p-6 pb-4">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">WhatsApp campaign</DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">FINISH LATER</Button>
                  <Button onClick={handleNext}>NEXT STEP</Button>
                </div>
              </div>
            </DialogHeader>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4">
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
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-6 pt-6">
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
                  <span className="font-medium">{formData.selectedSegments.length > 0 ? 
                    adobeSegments.filter(s => formData.selectedSegments.includes(s.id))
                      .reduce((sum, s) => sum + s.users, 0) : 0}</span>
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
                <div className="mb-4">
                  <Label>Select Lists/Segments</Label>
                  <div className="mt-2">
                    <SegmentsDropdown
                      selectedSegments={formData.selectedSegments}
                      onSelectionChange={(segments) => updateFormData({ selectedSegments: segments })}
                    />
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
        </div>
      </div>
      
      <div className="w-80 overflow-y-auto max-h-screen" style={{ WebkitOverflowScrolling: 'touch' }}>
        <SummaryPanel formData={formData} currentStep={currentStep} />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`${currentStep === 'setup' || currentStep === 'audience' || currentStep === 'content' || currentStep === 'schedule' || currentStep === 'preview' ? 'max-w-6xl h-screen max-h-screen' : 'max-w-2xl'} p-0 overflow-hidden`}>
        {currentStep === 'start' && renderStartStep()}
        {currentStep === 'channels' && renderChannelsStep()}
        {currentStep === 'setup' && renderSetupStep()}
        {currentStep === 'audience' && renderAudienceStep()}
        {currentStep === 'content' && renderContentStep()}
        {currentStep === 'schedule' && renderScheduleStep()}
        {currentStep === 'preview' && renderPreviewStep()}
      </DialogContent>
    </Dialog>
  );
}