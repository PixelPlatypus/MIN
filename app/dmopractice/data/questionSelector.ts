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

export function getRandomQuestionsAcrossSets(count: number): Question[] {
  const flat: Question[] = allQuestionSets.reduce<Question[]>((acc, set) => acc.concat(set), []);
  if (flat.length === 0) return [];

  const shuffled = [...flat];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const uniqueById: Record<string, Question> = {};
  for (const q of shuffled) {
    if (!uniqueById[q.id]) uniqueById[q.id] = q;
    if (Object.keys(uniqueById).length >= count) break;
  }

  const result = Object.values(uniqueById);
  if (result.length < count) return result;
  return result.slice(0, count);
}
