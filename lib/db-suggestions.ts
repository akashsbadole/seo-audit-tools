import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SuggestionInput {
  email: string;
  comment: string;
}

export async function addSuggestion(data: SuggestionInput) {
  try {
    const suggestion = await prisma.suggestion.create({
      data: {
        email: data.email,
        comment: data.comment,
      },
    });
    return suggestion;
  } catch (error) {
    console.error('Error adding suggestion:', error);
    throw new Error('Failed to add suggestion');
  }
}

export async function isEmailExists(email: string): Promise<boolean> {
  try {
    const existingSuggestion = await prisma.suggestion.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    return !!existingSuggestion;
  } catch (error) {
    console.error('Error checking if email exists:', error);
    return false;
  }
}

export async function getSuggestions() {
  try {
    const suggestions = await prisma.suggestion.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new Error('Failed to get suggestions');
  }
}