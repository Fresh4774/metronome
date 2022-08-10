window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var timer, noteCount, counting, accentPitch = 380, offBeatPitch = 200;
var delta = 0;
var curTime = 0.0;

$("document").ready(function() {
$(".ts-top").trigger("change");
$("header").fitText(1, { maxFontSize: "46px" });
});


function schedule() {
while(curTime < context.currentTime + 0.1) {
  playNote(curTime);
  updateTime();
}
timer = window.setTimeout(schedule, 0.1);
}

function updateTime() {
curTime += 60.0 / parseInt($(".bpm-input").val(), 10);
noteCount++;
}

function playNote(t) {
    var note = context.createOscillator();

    if(noteCount == parseInt($(".ts-top").val(), 10) )
      noteCount = 0;

    if( $(".counter .dot").eq(noteCount).hasClass("active") )
      note.frequency.value = accentPitch;
    else
      note.frequency.value = offBeatPitch;

    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);

    $(".counter .dot").attr("style", "");

    $(".counter .dot").eq(noteCount).css({
      transform: "translateY(-10px)",
      background: "#F75454"
    });
}

function countDown() {
  var t = $(".timer");

  if( parseInt(t.val(), 10) > 0 && counting === true)
  {
      t.val( parseInt(t.val(), 10) - 1 );
      window.setTimeout(countDown, 1000);
  }
  else
  {
    $(".play-btn").click();
    t.val(60);
  }
}

$(".tap-btn").click(function() {
  var d = new Date();
  var temp = parseInt(d.getTime(), 10);

  $(".bpm-input").val( Math.ceil(60000 / (temp - delta)) );
  delta = temp;
});

$(".bpm-minus, .bpm-plus").click(function() {
if($(this).hasClass("bpm-minus"))
  $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) - 1 );
else
  $(".bpm-input").val(parseInt($(".bpm-input").val(), 10) + 1 );
});

$(".beat-range, .accent-range").change(function() {
  if($(this).hasClass("beat-range"))
    offBeatPitch = $(this).val();
  else
     accentPitch = $(this).val();
});

$(document).on("click", ".counter .dot", function() {
  $(this).toggleClass("active");
});

$(".options-btn").click(function() {
$(".options").toggleClass("options-active");
});

$(".ts-top, .ts-bottom").on("change", function() {
  var _counter = $(".counter");
  _counter.html("");

  for(var i = 0; i < parseInt($(".ts-top").val(), 10); i++)
  {
    var temp = document.createElement("div");
    temp.className = "dot";

    if(i === 0)
      temp.className += " active";

    _counter.append( temp );
  }
});


$(".play-btn").click(function() {
if($(this).data("what") === "pause")
{
  counting = false;
  window.clearInterval(timer);
  $(".counter .dot").attr("style", "");
  $(this).data("what", "play").attr("style","").text("Play");
}
else {
  
if( $("#timer-check").is(":checked") )
 {
   counting = true;
   countDown();
 }
  
  curTime = context.currentTime;
  noteCount = parseInt($(".ts-top").val(), 10);
  schedule();

  $(this).data("what", "pause").css({
    background: "#F75454",
    color: "#FFF"
  }).text("Stop");
}
});