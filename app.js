// Game data
const gameData = {
  "categories": [
    "Paramount+ Shows", 
    "Star Trek Universe", 
    "Yellowstone Universe", 
    "Reality TV", 
    "Crime & Drama", 
    "Movies"
  ],
  "questions": {
    "Paramount+ Shows": {
      "1": "This animated series follows SpongeBob's early days at summer camp.",
      "2": "In this reboot of a 1990s series, babies Tommy, Chuckie, Phil, and Lil return with new adventures.",
      "3": "Mayor of Kingstown takes place in a city dominated by these institutions.",
      "4": "The Good Fight is a spinoff of this popular CBS legal drama.",
      "5": "This comedy series starring Kelsey Grammer as a psychiatrist was rebooted for Paramount+ in 2025."
    },
    "Star Trek Universe": {
      "1": "This Star Trek series features the return of Jean-Luc Picard.",
      "2": "In Star Trek: Discovery, this character became the first Black female lead in the franchise history.",
      "3": "This animated Star Trek comedy series follows the support crew of one of Starfleet's least important ships.",
      "4": "Star Trek: Strange New Worlds is a spinoff featuring this iconic character as captain of the USS Enterprise.",
      "5": "The 2025 film Star Trek: Section 31 stars this actress who previously played Emperor Philippa Georgiou."
    },
    "Yellowstone Universe": {
      "1": "This actor plays John Dutton in the series Yellowstone.",
      "2": "1883 depicts the Dutton family's journey to this U.S. state where they established their ranch.",
      "3": "This actor known for The Godfather starred in the Yellowstone prequel 1923.",
      "4": "Taylor Sheridan, creator of Yellowstone, also created this series starring Jeremy Renner as a released prisoner.",
      "5": "This Yellowstone prequel series takes place during Prohibition and the Great Depression."
    },
    "Reality TV": {
      "1": "RuPaul hosts this popular drag competition show available on Paramount+.",
      "2": "Season 17 winner of RuPaul's Drag Race in 2025 was this queen from Cleveland, Ohio.",
      "3": "This MTV reality show follows participants competing in physical challenges and strategic gameplay.",
      "4": "RuPaul's Drag Race All Stars Season 10 introduced this new format with competing brackets.",
      "5": "The new elimination mechanism on RuPaul's Drag Race featuring judge Michelle Visage involves this controversial water feature."
    },
    "Crime & Drama": {
      "1": "Criminal Minds: Evolution is a continuation of this long-running CBS procedural drama.",
      "2": "In Evil, this actress plays forensic psychologist Kristen Bouchard.",
      "3": "This antagonist known as the 'Sicarius Killer' appears in Criminal Minds: Evolution.",
      "4": "The Good Fight takes place in this major U.S. city.",
      "5": "Tulsa King stars this actor as a New York mafia capo who rebuilds his criminal empire in Oklahoma."
    },
    "Movies": {
      "1": "This blue video game character's movies are available on Paramount+.",
      "2": "This 2025 animated film explores the origin story of Optimus Prime and Megatron.",
      "3": "Tom Cruise returns as Ethan Hunt in this action franchise available on Paramount+.",
      "4": "This 2020 sci-fi film starring Mark Wahlberg as a man who can remember his past lives was a Paramount+ exclusive.",
      "5": "A Quiet Place is set in a post-apocalyptic world where people must remain silent to avoid these creatures."
    }
  },
  "answers": {
    "Paramount+ Shows": {
      "1": "Kamp Koral",
      "2": "Rugrats",
      "3": "Prisons",
      "4": "The Good Wife",
      "5": "Frasier"
    },
    "Star Trek Universe": {
      "1": "Star Trek: Picard",
      "2": "Michael Burnham",
      "3": "Star Trek: Lower Decks",
      "4": "Captain Pike",
      "5": "Michelle Yeoh"
    },
    "Yellowstone Universe": {
      "1": "Kevin Costner",
      "2": "Montana",
      "3": "Harrison Ford",
      "4": "Mayor of Kingstown",
      "5": "1923"
    },
    "Reality TV": {
      "1": "RuPaul's Drag Race",
      "2": "Onya Nurve",
      "3": "The Challenge",
      "4": "Tournament",
      "5": "Dunk Tank"
    },
    "Crime & Drama": {
      "1": "Criminal Minds",
      "2": "Katja Herbers",
      "3": "Elias Voit",
      "4": "Chicago",
      "5": "Sylvester Stallone"
    },
    "Movies": {
      "1": "Sonic the Hedgehog",
      "2": "Transformers One",
      "3": "Mission: Impossible",
      "4": "Infinite",
      "5": "Aliens"
    }
  }
};

// Game state
let currentScore = 0;
let answeredQuestions = new Set();
let currentQuestion = null;
let timer = null;
let timeLeft = 30;

// DOM elements
const elements = {
  currentScore: document.getElementById('currentScore'),
  resetBtn: document.getElementById('resetBtn'),
  questionModal: document.getElementById('questionModal'),
  gameOverModal: document.getElementById('gameOverModal'),
  questionText: document.getElementById('questionText'),
  questionValue: document.getElementById('questionValue'),
  answerInput: document.getElementById('answerInput'),
  submitBtn: document.getElementById('submitBtn'),
  feedback: document.getElementById('feedback'),
  feedbackMessage: document.getElementById('feedbackMessage'),
  continueBtn: document.getElementById('continueBtn'),
  timerDisplay: document.getElementById('timer'),
  finalScore: document.getElementById('finalScore'),
  newGameBtn: document.getElementById('newGameBtn')
};

