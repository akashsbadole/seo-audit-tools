const suggestions: Array<{ id: string; email: string; comment: string; createdAt: Date }> = [];

export interface SuggestionInput {
  email: string;
  comment: string;
}

export async function addSuggestion(data: SuggestionInput) {
  const suggestion = {
    id: `suggestion_${Date.now()}`,
    email: data.email,
    comment: data.comment,
    createdAt: new Date(),
  };
  suggestions.push(suggestion);
  return suggestion;
}

export async function isEmailExists(email: string): Promise<boolean> {
  return suggestions.some(s => s.email.toLowerCase() === email.toLowerCase());
}

export async function getSuggestions() {
  return [...suggestions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
