// Things I used...
// https://blog.hartleybrody.com/chrome-extension/
// https://github.com/seiyria/bootstrap-slider
//  button css
// rest is my own...

// Things to do
// add a timer sound
// add a custom timer for 3 and 5 hour.
// when the timer is running click start timer again... change time...click the btn again....

// some permissions :
// "permissions": [
//   "declarativeWebRequest",
//   "activeTab",
//   "https://ajax.googleapis.com/",
//   "tabs", "bookmarks", "*://*/*"
// ]

var sdate;
var edate;
var running = false;

var twoDigit = function(num){
  if ( num < 10){
    return "0"+num;
  }else{
    return num;
  }
};

var setEndTimeForTimer = function(hr,min){
	console.log("setEndTimeForTimer called");
  //set the value 
  sdate = new Date();
  edate = new Date(
    new Date(
      new Date().setHours(sdate.getHours()+hr)
      ).setMinutes(sdate.getMinutes()+min)
    );
};

var startTimer = function(){
  updateUI();
  if(sdate.valueOf() >= edate.valueOf()){
    console.log("Completed");
    //Log this to check the time.
    console.log(Date.now());
    if(running){
      // play the sound here.
      var myAudio = new Audio();
      myAudio.src = "../res/alarm.mp3";
      myAudio.play();
      // create a notification
      options = {
        type:"basic",
        title:"Count Down Timer",
        message: "Time up!",
        iconUrl:"../res/icon1.png"
      };
      chrome.notifications.create(options);
      running = false;
      chrome.runtime.sendMessage({"message":"timer_completed"});
    }
  } else {
    sdate = new Date();
    console.log(sdate.toString() +" "+edate.toString());
    setTimeout(
      function() {
        // set the timeOut to 100ms 
        // and match the value.
        startTimer();
      }, 500);
  }
};

var updateUI = function(){
  var diffMS = edate.valueOf() - sdate.valueOf();
  if(diffMS <= 0){
    dhr = 0;
    dmin = 0;
    dsec = 0;
    var timeValue  = twoDigit(dhr)+":"+twoDigit(dmin)+":"+twoDigit(dsec);
    console.log(timeValue);
    chrome.runtime.sendMessage({"message":"displayTime","timeValue":timeValue});
    // badge
    var badgeText = twoDigit(dhr)+""+twoDigit(dmin);// show only hr:min, max(size) = 5
    chrome.browserAction.setBadgeText({text:badgeText});
    // popUp
    // chrome.browserAction.setPopup({popup:timeValue});
    //title
    chrome.browserAction.setTitle({title:timeValue});
  }else{
    diffMS /= 1000;
    diffMS = parseInt(diffMS);
    dsec = diffMS  % 60;
    diffMS /= 60;
    diffMS = parseInt(diffMS);
    dmin = diffMS % 60;
    diffMS /= 60;
    diffMS = parseInt(diffMS);
    dhr = diffMS;
    var timeValue  = twoDigit(dhr)+":"+twoDigit(dmin)+":"+twoDigit(dsec);
    console.log(timeValue);
    chrome.runtime.sendMessage({"message":"displayTime","timeValue":timeValue});
    // badge
    var badgeText = twoDigit(dhr)+""+twoDigit(dmin);
    chrome.browserAction.setBadgeText({text:badgeText});
    // popUp
    // chrome.browserAction.setPopup({popup:timeValue});
    //title
    chrome.browserAction.setTitle({title:timeValue});
  }
};

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	
// });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.message === "stop_timer"){
		edate = new Date();
  	sdate = new Date();
    running = false;
  	updateUI();
	}else if(request.message === "start_timer"){
    running = true;
    sendResponse({farewell:"goodbye"});
    setEndTimeForTimer(parseInt(request.h), parseInt(request.m));
    startTimer();
  }else if(request.message === "get_status"){
    sendResponse({"timer":running});
  }
});

