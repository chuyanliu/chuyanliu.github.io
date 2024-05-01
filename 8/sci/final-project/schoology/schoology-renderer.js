/*class Question {
  constructor(prompt, image, answers) {
    this.prompt = prompt;
    this.image = image;
    this.answers = answers;
  }

  generateHTML(index) {
    let html = '<div class="question-wrapper">';
    html += '<div class="question-question">';
    html += `<span class="question-number">Question ${index + 1}</span> <span class="question-points">(1 point)</span>`;
    html += '<div class="question-title">';
    html += this.generateTitleHTML();
    if (this.image) {
      html += `<img src="${this.image}" alt="${this.prompt}">`;
    }
    html += '</div>';
    html += '<div class="question-answers">';
    html += this.generateAnswerHTML();
    html += '</div></div></div>';
    return html;
  }

  generateTitleHTML() {
    return this.prompt.split('\n').map(line => `<p><span style="font-size:16px;">${line}</span></p>`).join('');
  }

  generateAnswerHTML() {
    throw new Error('generateAnswerHTML must be implemented by subclasses');
  }
}

class MultiChoice extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML() {
    return this.answers.map((answer, index) => `
      <label>
        <input type="radio" name="question-${index}" value="${answer.correct ? '1' : '0'}">
        ${answer.text}
      </label>
    `).join('<br>');
  }
}

class CheckBoxChoice extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML() {
    return this.answers.map((answer, index) => `
      <label>
        <input type="checkbox" name="question-${index}" value="${answer.correct ? '1' : '0'}">
        ${answer.text}
      </label>
    `).join('<br>');
  }
}

class FillInTheBlank extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML() {
    return this.answers.map((answer, index) => `
      Blank ${index + 1}: <input type="text" name="question-${index}" value="${answer.text}" ${answer.correct ? 'data-correct="true"' : ''}>
    `).join('<br>');
  }
}

class SchoologyTest {
  constructor(...questions) {
    this.questions = questions;
  }

  generateHTML() {
    let html = '<form role="form" action="#" accept-charset="UTF-8" method="post" id="s-assessment-question-fill-form">';
    html += '<div>';
    this.questions.forEach((question, index) => {
      html += question.generateHTML(index);
    });
    html += '<input type="submit" name="op" id="edit-submit" value="Review Answers" class="form-submit assessment-nav has-next">';
    html += '</div></form>';
    return html;
  }
}
*/

class Question {
  constructor(prompt, image, answers) {
    this.prompt = prompt;
    this.image = image;
    this.answers = answers;
  }

  generateHTML(index) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('question-wrapper');

    const question = document.createElement('div');
    question.classList.add('question-question');
    wrapper.appendChild(question);

    const questionNumber = document.createElement('span');
    questionNumber.classList.add('question-number');
    questionNumber.textContent = `Question ${index + 1}`;
    question.appendChild(questionNumber);

    const points = document.createElement('span');
    points.classList.add('question-points');
    points.textContent = '(1 point)';
    question.appendChild(points);

    const title = document.createElement('div');
    title.classList.add('question-title');
    title.innerHTML = this.generateTitleHTML();
    question.appendChild(title);

    if (this.image) {
      const img = document.createElement('img');
      img.src = this.image;
      img.alt = this.prompt;
      title.appendChild(img);
    }

    const answers = document.createElement('div');
    answers.classList.add('question-answers');
    answers.innerHTML = this.generateAnswerHTML(index);
    question.appendChild(answers);

    return wrapper;
  }

  generateTitleHTML() {
    return this.prompt.split('\n').map(line => `<p><span style="font-size:16px;">${line}</span></p>`).join('');
  }

  generateAnswerHTML() {
    throw new Error('generateAnswerHTML must be implemented by subclasses');
  }

  generateAlphaSuffix(label, index) {
    const span = document.createElement('span');
    span.classList.add('form-alpha-suffix');
    span.innerText = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'o', 'p'][index];
    label.appendChild(span);
  }
}

