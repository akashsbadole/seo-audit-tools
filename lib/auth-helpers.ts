import jwt from "jsonwebtoken";
import prisma from "./prisma";

export async function authenticateUser(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Authentication required", status: 401 };
  }

  const token = authHeader.substring(7);
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded?.userId) {
      return { error: "Invalid token", status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, isPremium: true }
    });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    return { user };
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}