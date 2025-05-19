import fs from 'fs/promises';
import path from 'path';

export interface Suggestion {
  id: string;
  email: string;
  comment: string;
  createdAt: string;
}

const SUGGESTIONS_FILE = path.join(process.cwd(), 'data', 'suggestions.json');

export async function getSuggestions(): Promise<Suggestion[]> {
  try {
    const data = await fs.readFile(SUGGESTIONS_FILE, 'utf-8');
    const json = JSON.parse(data);
    return json.suggestions;
  } catch (error) {
    console.error('Error reading suggestions:', error);
    return [];
  }
}

export async function isEmailExists(email: string): Promise<boolean> {
  const suggestions = await getSuggestions();
  return suggestions.some(suggestion => suggestion.email.toLowerCase() === email.toLowerCase());
}

export async function addSuggestion(suggestion: Omit<Suggestion, 'id' | 'createdAt'>): Promise<Suggestion> {
  try {
    const suggestions = await getSuggestions();
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    suggestions.push(newSuggestion);
    
    await fs.writeFile(
      SUGGESTIONS_FILE,
      JSON.stringify({ suggestions }, null, 2),
      'utf-8'
    );
    
    return newSuggestion;
  } catch (error) {
    console.error('Error adding suggestion:', error);
    throw new Error('Failed to add suggestion');
  }
} 