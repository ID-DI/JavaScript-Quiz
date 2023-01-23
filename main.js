const startQuizPromise = new Promise(function(resolve, reject)
{
   setTimeout(function()
   {
    fetchQuestions()
    return resolve(1)
   },2222)
})

startQuizPromise
.then(function()
{
    displayNone_displayFlex("loadingScreen")
})
.then(function(){
    displayFlex_displayNone("loadingScreen")
    displayNone_displayFlex("welcomeScreen")
})
.catch(function(){
    document.getElementById('wentWrong').innerText = 'Something went wrong. Try again.'
})

var startBtn = document.getElementById('startBtn');
var startOverBtn = document.getElementById('startOverBtn');
var tryAgainBtn = document.getElementById('tryAgainBtn');
let correctCounter = 0;

window.addEventListener('load', () =>
{
    window.location.hash = '';
})
window.addEventListener('hashchange', addAndFillNewQuestion)
window.addEventListener('hashchange', counterSection)

//FUNCTIONS
/*1*/
function displayNone_displayFlex(elementId) 
{
    var element = document.getElementById(elementId); 
    if(element.classList.contains("d-none"))
    {
        element.classList.remove("d-none");
        element.classList.add("d-flex");
    }
}

/*2*/
function displayFlex_displayNone(elementId) 
{
    var element = document.getElementById(elementId); 
   if(element.classList.contains("d-flex"))
    {
        element.classList.remove("d-flex");
        element.classList.add("d-none");
    }
}

/*3*/
async function fetchQuestions() {
    const response = await fetch(`https://opentdb.com/api.php?amount=20`);
    const data = await response.json();
    // console.log('ima prasanja', data);
    return data;
}

/*4*/
function saveLocalStorage()
{
    fetchQuestions()
    .then(data => {
        data = JSON.stringify(data.results);
        window.localStorage.setItem('questions', data);
    });
}

/*5*/
function counterSection()
{
    let currentPage = parseInt(window.location.hash.split('-')[1]);
    let counter = currentPage - 1;
    console.log('brojac', counter)
    document.getElementById('counterSection').innerHTML =
    `
    <h5 class = 'text-center mb-0'>Completed: ${counter} / 20</h5>
    `
}

/*6*/
function addAndFillNewQuestion()
{
    let currentPage = parseInt(window.location.hash.split('-')[1])
    if(currentPage == 21)
    {
        endQuiz();
        return;
    }
    else
    {
        document.getElementById('answerPart').innerHTML = '';
            // let currentPage = parseInt(window.location.hash.split('-')[1])
            let questionNumber = currentPage - 1
            const question = getQuestion(questionNumber);
            
            const answers = 
            [
                {
                    text: question.correct_answer,
                    value: true,
                },
            ];
            question.incorrect_answers.forEach(function(answer,index)
            {
                let inncorectAnswerObj = 
                {
                    text: question.incorrect_answers[index],
                    value: false,
                };
                answers.push(inncorectAnswerObj); 
            });

        shuffleArray(answers)

        document.getElementById('questionPart').innerHTML = `
        <span>Question:</span>
        <h5 id="questionPart" class='bg-grey p-3 border mb-0'>${question.question}</h5>`;
        
        answers.forEach((value, index)=>
        {
        let button = document.createElement('button');
        button.innerHTML = answers[index].text
        button.classList.add('btn', 'btn-outline-success');
        button.setAttribute('id', 'submitedAnswer');
        button.setAttribute('value',  answers[index].value);
        document.getElementById('answerPart').appendChild(button)
        });
        document.getElementById('categoryPart').innerText = `${question.category}`;
        
        let btnAnswerHTMLCollection = document.getElementById('answerPart').children;
        // console.log(btnAnswerHTMLCollection, 'kolekcija')
        for(let i = 0; i < btnAnswerHTMLCollection.length; i++){
            btnAnswerHTMLCollection[i].addEventListener('click',function()
            { 
                if(btnAnswerHTMLCollection[i].value === 'true')
                {
                    correctCounter++;
                    window.localStorage.setItem('correct', correctCounter);
                    currentPage += 1; 
                    window.location.hash ='question-' + currentPage
                }
                else
                {
                    // console.log('ko ke ja natisnam greskana')
                    currentPage += 1; 
                    window.location.hash ='question-' + currentPage;
                } 
            });
        }
    }
}

/*7*/ 
function getQuestion(questionNumber) 
{
    let questions = window.localStorage.getItem('questions');
    questions = JSON.parse(questions);
    console.log(questions,'prasanje')
    return questions[questionNumber];
}

/*8*/
function endQuiz()
{
    displayFlex_displayNone('gameTxt');
    displayFlex_displayNone('questionSection');
    displayFlex_displayNone('counterSection');
    displayNone_displayFlex('resultSection');
    printResults();
}

/*9*/
function printResults()
{
    const resultFinal = localStorage.getItem('correct')
    // console.log('rezultati', result)
    document.getElementById('scorePart').innerHTML = 
    `
    <h3 class = 'text-center'>Total correct answers: ${resultFinal} / 20</h3>
    `
}

/*10*/
function handleStartBtn(e)
{
    e.preventDefault();
    window.location.hash = 'question-1';
    window.localStorage = '';
    window.localStorage.setItem('correct', 0)
    displayFlex_displayNone('startTxt');
    displayNone_displayFlex('gameTxt');
    displayNone_displayFlex('questionSection');
    displayNone_displayFlex('counterSection');
}

/*11*/
function handleStartOverBtn(e)
{
    e.preventDefault();
    // fetchQuestions();
    window.localStorage = '';
    window.location.hash = 'question-1';
    window.localStorage.setItem('correct', 0)
    correctCounter = 0;
}

/*12*/
function handleTryAgainBtn(e)
{
    // console.log('tuka stigame li ??')
    e.preventDefault();
    location.reload();
}

/*13*/
function shuffleArray(array) 
{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startBtn.addEventListener('click', handleStartBtn);
startOverBtn.addEventListener('click', handleStartOverBtn);
tryAgainBtn.addEventListener('click', handleTryAgainBtn);

saveLocalStorage();
getQuestion();