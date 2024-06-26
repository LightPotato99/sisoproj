async function generate_system_text(n,grammer_type){
    const quiz_inst = "You will be given a paragraph, and you should make" + String(n) + "english grammer quiz(es) in a type of multiple choice question.\n";
    const grammer_inst = "The quizzes will be about the usage of be-verbs."; //TODO: add grammer_type variable
    const format_inst = "Give the response as the format given below:\n";
    const format_text = "Question:\"Insert a question here\"\n\
                        1)\"Insert an option here\"\n\
                        2)\"Insert an option here\"\n\
                        3)\"Insert an option here\"\n\
                        4)\"Insert an option here\"\n\
                        Answer:\"Insert a single digit here (1~4)\"";
    const spec_output = "Return the output as JSON - {question:, options:[1), 2), 3), 4)], answer:}"

    return new Promise((resolve) => {
        setTimeout(() => {
            const result = quiz_inst + grammer_inst + format_inst + format_text + spec_output;
            resolve(result);
        }, 1000);
    });
}

async function generate_response(sys, user) {
    const response = await fetch('http://localhost:3000/generate-response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sys, user })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data.choices[0].message.content);
        }, 1000);
    });
}

async function generate_ui(data){
    console.log(typeof data);
    console.log(Object.keys(data));
    console.log(JSON.stringify(data));
    console.log(data.question);
    console.log(data.options);
    console.log(data.answer);
    const container = document.getElementById('quiz-container');

    // Create question element
    const questionElement = document.createElement('p');
    questionElement.textContent = data.question;
    container.appendChild(questionElement);

    // Create choices
    data.options.forEach((choice, index) => {
        const choiceContainer = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'choice';
        radio.value = index;
        const label = document.createElement('label');
        label.textContent = choice;
        
        choiceContainer.appendChild(radio);
        choiceContainer.appendChild(label);
        container.appendChild(choiceContainer);
    });

    // Create answer element
    const answerElement = document.createElement('p');
    answerElement.textContent = `Answer: ${parseInt(data.answer)}`;
    container.appendChild(answerElement);

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = () => checkAnswer(data);
    container.appendChild(submitButton);

    // Create result element
    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    container.appendChild(resultElement);
}

const TEXT_MIN_LIMIT = 200;
const TEXT_MAX_LIMIT = 2000;

async function main(){
    var user_text = document.getElementById('context').value;
    if (user_text.length < TEXT_MIN_LIMIT){
        alert("The text should have at least " + String(TEXT_MIN_LIMIT) + " characters.");
        return;
    }
    if (user_text.length >= TEXT_MAX_LIMIT){
        alert("The text should have less than " + String(TEXT_MAX_LIMIT) + " characters.")
        return;
    }
    var system_text = await generate_system_text(4,'a');
    var quiz_obj = await generate_response(system_text,user_text);
    //var quiz_obj = await parse(response_text);
    await generate_ui(JSON.parse(quiz_obj));
}

function checkAnswer(data){
    const selectedOption = document.querySelector('input[name="choice"]:checked');
    const resultElement = document.getElementById('result');

    if (!selectedOption) {
        resultElement.textContent = 'Please select an answer.';
        resultElement.style.color = 'red';
        return;
    }

    const userAnswer = parseInt(selectedOption.value)+1;
    const correctAnswer = parseInt(data.answer);
    let result = "";

    if (userAnswer === correctAnswer) {
        result = "O";
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
    } else {
        result = "X";
        resultElement.textContent = 'Incorrect. Please try again.';
        resultElement.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const button = document.getElementById('test_button');
    button.addEventListener('click', () => {
      main();
    });
  });

document.getElementById('insertButton').addEventListener('click', () => {
    const quiz_data = {
        date: '2024-05-25',
        result: 'Passed'
    };

    fetch('/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz_data)
    })
    .then(response => response.text())
    .catch(error => {
        console.error('Error:', error);
        alert('Error inserting data');
    });
});