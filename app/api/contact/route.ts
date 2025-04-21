import { NextResponse } from "next/server"
import fs from 'fs/promises'
import path from 'path'
import nodemailer from 'nodemailer'

// Path to store contact messages
const CONTACT_MESSAGES_FILE = path.join(process.cwd(), 'data', 'contact-messages.json')

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}

// Create email transporter
const transporter = nodemailer.createTransport(emailConfig)

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir)
  }
}

// Read existing messages
async function readMessages() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(CONTACT_MESSAGES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Check if email already exists
async function isEmailExists(email: string) {
  const messages = await readMessages()
  return messages.some((msg: any) => msg.email === email)
}

// Write new message
async function writeMessage(message: any) {
  await ensureDataDirectory()
  const messages = await readMessages()
  messages.push({
    ...message,
    id: Date.now(),
    createdAt: new Date().toISOString()
  })
  await fs.writeFile(CONTACT_MESSAGES_FILE, JSON.stringify(messages, null, 2))
}

// Send email notification
async function sendEmailNotification(fullName: string, email: string, message: string) {
  // Only send email if credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log("Email credentials not provided, skipping email notification")
    return
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${fullName}`,
      text: `
        New contact form submission:
        
        Name: ${fullName}
        Email: ${email}
        Message: ${message}
        
        Time: ${new Date().toLocaleString()}
      `,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log("Email notification sent successfully")
  } catch (error) {
    console.error("Error sending email notification:", error)
    // Don't throw error, just log it
  }
}

export async function POST(request: Request) {
  console.log("Handling contact form submission...")
  try {
    // Parse request body
    console.log("Parsing request body...")
    const body = await request.json()
    console.log("Request body parsed:", body)
    const { fullName, email, message } = body

    // Validate required fields
    console.log("Validating required fields...")
    if (!fullName || !email || !message) {
      console.error("Missing required fields:", { fullName, email, message })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    console.log("Validating email format...")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email)
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check for duplicate email
    console.log("Checking for duplicate email...")
    const emailExists = await isEmailExists(email)
    if (emailExists) {
      console.error("Email already exists:", email)
      return NextResponse.json(
        { error: "You have already submitted a message. Please wait before submitting again." },
        { status: 400 }
      )
    }

    // Store in file
    console.log("Storing message...")
    try {
      const newMessage = {
        fullName,
        email,
        message
      }
      await writeMessage(newMessage)
      console.log("Message saved successfully")

      // Send email notification
      await sendEmailNotification(fullName, email, message)

      return NextResponse.json({ 
        success: true,
        message: "Contact message saved successfully",
        data: newMessage
      })
    } catch (error) {
      console.error("Error saving message:", error)
      return NextResponse.json(
        { error: "Error saving message: " + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}