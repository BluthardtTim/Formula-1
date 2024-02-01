function drawSecondMap() {

    let pointCounter = {};
    let dotSize = 6;

    uniqueConstructorIds = teamsArray;
    totalUniqueValues = teamsArray.length;
    widthPerValue = stageWidth / totalUniqueValues;

    for (var i = 0; i < dataArray.length - 1; i++) {
        var currentPitDuration = dataArray[i].duration;
        var currentConstructorId = dataArray[i].constructorId;

        console.log(dataArray[i].year)

        if (currentPitDuration < 62.5 && currentPitDuration > 12.5) {
    
            var x = gmynd.map(dataArray[i].year, 2011, 2023, 150, stageWidth - 150);
            var y = gmynd.map(currentPitDuration, 12.0, 59.0, stageHeight - 120, 120);

            // Erhöhe den Zähler für die aktuellen Koordinaten
            const coordinateKey = `${x}_${y}`;
            if (!pointCounter[coordinateKey]) {
                pointCounter[coordinateKey] = {
                    x: x, y: y, count: 1, color: dataArray[i].color, constructor: dataArray[i].name,
                    Vorname: dataArray[i].forename,
                    Nachname: dataArray[i].surname,
                    milliseconds: dataArray[i].milliseconds,
                    duration: dataArray[i].duration,
                    constructorId: dataArray[i].constructorId,
                }
            } else {
                pointCounter[coordinateKey].count++;
            }
        }
        }
        console.log(pointCounter)


        Object.keys(pointCounter).forEach(key => {
            let point = pointCounter[key];
            let count = point.count;
            let dotCount = Math.ceil(count / 5);
            let offset = Math.ceil(dotCount / 2);
            // console.log(dotCount);
    
    
    
            for (var j = 0; j < dotCount; j++) {

                xPos = point.x + (j - offset) * 8;

                xPositions.push({ pointIndex: j, duration: point.duration, constructorId: point.constructorId, xPos: xPos});

            let dot = $('<div class="dot"></div>');

            dot.css({
                'left': xPos - dotSize / 2,
                'top': point.y - dotSize / 2,
                'height': dotSize,
                'width': dotSize,
                'border-radius': '50%',
                'position': 'absolute',
                'background-color': point.color,
                'z-index': 1,
                'transition': 'all ease-in-out 0.2s',
                // 'border': '1px solid white',
                // 'outline': '0.5px solid' + point.color,
            });

                renderer.append(dot);


                dot.data({
                    constructor: point.constructor,
                    constructorId: point.constructorId,
                    duration: point.duration,
                    Vorname: point.Vorname,
                    Nachname: point.Nachname,
                    milliseconds: point.milliseconds,
                    pointIndex: j,
                    count: point.count,
                })
    
    
    
                const tooltip = $('<div></div>');
                const TeamColorDiv = $('<div></div>');
                const durationDiv = $('<div></div>');
                const timerDiv = $('<div></div>');
                const progressBar = $('<div></div>');
    
                let tooltipwidth = 365;
    
                // tooltip.addClass('tooltip')
    
                // Hover Menue Follower verschwindet
                $("#menueBox").hover(
                    function () {
                        $("#follower").css({
                            'display': 'none',
                        });
                    },
                    function () {
                        $("#follower").css({
                            'display': 'block',
                        });
                    }
                );
    
                dot.hover(
                    function () {
                        const dotData = dot.data();
                        tooltip.css({
                            'left': dot.position().left + 30,
                            'top': dot.position().top,
                            'height': 38,
                            'width': tooltipwidth,
                            'border-radius': 8,
                            'position': 'absolute',
                            'background-color': 'rgba(0,0,0,0.55)',
                            'z-index': 999999999999,
                            'padding': 10,
                            'padding-left': 25,
                            'color': 'white',
                            'font-family': 'sans-serif',
                        });
    
                        $("#follower").css({
                            'transform': 'scale(0.2)',
                            'z-index': '1',
                        })
    
                        if (point.count <= 1) {
                            tooltip.html(`<span style="font-weight: bold;">${dotData.constructor}</span> 
                        <span style="font-weight: lighter; margin-left: 10px;">${dotData.Vorname} ${dotData.Nachname}</span>`);
                        }
    
                        if (point.count > 1) {
                            tooltip.html(`<span style="font-weight: bold;">${dotData.constructor}</span> 
                            <span style="font-weight: lighter; margin-left: 10px;">${dotData.count} PitStops</span>`);
                        }
    
                        TeamColorDiv.css({
                            'left': dot.position().left + 38,
                            'top': dot.position().top + 5,
                            'height': 28,
                            'width': 6,
                            'border-radius': 2,
                            'position': 'absolute',
                            'background-color': point.color,
                            'z-index': 9999999999999,
                        });
    
                        durationDiv.css({
                            'left': dot.position().left + 300,
                            'top': dot.position().top + 8,
                            'height': 22,
                            'width': 85,
                            'border-radius': 50,
                            'position': 'absolute',
                            'background-color': 'rgba(138,138,138,1)',
                            'z-index': 9999999999,
                            'color': 'white',
                            'text-align': 'center',
                            'padding': 2,
                            'font-family': 'sans-serif',
                        });
    
                        const millisecondsString = String(dotData.milliseconds / 10000);
                        const firstThreeDigits = millisecondsString.substring(0, 4);
    
                        durationDiv.text(`${firstThreeDigits} sec`);
    
    
                        // Tooltip für Teams verschieben Wenn Abstand zu gering
                        if (stageWidth - dot.position().left < tooltipwidth + 50) {
                            tooltip.css({
                                'left': dot.position().left - 390,
                            });
                            TeamColorDiv.css({
                                'left': dot.position().left - 382,
                            });
                            durationDiv.css({
                                'left': dot.position().left - 120,
                            });
                        }
    
    
                        renderer.append(tooltip);
                        renderer.append(TeamColorDiv);
                        renderer.append(durationDiv);
    
                        dot.css({
                            'transform': 'scale(3)',
                            // 'cursor': 'pointer',
                            'z-index': 999999999999999,
                        });
    
                    },
                    function () {
                        tooltip.remove();
                        TeamColorDiv.remove();
                        durationDiv.remove();
                        timerDiv.remove();
                        progressBar.remove();
                        dotSize = 6;
                        dot.css({
                            'transform': 'scale(1)',
                        });
                        $("#follower").css({
                            'transform': 'scale(1)',
                        })
                    }
                );
    
                dot.click(function () {
                    const dotData = dot.data();
    
                    tooltip.css({
                        'height': 130,
                        'width': 150,
                    });
    
                    tooltip.text("");
                    TeamColorDiv.css({
                        'height': 120,
                        'background-color': 'grey',
                    });
                    durationDiv.remove();
                    renderer.append(tooltip);
                    renderer.append(TeamColorDiv);
    
    
                    progressBar.css({
                        'left': dot.position().left + 44,
                        'top': dot.position().top + 11,
                        // 'height': 100,
                        'width': 6,
                        'border-radius': 2,
                        'position': 'absolute',
                        'background-color': point.color,
                        'z-index': 99999999999999,
                    });
                    renderer.append(progressBar);
    
                    timerDiv.css({
                        'left': dot.position().left + 70,
                        'top': dot.position().top + 55,
                        'position': 'absolute',
                        'z-index': 9999999999,
                        'color': 'white',
                        'text-align': 'center',
                        'padding': 0,
                        'font-family': 'sans-serif',
                        'font-size': 24,
                    });
    
    
                    // Tooltip für Teams verschieben Wenn Abstand zu gering
                    if (stageWidth - dot.position().left < tooltipwidth + 50) {
                        tooltip.css({
                            'left': dot.position().left - 180,
                        });
                        TeamColorDiv.css({
                            'left': dot.position().left - 172,
                        });
                        progressBar.css({
                            'left': dot.position().left - 172,
                        });
                        timerDiv.css({
                            'left': dot.position().left - 145,
                        });
                    }
    
    
                    // Timer erstellen
                    let timerDuration = dotData.duration * 100; // Umrechnen in Millisekunden
                    timerDiv.text(`${(timerDuration / 1000).toFixed(3)} s`);
                    renderer.append(timerDiv);
    
                    function updateTimer() {
                        timerDuration -= 15;  // 15 ms herunterzählen
    
                        if (timerDuration <= 0) {
                            clearInterval(timerInterval);
                            timerDiv.remove();
                            tooltip.remove();
                            TeamColorDiv.remove();
                            progressBar.remove();
                        } else {
                            const progress = (timerDuration / (dotData.duration * 100)) * 123;
                            progressBar.css('height', `${progress}px`);
                            timerDiv.text(`${(timerDuration / 1000).toFixed(3)} s`);
                        }
                    }
    
                    // Aktualisiere den Timer alle 10 ms
                    const timerInterval = setInterval(updateTimer, 10);
    
                    dot.click(function () {
                        clearInterval(timerInterval);
                        timerDiv.remove();
                        progressBar.remove();
                        renderer.append(progressBar);
                        renderer.append(timerDiv);
                    });
                });
            }
            
        });
}






