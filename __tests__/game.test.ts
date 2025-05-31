import { Game, Question } from '../lib/game';

describe('Question', () => {
  test('should initialize with text and empty answers', () => {
    // Arrange
    const questionText = "What's your favorite programming language?";
    
    // Act
    const question = new Question(questionText);
    
    // Assert
    expect(question.text).toBe(questionText);
    expect(question.answers).toEqual({});
  });
  
  test('should add player answer', () => {
    // Arrange
    const question = new Question("What's your favorite programming language?");
    const playerName = "Alice";
    const answer = "TypeScript";
    
    // Act
    question.addAnswer(playerName, answer);
    
    // Assert
    expect(question.answers[playerName]).toBe(answer);
  });
  
  test('should get most common answer', () => {
    // Arrange
    const question = new Question("What's your favorite programming language?");
    question.addAnswer("Alice", "TypeScript");
    question.addAnswer("Bob", "JavaScript");
    question.addAnswer("Charlie", "TypeScript");
    question.addAnswer("Dave", "Python");
    
    // Act
    const mostCommon = question.getMostCommonAnswer();
    
    // Assert
    expect(mostCommon).toBe("TypeScript");
  });
  
  test('should get players with most common answer', () => {
    // Arrange
    const question = new Question("What's your favorite programming language?");
    question.addAnswer("Alice", "TypeScript");
    question.addAnswer("Bob", "JavaScript");
    question.addAnswer("Charlie", "TypeScript");
    question.addAnswer("Dave", "Python");
    
    // Act
    const players = question.getPlayersWithMostCommonAnswer();
    
    // Assert
    expect(players).toEqual(["Alice", "Charlie"]);
  });
});

describe('Game', () => {
  test('should initialize with questions', () => {
    // Arrange & Act
    const game = new Game();
    
    // Assert
    expect(game.questions.length).toBeGreaterThan(0);
    expect(game.questions[0]).toBeInstanceOf(Question);
  });
  
  test('should throw error when starting with fewer than 3 players', () => {
    // Arrange
    const game = new Game();
    game.addPlayer("Alice");
    game.addPlayer("Bob");
    
    // Act & Assert
    expect(() => {
      game.start();
    }).toThrow("Cannot start game with fewer than 3 players");
  });
  
  test('should start game with 3 or more players', () => {
    // Arrange
    const game = new Game();
    game.addPlayer("Alice");
    game.addPlayer("Bob");
    game.addPlayer("Charlie");
    
    // Act & Assert
    expect(() => {
      game.start();
    }).not.toThrow();
  });
  
  test('should add player', () => {
    // Arrange
    const game = new Game();
    const playerName = "Alice";
    
    // Act
    game.addPlayer(playerName);
    
    // Assert
    expect(game.players).toContain(playerName);
    expect(game.scores[playerName]).toBe(0);
  });
  
  test('should get current question', () => {
    // Arrange
    const game = new Game();
    
    // Act
    const question = game.getCurrentQuestion();
    
    // Assert
    expect(question).toBeInstanceOf(Question);
  });
  
  test('should submit answer', () => {
    // Arrange
    const game = new Game();
    game.addPlayer("Alice");
    
    // Act
    game.submitAnswer("Alice", "TypeScript");
    
    // Assert
    const currentQuestion = game.getCurrentQuestion();
    expect(currentQuestion.answers["Alice"]).toBe("TypeScript");
  });
  
  test('should move to next question', () => {
    // Arrange
    const game = new Game();
    const initialQuestionIndex = game.currentQuestionIndex;
    
    // Act
    game.nextQuestion();
    
    // Assert
    expect(game.currentQuestionIndex).toBe((initialQuestionIndex + 1) % game.questions.length);
  });
  
  test('should score current question', () => {
    // Arrange
    const game = new Game();
    game.addPlayer("Alice");
    game.addPlayer("Bob");
    game.addPlayer("Charlie");
    
    game.submitAnswer("Alice", "TypeScript");
    game.submitAnswer("Bob", "JavaScript");
    game.submitAnswer("Charlie", "TypeScript");
    
    // Act
    const winners = game.scoreCurrentQuestion();
    
    // Assert
    expect(winners).toEqual(["Alice", "Charlie"]);
    expect(game.scores["Alice"]).toBe(1);
    expect(game.scores["Bob"]).toBe(0);
    expect(game.scores["Charlie"]).toBe(1);
  });
});
