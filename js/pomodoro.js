var pomodoro = (function () {

    var remainingSeconds,
        stopTimer,
        timerHandle,
        secondsInOneMinute = 1,
        RED = true,
        GREEN = false;

    function displayPomodoroRemainingTime() {
        var minutes = Math.floor(remainingSeconds / 60),
            seconds = remainingSeconds % 60,
            formattedMinutes = ("0" + minutes.toString()).substr(-2),
            formattedSeconds = ("0" + seconds.toString()).substr(-2);

        $('#timeRemaining').text(formattedMinutes + ':' + formattedSeconds);

    }

    function init() {
        $(function () {
            setEventHandlers();
        })
    };

    function handleStartTimerClick() {
        runPomodoroAndBreakTimers();
    }

    function runPomodoroAndBreakTimers() {
        var pomodoroMinutes = $('#pomodoroMinutes').val(),
            breakMinutes = $('#breakMinutes').val();

        setTomatoColor(RED);

        remainingSeconds = (isNaN(pomodoroMinutes) ? 0 : pomodoroMinutes) * secondsInOneMinute;

        if (timerHandle) {
            clearTimeout(timerHandle);
        }

        $.when(runTimer())
        .then(function () {
            remainingSeconds = (isNaN(breakMinutes) ? 0 : breakMinutes) * secondsInOneMinute;
            setTomatoColor(GREEN);

            return runTimer();
        })
        .then(function () {
            flickerTomato(40);
        });
    }

    function runTimer() {
        var deferred = $.Deferred();

        timerHandle = setTimeout(function () {
            timer();
        }, 1000);

        function timer() {
            displayPomodoroRemainingTime();
            remainingSeconds--;
            if (remainingSeconds >= 0) {
                timerHandle = setTimeout(function () {
                    timer();
                }, 1000);
            } else {
                deferred.resolve();
            }
        }

        return deferred;
    }

    function setEventHandlers() {
        $('img,#timeRemaining').click(handleStartTimerClick);
    }

    function setTomatoColor(redOrGreen) {
        var imageSrc = redOrGreen === RED ? 'img/tomato.jpg' : 'img/green.jpg';
        $('img').attr('src', imageSrc);
    }

    function flickerTomato(numberOfFlicks) {
        var color = GREEN,
            workingFlicks = numberOfFlicks;

        flick();

        function flick() {
            color = !color;
            setTomatoColor(color);
            if (workingFlicks) {
                workingFlicks--;
                setTimeout(flick, 75);
            }
        }
    }

    return {
        init: init
    };
}());

pomodoro.init();
