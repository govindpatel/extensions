
chrome.extension.isAllowedIncognitoAccess(function(isAllowedAccess) {
  // console.log("isAllowedAccess : "+isAllowedAccess);
  if(isAllowedAccess)return;
});

chrome.runtime.sendMessage({"message":"get_status"},function(response){
  if(response.timer){
    // console.log("get status");
    document.getElementById("startTimer").disabled = true;
  }
});


// slider
var hrSlider = new Slider('#ex1', {});
var minSlider = new Slider('#ex2',{});

var twoDigit = function(num){
  if ( num < 10){
    return "0"+num;
  }else{
    return num;
  }
};

// slider event
hrSlider.on("slide", function(evntName){
  // console.log("Sliding value:"+hrSlider.getValue());
  document.getElementById("hrText").innerHTML = twoDigit(hrSlider.getValue());
}); 
minSlider.on("slide", function(evntName){
  // console.log("Sliding value:"+minSlider.getValue());
document.getElementById("minText").innerHTML = twoDigit(minSlider.getValue());
});

hrSlider.on("slideStop", function(evntName){
  // console.log("Sliding value:"+hrSlider.getValue());
  document.getElementById("hrText").innerHTML = twoDigit(hrSlider.getValue());
}); 
minSlider.on("slideStop", function(evntName){
  // console.log("Sliding value:"+minSlider.getValue());
document.getElementById("minText").innerHTML = twoDigit(minSlider.getValue());
});

// when startTimer button is clicked
document.getElementById("startTimer").addEventListener("click", function(){
  h = hrSlider.getValue();
  m = minSlider.getValue();
  this.disabled = true;
  // console.log("Starting timer: "+h+":"+m);
  chrome.runtime.sendMessage({"message": "start_timer", "h": h, "m":m},function(response){
    // console.log("got this from background.js : "+response.farewell);
  });
    
});

//stop timer
document.getElementById("stopTimer").addEventListener("click", function(){
  chrome.runtime.sendMessage({"message": "stop_timer"});
  document.getElementById("startTimer").disabled = false;
});


// get message from background
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
  if(request.message === "displayTime"){
    // show the remaining time
    document.getElementById("displayTime").innerHTML = request.timeValue;
  }else if(request.message === "timer_completed"){
    document.getElementById("startTimer").disabled = false;
  }
});