// function drawRaceMap() {
//     console.log(dataArray)

//     let dotSize;
//     let pointCounter = {}; // Zähler für die Punkte


//     for (var i = 0; i < dataArray.length - 1; i++) {

//         var currentPitDuration = dataArray[i].duration;
//         var currentConstructorId = dataArray[i].constructorId;

//         raceIDValue = dataArray[i].raceId;

//         var x = gmynd.map(raceIDValue, 840, 1100, 150, stageWidth - 150);
//         var y = gmynd.map(currentPitDuration, 12.0, 60.0, stageHeight - 100, 150);
//         let dot = $('<div class="dot"></div>');

        
//         // Erhöhe den Zähler für die aktuellen Koordinaten
//         const coordinateKey = `${x}_${y}`;
//         pointCounter[coordinateKey] = (pointCounter[coordinateKey] || 0) + 1;



//         // Punkte nach rechts und links verschieben
//         if (pointCounter[coordinateKey] > 1) {
//             if (pointCounter[coordinateKey] % 2 === 0) {
//                 x = x + (pointCounter[coordinateKey] / 2) * 6;
//             } else {
//                 x = x - Math.floor(pointCounter[coordinateKey] / 2) * 6;
//             }

//             // dotSize = 4 + (pointCounter[coordinateKey]);
//             dotSize = 6;
//         } else {
//             dotSize = 6;
//         }




