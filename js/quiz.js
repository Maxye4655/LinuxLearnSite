const questionSets = {
    basics: [
        {
            question: "Which command displays files and directories in the current directory?",
            answers: ["cat", "ls", "echo", "pwd"],
            correct: 1
        },
        {
            question: "What is the command-line interpreter in Linux called?",
            answers: ["Shell", "Kernel", "Compiler", "Daemon"],
            correct: 0
        },
        {
            question: "Which command do you use to get help about a command?",
            answers: ["help", "info", "man", "docs"],
            correct: 2
        },
        {
            question: "Which of these is a valid Linux command to clear the terminal?",
            answers: ["cls", "clean", "clear", "wipe"],
            correct: 2
        },
        {
            question: "Which command prints text to the terminal?",
            answers: ["print", "echo", "write", "say"],
            correct: 1
        }
    ],

    terminal: [
        {
            question: "Which shortcut cancels the current command in the terminal?",
            answers: ["Ctrl+C", "Ctrl+Z", "Ctrl+D", "Ctrl+X"],
            correct: 0
        },
        {
            question: "What does the `history` command do?",
            answers: [
                "Shows previously executed commands",
                "Deletes old files",
                "Edits command files",
                "Shows system uptime"
            ],
            correct: 0
        },
        {
            question: "Which command shows the manual page for a command?",
            answers: ["doc", "help", "man", "read"],
            correct: 2
        },
        {
            question: "Which command searches a file for a matching pattern?",
            answers: ["find", "grep", "locate", "search"],
            correct: 1
        },
        {
            question: "What does the `&&` operator do between two commands?",
            answers: [
                "Runs the second command only if the first succeeds",
                "Runs both commands at the same time",
                "Runs the first command twice",
                "Runs either command"
            ],
            correct: 0
        }
    ],

    filesystem: [
        {
            question: "What symbol represents the root directory in Linux?",
            answers: ["/", "~", ".", ".."],
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
            answers: ["pwd", "ls", "cd", "cat"],
            correct: 1
        },
        {
            question: "Which of these commands would enter the Documents directory?",
            answers: ["pwd Documents", "ls Documents", "cd /Documents", "cd Documents"],
            correct: 3
        },
        {
            question: "What does the `~` symbol represent?",
            answers: [
                "The root directory",
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
                "/"
            ],
            correct: 1
        },
        {
            question: "What does a single dot (.) represent in a file path?",
            answers: [
                "The root directory",
                "The parent directory",
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
                "cd /",
                "cd ../.."
            ],
            correct: 0
        }
    ],

    permissions: [
        {
            question: "Which command changes file permissions?",
            answers: ["chown", "chmod", "umask", "passwd"],
            correct: 1
        },
        {
            question: "What do the three permission groups apply to?",
            answers: [
                "Owner, group, and others",
                "Read, write, and execute",
                "Files, directories, and links",
                "Users, admins, and root"
            ],
            correct: 0
        },
        {
            question: "What permission does the number 7 represent?",
            answers: ["Read only", "Write only", "Read and write", "Read, write, and execute"],
            correct: 3
        },
        {
            question: "Which command changes the owner of a file?",
            answers: ["chmod", "chown", "chgrp", "chattr"],
            correct: 1
        },
        {
            question: "What does the letter `x` mean in a permission listing?",
            answers: ["Copy", "Execute", "Expand", "Export"],
            correct: 1
        }
    ],

    networking: [
        {
            question: "Which command tests connectivity to another host?",
            answers: ["netstat", "ping", "traceroute", "ifconfig"],
            correct: 1
        },
        {
            question: "Which command shows the IP address of your interfaces?",
            answers: ["ip addr", "route", "ping", "netstat"],
            correct: 0
        },
        {
            question: "Which tool downloads files over HTTP?",
            answers: ["curl", "ls", "grep", "chmod"],
            correct: 0
        },
        {
            question: "Which command shows the route packets take to a destination?",
            answers: ["ping", "traceroute", "dig", "ssh"],
            correct: 1
        },
        {
            question: "Which command copies files securely over SSH?",
            answers: ["cp", "ftp", "scp", "wget"],
            correct: 2
        }
    ],

    processes: [
        {
            question: "Which command shows a list of running processes?",
            answers: ["ls", "ps", "dir", "cat"],
            correct: 1
        },
        {
            question: "Which command sends a signal to a process?",
            answers: ["kill", "stop", "end", "halt"],
            correct: 0
        },
        {
            question: "Which key pauses a foreground process?",
            answers: ["Ctrl+C", "Ctrl+Z", "Ctrl+D", "Ctrl+V"],
            correct: 1
        },
        {
            question: "Which command shows real-time system processes?",
            answers: ["top", "ls", "cat", "find"],
            correct: 0
        },
        {
            question: "Which option of `ps` shows all processes on the system?",
            answers: ["-e", "-l", "-t", "-h"],
            correct: 0
        }
    ]
};

