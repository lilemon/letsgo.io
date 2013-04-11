var isOpened = false, urlState = {q:null,from:null,wp:[],pids:[],dpid:null};

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD *
 * Build: http://modernizr.com/download/#-svg */
;window.Modernizr=function(a,b,c){function u(a){i.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={svg:"http://www.w3.org/2000/svg"},m={},n={},o={},p=[],q=p.slice,r,s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.svg=function(){return!!b.createElementNS&&!!b.createElementNS(l.svg,"svg").createSVGRect};for(var z in m)t(m,z)&&(r=z.toLowerCase(),e[r]=m[z](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)t(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},u(""),h=j=null,e._version=d,e}(this,this.document);

if(!Modernizr.svg) {
	$('img[src*="svg"]').attr('src', function() {
		return $(this).attr('src').replace('.svg', '.png');
	});
}

function fullPicture(image, photoID) {
	$("#bigPicture").css({'background-image':'url('+image+')'}).addClass("active");
	$("#mapFrame").addClass("sidebar");

	if (!isOpened) { _gaq.push(['_trackEvent', 'Photo', 'OpenedFullPictureViewer', image]); }
	urlState.dpid = photoID;
	isOpened = true;
}

function smallPicture() {
	$("#bigPicture").removeClass("active");
	$("#mapFrame").removeClass("sidebar");
	if (isOpened) { _gaq.push(['_trackEvent', 'Photo', 'ClosedFullPictureViewer']); }
	urlState.dpid = null;
	isOpened = false;
}

// function hugePicture() {
//     if(alreadyBig = True){
//         $("header").removeClass("active");
//         $("#mapFrame").addClass("imageFullScreen");
//         $("#bigPicture").addClass("imageFullScreen");
//         alreadyBig = true;
//     }
//     else {
//         $("header").addClass("active");
//         $("#mapFrame").removeClass("imageFullScreen");
//         $("#bigPicture").removeClass("imageFullScreen");
//         alreadyBig = false;
//     }
    
// }

function getUrl() {
	"use strict";

	var link = document.location.origin, parameterArray = [];
	
	$.each(urlState, function(parameter, value) {
		if (value && value.toString().length > 0) {
			parameterArray.push(parameter + "=" + encodeURIComponent(value)); // encodeURIComponent converts an array from [1,2,3] to "1,2,3" then encodes the commas.
		}
	});
	
	if (parameterArray.length > 0) { link += '/?' + parameterArray.join('&'); }
	
	link = link.split('%20').join('+');
	link = link.split('%2C').join(',');
	
	return link;
}

function getTitle() {
	"use strict";
	
	var from = '', to = '', title = "LetsGo - Discover Scenic Highways and Byways";
	
	if (urlState.q && urlState.q.length) to = urlState.q;
	if (urlState.from && urlState.from.length) from = urlState.from;
		
	if (from.length && to.length) title += " - " + from + " to " + to; 
	else if (!from.length && to.length) title += " - " + to;
	else if (from.length && !to.length) title += " - " + from;
	else { /* add nothing to the title */ }
	
	return title;
}

function replaceWindowHistory() {
	"use strict";
	
	window.history.replaceState(null, getTitle(), getUrl());
}

// Responsive Logo for the home screen splash.
function logoSize() {
    var $searchBar = $("#bigSearchBar");
    if ($searchBar.length) {
	    var offsert = $searchBar.offset();
	    $("#introLogo").css({height: (offsert.top/3)*2, paddingTop: offsert.top/6});
	    if($("#introLogo").hasClass("hidden")) {
	        $("#introLogo").removeClass("hidden");
	    }
	}
}

$(document).ready(function() {
    logoSize();
});

$(window).resize(function() {
    logoSize();
});

$(document).on("click", "#welcomeScreen", function(e) {
	if (e.target.id === 'welcomeScreen' || e.target.id === 'introLogo') appActivate();
});

$(document).on("click", ".mapImage", function() {
	var item = canvasPhotos[$(this).attr("data-id")];
	//var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_l.jpg";
	fullPicture(item.url_l, item.id);
});

// $(document).on("click", "#bigPicture", function() {
//     alert("MERP!");
//     window.open("http://flickr.com/photos/" + canvasPhotos['2588515847'].owner + "/" + canvasPhotos['2588515847'].id, "_blank");
// })

$(document).on("touchstart", ".mapImage", function() {
	var item = canvasPhotos[$(this).attr("data-id")];
	//var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_l.jpg";
	fullPicture(item.url_l, item.id);
});


$(document).on("keyup", function(e) {
	if (e.keyCode === 27) smallPicture();
});




