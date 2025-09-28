import { Question, allQuestions } from './questions';
import questionSets from './questionSets.json';

export function getRandomQuestions(count: number): Question[] {
  if (questionSets.length === 0) {
    console.warn("No question sets defined. Returning all questions.");
    return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // Randomly select one question set
  const randomSetIndex = Math.floor(Math.random() * questionSets.length);
  const selectedQuestionIds = questionSets[randomSetIndex];

  // Filter allQuestions to include only those in the selected set
  const selectedQuestions = allQuestions.filter(question =>
    selectedQuestionIds.includes(question.id)
  );

  // Ensure we return exactly 'count' questions, even if the set has more or less
  // (though ideally each set in questionSets.json should have 'count' questions)
  if (selectedQuestions.length > count) {
    return selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
  } else if (selectedQuestions.length < count) {
    console.warn("Selected question set has fewer questions than requested count. Filling with random questions.");
    const remainingCount = count - selectedQuestions.length;
    const alreadySelectedIds = new Set(selectedQuestions.map(q => q.id));
    const fillerQuestions = allQuestions.filter(q => !alreadySelectedIds.has(q.id))
                                      .sort(() => 0.5 - Math.random())
                                      .slice(0, remainingCount);
    return selectedQuestions.concat(fillerQuestions).sort(() => 0.5 - Math.random());
  }

  return selectedQuestions.sort(() => 0.5 - Math.random()); // Final shuffle
}