class MultiChoice extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML(questionIndex) {
    return this.answers.map((answer, index) => {
      const label = document.createElement('label');
      label.classList.add('c-question-label');
      const input = document.createElement('input');
      input.classList.add('c-question-input-clicker');
      input.type = 'radio';
      input.name = `sgy-question-${questionIndex}`;
      input.value = answer.correct ? '1' : '0';
      label.appendChild(input);
      this.generateAlphaSuffix(label, index);
      //<span class="form-radio-alpha-suffix">a</span>
      label.appendChild(document.createTextNode(answer.text));
      return label.outerHTML;
    }).join('');
  }
}

class CheckBoxChoice extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML(questionIndex) {
    return this.answers.map((answer, index) => {
      const label = document.createElement('label');
      label.classList.add('c-question-label');
      const input = document.createElement('input');
      input.classList.add('c-question-input-clicker');
      input.type = 'checkbox';
      input.name = `sgy-question-${questionIndex}`;
      input.value = answer.correct ? '1' : '0';
      label.appendChild(input);
      this.generateAlphaSuffix(label, index - 1);
      label.appendChild(document.createTextNode(answer.text));
      return label.outerHTML;
    }).join('');
  }
}

class FillInTheBlank extends Question {
  constructor(prompt, image, answers) {
    super(prompt, image, answers);
  }

  generateAnswerHTML(questionIndex) {
    return this.answers.map((answer, index) => {
      const input = document.createElement('input');
      input.classList.add('c-question-input');
      input.type = 'text';
      input.name = `sgy-question-${questionIndex}`;
      input.value = answer.text;
      if (answer.correct) {
        input.setAttribute('data-correct', 'true');
      }
      return `Blank ${index + 1}: ${input.outerHTML}`;
    }).join('');
  }
}

class SchoologyTest {
  constructor(...questions) {
    this.questions = questions;
    this.questionsCorrect = 0;
  }

  generateHTML() {
    const form = document.createElement('form');
    form.role = 'form';
    form.action = '#';
    form.acceptCharset = 'UTF-8';
    //form.method = 'post';
    form.id = 's-assessment-question-fill-form';

    const div = document.createElement('div');
    form.appendChild(div);

    this.questions.forEach((question, index) => {
      div.appendChild(question.generateHTML(index));
    });

    const submitBtnWrp = document.createElement('div');
    submitBtnWrp.classList.add('submit-span-wrapper');
    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.name = 'op';
    submitBtn.id = 'edit-submit';
    submitBtn.value = 'Submit';
    submitBtn.classList.add('form-submit', 'assessment-nav', 'has-next');
    submitBtnWrp.appendChild(submitBtn);
    const score = document.createElement('span');
    score.classList.add('score');
    div.appendChild(submitBtnWrp);
    div.appendChild(score);

    let testClass = this;
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      testClass.questions.forEach((q, i) => {
        let studentAnswer = [...document.getElementsByName('sgy-question-' + i)].filter(e => e.checked);
        let systemAnswer = [...document.getElementsByName('sgy-question-' + i)].filter(e => e.value === '1');
        if (studentAnswer.length > 0) {
          studentAnswer.forEach(a => {
            if (a.value === '1') {
              a.parentElement.classList.add('correct');
              testClass.questionsCorrect++;
            } else {
              a.parentElement.classList.add('incorrect');
              systemAnswer.forEach(e => {
                e.parentElement.classList.add('ghost-correct');
              });
            }
          });
        } else {
          systemAnswer.forEach(e => {
            e.parentElement.classList.add('ghost-correct');
          });
        }
      });

      for (let i of this) {
        i.disabled = 'true';
      }

      let totalQuestionsCorrect = 0;

      testClass.questions.forEach(q => {
        q.answers.forEach(a => {
          if (a.correct) {
            totalQuestionsCorrect++;
          }
        });
      });

      score.innerHTML = 'Your Score: ' + ((Math.floor((testClass.questionsCorrect / (totalQuestionsCorrect)) * 10000)) / 100) + '%' + '<p class="mt-3">Congrats! You have finished the game! Feel free to exit fullscreen and check over your answers to see what you missed.</p>';
      setTimeout(() => document.exitFullscreen(), 1000);
    });

    return form;
  }
}