let questions = [];
let currentCategory = "";
let currentQuestion = 0;
let score = 0;
let answered = false;

const categoriesSection = document.getElementById("categories");
const quizSection = document.getElementById("quiz");
const resultsSection = document.getElementById("results");
const categoryTitleEl = document.getElementById("categoryTitle");

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("feedback");

const questionNumberElement = document.getElementById("questionNumber");
const quizTotalElement = document.getElementById("quizTotal");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressFill = document.getElementById("quizProgressFill");
const nextButton = document.getElementById("nextQuestionBtn");

const finalScoreElement = document.getElementById("finalScore");
const finalTotalElement = document.getElementById("finalTotal");
const resultMessageElement = document.getElementById("resultMessage");

function showCategories() {
    quizSection.hidden = true;
    resultsSection.hidden = true;
    categoriesSection.hidden = false;
}

function startQuiz(category) {
    currentCategory = category;
    currentQuestion = 0;
    score = 0;
    questions = questionSets[category];

    categoriesSection.hidden = true;
    resultsSection.hidden = true;
    quizSection.hidden = false;

    categoryTitleEl.textContent = formatCategory(category);
    quizTotalElement.textContent = questions.length;

    loadQuestion();
}

function formatCategory(category) {
    const names = {
        basics: "Basics",
        terminal: "Terminal",
        filesystem: "Filesystem",
        permissions: "Permissions",
        networking: "Networking",
        processes: "Processes"
    };
    return names[category] || category;
}

function loadQuestion() {
    answered = false;

    const question = questions[currentQuestion];

    questionElement.textContent = question.question;
    questionNumberElement.textContent = currentQuestion + 1;
    scoreDisplay.textContent = `Score: ${score}`;

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;

    feedbackElement.textContent = "";
    feedbackElement.className = "";

    nextButton.textContent = "Next Question";
    nextButton.disabled = true;

    answersElement.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-answer";
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.addEventListener("click", () => selectAnswer(index));
        answersElement.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = questions[currentQuestion];
    const buttons = answersElement.querySelectorAll(".quiz-answer");

    buttons.forEach((button, index) => {
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
    quizSection.hidden = true;
    resultsSection.hidden = false;

    finalScoreElement.textContent = score;
    finalTotalElement.textContent = questions.length;

    const percentage = (score / questions.length) * 100;

    if (percentage === 100) {
        resultMessageElement.textContent = "Perfect score! Excellent work!";
    } else if (percentage >= 80) {
        resultMessageElement.textContent = "Great job! You have a strong understanding of this topic.";
    } else if (percentage >= 50) {
        resultMessageElement.textContent = "Good effort! You have a basic understanding, but there's room for improvement.";
    } else {
        resultMessageElement.textContent = "Keep practicing! Review the material and try again to improve.";
    }
}

document.getElementById("restartQuizBtn").addEventListener("click", () => {
    startQuiz(currentCategory);
});

document.getElementById("chooseCategoryBtn").addEventListener("click", () => {
    showCategories();
});

document.getElementById("backToCategories").addEventListener("click", () => {
    showCategories();
});

document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
        startQuiz(card.dataset.category);
    });
});

showCategories();