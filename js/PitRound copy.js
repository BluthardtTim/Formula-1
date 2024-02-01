function drawPitRoundMap() {
    let pointCounter = {};
    let dotSize = 8;

    
    for (var i = 0; i < dataArray.length - 1; i++) {
        
        uniqueConstructorIds = teamsArray;
        var currentConstructorId = dataArray[i].constructorId;

        if (uniqueConstructorIds.indexOf(currentConstructorId) >= 0) {
            var x = gmynd.map(dataArray[i].lap, 0, 78, 150, stageWidth - 150);
            var y = stageHeight - 100;

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
                    lap: dataArray[i].lap,
                }
            } else {
                pointCounter[coordinateKey].count++;
            }
        }
    }
    Object.keys(pointCounter).forEach(key => {
        let point = pointCounter[key];
        let count = point.count;
        let dotCount = Math.ceil(count / 5);
        let offset = Math.ceil(dotCount / 2);
        // console.log(dotCount);



        for (var j = 0; j < dotCount; j++) {

            // y verschieben
            yPos = point.y - j * 8;

            xPositions.push({ pointIndex: j, duration: point.duration, constructorId: point.constructorId, yPos: yPos });

            let dot = $('<div class="dot"></div>');

            dot.css({
                'left': point.x - dotSize / 2,
                'top': yPos - dotSize / 2,
                'height': dotSize,
                'width': dotSize,
                'border-radius': '50%',
                'position': 'absolute',
                'background-color': point.color,
                'border': '0.1px solid white',
                'z-index': 1,
                'transition': 'all ease-in-out 0.2s',
                // 'border': '1px solid white',
                // 'outline': '0.5px solid' + point.color,
            });

            setTimeout(function () {
                renderer.append(dot);
            }, j * 50);

            dot.data({
                constructor: point.constructor,
                constructorId: point.constructorId,
                duration: point.duration,
                Vorname: point.Vorname,
                Nachname: point.Nachname,
                milliseconds: point.milliseconds,
                pointIndex: j,
                count: point.count,
                lap: point.lap,
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

                        tooltip.html(`<span style="font-weight: bold;">${dotData.constructor}</span> 
                        <span style="font-weight: lighter; margin-left: 10px;">${dotData.count} PitStops, ${dotData.lap} lap</span>`);

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