//         dotSize = 6;

//         dot.css({
//             'left': x - dotSize / 2,
//             'height': dotSize,
//             'width': dotSize,
//             'border-radius': 100,
//             'top': y,
//             'position': 'absolute',
//             'background-color': dataArray[i].color,
//             'border': '0.1px solid white',
//             'z-index': 1,
//             // 'opacity': 0.1,
//         });

//         dot.data({
//             constructor: dataArray[i].name,
//             duration: currentPitDuration,
//             Vorname: dataArray[i].forename,
//             Nachname: dataArray[i].surname,
//             Race: dataArray[i].raceId,
//         })


//         if (teamsArray.includes(currentConstructorId) && currentPitDuration > 12.5) {
//             renderer.append(dot);
//         }


//         const tooltip = $('<div></div>');

//         dot.hover(
//             function () {
//                 const dotData = dot.data();
//                 tooltip.css({
//                     'left': dot.position().left + 30,
//                     'top': dot.position().top,
//                     'height': 90,
//                     'width': 200,
//                     'border-radius': 8,
//                     'position': 'absolute',
//                     'background-color': dot.css('background-color'),
//                     // 'background-color': 'rgba(0,0,0,0.4)',
//                     'z-index': 999999999999,
//                     'padding': 16,
//                     'color': 'white',
//                     'font-family': 'sans-serif',
//                 });

//                 tooltip.text(`Team: ${dotData.constructor}, Duration: ${dotData.duration}, Name: ${dotData.Vorname} ${dotData.Nachname}, Race: ${dotData.Race}`);

//                 renderer.append(tooltip);

//                 dot.css({
//                     'height': dotSize * 4,
//                     'width': dotSize * 4,
//                     'z-index': 999999999999,
//                 });

//             },
//             function () {
//                 tooltip.remove();
//                 dot.css({
//                     'height': dotSize,
//                     'width': dotSize,
//                     'z-index': 0,
//                 });
//             }
//         );

//     }
// }