// Initialize game
function initGame() {
  currentScore = 0;
  answeredQuestions.clear();
  updateScoreDisplay();
  
  // Reset all question tiles
  document.querySelectorAll('.question-tile').forEach(tile => {
    tile.classList.remove('answered');
    tile.addEventListener('click', handleQuestionClick);
  });
  
  // Hide modals
  elements.questionModal.classList.add('hidden');
  elements.gameOverModal.classList.add('hidden');
  
  // Reset feedback
  elements.feedback.classList.add('hidden');
  elements.feedback.classList.remove('correct', 'incorrect');
}

// Handle question tile click
function handleQuestionClick(event) {
  const tile = event.currentTarget;
  
  // Don't allow clicking answered questions
  if (tile.classList.contains('answered')) {
    return;
  }
  
  const category = tile.dataset.category;
  const value = tile.dataset.value;
  
  showQuestion(category, value, tile);
}

// Show question modal
function showQuestion(category, value, tile) {
  currentQuestion = { category, value, tile };
  
  // Set question content
  elements.questionText.textContent = gameData.questions[category][value];
  elements.questionValue.textContent = `${value} Minute${value !== '1' ? 's' : ''}`;
  
  // Reset answer input
  elements.answerInput.value = '';
  elements.answerInput.disabled = false;
  elements.submitBtn.disabled = false;
  
  // Reset feedback
  elements.feedback.classList.add('hidden');
  elements.feedback.classList.remove('correct', 'incorrect');
  
  // Start timer
  startTimer();
  
  // Show modal and focus input
  elements.questionModal.classList.remove('hidden');
  elements.answerInput.focus();
}

// Start countdown timer
function startTimer() {
  timeLeft = 30;
  updateTimerDisplay();
  
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeUp();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  elements.timerDisplay.textContent = timeLeft;
  
  // Add warning classes
  elements.timerDisplay.classList.remove('warning', 'danger');
  if (timeLeft <= 10 && timeLeft > 5) {
    elements.timerDisplay.classList.add('warning');
  } else if (timeLeft <= 5) {
    elements.timerDisplay.classList.add('danger');
  }
}

// Handle time up
function handleTimeUp() {
  elements.answerInput.disabled = true;
  elements.submitBtn.disabled = true;
  
  const correctAnswer = gameData.answers[currentQuestion.category][currentQuestion.value];
  showFeedback(false, correctAnswer, "Time's up!");
}

// Handle answer submission
function submitAnswer() {
  if (elements.answerInput.disabled) return;
  
  clearInterval(timer);
  
  const userAnswer = elements.answerInput.value.trim();
  const correctAnswer = gameData.answers[currentQuestion.category][currentQuestion.value];
  
  // Case-insensitive comparison
  const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
  
  elements.answerInput.disabled = true;
  elements.submitBtn.disabled = true;
  
  showFeedback(isCorrect, correctAnswer);
}

// Show feedback
function showFeedback(isCorrect, correctAnswer, timeUpMessage = null) {
  let message;
  
  if (timeUpMessage) {
    message = `${timeUpMessage}<br><strong>Correct answer:</strong> ${correctAnswer}`;
    elements.feedback.classList.add('incorrect');
  } else if (isCorrect) {
    message = "Correct!";
    elements.feedback.classList.add('correct');
  } else {
    message = `Wrong!<br><strong>Correct answer:</strong> ${correctAnswer}`;
    elements.feedback.classList.add('incorrect');
  }
  
  elements.feedbackMessage.innerHTML = message;
  elements.feedback.classList.remove('hidden');
  elements.feedback.classList.add('show');
  
  // Update score
  const value = parseInt(currentQuestion.value);
  if (isCorrect && !timeUpMessage) {
    currentScore += value;
  } else {
    currentScore = Math.max(0, currentScore - value);
  }
  
  updateScoreDisplay();
  
  // Mark question as answered
  currentQuestion.tile.classList.add('answered');
  answeredQuestions.add(`${currentQuestion.category}-${currentQuestion.value}`);
  
  // Focus continue button
  elements.continueBtn.focus();
}

// Update score display
function updateScoreDisplay() {
  elements.currentScore.textContent = currentScore;
}

// Continue to next question
function continueGame() {
  elements.questionModal.classList.add('hidden');
  
  // Check if all questions are answered
  if (answeredQuestions.size === 30) { // 6 categories × 5 questions
    showGameOver();
  }
}

// Show game over modal
function showGameOver() {
  elements.finalScore.textContent = currentScore;
  elements.gameOverModal.classList.remove('hidden');
  elements.newGameBtn.focus();
}

// Event listeners
elements.resetBtn.addEventListener('click', initGame);
elements.newGameBtn.addEventListener('click', initGame);
elements.submitBtn.addEventListener('click', submitAnswer);
elements.continueBtn.addEventListener('click', continueGame);

// Handle Enter key in answer input
elements.answerInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !elements.submitBtn.disabled) {
    submitAnswer();
  }
});

// Handle Enter key on continue button
elements.continueBtn.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    continueGame();
  }
});

// Close modal when clicking outside (optional enhancement)
elements.questionModal.addEventListener('click', (event) => {
  if (event.target === elements.questionModal) {
    // Don't allow closing during active question
    return;
  }
});

// Prevent form submission if wrapped in a form
document.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
    event.preventDefault();
  }
});

// Initialize game on page load
document.addEventListener('DOMContentLoaded', initGame);