import { Question } from './questions';
import { allQuestionSets } from './allQuestionSets';

export function getRandomQuestions(count: number): Question[] {
  const randomIndex = Math.floor(Math.random() * allQuestionSets.length);
  const selectedQuestionSet = allQuestionSets[randomIndex];
  
  // If we need exactly the number of questions in the set, return them
  if (selectedQuestionSet.length === count) {
    return [...selectedQuestionSet];
  }
  
  // If we need fewer questions than in the set, return the first 'count' questions
  if (selectedQuestionSet.length > count) {
    return selectedQuestionSet.slice(0, count);
  }
  
  // If we need more questions than in the set, just return all questions from set 1
  console.warn("Selected question set has fewer questions than requested count. Returning all available questions from Set 1.");
  return [...selectedQuestionSet];
}