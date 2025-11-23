import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Define types locally to avoid import issues
interface EnhancedSiteAuditResult {
  url: string;
  overallScore: number;
  pagesAudited: number;
  auditDate: string;
  basic: {
    title: {
      present: boolean;
      length: number;
      optimized: boolean;
      recommendations: string[];
    };
    metaDescription: {
      present: boolean;
      length: number;
      optimized: boolean;
      recommendations: string[];
    };
    headings: {
      h1: { count: number; issues: string[] };
      h2: { count: number; issues: string[] };
      structure: boolean;
      recommendations: string[];
    };
    images: {
      total: number;
      withoutAlt: number;
      optimized: number;
      recommendations: string[];
    };
    links: {
      internal: number;
      external: number;
      broken: number;
      recommendations: string[];
    };
  };
  technical: {
    https: boolean;
    mobileFriendly: boolean;
    pageSpeed: {
      desktop: number;
      mobile: number;
      recommendations: string[];
    };
    crawlability: {
      sitemap: boolean;
      robotsTxt: boolean;
      issues: string[];
    };
  };
  content: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    internalLinking: {
      count: number;
      relevance: number;
    };
    recommendations: string[];
  };
  performance?: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    recommendations: string[];
  };
  accessibility?: {
    score: number;
    issues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      count: number;
    }>;
    recommendations: string[];
  };
  security?: {
    score: number;
    issues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
    }>;
    recommendations: string[];
  };
  recommendations: string[];
  scoreBreakdown: {
    basic: number;
    technical: number;
    content: number;
    performance?: number;
    accessibility?: number;
    security?: number;
  };
}

interface BulkAnalysisResult {
  analysisType: string;
  totalUrls: number;
  processedUrls: number;
  results: Array<{
    url: string;
    success: boolean;
    data?: any;
    error?: string;
    processingTime: number;
  }>;
  summary: {
    overallScore: number;
    successRate: number;
    errors: number;
    warnings: number;
    keyMetrics: Record<string, number>;
    recommendations: string[];
  };
  exportData?: {
    format: string;
    data: any;
    filePath?: string;
  };
  processingTime: number;
}

// Extend jsPDF types for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export interface WhiteLabelOptions {
  companyName?: string;
  logo?: string; // Base64 encoded image or URL
  brandColor?: string;
  removeBranding?: boolean;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  footerText?: string;
  reportTitle?: string;
}

export interface PDFReportData {
  type: 'seo-audit' | 'bulk-analysis' | 'site-audit' | 'competitor-analysis' | 'backlink-analysis' | 'keyword-tracking';
  data: any;
  url?: string;
  urls?: string[];
  generatedAt: Date;
  whiteLabel?: WhiteLabelOptions;
}

class WhiteLabelPDFService {
  private doc: jsPDF;
  private whiteLabel: WhiteLabelOptions;
  private defaultColor = '#1a365d';

