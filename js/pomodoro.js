var pomodoro = (function () {

    var remainingSeconds;

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
        var pomodoroMinutes = $('#pomodoroMinutes').val(),
            breakMinutes = $('#breakMinutes').val();

        remainingSeconds = (isNaN(pomodoroMinutes) ? 0 : pomodoroMinutes) * 1;

        $.when(runTimer())
        .then(function () {
            remainingSeconds = (isNaN(breakMinutes) ? 0 : breakMinutes) * 1;
            return runTimer();
        })
        .then(function () {
            alert('done');
        });
    }

    function runTimer() {
        var deferred = $.Deferred();

        setTimeout(function () {
            timer();
        }, 1000);

        function timer() {
            displayPomodoroRemainingTime();
            remainingSeconds--;
            if (remainingSeconds >= 0) {
                setTimeout(function () {
                    timer();
                }, 1000);
            } else {
                deferred.resolve();
            }
        }

        return deferred.promise();
    }

    function setEventHandlers() {
        $('#startTimer').click(handleStartTimerClick);
    }

    return {
        init: init
    };
}());

pomodoro.init();
