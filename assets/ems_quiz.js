// ToDo
// Implement timer
// Implement random (user input) number of questions
// Randomize answers on questions
// Add reset to score page


// Some variables
var quizQuestionAmount = 10;
var quizSeconds = 5;
// Array for all questions
var allQuestions = new Array();
// Array for quiz score

function main(){

    // Load JSON
    $.getJSON("assets/question.json", function(data){
        allQuestions = data.questions;
    })
    .done(function(){
        console.log("JSON loaded");

        // Make sure number of questions in quiz don't exceed total number of available questions
        if(quizQuestionAmount > allQuestions.length){
            quizQuestionAmount = allQuestions.length
        };

        // Call start screen
        startScreen();
    })

};



// Load initial page
function startScreen(){

    // Replace warning with general info and start button
    let mainTable = "";

    mainTable += "<table class='start_screen'>";
    mainTable += "<thead><tr>";
    mainTable += "<th>Welcome to the SOP Test Quiz</th>";
    mainTable += "</tr></thead>";
    mainTable += "<tbody><tr><td>";
    mainTable += "<div class='start_screen_text'>This test is meant to be used for GTA-RP</div>";
    mainTable += "<div class='start_screen_text'>Use this test quiz to practice as much as you want.<br/> The test consists of " + quizQuestionAmount + " random questions</div>";
    mainTable += "<div class='start_screen_text'>After finishing the quiz your score will be presented on screen, and you will have the chance to review your answers. If there are any technical issues please contact me.</div>";
    // mainTable += "<div class='start_screen_text'>Enabling the timer will put a " + quizSeconds + " second time limit on each question. <br/>Click 'Start' to start the quiz.</div>";
    mainTable += "<div class='start_screen_text'>Click 'Start' to start the quiz.</div>";
    mainTable += "<div class='start_screen_text'><!--input type='checkbox' class='largercheckbox' id='timed' name='timed' checked/> Timed |--> <button class='startbutton' onclick='createQuiz()'>Start</button></div>";
    mainTable += "</td></tr></tbody>";
    mainTable += "</table>";

    // Replace element
    document.getElementById("main").innerHTML = mainTable;

};

// Create quiz qith set number of questions
function createQuiz(){
    // Create random array of numbers with allQuestions.length
    var randomArray = [];
    // Fill array
    let i = 0;
    while ( i < allQuestions.length){
        randomArray.push(i);
        i++;
    };
    // Randomize array
    // Get array length
    let currentIndex = randomArray.length,  randomIndex;
    // While there are items left to shuffle
    while (currentIndex > 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [randomArray[currentIndex], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[currentIndex]];
    };
    // console.log("Randomized array:");
    // console.log(randomArray);

    // Array for quiz questions
    var quizQuestions = new Array();
    // Add random questions to quizQuestions
    i = 0;
    while( i < quizQuestionAmount ){
        // console.log(randomArray[i]);
        // Add to array
        quizQuestions.push(allQuestions[randomArray[i]]);

        i++;
    }
    // console.log("Quiz questions");
    // console.log(quizQuestions);

    // Start quiz
    runQuiz(quizQuestions);
};

// Run quiz
function runQuiz(questions){
    
    console.log("Run quiz questions");
    console.log(questions);

    // Array to store answers
    answers = new Array();

    // Get first question
    var questionIndex = 0;
    getQuestion(questionIndex);

    // Select question
    function getQuestion(i){
        if(i < questions.length){
            displayCard(questions[i]);
        }
        else{
            // Display score screen
            displayScore(questions, answers);
        }
    };
    
    function displayCard(question){
        // Update question number
        questionIndex++;

        // Display current question
        let mainTable = "";
        mainTable += "<table class='question_card'>";
        mainTable += "<thead><tr><th>";
        mainTable += "<div id='question_counter'>Question " + questionIndex + "/" + quizQuestionAmount + "</div> ";
        mainTable += "<div>" + question.question + "</div>";
        mainTable += "</th></tr>";
        // mainTable += "<tr><td>";
        // mainTable += "<div id='progress_bar'>&nbsp;</div>";
        // mainTable += "</td></tr>";
        mainTable += "</thead>";
        mainTable += "<tbody><tr><td>";
        // Populate answers
        for(answer in question.options){
            id = parseInt(answer) + 1;
            mainTable += "<div class='answer' value='testanswer'>" + question.options[answer] + "</div>";
        }
        mainTable += "</td></tr></tbody>";
        mainTable += "</table>";

        // Replace element
        document.getElementById("main").innerHTML = mainTable;

        $(".answer").click(function(event) {
            // Register questions and answer
            answers.push($(event.target).text());

            // Get next question / score
            getQuestion(questionIndex);
        });

        // Record answer (onclick) and get next question

        // Get next question
        // getQuestion(questionIndex);
        // setTimeout(getQuestion(questionIndex),1000);
    };
};

function displayScore(questions, answers){

    // Correct answer and answer provided.
    // We have to do the score fist because the HTML is generated sequentially.
    score = 0;
    i = 0;
    while(i < questions.length){
        question = questions[i];

        // If provided answer (index+1) == question answer, up the score
        if(question['options'].indexOf(answers[i]) + 1 == question['answer']){
            console.log("Correct answer");
            score++;
        }
        else{
            console.log("Wrong answer");
        };
        
        i++;
    };




    let mainTable = "";
    mainTable += "<table class='summary'>";
    mainTable += "<thead><tr>";
    mainTable += "<th>Score " + score + "/" + quizQuestionAmount + "</th>";
    mainTable += "</tr></thead>";
    mainTable += "<tbody>";

    
    // START WHILE LOOP
    i = 0;
    while(i < questions.length){

        question = questions[i];

        mainTable += "<tr><td>";
        // Display question
        mainTable += "<div class='summary_question'>" + question['question'] + "</div>";
        // Display answers
        for(answer in question['options']){

            // Assign proper CSS classes
            mainTable += "<div class='summary_answer";

            // Check if correct answer
            if(parseInt(answer) + 1 == question['answer']){
                mainTable += " summary_correct";
            }
            
            // Check if provided answer
            // Get index of provided answer
            provided_answer = question['options'].indexOf(answers[i]);
            // console.log(provided_answer);
            if(parseInt(answer) ==  provided_answer){
                mainTable += " summary_provided";
            }
            
            // Close DIV
            mainTable += "'>";
            // Display answer
            mainTable += question['options'][answer];
            mainTable += "</div>";

        };

        mainTable += "</td></tr>";

        i++;
    
    }
    // END WHILE LOOP

    mainTable += "</tbody>";
    mainTable += "</table>";

    // Replace element
    document.getElementById("main").innerHTML = mainTable;

};