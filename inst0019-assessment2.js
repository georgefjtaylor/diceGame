//intialise misc global arrays and variables.
var total_arr = [],
    global_num_of_rolls = 0,
    global_matching = 0,
    global_total_score = 0,
    populate_bool = false;
//initialise constants; these are not a limitation of the code and can be however large you want.
//allows for input validation to show regex skills and can save processing power if files are hosted rather than ran locally.
const too_low = 0,
    too_high = 20,
    max_score = 400,
    MIN = 1,
    MAX = 20;

function roll_dice() {
    //declare html input.
    yesNoMenu = document.getElementById('yesOrNo'), userSelection = yesNoMenu.options[yesNoMenu.selectedIndex].value;
    win = document.getElementById('win'), win_method = win.options[win.selectedIndex].value;
    //ensure valid input.
    if (userSelection == 'no') {
        var num_dice = document.getElementById("number_dice").value,
            num_sides = document.getElementById("number_sides").value
        if (/^[1-9][0-9]?$|^100/.test(num_sides) == false || /^[1-9][0-9]?$|^100/.test(num_dice) == false) {
            alert('Please enter valid numbers for both number of sides and number of dice [0-20]')
            return
        }
    } else if (userSelection == 'yes') {
        var num_dice = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
        var num_sides = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    }
    //Now dice is rolled, add titles to the right-hand nav bar.
    document.getElementById('this_roll_id').innerHTML = 'THIS ROLL:'
    document.getElementById('all_rolls').innerHTML = 'ALL <br> ROLLS:'
    //intialise local misc variables and arrays to store rolled dice values / a tally of matches.
    var total = 0,
        matching_die = 0,
        rolls_arr = new Array(num_dice),
        tally_arr = new Array(num_sides);
    //fill tally array with 0s.
    for (var i = 0; i < num_sides; i++) tally_arr[i] = 0;
    //fill global total array with 0s, only if it hasnt been done already.
    if (populate_bool == false) {
        for (var i = 0; i < (max_score); i++) total_arr[i] = 0;
        populate_bool = true
    }
    //this is the core loop; generates dice, updates total, updates tally array with matches.
    for (i = 0; i < num_dice; i++) {
        rolls_arr[i] = Math.floor(Math.random() * num_sides) + 1
        total += rolls_arr[i]
        tally_arr[rolls_arr[i] - 1] += 1
    }
    //update tally array
    for (i = 0; i < num_sides; i++) {
        if (tally_arr[i] > 1) matching_die += tally_arr[i];
    }
    //intialise variable for HTML output
    //if win method = selected value run that
    //nested if for conditions to win; all even, half matching
    //play audio and output a gif dependent on nested conditions
    //gifs and audio files are hosted on websites (giphy and soundfxcenter.com); they all work at the time of writing.
    //playing of audio may be delayed depending on demand to external servers.
    //audio may not play due to auto-play restrictions. tested working on chrome and firefox.
    var output = document.getElementById('win_output');
    if (win_method == 'all dice even') {
        let is_even = rolls_arr.every(function (e) {
            return e % 2 == 0;
        });
        if (is_even == true) {
            var gif_win = '<IMG SRC="https://media.giphy.com/media/Id1Ay5MD5IsF6Or51v/giphy.gif">';
            output.innerHTML = gif_win;
            let src = 'http://soundfxcenter.com/video-games/mario-bros/8d82b5_Mario_Bros_Coin_Sound_Effect.mp3';
            let audio = new Audio(src);
            audio.play();
        }
        if (is_even == false) {
            var gif_loss = '<IMG SRC="https://media.giphy.com/media/1jARfPtdz7eE0/giphy.gif">';
            output.innerHTML = gif_loss;
            let src = 'http://soundfxcenter.com/video-games/street-fighter/8d82b5_Street_Fighter_Lose_Sound_Effect.mp3';
            let audio = new Audio(src);
            audio.play();
        }
    } else if (win_method == 'half or more dice matching') {
        if (matching_die >= Number(num_dice / 2)) {
            var gif_win = '<IMG SRC="https://media.giphy.com/media/ToMjGpyO2OVfPLpoxu8/giphy.gif">';
            output.innerHTML = gif_win;
            let src = 'http://soundfxcenter.com/video-games/mario-bros/8d82b5_Mario_Bros_Coin_Sound_Effect.mp3';
            let audio = new Audio(src);
            audio.play();
        }
        if (matching_die < Number(num_dice / 2)) {
            var gif_lose = '<IMG SRC="https://media.giphy.com/media/l3q2J7KgtglQ5GQH6/giphy.gif">';
            output.innerHTML = gif_lose;
            let src = 'http://soundfxcenter.com/video-games/street-fighter/8d82b5_Street_Fighter_Lose_Sound_Effect.mp3';
            let audio = new Audio(src);
            audio.play();
        }
    } else if (win_method == 'no win method (default)') {
        output.innerHTML = '';
    }
    //update global variables.
    total_arr[total] += 1;
    global_total_score = global_total_score + total;
    global_num_of_rolls += 1
    global_matching = global_matching + matching_die;
    //call print functions.
    print_this_roll(rolls_arr, tally_arr, matching_die, total, num_sides);
    print_all_rolls();
    print_graph();
    print_tally();
}

