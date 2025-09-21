/**
 * Downloads a file from a URL with proper error handling and filename extraction
 * @param url - The URL to download from
 * @param fallbackName - Fallback filename if Content-Disposition header is not present
 * @returns Promise that resolves when download is complete
 */
export async function downloadFile(url: string, fallbackName: string): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin', // Include cookies for same-origin requests
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = fallbackName;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    // Get the blob data
    const blob = await response.blob();
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error('Download error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to download file. Please try again.'
    );
  }
}

/**
 * Configuration for download URLs
 * These can be easily replaced with real endpoints later
 */
export const DOWNLOAD_CONFIG = {
  SUMMARY_EXCEL_URL: '/summary_report.xlsx',
  DETAILED_EXCEL_URL: '/detailed_report.xlsx',
} as const;

/**
 * Download options for the campaign reports
 */
export type DownloadOption = 'summary' | 'detailed';

/**
 * Get the appropriate URL and filename for a download option
 */
export function getDownloadInfo(option: DownloadOption): { url: string; filename: string } {
  switch (option) {
    case 'summary':
      return {
        url: DOWNLOAD_CONFIG.SUMMARY_EXCEL_URL,
        filename: 'campaign-report-summary.xlsx'
      };
    case 'detailed':
      return {
        url: DOWNLOAD_CONFIG.DETAILED_EXCEL_URL,
        filename: 'campaign-report-detailed.xlsx'
      };
    default:
      throw new Error(`Unknown download option: ${option}`);
  }
}
