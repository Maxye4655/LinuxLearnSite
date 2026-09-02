const questions = [
    {
        question: "What symbol represents the root directory in Linux?",
        answers: [
            "/",
            "~",
            ".",
            ".."
        ],
        correct: 0
    },

    {
        question: "What does the pwd command do?",
        answers: [
            "Prints the current working directory",
            "Lists files in a directory",
            "Changes directory",
            "Deletes a directory"
        ],
        correct: 0
    },

    {
        question: "Which command lists the files and directories in your current working directory?",
        answers: [
            "pwd",
            "ls",
            "cd",
            "cat"
        ],
        correct: 1
    },
    {
        question: "Which of these commands would enter the Documents directory?",
        answers: [
            "pwd Documents",
            "ls Documents",
            "cd /Documents",
            "cd Documents"
        ],
        correct: 3
    },
    {
        question: "What does the `~` symbol represent?",
        answers: [
            "The root Directory",
            "The current working directory",
            "The user's home directory",
            "The parent directory"
        ],
        correct: 2
    },
    {
        question: "Which of these is an absolute path?",
        answers: [
            "/home/user/Documents",
            "Documents",
            "./Documents",
            "../Documents"
        ],
        correct: 0
    },
    {
        question: "Which of these is a relative path?",
        answers: [
            "/Documents",
            "Documents",
            "/home/user/Documents",
            "/home/user/../Documents"
        ],
        correct: 1
    },
    {
        question: "What does a single dot (.) represent in a file path?",
        answers: [
            "The root Directory",
            "The Parent directory",
            "The current working directory",
            "The user's home directory"
        ],
        correct: 2
    },
    {
        question: "You are in /home/student/Documents/projects. Which command takes you to /home/student/Documents?",
        answers: [
            "cd ..",
            "cd .",
            "cd /home/student/Documents",
            "cd ../.."
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");

const questionNumberElement = 
document.getElementById("questionNumber");

const scoreDisplay = 
document.getElementById("scoreDisplay");

const progressFill = 
document.getElementById("quizProgressFill");

const nextButton = 
document.getElementById("nextQuestionBtn");

const quizElement = 
document.getElementById("quiz");

const resultElement =
document.getElementById("results");

const finalScoreElement =
document.getElementById("finalScore");

const resultMessageElement = 
document.getElementById("resultMessage");

const restartButton =
document.getElementById("restartQuizBtn");

function loadQuestion() {

    answered = false;

    const question = questions[currentQuestion];

    questionElement.textContent = question.question;

    questionNumberElement.textContent =
    currentQuestion + 1;

    scoreDisplay.textContent = `Score: ${score}`;

    progressFill.style.width = 
    `${proggress}%`;

    feedbackElement.textContent = "";
    feedbackElement.className = "";

    nextButton.disabled = true; 

    answersElement.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-answer";
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.addEventListener(
            "click",
            () => selectAnswer(index)
        );

        answersElement.appendChild(button);
        
    });
}

function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = questions[currentQuestion];

    const buttons = answersElement.querySelectorAll(".quiz-answer");

    buttons.forEach((button, index ) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && index !== question.correct) {
            button.classList.add("incorrect");
        }
    });

    if (selectedIndex === question.correct) {

        score++;

        feedbackElement.textContent = "Correct!";

        feedbackElement.className = "feedback-correct";
    } else {
        feedbackElement.textContent = `Incorrect, the correct answer is "${question.answers[question.correct]}".`;

        feedbackElement.className = "feedback-incorrect";
    }

    scoreDisplay.textContent = `Score: ${score}`;

    nextButton.disabled = false;

    if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "View Results";
    } else {
        nextButton.textContent = "Next Question";
    }
}

nextButton.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    loadQuestion();
});

function showResults() {
    quizElement.hidden = true;
    resultElement.hidden = false;

    finalScoreElement.textContent = score;

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
        resultMessageElement.textContent = "Perfect score! Excellent work!";
    }  else if (percentage >= 80) {
        resultMessageElement.textContent = "Great job! You have a strong understanding of Linux.";
    }  else if (percentage >= 50) {
        resultMessageElement.textContent = "Good effort! You have a basic understanding of Linux, but there's room for improvement.";
    } else {
        resultMessageElement.textContent = "Keep practicing! Review the material and try again to improve your understanding of Linux.";
    }
}

restartButton.addEventListener("click", () => {
    currentQuestion = 0;
    score = 0;
    quizElement.hidden = false;
    resultElement.hidden = true;
    loadQuestion();
});

loadQuestion();