var pomodoro = (function () {

    var remainingSeconds,
        stopTimer,
        timerHandle,
        secondsInOneMinute = 1;

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

        //$('#timeRemaining').css('background-color', '#F00');
        $('#tomato img').attr('src', 'img/tomato.jpg');


        remainingSeconds = (isNaN(pomodoroMinutes) ? 0 : pomodoroMinutes) * secondsInOneMinute;

        if (timerHandle) {
            clearTimeout(timerHandle);
        }

        $.when(runTimer())
        .then(function () {
            remainingSeconds = (isNaN(breakMinutes) ? 0 : breakMinutes) * secondsInOneMinute;
            //$('#timeRemaining').css('background-color', '#0F0');
            $('#tomato img').attr('src', 'img/green.jpg');
            //$('#timeRemaining').css('color', 'red');
            return runTimer();
        })
        .then(function () {
            //$('#timeRemaining').css('background-color', '#FFF');
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

    return {
        init: init
    };
}());

pomodoro.init();