//create function for local rolls.
function print_this_roll(rolls_arr, tally_arr, matching_die, total, num_sides) {
    //Grab variable for number of sides for loop later, create output html.
    //var num_sides = document.getElementById("number_sides").value;
    var output = document.getElementById('matches');
    //print variables to HTML.
    var dice = document.getElementById('showResults');
    dice.innerHTML = 'Die Rolled: ' + '<br>' + rolls_arr;
    var sum = document.getElementById('total');
    sum.innerHTML = 'Total Score: ' + total;
    var string_builder = "Number of matching die: " + matching_die + '<br>' + 'List of Matches:';
    //concatonate string with matches in the tally array if there are any.
    if (matching_die > 0) {
        for (i = 0; i < num_sides; i++) {
            if (tally_arr[i] > 1) {
                string_builder += '<br>' + tally_arr[i] + ' rolls of: ' + (i + 1);
            };
        };
    }
    output.innerHTML = string_builder;
}

//create function for all rolls.
function print_all_rolls() {
    //print variables to html
    var num_rolls = document.getElementById('number_of_rolls')
    num_rolls.innerHTML = 'Total Number of Rolls: ' + global_num_of_rolls;

    var total_across_rolls = document.getElementById('total_across_rolls')
    total_across_rolls.innerHTML = 'Total Accross Rolls: ' + global_total_score;

    var total_matches = document.getElementById('total_matching')
    total_matches.innerHTML = 'Total Matching Dice: ' + global_matching;
}

//create function for matches of global totals.
function print_graph() {
    //Variables to print HTML and dispaly matches in a string.
    var output = document.getElementById('totals_graph');
    var string_builder = "Totals: ";
    //concatonate string with matches in the totals array if there are any.
    for (i = 0; i < max_score; i++) {
        if (total_arr[i] > 0) {
            string_builder += '<br>' + total_arr[i] + ' rolls of: ' + (i);
        };
    };
    output.innerHTML = string_builder;
}
//create function for creating a tally for totals.
function print_tally() {
    //Variables to print a HTML table.
    var output = document.getElementById('tally');
    var string_builder = "<table class='center'>";
    string_builder += "<tr><th>Letter</th><th>Total</th><th></th></tr>";
    // add a table row for the total score.
    for (var i = 0; i < max_score; i++) {
        if (total_arr[i] > 0) {
            string_builder += "<tr>";
            string_builder += "<td>" + (i) + "</td>";
            //add column for #s; repeat for x number of keys.
            string_builder += "<td>" + "#".repeat(total_arr[i]) + "</td>";
            string_builder += "</td>";
            string_builder += "</tr>";
        }
    }
    string_builder += "</table>";
    output.innerHTML = string_builder;
}

//create function to reset all variables in the programme.
function reset_variables() {
    //gloal reset.
    global_num_of_rolls = 0, global_matching = 0, global_total_score = 0, populate_bool = false;
    for (var i = 0; i < (max_score); i++) total_arr[i] = 0;
    //local reset.
    total = 0, matching_die = 0, num_sides = 0, output = 0, dice = 0, sum = 0;
    //graph reset.
    //var output = document.getElementById('totals_graph');
    var string_builder = "Totals: " + '<br>';
    //call the functions now with reset variables.
    print_this_roll();
    print_all_rolls();
    print_graph();
    print_tally();
    //reset HTML; otherwise display will be x: undefined.
    document.getElementById('number_of_rolls').innerHTML = ''
    document.getElementById('total_across_rolls').innerHTML = ''
    document.getElementById('total_matching').innerHTML = ''
    document.getElementById('totals_graph').innerHTML = ''
    document.getElementById('matches').innerHTML = ''
    document.getElementById('showResults').innerHTML = ''
    document.getElementById('total').innerHTML = ''
    document.getElementById('win_output').innerHTML = ''
    document.getElementById('this_roll_id').innerHTML = ''
    document.getElementById('all_rolls').innerHTML = ''
    document.getElementById('tally').innerHTML = ''
}

