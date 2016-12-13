var pomodoro = (function () {

    var remainingPomodoroSeconds;

    function displayPomodoroRemainingTime() {
        var minutes = Math.floor(remainingPomodoroSeconds / 60),
            seconds = remainingPomodoroSeconds % 60,
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
        var remainingPomodoroMinutes = $('#pomodoroMinutes').val();

        remainingPomodoroSeconds = (isNaN(remainingPomodoroMinutes) ? 0 : remainingPomodoroMinutes) * 60;

        setTimeout(function () {
            runTimer();
        }, 1000);
    }

    function runTimer() {
        displayPomodoroRemainingTime();
        remainingPomodoroSeconds--;
        if (remainingPomodoroSeconds >= 0) {
            setTimeout(function () {
                runTimer();
            }, 1000);
        }
    }

    function setEventHandlers() {
        $('#startTimer').click(handleStartTimerClick);
    }

    return {
        init: init
    };
}());

pomodoro.init();
