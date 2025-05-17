interface ServiceRequestData {
  name: string;
  email: string;
  phoneNumber: string;
  brandName: string;
  websiteType: string;
  budget: string;
  question: string;
  brandDescription: string;
  additionalRequirements?: string;
  hasDomain: boolean;
  hasHosting: boolean;
  needsLogo: boolean;
  categoryPages: string;
  needsContent: boolean;
  providingProductImages: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export function getCustomerEmailTemplate(data: ServiceRequestData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Thank You for Your Service Request</h1>
      
      <p>Dear ${data.name},</p>
      
      <p>We have received your service request and will review it shortly. Here's a summary of your request:</p>
      
      <h2 style="color: #444;">Project Details</h2>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Brand Name:</strong> ${data.brandName}</li>
        <li><strong>Website Type:</strong> ${data.websiteType}</li>
        <li><strong>Budget Range:</strong> ${data.budget}</li>
        <li><strong>Your Question:</strong> ${data.question}</li>
      </ul>
      
      <h2 style="color: #444;">Technical Requirements</h2>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Domain:</strong> ${data.hasDomain ? 'You have a domain' : 'You need a domain'}</li>
        <li><strong>Hosting:</strong> ${data.hasHosting ? 'You have hosting' : 'You need hosting'}</li>
        <li><strong>Logo:</strong> ${data.needsLogo ? 'You need a logo' : 'You have a logo'}</li>
        <li><strong>Category Pages:</strong> ${data.categoryPages}</li>
        <li><strong>Content:</strong> ${data.needsContent ? 'You need content' : 'You have content'}</li>
        <li><strong>Product Images:</strong> ${data.providingProductImages ? 'You will provide images' : 'You need help with images'}</li>
      </ul>

      <p>We will contact you at ${data.email} or ${data.phoneNumber} to discuss your project in detail.</p>
      
      <p>Best regards,<br>Your Service Team</p>
    </div>
  `;
}

export function getAdminEmailTemplate(data: ServiceRequestData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">New Service Request</h1>
      
      <h2 style="color: #444;">Client Information</h2>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phoneNumber}</li>
        <li><strong>IP Address:</strong> ${data.ipAddress || 'Unknown'}</li>
        <li><strong>User Agent:</strong> ${data.userAgent || 'Unknown'}</li>
      </ul>
      
      <h2 style="color: #444;">Project Details</h2>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Brand Name:</strong> ${data.brandName}</li>
        <li><strong>Website Type:</strong> ${data.websiteType}</li>
        <li><strong>Budget:</strong> ${data.budget}</li>
        <li><strong>Question:</strong> ${data.question}</li>
        <li><strong>Brand Description:</strong> ${data.brandDescription}</li>
        <li><strong>Additional Requirements:</strong> ${data.additionalRequirements || 'None'}</li>
      </ul>
      
      <h2 style="color: #444;">Technical Requirements</h2>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Has Domain:</strong> ${data.hasDomain ? 'Yes' : 'No'}</li>
        <li><strong>Has Hosting:</strong> ${data.hasHosting ? 'Yes' : 'No'}</li>
        <li><strong>Needs Logo:</strong> ${data.needsLogo ? 'Yes' : 'No'}</li>
        <li><strong>Category Pages:</strong> ${data.categoryPages}</li>
        <li><strong>Needs Content:</strong> ${data.needsContent ? 'Yes' : 'No'}</li>
        <li><strong>Will Provide Images:</strong> ${data.providingProductImages ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  `;
} 