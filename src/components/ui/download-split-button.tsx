import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  ChevronDown, 
  FileSpreadsheet,
  FileText,
  Loader2
} from 'lucide-react';
import { downloadFile, getDownloadInfo, DownloadOption } from '@/lib/downloadFile';
import { useToast } from '@/hooks/use-toast';

interface DownloadSplitButtonProps {
  className?: string;
}

export function DownloadSplitButton({ className }: DownloadSplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingOption, setLoadingOption] = useState<DownloadOption | null>(null);
  const { toast } = useToast();

  const handleDownload = async (option: DownloadOption) => {
    try {
      setLoadingOption(option);
      setIsOpen(false);
      
      const { url, filename } = getDownloadInfo(option);
      await downloadFile(url, filename);
      
      toast({
        title: "Download Started",
        description: `${option === 'summary' ? 'Summary' : 'Detailed'} report is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingOption(null);
    }
  };

  const isLoading = loadingOption !== null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex">
        {/* Main Download Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleDownload('summary')}
          disabled={isLoading}
          className={`rounded-r-none ${className}`}
          aria-label="Download Summary Report"
        >
          {loadingOption === 'summary' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {loadingOption === 'summary' ? 'Preparing...' : 'Download'}
        </Button>
        
        {/* Split Dropdown Trigger */}
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-l-none border-l-0 px-2"
            disabled={isLoading}
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => handleDownload('summary')}
          disabled={loadingOption === 'summary'}
          className="flex items-center"
          role="menuitem"
        >
          {loadingOption === 'summary' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 mr-2" />
          )}
          <span>{loadingOption === 'summary' ? 'Preparing...' : 'Summary (Excel)'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleDownload('detailed')}
          disabled={loadingOption === 'detailed'}
          className="flex items-center"
          role="menuitem"
        >
          {loadingOption === 'detailed' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          <span>{loadingOption === 'detailed' ? 'Preparing...' : 'Detailed (Excel/CSV)'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
