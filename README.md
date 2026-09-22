```
 ░▒▓███████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░ ░▒▓██████▓▒░ ░▒▓███████▓▒░░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░        
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
 ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
       ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓████████▓▒░
```                                                                                                                                    
                                                                                                                                    

# SudoSchool

SudoSchool is an interactive, browser-based website for learning the Linux command line.

## Features

- **Interactive lessons** six lessons covering the Linux filesystem, working in the terminal, file and directory permissions, networking and processes.
- **Live in-browser terminal** type real Linux commands and learn by doing, with no virtual machines, downloads or setup.
- **Challenges & quizzes** multiple-choice questions with instant feedback, a progress bar and a final score.
- **Glassmorphism theme** a custom glass-effect interface with a fixed background image, light rays and floating bubbles.

## Site map

| Path | Description |
| --- | --- |
| `index.html` | Site shell (navigation + content card) |
| `pages/Homepage.html` | Landing page with the Tux mascot |
| `pages/LessonLanding.html` | Lesson index |
| `pages/Lessons/Lesson1.html` – `Lesson6.html` | The six lessons |
| `pages/Challenges.html` | Quiz challenges |
| `pages/About.html` | About the project, source and validation |
| `css/style.css` | All styling |
| `js/lesson.js`, `js/quiz.js`, `js/terminal.js` | Lesson, quiz and terminal logic |
| `images/` | Background image, cursors and the Tux mascot |

## Getting started

**Demo Available at:** ```https://maxye4655.github.io/LinuxLearnSite/pages/Homepage.html```

1. Clone the repository:

   ```bash
   git clone https://github.com/Maxye4655/LinuxLearnSite.git
   ```

2. Open `index.html` in a browser, or serve the folder locally — for example with VS Code Live Server or:

   ```bash
   python3 -m http.server
   ```

## Technologies

- **HTML5** — semantic, accessible markup
- **CSS3** — custom glassmorphism theme, responsive layout, custom fonts and cursors
- **JavaScript** — lesson navigation, quiz logic and an in-browser terminal emulator

## Validation

[![Valid HTML5](https://www.w3.org/html/logo/badge/html5-badge-h-css3-semantics.png)](https://validator.w3.org/nu/?doc=https%3A%2F%2Fmaxye4655.github.io%2FLinuxLearnSite%2Findex.html)
[![Valid CSS!](https://jigsaw.w3.org/css-validator/images/vcss)](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fmaxye4655.github.io%2FLinuxLearnSite%2Fcss%2Fstyle.css)
[![Valid JavaScript](https://img.shields.io/badge/JavaScript-JSHint_validated-brightgreen.svg)](https://jshint.com/)

## Source

The source code is available on GitHub: <https://github.com/Maxye4655/LinuxLearnSite>