  constructor(whiteLabel?: WhiteLabelOptions) {
    this.doc = new jsPDF();
    this.whiteLabel = whiteLabel || {};
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 26, g: 54, b: 93 }; // Default color
  }

  private addHeader(title: string): void {
    const brandColor = this.whiteLabel.brandColor || this.defaultColor;
    const rgb = this.hexToRgb(brandColor);

    // Add colored header bar
    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
    this.doc.rect(0, 0, 210, 40, 'F');

    // Add logo if provided
    if (this.whiteLabel.logo && !this.whiteLabel.removeBranding) {
      try {
        this.doc.addImage(this.whiteLabel.logo, 'PNG', 15, 10, 30, 20);
      } catch (error) {
        console.warn('Failed to add logo to PDF:', error);
      }
    }

    // Add title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    const titleY = this.whiteLabel.logo ? 25 : 25;
    this.doc.text(title, this.whiteLabel.logo ? 55 : 105, titleY, { align: this.whiteLabel.logo ? 'left' : 'center' });

    // Add company name if provided
    if (this.whiteLabel.companyName && !this.whiteLabel.removeBranding) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(this.whiteLabel.companyName, this.whiteLabel.logo ? 55 : 105, 32, { align: this.whiteLabel.logo ? 'left' : 'center' });
    }

    // Reset text color
    this.doc.setTextColor(0, 0, 0);
    this.doc.setDrawColor(0, 0, 0);
  }

  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const brandColor = this.whiteLabel.brandColor || this.defaultColor;
    const rgb = this.hexToRgb(brandColor);

    // Add footer bar
    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
    this.doc.rect(0, pageHeight - 20, 210, 20, 'F');

    // Add footer text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    
    const footerText = this.whiteLabel.footerText || 
      (this.whiteLabel.removeBranding ? '' : 'Generated by SEO Audit Tool');
    
    if (footerText) {
      this.doc.text(footerText, 105, pageHeight - 10, { align: 'center' });
    }

    // Add page number
    const pageNumber = `Page 1`;
    this.doc.text(pageNumber, 200, pageHeight - 10, { align: 'right' });

    // Add contact info if provided
    if (this.whiteLabel.contactInfo && !this.whiteLabel.removeBranding) {
      const contactText = [
        this.whiteLabel.contactInfo.email,
        this.whiteLabel.contactInfo.phone,
        this.whiteLabel.contactInfo.website
      ].filter(Boolean).join(' | ');
      
      if (contactText) {
        this.doc.text(contactText, 105, pageHeight - 5, { align: 'center' });
      }
    }
  }

  private addSection(title: string, yPosition: number): number {
    const brandColor = this.whiteLabel.brandColor || this.defaultColor;
    const rgb = this.hexToRgb(brandColor);

    this.doc.setFillColor(rgb.r, rgb.g, rgb.b);
    this.doc.rect(15, yPosition, 180, 8, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, yPosition + 5.5);
    
    this.doc.setTextColor(0, 0, 0);
    return yPosition + 15;
  }

  private generateSEOAuditPDF(data: EnhancedSiteAuditResult): void {
    this.addHeader(this.whiteLabel.reportTitle || 'SEO Audit Report');
    let yPosition = 50;

    // Executive Summary
    yPosition = this.addSection('Executive Summary', yPosition);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const summaryText = [
      `Overall SEO Score: ${data.overallScore}/100`,
      `URL Analyzed: ${data.url}`,
      `Audit Date: ${new Date(data.auditDate).toLocaleDateString()}`,
      `Total Issues Found: ${(data.basic.headings.h1.issues.length + (data.basic?.images?.withoutAlt || 0))}`,
    ];
    
    summaryText.forEach((text, index) => {
      this.doc.text(text, 20, yPosition + (index * 5));
    });
    
    yPosition += summaryText.length * 5 + 10;

    // Basic SEO Analysis
    yPosition = this.addSection('Basic SEO Analysis', yPosition);
    
    const basicData = [
      ['Metric', 'Status', 'Recommendations'],
      ['Title Tag', data.basic.title.optimized ? 'Optimized' : 'Needs Work', `${data.basic.title.recommendations.length} recommendations`],
      ['Meta Description', data.basic.metaDescription.optimized ? 'Optimized' : 'Needs Work', `${data.basic.metaDescription.recommendations.length} recommendations`],
      ['Headings Structure', data.basic.headings.structure ? 'Good' : 'Needs Work', `${data.basic.headings.recommendations.length} recommendations`],
      ['Image Optimization', `${data.basic.images?.optimized || 0}/${data.basic.images?.total || 0} optimized`, `${data.basic.images?.recommendations?.length || 0} recommendations`],
    ];

    this.doc.autoTable({
      head: [basicData[0]],
      body: basicData.slice(1),
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: this.hexToRgb(this.whiteLabel.brandColor || this.defaultColor) },
    });

    yPosition = (this.doc.lastAutoTable as any)?.finalY + 10 || yPosition + 40;

    // Technical SEO Analysis
    yPosition = this.addSection('Technical SEO Analysis', yPosition);
    
    const technicalData = [
      ['Metric', 'Status', 'Details'],
      ['HTTPS', data.technical.https ? 'Secure' : 'Not Secure', data.technical.https ? '✓' : '✗'],
      ['Mobile Friendly', data.technical.mobileFriendly ? 'Yes' : 'No', data.technical.mobileFriendly ? '✓' : '✗'],
      ['Page Speed (Desktop)', `${data.technical.pageSpeed.desktop}/100`, data.technical.pageSpeed.desktop > 70 ? 'Good' : 'Needs Improvement'],
      ['Page Speed (Mobile)', `${data.technical.pageSpeed.mobile}/100`, data.technical.pageSpeed.mobile > 70 ? 'Good' : 'Needs Improvement'],
    ];

    this.doc.autoTable({
      head: [technicalData[0]],
      body: technicalData.slice(1),
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: this.hexToRgb(this.whiteLabel.brandColor || this.defaultColor) },
    });

    yPosition = (this.doc.lastAutoTable as any)?.finalY + 10 || yPosition + 40;

    // Content Analysis
    yPosition = this.addSection('Content Analysis', yPosition);
    
    const contentData = [
      ['Metric', 'Value', 'Assessment'],
      ['Word Count', data.content.wordCount.toString(), data.content.wordCount >= 300 ? 'Good' : 'Needs More Content'],
      ['Readability Score', `${data.content.readabilityScore}/100`, data.content.readabilityScore >= 60 ? 'Good' : 'Needs Improvement'],
      ['Internal Links', data.content.internalLinking.count.toString(), data.content.internalLinking.count > 0 ? 'Good' : 'Add Internal Links'],
    ];

    this.doc.autoTable({
      head: [contentData[0]],
      body: contentData.slice(1),
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: this.hexToRgb(this.whiteLabel.brandColor || this.defaultColor) },
    });

    // Check if we need a new page for recommendations
    yPosition = (this.doc.lastAutoTable as any)?.finalY + 10 || yPosition + 40;
    if (yPosition > 250) {
      this.doc.addPage();
      yPosition = 20;
      this.addHeader(this.whiteLabel.reportTitle || 'SEO Audit Report');
    }

    // Recommendations
    yPosition = this.addSection('Key Recommendations', yPosition);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    
    data.recommendations.forEach((recommendation, index) => {
      if (yPosition + (index * 8) > 270) {
        this.doc.addPage();
        yPosition = 20;
        this.addHeader(this.whiteLabel.reportTitle || 'SEO Audit Report');
        yPosition = this.addSection('Key Recommendations (Continued)', yPosition);
      }
      
      const lines = this.doc.splitTextToSize(`${index + 1}. ${recommendation}`, 170);
      this.doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 3;
    });
  }

  private generateBulkAnalysisPDF(data: BulkAnalysisResult): void {
    this.addHeader(this.whiteLabel.reportTitle || 'Bulk Analysis Report');
    let yPosition = 50;

    // Executive Summary
    yPosition = this.addSection('Executive Summary', yPosition);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const summaryText = [
      `Analysis Type: ${data.analysisType}`,
      `Total URLs: ${data.totalUrls}`,
      `Successfully Processed: ${data.processedUrls}`,
      `Overall Success Rate: ${data.summary.successRate}%`,
      `Average Score: ${data.summary.overallScore}/100`,
      `Total Processing Time: ${(data.processingTime / 1000).toFixed(2)} seconds`,
    ];
    
    summaryText.forEach((text, index) => {
      this.doc.text(text, 20, yPosition + (index * 5));
    });
    
    yPosition += (summaryText.length * 5) + 10;

    // Key Metrics
    yPosition = this.addSection('Key Metrics', yPosition);
    
    const metricsData = Object.entries(data.summary.keyMetrics).map(([key, value]) => [
      this.formatMetricName(key),
      typeof value === 'number' ? value.toFixed(2) : String(value),
      this.getMetricAssessment(key, value)
    ]);

    this.doc.autoTable({
      head: [['Metric', 'Value', 'Assessment']],
      body: metricsData,
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: this.hexToRgb(this.whiteLabel.brandColor || this.defaultColor) },
    });

    yPosition = (this.doc.lastAutoTable as any)?.finalY + 10 || yPosition + 40;

    // Results Details
    yPosition = this.addSection('URL Analysis Details', yPosition);
    
    const resultsData = data.results.map(result => [
      result.url,
      result.success ? 'Success' : 'Failed',
      result.data?.overallScore ? `${result.data.overallScore}/100` : 'N/A',
      result.error || 'N/A',
      `${(result.processingTime / 1000).toFixed(2)}s`
    ]);

    this.doc.autoTable({
      head: [['URL', 'Status', 'Score', 'Error', 'Processing Time']],
      body: resultsData,
      startY: yPosition,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: this.hexToRgb(this.whiteLabel.brandColor || this.defaultColor) },
    });

    yPosition = (this.doc.lastAutoTable as any)?.finalY + 10 || yPosition + 40;

    // Recommendations
    yPosition = this.addSection('Recommendations', yPosition);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    
    data.summary.recommendations.forEach((recommendation, index) => {
      if (yPosition + (index * 8) > 270) {
        this.doc.addPage();
        yPosition = 20;
        this.addHeader(this.whiteLabel.reportTitle || 'Bulk Analysis Report');
        yPosition = this.addSection('Recommendations (Continued)', yPosition);
      }
      
      const lines = this.doc.splitTextToSize(`${index + 1}. ${recommendation}`, 170);
      this.doc.text(lines, 20, yPosition);
      yPosition += lines.length * 5 + 3;
    });
  }

  private formatMetricName(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  private getMetricAssessment(key: string, value: number): string {
    const assessments: Record<string, (value: number) => string> = {
      avgScore: (v) => v >= 80 ? 'Excellent' : v >= 60 ? 'Good' : 'Needs Improvement',
      pagesWithIssues: (v) => v === 0 ? 'No Issues' : v <= 2 ? 'Few Issues' : 'Many Issues',
      totalBacklinks: (v) => v >= 1000 ? 'Excellent' : v >= 500 ? 'Good' : 'Needs Work',
      avgPosition: (v) => v <= 10 ? 'Excellent' : v <= 20 ? 'Good' : 'Needs Improvement',
    };

    const assessment = assessments[key];
    return assessment ? assessment(value) : 'N/A';
  }

  public generatePDF(reportData: PDFReportData): Buffer {
    switch (reportData.type) {
      case 'seo-audit':
      case 'site-audit':
        this.generateSEOAuditPDF(reportData.data);
        break;
      case 'bulk-analysis':
        this.generateBulkAnalysisPDF(reportData.data);
        break;
      default:
        throw new Error(`Unsupported report type: ${reportData.type}`);
    }

    // Add footer to all pages
    const pageCount = 1;
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.addFooter();
    }

    return Buffer.from(this.doc.output('arraybuffer'));
  }

  public async generatePDFAndSave(reportData: PDFReportData, filename: string): Promise<string> {
    const pdfBuffer = this.generatePDF(reportData);
    
    // In a real implementation, you would save this to cloud storage
    // For now, we'll return a mock path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = `/exports/${filename}-${timestamp}.pdf`;
    
    // Here you would typically upload to S3, Google Cloud Storage, etc.
    // await uploadToCloudStorage(pdfBuffer, filePath);
    
    return filePath;
  }
}

export function generateWhiteLabelPDF(
  reportData: PDFReportData
): Promise<{ buffer: Buffer; filePath: string }> {
  return new Promise((resolve, reject) => {
    try {
      const service = new WhiteLabelPDFService(reportData.whiteLabel);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${reportData.type}-report-${timestamp}`;
      
      const buffer = service.generatePDF(reportData);
      const filePath = `/exports/${filename}.pdf`;
      
      resolve({ buffer, filePath });
    } catch (error) {
      reject(error);
    }
  });
}

export async function createWhiteLabelPDFReport(
  type: PDFReportData['type'],
  data: any,
  whiteLabel?: WhiteLabelOptions,
  url?: string,
  urls?: string[]
): Promise<{ buffer: Buffer; filePath: string }> {
  const reportData: PDFReportData = {
    type,
    data,
    url,
    urls,
    generatedAt: new Date(),
    whiteLabel,
  };

  return generateWhiteLabelPDF(reportData);
}