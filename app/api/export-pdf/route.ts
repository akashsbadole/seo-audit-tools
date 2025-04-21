import { NextResponse } from "next/server"
import jsPDF from "jspdf"
import type { PDFExportOptions, SEOAuditResult } from "@/types/seo-audit"

export async function POST(request: Request) {
  try {
    const { url, auditResult, exportOptions } = await request.json()

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt", // Use points for more precise positioning
      format: "a4"
    })

    // Helper function to add text with word wrap
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.text(lines, x, y)
      return lines.length * fontSize * 1.2 // Return height of text block
    }

    // Add watermark if enabled
    if (exportOptions.includeWatermark) {
      const watermarkText = exportOptions.watermarkText || "SEO Audit Report"
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Set watermark properties
      doc.setTextColor(200, 200, 200) // Light gray color
      doc.setFontSize(60)
      
      // Position and rotate watermark
      doc.text(watermarkText, pageWidth/2, pageHeight/2, {
        align: 'center',
        angle: -45
      })
    }

    // Reset text color for content
    doc.setTextColor(0)

    // Set initial position
    let currentY = 60 // Increased initial Y position
    const marginLeft = 60 // Increased left margin
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - (marginLeft * 2)

    // Add title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(28) // Increased title size
    doc.text("SEO Audit Report", pageWidth / 2, currentY, { align: 'center' })
    currentY += 40 // Increased spacing after title

    // Add URL and date
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text(`URL: ${url}`, marginLeft, currentY)
    currentY += 35 // Increased spacing
    doc.text(`Generated on: ${new Date().toLocaleString()}`, marginLeft, currentY)
    currentY += 40 // Increased spacing

    // Add overall score with a box
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("Overall SEO Score", marginLeft, currentY)
    currentY += 35
    doc.setFont("helvetica", "normal")
    doc.setFontSize(14)
    
    // Draw a box around the score
    const scoreText = `${auditResult.overallScore}/100`
    const scoreWidth = doc.getTextWidth(scoreText)
    const boxWidth = scoreWidth + 40
    const boxHeight = 30
    doc.rect(marginLeft, currentY - 20, boxWidth, boxHeight)
    doc.text(scoreText, marginLeft + 20, currentY)
    currentY += 50 // Increased spacing after score

    // Function to add a section
    const addSection = (title: string, data: any) => {
      // Check if we need a new page
      if (currentY > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage()
        currentY = 60 // Reset to new page initial position

        // Re-add watermark on new page if enabled
        if (exportOptions.includeWatermark) {
          const watermarkText = exportOptions.watermarkText || "SEO Audit Report"
          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()
          doc.setTextColor(200, 200, 200)
          doc.setFontSize(60)
          doc.text(watermarkText, pageWidth/2, pageHeight/2, {
            align: 'center',
            angle: -45
          })
          doc.setTextColor(0)
        }
      }

      // Add section title with underline
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16) // Increased section title size
      doc.text(title, marginLeft, currentY)
      doc.setDrawColor(0, 0, 0)
      doc.line(marginLeft, currentY + 5, marginLeft + 200, currentY + 5)
      currentY += 30 // Increased spacing after section title

      // Add status items
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        if (typeof value === 'object' && value !== null && 'status' in value) {
          // Check if we need a new page
          if (currentY > doc.internal.pageSize.getHeight() - 150) {
            doc.addPage()
            currentY = 60

            // Re-add watermark on new page if enabled
            if (exportOptions.includeWatermark) {
              const watermarkText = exportOptions.watermarkText || "SEO Audit Report"
              const pageWidth = doc.internal.pageSize.getWidth()
              const pageHeight = doc.internal.pageSize.getHeight()
              doc.setTextColor(200, 200, 200)
              doc.setFontSize(60)
              doc.text(watermarkText, pageWidth/2, pageHeight/2, {
                align: 'center',
                angle: -45
              })
              doc.setTextColor(0)
            }
          }

          // Add item title and value
          doc.setFont("helvetica", "bold")
          doc.setFontSize(12)
          doc.text(`${key}: `, marginLeft, currentY)
          doc.setFont("helvetica", "normal")
          const titleWidth = doc.getTextWidth(`${key}: `)
          const valueHeight = addWrappedText(value.value || '', marginLeft + titleWidth, currentY, contentWidth - titleWidth)
          currentY += Math.max(35, valueHeight) // Increased spacing

          // Add issues if any
          if (value.issues && value.issues.length > 0) {
            doc.setTextColor(255, 0, 0) // Red for issues
            doc.setFont("helvetica", "bold")
            doc.text("Issues:", marginLeft, currentY)
            currentY += 20 // Increased spacing
            doc.setFont("helvetica", "normal")
            value.issues.forEach((issue: string) => {
              const issueHeight = addWrappedText(`• ${issue}`, marginLeft + 20, currentY, contentWidth - 20, 11) // Slightly larger font
              currentY += Math.max(20, issueHeight) // Increased spacing
            })
          }

          // Add recommendations if any
          if (value.recommendations && value.recommendations.length > 0) {
            doc.setTextColor(0, 128, 0) // Green for recommendations
            doc.setFont("helvetica", "bold")
            doc.text("Recommendations:", marginLeft, currentY)
            currentY += 20 // Increased spacing
            doc.setFont("helvetica", "normal")
            value.recommendations.forEach((rec: string) => {
              const recHeight = addWrappedText(`• ${rec}`, marginLeft + 20, currentY, contentWidth - 20, 11) // Slightly larger font
              currentY += Math.max(20, recHeight) // Increased spacing
            })
          }

          doc.setTextColor(0) // Reset to black
          currentY += 20 // Increased spacing between items
        }
      })
      currentY += 30 // Increased spacing between sections
    }

    // Add sections based on exportOptions
    if (exportOptions.includeSections.onPageSEO) {
      addSection('Basic SEO', auditResult.onPageSEO)
    }
    if (exportOptions.includeSections.technicalSEO) {
      addSection('Technical SEO', auditResult.technicalSEO)
    }
    if (exportOptions.includeSections.contentSEO) {
      addSection('Content SEO', auditResult.contentSEO)
    }
    if (exportOptions.includeSections.performance) {
      addSection('Performance', auditResult.performance)
    }
    if (exportOptions.includeSections.advancedSEO) {
      addSection('Advanced SEO', auditResult.advancedSEO)
    }
    if (exportOptions.includeSections.competitiveAnalysis) {
      addSection('Competitive Analysis', auditResult.competitiveAnalysis)
    }

    // Generate a clean filename
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-')
    const date = new Date().toISOString().split('T')[0]
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0')
    const time = `${hours}-${minutes}-${seconds}-${milliseconds}`
    const filename = `seo-audit-${cleanUrl}-${date}-${time}.pdf`

    // Convert the PDF to a buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}
