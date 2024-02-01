// Tim Bluthardt IG2

let teamsArray = [4, 117, 131, 3, 9, 15, 6, 210, 10, 1, 5];
let cumulatedData;
let groupedTeams;
let averagePitArray;
let fastestPitArray;
let renderer;
var drawMap = true;


let xPositions = [];


$(function () {

    renderer = $('#renderer');
    stageHeight = renderer.height();
    stageWidth = renderer.width();

    prepareData();


    $('#fastest').addClass('menueActive');

    // Klick-Event Menue Items
    $('#average, #fastest, #lap').click(function () {
        id = $(this).attr('id');
        handleMenuClick(id);
    });


    // Beginn Draw 
    $('#startButton').click(function () {
        $('#startScreen').css({
            'display': 'none',
        })
        // $('#renderer').css({
        //     'height': '90vh',
        // })
        $('#heading').css({
            'margin-left': 50,
            'margin-top': 50,
        });
        $('#renderer').css({
            'cursor': 'none',
        });
        $('#follower').css({
            'display': 'block',
        });
        // drawPitRoundMap();
        createElements();
        setTimeout(function () {
            $('#fastestText').css({
                'display': 'block',
            })
            $('#menueBox').css({
                'display': 'flex',
            })
            $('#menueBox2').css({
                'display': 'flex',
            })
        }, 600);
    });
});

function prepareData() {

    // Duration Runden um Raster zu erzeugen
    dataArray = dataArray2.map(item => ({
        ...item,
        duration: (Math.round(parseFloat(item.duration) * 2) / 2).toFixed(1)
    }));

    groupedTeams = gmynd.groupData(dataArray, 'constructorId');

    // Den Durchschnitt eines Constructors berechnen
    function caluclateAverage(constructorId) {
        let gesamtsummeDurations = 0;
        let countDuration = 0;

        if (groupedTeams.hasOwnProperty(constructorId)) {
            for (let i = 0; i < groupedTeams[constructorId].length; i++) {
                if (groupedTeams[constructorId][i].duration && !isNaN(parseFloat(groupedTeams[constructorId][i].duration))) {
                    gesamtsummeDurations += parseFloat(groupedTeams[constructorId][i].duration);
                    countDuration++;
                }
            }
            if (countDuration > 0) {
                const averageDuration = gesamtsummeDurations / countDuration;
                groupedTeams[constructorId].averageDuration = averageDuration;  // averageDuration in Array speichern
            }
        }

        // Die Schnellste PiStop Zeit herausfinden und in array speichern:
        const fastestPitTime = gmynd.dataMin(groupedTeams[constructorId], "milliseconds");
        groupedTeams[constructorId].fastestPitTime = fastestPitTime;
    }

    // Berechne den Durchschnitt
    for (let constructorId in groupedTeams) {
        if (groupedTeams.hasOwnProperty(constructorId)) {
            caluclateAverage(constructorId);
        }
    }

    // Sortiere nach durchschnittlicher Dauer
    const sortedGroupedTeams = Object.values(groupedTeams).sort((a, b) => a.averageDuration - b.averageDuration);
    averagePitArray = sortedGroupedTeams
        .filter(team => teamsArray.includes(parseInt(team[0].constructorId)))
        .map(team => parseInt(team[0].constructorId));
    console.log(averagePitArray);


    // Sortiere nach schnellstem PitStop
    const sortedGroupedTeams2 = Object.values(groupedTeams).sort((a, b) => a.fastestPitTime - b.fastestPitTime);
    fastestPitArray = sortedGroupedTeams2
        .filter(team => teamsArray.includes(parseInt(team[0].constructorId)))
        .map(team => parseInt(team[0].constructorId));
    console.log(fastestPitArray);



    console.log(groupedTeams);
    console.log(dataArray);
}




function drawFastestMap() {
    $('.dot').each(function (index) {
        let dot = $(this);
        let dotData = $(this).data();

        setTimeout(function () {
            dot.animate({
                'left': dotData.xfastest - 6 / 2,
                'top': dotData.yNormal - 6 / 2,
            }, 600);
        }, 1);
    });
}

function drawAverageMap() {
    $('.dot').each(function (index) {
        let dot = $(this);
        let dotData = dot.data();

        setTimeout(function () {
            dot.animate({
                'left': dotData.xAverage - 6 / 2,
                'top': dotData.yNormal - 6 / 2,
            }, 600);
        }, 1);
    });
}





function handleMenuClick(id) {
    console.log(id + ' clicked');
    $('#average, #fastest, #lap').removeClass('menueActive');
    $('#' + id).addClass('menueActive');


    if (id === 'fastest') {
        if ($('.dot:not(.persist)').length > 0) {
            $('.dot').remove();
            createElements();
        }
        $('.dot').addClass('persist');
        drawFastestMap();
        $('#lapText, #averageText').css('display', 'none');
        $('#fastestText').css('display', 'block');

    } else if (id === 'average') {
        if ($('.dot:not(.persist)').length > 0) {
            $('.dot').remove();
            createElements();
        }
        $('.dot').addClass('persist');
        drawAverageMap();
        $('#lapText, #fastestText').css('display', 'none');
        $('#averageText').css('display', 'block');

    } else if (id === 'lap') {
        $('.dot').remove();
        $('.dot').removeClass('persist');
        drawPitRoundMap();
        $('#lapText').css('display', 'block');
        $('#averageText, #fastestText').css('display', 'none');
    }



}








$(document).ready(function () {
    var follower = $("#follower");

    $(document).mousemove(function (e) {
        var xPos = e.pageX - (follower.width() / 2);
        var yPos = e.pageY - (follower.height() / 2);


        follower.css({
            left: xPos,
            top: yPos
        });
    });
    // follower.setStick($(dot));
});