'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, FileDown, Lock } from "lucide-react";
import { useState } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  trend: string;
  cpc: number;
  competition: number;
  isPremium?: boolean;
}

interface KeywordTableProps {
  data: KeywordData[];
  showPremium?: boolean;
  onPremiumClick?: () => void;
}

export function KeywordTable({ data, showPremium = false, onPremiumClick }: KeywordTableProps) {
  const [sortField, setSortField] = useState<keyof KeywordData>('searchVolume');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField] ?? 0;
    const bValue = b[sortField] ?? 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof KeywordData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCsv = () => {
    const headers = ['Keyword', 'Search Volume', 'Trend', 'Average CPC (USD)', 'Competition'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => [
        row.keyword,
        row.searchVolume,
        row.trend,
        row.cpc.toFixed(2),
        row.competition
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'keyword_data.csv';
    link.click();
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const title = 'Keyword Research Results';
    const exportDate = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${exportDate}`, 14, 25);

    // Prepare table data
    const headers = [['Keyword', 'Search Volume', 'Trend', 'CPC (USD)', 'Competition']];
    const data = sortedData.map(row => [
      row.keyword,
      row.searchVolume.toLocaleString(),
      row.trend,
      `$${row.cpc.toFixed(2)}`,
      getCompetitionLabel(row.competition)
    ]);

    // Add table
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 63, 70],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });

    // Save PDF
    doc.save('keyword_research.pdf');
  };

  const getCompetitionLabel = (value: number) => {
    if (value <= 0.33) return 'Low';
    if (value <= 0.66) return 'Medium';
    return 'High';
  };

  const getCompetitionColor = (value: number) => {
    if (value <= 0.33) return 'text-green-600';
    if (value <= 0.66) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Keyword Analysis Results</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPdf}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button variant="ghost" onClick={() => handleSort('keyword')}>
                  Keyword
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('searchVolume')}>
                  Search Volume
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('trend')}>
                  Trend
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('cpc')}>
                  Average CPC (USD)
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('competition')}>
                  Competition
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow 
                key={index} 
                className={row.isPremium && !showPremium ? 'opacity-50 cursor-pointer hover:opacity-75 transition-opacity' : ''}
                onClick={() => {
                  if (row.isPremium && !showPremium && onPremiumClick) {
                    onPremiumClick();
                  }
                }}
              >
                <TableCell className="font-medium">
                  {row.keyword}
                  {row.isPremium && !showPremium && (
                    <Lock className="h-3 w-3 ml-2 inline-block text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  {row.isPremium && !showPremium ? (
                    <span className="text-muted-foreground">Premium</span>
                  ) : (
                    row.searchVolume.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {row.isPremium && !showPremium ? (
                    <span className="text-muted-foreground">Premium</span>
                  ) : (
                    row.trend
                  )}
                </TableCell>
                <TableCell>
                  {row.isPremium && !showPremium ? (
                    <span className="text-muted-foreground">Premium</span>
                  ) : (
                    `$${row.cpc.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell className={getCompetitionColor(row.competition)}>
                  {row.isPremium && !showPremium ? (
                    <span className="text-muted-foreground">Premium</span>
                  ) : (
                    getCompetitionLabel(row.competition)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 