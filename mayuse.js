
// idea for !mapchange:
// if at least 50% of users type !mapchange, then the bot picks a random mapname from
// <select id="map" name="map"> option-value on /current/change, then send ajax POST header
// with mapchangerequest like:
/*
 Request URL:/ServerAdmin/current/change
 POST Form Data
 gametype:KFGameContent.KFGameInfo_Survival
 map:KF-WestLondon2009_Prerelease
 mutatorGroupCount:0
 urlextra:?difficulty=3
 action:change
 */
// (voter should get a timestamp and be identified by steamid to prevent wrong results, if the person isn't on the server anymore by the time the vote ends
// the voice should be void. The  vote should be active for 60 sec after first invoking it, and have some kind of cooldown, and so on)
// Same would work with !difficulty HoE (GET request for difficulty=3 and so on should suffice)
// I imagine !mapvote from chat to work like this:
// !mapvote KF-SmurfBrothel, !mapvote KF-Paris, !mapvote KF-Paris => switching to KF-Paris


/*
 ----- BORROWED CODE THAT HELPED ME AND MIGHT COME IN HANDY LATER :) -----
 */



/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
 that detects and handles AJAXed content.
 Usage example:
 waitForKeyElements (
 "div.comments"
 , commentCallbackFunction
 );
 //--- Page-specific function to do what we want when the node is found.
 function commentCallbackFunction (jNode) {
 jNode.text ("This comment changed by waitForKeyElements().");
 }
 IMPORTANT: This function requires your script to have loaded jQuery.


 SOURCE: https://gist.github.com/BrockA/2625891
 */
//function waitForKeyElements (
//selectorTxt,    /* Required: The jQuery selector string that
//                        specifies the desired element(s).
//                    */
// actionFunction, /* Required: The code to run when elements are
//                        found. It is passed a jNode to the matched
//                        element.
//                    */
// bWaitOnce,      /* Optional: If false, will continue to scan for
//                        new elements even after the first match is
//                        found.
//                    */
// iframeSelector  /* Optional: If set, identifies the iframe to
//                        search.
//                    */
//) {
//    var targetNodes, btargetsFound;
//
//    if (typeof iframeSelector == "undefined")
//        targetNodes     = $(selectorTxt);
//    else
//        targetNodes     = $(iframeSelector).contents ()
//        .find (selectorTxt);
//
//    if (targetNodes  &&  targetNodes.length > 0) {
//        btargetsFound   = true;
//        /*--- Found target node(s).  Go through each and act if they
//            are new.
//        */
//        targetNodes.each ( function () {
//            var jThis        = $(this);
//            var alreadyFound = jThis.data ('alreadyFound')  ||  false;
//
//            if (!alreadyFound) {
//                //--- Call the payload function.
//                var cancelFound     = actionFunction (jThis);
//                if (cancelFound)
//                    btargetsFound   = false;
//                else
//                  jThis.data ('alreadyFound', true);
//            }
//        } );
//    }
//    else {
//        btargetsFound   = false;
//    }
//
//    //--- Get the timer-control variable for this selector.
//    var controlObj      = waitForKeyElements.controlObj  ||  {};
//    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
//    var timeControl     = controlObj [controlKey];
//
//    //--- Now set or clear the timer as appropriate.
//    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
//        //--- The only condition where we need to clear the timer.
//        clearInterval (timeControl);
//        delete controlObj [controlKey]
//    }
//    else {
//        //--- Set a timer, if needed.
//        if ( ! timeControl) {
//            timeControl = setInterval ( function () {
//                waitForKeyElements (    selectorTxt,
//                                    actionFunction,
//                                    bWaitOnce,
//                                    iframeSelector
//                                   );
//            },
//                                       300
//                                      );
//            controlObj [controlKey] = timeControl;
//        }
//    }
//    waitForKeyElements.controlObj   = controlObj;
//}

/* AJAX EVENT LISTENER
 Just c/p this onto your page or include it in a .js file or whatever. This will create an object called s_ajaxListener. 
 Whenever an AJAX GET or POST request is made, s_ajaxListener.callback() is called, and the following properties are available:

 s_ajaxListener.method : The ajax method used. 
 This should be either GET or POST. 
 NOTE: the value may not always be uppercase, it depends on how the specific request was coded. 

 s_ajaxListener.url : The url of the requested script (including query string, if any) (urlencoded). 
 I have noticed, depending on how the data is sent and from which browser/framework, 
 for example this value could end up being as " " or "+" or "%20".

 s_ajaxListener.data : the data sent, if any 
 ex: foo=bar&a=b (same 'issue' as .url with it being url-encoded)

 NOTES:
 I have tested this in (as of this posted date): Current Safari, Current Chrome, Current FireFox, IE8, IE8 (IE7 Compatible). 
 It doesn't currently work with IE6 because IE6 uses an ActiveX object, while virtually everything else uses XMLHttpRequest.
 Under each of the browsers I tested above, this works with AJAX requests from a generic object, and also from the jquery and prototype frameworks. 
 I know there are other frameworks out there, but IMO these 2 are the major ones. I might possibly QA MooTools, but other than that, I'm fine with only testing those.

 SOURCE: http://stackoverflow.com/questions/3596583/javascript-detect-an-ajax-event/3597640#3597640
 */
//var s_ajaxListener = new Object();
//s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
//s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
//s_ajaxListener.callback = function () {
// this.method :the ajax method used
// this.url    :the url of the requested script (including query string, if any) (urlencoded) 
// this.data   :the data sent, if any ex: foo=bar&x=b (urlencoded)
//};

//XMLHttpRequest.prototype.open = function(x,y) {
//    if (!x) x='';
//    if (!y) y='';
//    s_ajaxListener.tempOpen.apply(this, arguments);
//    s_ajaxListener.method = x;  
//    s_ajaxListener.url = y;
//    if (x.toLowerCase() == 'get') {
//        s_ajaxListener.data = y.split('?');
//        s_ajaxListener.data = s_ajaxListener.data[1];
//    }
//};

//XMLHttpRequest.prototype.send = function(x,y) {
//    if (!x) x='';
//    if (!y) y='';
//    s_ajaxListener.tempSend.apply(this, arguments);
//    if(s_ajaxListener.method.toLowerCase() == 'post' && !s_ajaxListener.url.includes('gamesummary'))s_ajaxListener.data = x;
//    s_ajaxListener.callback(checkTheStuff());
//};