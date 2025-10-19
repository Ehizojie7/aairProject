/**
 * Natural Language Task Parser
 * 
 * This utility intelligently parses spoken text to extract multiple tasks.
 * It handles various patterns and conjunctions commonly used in speech.
 */

export interface ParsedTask {
  title: string;
  confidence: number; // 0-1 score indicating parsing confidence
}

export interface ParseResult {
  tasks: ParsedTask[];
  originalText: string;
  parsingMethod: string;
}

/**
 * Common conjunctions and separators used to split tasks
 */
const TASK_SEPARATORS = [
  // Coordinating conjunctions
  { pattern: /\s+and\s+/gi, weight: 1.0, name: 'and' },
  { pattern: /\s+then\s+/gi, weight: 0.9, name: 'then' },
  { pattern: /\s+also\s+/gi, weight: 0.8, name: 'also' },
  { pattern: /\s+plus\s+/gi, weight: 0.7, name: 'plus' },
  
  // Punctuation-based separators
  { pattern: /[,;]\s*/g, weight: 0.6, name: 'punctuation' },
  
  // Sequential indicators
  { pattern: /\s+after\s+that\s+/gi, weight: 0.9, name: 'after that' },
  { pattern: /\s+next\s+/gi, weight: 0.8, name: 'next' },
  { pattern: /\s+afterwards\s+/gi, weight: 0.7, name: 'afterwards' },
];

/**
 * Action verbs that typically start tasks
 */
const ACTION_VERBS = [
  'buy', 'call', 'email', 'text', 'message', 'send', 'write', 'read', 'finish', 'complete',
  'start', 'begin', 'schedule', 'book', 'reserve', 'order', 'purchase', 'get', 'pick up',
  'drop off', 'deliver', 'submit', 'review', 'check', 'verify', 'confirm', 'cancel',
  'update', 'edit', 'delete', 'remove', 'add', 'create', 'make', 'prepare', 'organize',
  'clean', 'wash', 'fix', 'repair', 'install', 'setup', 'configure', 'backup', 'sync',
  'visit', 'go to', 'meet', 'attend', 'join', 'participate', 'watch', 'listen', 'learn'
];

/**
 * Patterns that suggest a single complex task rather than multiple tasks
 */
const SINGLE_TASK_INDICATORS = [
  /\b(and|or)\s+(then|also|plus)\b/gi, // "buy milk and then put it in fridge" - single task
  /\bfor\s+\w+/gi, // "buy flowers for mom" - single task
  /\bwith\s+\w+/gi, // "meet with John" - single task
  /\bat\s+\w+/gi, // "lunch at restaurant" - single task
  /\bin\s+\w+/gi, // "meeting in conference room" - single task
];

/**
 * Clean and normalize text for processing
 */
function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // normalize whitespace
    .replace(/[.!?]+$/, '') // remove trailing punctuation
    .toLowerCase();
}

/**
 * Check if text likely represents a single complex task
 */
function isSingleComplexTask(text: string): boolean {
  const cleaned = cleanText(text);
  
  // Check for single task indicators
  for (const indicator of SINGLE_TASK_INDICATORS) {
    if (indicator.test(cleaned)) {
      return true;
    }
  }
  
  // If text is very short, likely a single task
  if (cleaned.split(' ').length <= 4) {
    return true;
  }
  
  return false;
}

/**
 * Split text using separator patterns
 */
function splitBySeparators(text: string): { parts: string[], method: string, confidence: number } {
  let bestSplit = { parts: [text], method: 'no-split', confidence: 0.3 };
  
  for (const separator of TASK_SEPARATORS) {
    const parts = text.split(separator.pattern).map(part => part.trim()).filter(part => part.length > 0);
    
    if (parts.length > 1) {
      // Higher confidence if parts look like valid tasks
      let confidence = separator.weight;
      const validParts = parts.filter(part => isValidTaskPart(part));
      confidence *= (validParts.length / parts.length);
      
      if (confidence > bestSplit.confidence) {
        bestSplit = {
          parts,
          method: `split-by-${separator.name}`,
          confidence
        };
      }
    }
  }
  
  return bestSplit;
}

/**
 * Check if a text part looks like a valid task
 */
function isValidTaskPart(part: string): boolean {
  const cleaned = cleanText(part);
  const words = cleaned.split(' ');
  
  // Too short to be meaningful
  if (words.length < 2) {
    return false;
  }
  
  // Check if it starts with an action verb
  const firstWord = words[0];
  const startsWithAction = ACTION_VERBS.some(verb => 
    firstWord === verb || firstWord.startsWith(verb)
  );
  
  // Check if it contains an action verb
  const containsAction = words.some(word => 
    ACTION_VERBS.some(verb => word === verb || word.startsWith(verb))
  );
  
  return startsWithAction || containsAction;
}

/**
 * Capitalize first letter of each task
 */
function capitalizeTask(task: string): string {
  return task.charAt(0).toUpperCase() + task.slice(1);
}

/**
 * Main parsing function
 */
export function parseTasksFromSpeech(speechText: string): ParseResult {
  const originalText = speechText.trim();
  
  if (!originalText) {
    return {
      tasks: [],
      originalText,
      parsingMethod: 'empty-input'
    };
  }
  
  // Check if this is likely a single complex task
  if (isSingleComplexTask(originalText)) {
    return {
      tasks: [{
        title: capitalizeTask(originalText),
        confidence: 0.9
      }],
      originalText,
      parsingMethod: 'single-complex-task'
    };
  }
  
  // Try to split into multiple tasks
  const splitResult = splitBySeparators(originalText);
  
  if (splitResult.parts.length === 1) {
    // No split found, treat as single task
    return {
      tasks: [{
        title: capitalizeTask(originalText),
        confidence: 0.8
      }],
      originalText,
      parsingMethod: 'single-task-fallback'
    };
  }
  
  // Process split parts into tasks
  const tasks: ParsedTask[] = splitResult.parts.map(part => ({
    title: capitalizeTask(part),
    confidence: splitResult.confidence
  }));
  
  return {
    tasks,
    originalText,
    parsingMethod: splitResult.method
  };
}

/**
 * Utility function to get a summary of parsing results
 */
export function getParsingStats(result: ParseResult): string {
  const taskCount = result.tasks.length;
  const avgConfidence = result.tasks.reduce((sum, task) => sum + task.confidence, 0) / taskCount;
  
  return `Parsed ${taskCount} task${taskCount === 1 ? '' : 's'} using ${result.parsingMethod} (confidence: ${(avgConfidence * 100).toFixed(0)}%)`;
}

/**
 * Example usage and test cases
 */
export const EXAMPLE_INPUTS = [
  "Buy groceries and call mom",
  "Send email to John, schedule meeting with Sarah, and finish the report",
  "Pick up dry cleaning then go to the bank",
  "Buy flowers for mom's birthday",
  "Meet with the team at 3pm in conference room A",
  "Clean the house, do laundry, and prepare dinner",
  "Book flight to New York and reserve hotel room",
  "Review the proposal and send feedback to the client"
];
