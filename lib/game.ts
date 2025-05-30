// Define types for our game
type PlayerName = string;
type Answer = string;
type Answers = Record<PlayerName, Answer>;
type Scores = Record<PlayerName, number>;

/**
 * Question class to manage a single question in the game
 */
export class Question {
  text: string;
  answers: Answers;

  constructor(text: string) {
    this.text = text;
    this.answers = {};
  }

  /**
   * Add a player's answer to the question
   */
  addAnswer(playerName: PlayerName, answer: Answer): void {
    this.answers[playerName] = answer;
  }

  /**
   * Get the most common answer among all players
   */
  getMostCommonAnswer(): Answer {
    if (Object.keys(this.answers).length === 0) {
      return "";
    }

    const answerCounts = new Map<Answer, number>();
    
    // Count occurrences of each answer
    Object.values(this.answers).forEach(answer => {
      answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
    });

    // Find the answer with the highest count
    let mostCommonAnswer = "";
    let highestCount = 0;

    answerCounts.forEach((count, answer) => {
      if (count > highestCount) {
        mostCommonAnswer = answer;
        highestCount = count;
      }
    });

    return mostCommonAnswer;
  }

  /**
   * Get a list of players who gave the most common answer
   */
  getPlayersWithMostCommonAnswer(): PlayerName[] {
    const mostCommonAnswer = this.getMostCommonAnswer();
    if (!mostCommonAnswer) return [];

    return Object.entries(this.answers)
      .filter(([, answer]) => answer === mostCommonAnswer)
      .map(([playerName]) => playerName);
  }
}

/**
 * Game class to manage the overall game state
 */
export class Game {
  questions: Question[];
  currentQuestionIndex: number;
  players: Set<PlayerName>;
  scores: Scores;

  constructor() {
    this.questions = this.loadQuestions();
    this.currentQuestionIndex = 0;
    this.players = new Set<PlayerName>();
    this.scores = {};
  }

  /**
   * Load programming-related questions
   */
  private loadQuestions(): Question[] {
    const questionTexts = [
      "What's your favorite programming language?",
      "What's the most frustrating bug you've ever encountered?",
      "What's your preferred code editor or IDE?",
      "What's your favorite data structure?",
      "What's the best way to debug code?",
      "What's your favorite design pattern?",
      "What's the most important skill for a programmer?",
      "What's the best programming book you've read?",
      "What's your favorite algorithm?",
      "What's the best way to learn programming?",
      "What's the most overrated technology?",
      "What's the most underrated programming language?",
      "What's your favorite way to handle errors?",
      "What's the best coding convention?",
      "What's your preferred testing framework?",
      "What's the most useful programming paradigm?",
      "What's your favorite keyboard shortcut?",
      "What's the best way to document code?",
      "What's your favorite terminal command?",
      "What's the most important principle of clean code?"
    ];

    return questionTexts.map(text => new Question(text));
  }

  /**
   * Add a player to the game
   */
  addPlayer(playerName: PlayerName): void {
    this.players.add(playerName);
    this.scores[playerName] = 0;
  }

  /**
   * Get the current question
   */
  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  /**
   * Submit a player's answer for the current question
   */
  submitAnswer(playerName: PlayerName, answer: Answer): void {
    if (!this.players.has(playerName)) {
      throw new Error(`Player ${playerName} is not in the game`);
    }

    const currentQuestion = this.getCurrentQuestion();
    currentQuestion.addAnswer(playerName, answer);
  }

  /**
   * Move to the next question
   */
  nextQuestion(): void {
    this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
  }

  /**
   * Score the current question and update player scores
   */
  scoreCurrentQuestion(): PlayerName[] {
    const currentQuestion = this.getCurrentQuestion();
    const playersWithMostCommonAnswer = currentQuestion.getPlayersWithMostCommonAnswer();

    // Award 1 point to players who gave the most common answer
    playersWithMostCommonAnswer.forEach(playerName => {
      this.scores[playerName] += 1;
    });

    return playersWithMostCommonAnswer;
  }

  /**
   * Get the current scores for all players
   */
  getScores(): Scores {
    return this.scores;
  }
}
