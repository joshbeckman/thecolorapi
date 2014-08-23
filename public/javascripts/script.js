// Init scrollers
(function(window, document){
  var scrollers = document.getElementsByClassName('scroller'),
    length = scrollers.length,
    i = 0;
  function makeScroller(scrollToPath) {
    return function(){
      var path = scrollToPath;
      scrollTo(window, document.getElementById(path).offsetTop, 1000);
      window.history.pushState({foo:'bar'}, ('Aislin ' + path), '/#' + path);
    };
  }
  for (; i < length; i++) {
    scrollers[i].onclick = makeScroller(scrollers[i].dataset.scrollTo);
  }
  function getRandomHex() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  if (document.getElementById('loading')){
    setTimeout(loadingBack, 2000);
  }
  function loadingBack(){
    var load = document.getElementById('loading'),
    bullets = load.getElementsByClassName('bullet'),
    color;
    color = getRandomHex();
    if(load.className == 'loading'){
      load.className = 'loading back';
    } else {
      load.className = 'loading';
    }
    load.style.display='none';
    load.offsetHeight; // no need to store this anywhere, the reference is enough to fool Chrome
    load.style.display='block';
    for (i = bullets.length - 1; i >= 0; i--) {
      bullets[i].style.background = color;
      bullets[i].style.zIndex = 1;
    }
    document.getElementById('sunset').style.background = color;
    document.getElementById('try-it').style.color = document.getElementById('try-it').style.borderColor = color;
    document.getElementsByClassName('title')[0].getElementsByTagName('span')[0].style.color = color;
    setTimeout(loadingBack, 2000);
  }
  document.getElementById('try-it').addEventListener('click', function(evt){
    evt.preventDefault;
    var color = getRandomHex();
    document.getElementById('try-show').src = '/id?format=svg&hex=' + color.substring(1);
    evt.target.className = document.getElementById('try-show').className = 'active';
  }, false);
  document.getElementById('try-show').addEventListener('click', function(evt){
    var s = evt.target.src.split('format=svg');
    window.location = s[0] + 'format=html' + s[1];
  }, false);
})(this, this.document);

// Custom ScrollTo
window.scrollTo = function(element, to, duration) {
  var start = element.scrollY,
      change = to - start,
      currentTime = 0,
      increment = 20;

  var animateScroll = function(){
    currentTime += increment;
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scroll(0, val);
    if(currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
};
// Custom Request
var request = function(url,cb,method,post,contenttype){
var requestTimeout,xhr;
try{ xhr = new XMLHttpRequest(); }catch(e){
try{ xhr = new ActiveXObject("Msxml2.XMLHTTP"); }catch (error){
if(console)console.log("tinyxhr: XMLHttpRequest not supported");
return null;
}
}
requestTimeout = setTimeout(function() {xhr.abort(); cb(new Error("tinyxhr: aborted by a timeout"), "",xhr); }, 10000);
xhr.onreadystatechange = function(){
if (xhr.readyState != 4) return;
clearTimeout(requestTimeout);
cb(xhr.status != 200?new Error("tinyxhr: server respnse status is "+xhr.status):false, xhr.responseText,xhr);
};
xhr.open(method?method.toUpperCase():"GET", url, true);
if(!post){
xhr.send();
}else{
xhr.setRequestHeader('Content-type', contenttype?contenttype:'application/x-www-form-urlencoded');
xhr.send(post);
}
}