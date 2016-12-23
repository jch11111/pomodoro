var pomodoro = (function () {

    var remainingSeconds,
        timerHandle,
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

        remainingSeconds = (isNaN(pomodoroMinutes) ? 0 : pomodoroMinutes) * ('#debug' === location.hash ? 1 : 60);

        if (timerHandle) {
            clearTimeout(timerHandle);
        }

        $.when(runTimer())
        .then(function () {
            remainingSeconds = (isNaN(breakMinutes) ? 0 : breakMinutes) * ('#debug' === location.hash ? 1 : 60);
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
        //var imageSrc = redOrGreen === RED ? 'http://curthill.net/pomodoro/img/tomato.jpg' : 'http://curthill.net/pomodoro/img/green.jpg';
        var imageSrc = redOrGreen === RED ? 'img/tomato.jpg' : 'img/green.jpg';
        $('img').attr('src', imageSrc);
    }

    function flickerTomato(numberOfFlicks) {
        var color = GREEN,
            workingFlicks = numberOfFlicks;

        flick();

        function flick() {
            setTomatoColor(color = !color);
            if (workingFlicks--) {
                setTimeout(flick, 75);
            }
        }
    }

    return {
        init: init
    };
}());

pomodoro.init();
