/* 
    Created on : 16 févr. 2017, 10:13:00
    Author     : Jules Jamart et Granddad
*/

var pp = (function(){
     
    var splash = (function(){
        var div             = null,
            visible         = true,
            paramsDiv       = null,
            SCORETAG        = "#score",
            SCOREKEY        = "PIGPONGSCORE",
            msg             = "";
            
        function hide() {
            div.style.display = "none";
            visible = false;
        };
        function leaderBoard() {
            var div = show(msg[6],score);
            var list = div.querySelector("ol.topscores");
            var scores = bestScores.scores();
            if(list) {
                for(var i in scores) {
                    var div = document.createElement("div");
                    var el = document.createElement("div");
                    el.className = "leaderrname";
                    el.textContent = scores[i].name;
                    div.appendChild(el);
                    el = document.createElement("div");
                    el.className = "leaderscore";                    
                    el.textContent = scores[i].score;                    
                    div.appendChild(el);
                    var li = document.createElement("li");
                    li.appendChild(div);
                    list.appendChild(li);
                }
            }
         
        };
        function addTopScore(input,score) {
            if(input.value) {
                bestScores.add(input.value,score);
            }
            leaderBoard();
        };
        function addListeners(div,score) {
            var input = div.querySelector('input[name=playername]');
            var button = div.querySelector('input[name=okbutton]');
            if(input && button) {
                button.addEventListener("click",function(){
                    addTopScore(input,score);
                },false);
            } 
        };
        function whichMessage(msg4,msg5,score) {
            var array = bestScores.scores();
            if(array.length < 5) return msg5;
            var least = array[array.length-1].score;
            if(score > least) {
                return msg5;
            }
            return msg4;
        };
        function show(message,score) {
            div.innerHTML = message;
            addListeners(div,score);          
            div.style.display = "block";
            visible = true;
            return div;
        };
        function endGame(score) {
            function text() {
               
                if(score < 5){
                    return msg[2].replace(SCORETAG,score);
                }
                if(score < 10){
                    return msg[3].replace(SCORETAG,score);
                }
                if(score < 20 ) {
                    return msg[4].replace(SCORETAG,score); 
                } 
                return whichMessage(msg[4].replace(SCORETAG,score),
                       msg[5].replace(SCORETAG,score),score );
            }           
            show(text(),score);
        };
        function pause() {

        };
        function reset() {
            show(msg[1]);
            var params = div.querySelector("#params");
            params.appendChild(paramsDiv);            
        }
        function start() {
            hide();
        };
        function bounds() {
            return utils.getBounds(div);
        };
        function makeMessages(div) {
            function msgs(textArray) {
        //dumpText(textArray);
        return [
            "<div>"+
            textArray[0]+
            "</div><div id='params'></div><br><div>"+
            textArray[1]+"</div>",

            "<div>"+
            textArray[2]+
            "</div><div id='params'></div><br><div>"+
            textArray[1]+
            "</div>",

            textArray[3]+
            "<br>"+SCORETAG+
            "<br>"+textArray[4]+
            "<br>"+textArray[5]+
            "<br><br>"+
            textArray[11],

            SCORETAG+"<br>"+
            textArray[6]+
            "<br>"+textArray[7]+
            "<br><br>"+textArray[11],

            textArray[8]+
            "<br>"+SCORETAG+
            "<br>"+textArray[9]+
            "<br>"+textArray[10]+
            "<br><br>"+textArray[11],

            textArray[13]+
            "<br>"+SCORETAG+
            "<br>"+textArray[14]+
            "<br> <input class='playername' type='text' name='playername' ><br>"+
            "<input class='okbutton' type='button' value='ok' name='okbutton'>",

            "<div class='champions'>"+
             textArray[17]+
             "</div> <ol class='topscores'></ol><br>"+
             textArray[11]
        ];
            }            
           msg = msgs(JSON.parse(div.getAttribute("data-texts")));            
        };
        
        function dumpText(arr) {
            arr.forEach(function(el,index){
                console.log(index+" "+el);
            });
        }
        
        function startMessage(settingsDiv) {
            paramsDiv = settingsDiv;
            show(msg[0]);
            var params = div.querySelector("#params");
            params.appendChild(paramsDiv);            
        };
        
        var bestScores = (function() {
            var scores;
            function init() {
                scores = utils.localStorage(SCOREKEY);
                if(scores === null) {
                    scores = [];
                }
                save();
            };
            function sort() {
                scores.sort(function(a,b){
                    if (a.score > b.score) {
                        return -1;
                    }
                    if (a.score < b.score) {
                        return 1;
                    }
                    return 0;                   
                });
                scores.splice(5);               
            };
            function save() {
                sort();
                utils.localStorage(SCOREKEY,scores);
            };
            function add(name,score) {
                scores.push({name:name,score:score});
                save();
            };
            function clear() {
                scores = [];
                save();
            };
            function get() {
                return scores;
            };
            
            return {
                init:init,
                add:add,
                clear:clear,
                scores:get
            };
        })();
        
        function init() {
            div = document.querySelector("#splash");
            bestScores.init();           
            makeMessages(div);
        };
        
        return {
            init:init,
            pause:pause,
            reset:reset,
            start:start,
            endGame:endGame,
            bounds:bounds,
            startMessage:startMessage
        };
    })();
     
    var score = (function(){
        var paused      = false,
            rect        = null,
            scoreNum    = 0,
            div         = null,
            numPigsDiv  = null,            
            effect      = null;
        
        
        function pause(p) {
            if(p !== undefined) {
                paused = p;
            }
            return paused;
        };
        function scoreDisplay(s) {
            if(s !== undefined) {
                scoreNum = s;
                div.textContent = scoreNum.toString().padLeft(3,"0");;
            }
            return scoreNum;
        };
        function pigsDisplay(pigs) {
           numPigsDiv.textContent = pigs.toString().padLeft(2,"0"); 
        };
        function addScore(num) {         
            utils.cssEffect(effect,"addScore",scoreDisplay(scoreNum+num));  
        };
        function reset() {
            scoreNum = 0;
            scoreDisplay(scoreNum);
        };
        function start() {
            
        };
        
        function init() {
           div = document.querySelector("#score");
           effect = document.querySelector("#scoreEffect");
           numPigsDiv = document.querySelector("#numPigs");
           reset();
        };
        function bounds() {
            return rect;
        };
         
        return {
             init:          init,
             pause:         pause,
             scoreDisplay:  scoreDisplay,
             pigsDisplay:   pigsDisplay,
             addScore:      addScore,
             reset:         reset,
             start:         start,
             bounds:        bounds             
         };
     })();
     
    var racket = (function(){
        var div             = null,
            paddle          = null,
            mousePoint      = null,
            dy              = 0,
            paused          = false;            

        function move() {
            if(paused) return;
            moveTo(bounds().y + dy);
        };
        function moveTo(y) {
            var r = bounds();
            var pr = utils.getRelBounds(div.parentNode);
            y = y > pr.y ? y : pr.y;
            y = (dy + r.bottom) < pr.bottom ? y : pr.bottom - r.height;
            if(y !== r.y) {
                div.style.transform = 'translateY('+y+'px)'; 
            }           
        };       
        function mouseDown(e) {
            mousePoint = {x:e.clientX,y:e.clientY};
            paddle.style.backgroundColor = "white";
        };
        function touchStart(e){
            if(e.targetTouches.length === 1){
                mouseDown(e.targetTouches[0]);
            }
        };
        function mouseUp(e) {
            mousePoint = null;
            paddle.style.backgroundColor = "gray";
        }
        function touchEnd(){
            mouseUp();
        };
        function mouseMove(e) {
            if(mousePoint !== null) {
                dy = e.clientY - mousePoint.y;
                mousePoint.y = e.clientY;
                move();
            }
        };
        function touchMove(e) {
            e.preventDefault();
            if(e.targetTouches.length > 0){
                mouseMove(e.targetTouches[0]);
            }            
        };
        function keyDown(e) {
            if(e.key === "ArrowUp" || e.key === "ArrowDown" ) {
                if(e.key === "ArrowUp") {
                    dy = -15;
                }
                else  {
                    dy = 15;
                }
                e.preventDefault();
                paddle.style.backgroundColor = "white";
                move();
                mousePoint = null;               
            }
        };

        function pause(p) {
            if(p !== undefined) {
                paused = p;
            }
            return paused;
        };
        function reset() {
     
        };
        function start() {
           paused = false; 
        };
        function bounds() { 
            return utils.getRelBounds(div);
        };
        function hit(pig) {
            var rect = bounds();
            if(pig.bottom < rect.y || pig.y > rect.bottom ) {
                return 0;
            }
            if(pig.centerY < rect.centerY) {
                if(pig.centerY < rect.y) {
                    return -2;
                }
                return -1;
            }
            if(pig.centerY > rect.bottom) {
                return 2;
            }
            return 1;            
        };
        function resize() {
            var rect = utils.getBounds(div);
            var parentRect = utils.getBounds(div.parentNode);
            moveTo(parentRect.height/2-rect.height/2);
        };
        function init() {
            if(div !== null) return;
            div = document.querySelector("#racket");
            paddle = document.querySelector("#racket div");
            div.addEventListener("mousedown",mouseDown);
            div.addEventListener("touchstart",touchStart);
            div.addEventListener("mouseup",mouseUp);
            div.addEventListener("touchend",touchEnd);
            div.addEventListener("mousemove",mouseMove);
            div.addEventListener("touchmove",touchMove);
            div.addEventListener("mouseleave",mouseUp);
            document.addEventListener("keydown",keyDown);
            document.addEventListener("keyup",mouseUp);
            resize();
        };       

        return {
           init:    init,
           pause:   pause,
           reset:   reset,
           start:   start,
           bounds:  bounds,
           hit:     hit,
           resize:  resize

        };
    })();    

    var ball = (function(){            
        var params          = {
                div:null,
                effect:null,
                pig:null,
                x:0,
                y:0,
                r:0,
                a:0,
                width:0,
                height:0,
                dx:0,
                dy:0,
                dr:0,
                demo:true,
                pigNum:-1,
                missed:false
            },
            effects       = [
                function() {
                    game.playSound("aahh");
                    utils.cssEffect(this.effect,"growspin","aahh"); 
                },
                function() { 
                    game.playSound("HeHe");
                    utils.cssEffect(this.effect,"pulse","HeHe",function(){
                          nextBall(2500);
                    });                    
                },                  
                function() {
                    game.playSound("Oink"); 
                    utils.cssEffect(this.effect,"growspin","Oink");
                },
                function() {
                    game.playSound("Boom"); 
                    utils.cssEffect(this.effect,"growspin","Boom");
                }
             
            ],
            paused          = false,
            started         = false,
            ANGMIN          = 5,
            ANGMAX          = 45;

            
            function move() {
               moveTo(params.x+params.dx, params.y+params.dy, params.r+params.dr);
            };
            function moveTo(x,y,r) {
               params.x = x;
               params.y = y; 
               params.r = r; 
               params.div.style.transform = 'translate('+x+'px,'+y+'px)';
               params.pig.style.transform = "rotate("+r+"deg)";               
            };            
            function collisions() {

                params = bounds();
                if(params.missed) {
                    return params;
                }
                var hit = game.court.hit(params);
                params.dx = params.dx * hit.x;
                params.dy = params.dy * hit.y;
                params.dr = params.dr + hit.r;
                if(params.dr !== 0) {
                    setPath();
                }
                if(hit.side !== -1) {
                    effects[hit.side].call(params);                     
                    params.missed = (hit.side === 1);
                }               
                return params;
            };           
            function changePig() {
                var pigNum = utils.getRandomInt(0,4);               
                if(pigNum === params.pigNum) {
                    changePig();
                }
                else {
                    params.pigNum = pigNum;
                    params.pig.style.backgroundPositionX = (pigNum*25)+"%";
                }              
            };
            function setPath() {
                var signX = Math.abs(params.dx)/params.dx;
                var signY = Math.abs(params.dy)/params.dy;
                if(params.dr !== 0) {
                    params.a = params.a + params.dr;
                    params.a = params.a >= ANGMIN ? params.a : ANGMIN;
                    params.a = params.a <= ANGMAX ? params.a : ANGMAX;
                };
                params.dy = speed() * Math.sin(Math.radians(params.a)) * signY;
                params.dx = speed() * Math.cos(Math.radians(params.a)) * signX;                
                 
            };
            function nextBall(timeout) {
                params.div.style.display = "none";
                paused = true;
                params.missed = false;
                var co = game.court.bounds();
                var c = utils.getRandomInt(5,co.bottom-params.height-5);
                moveTo(co.right-params.width-5,c,0);
                params.a = utils.getRandomInt(ANGMIN,ANGMAX);
                params.dx = -1;
                params.dy = c < (co.bottom-params.height)/2 ? 1 : -1;
                params.dr = 0;
                params.r = 0;         
                setPath();              
                changePig();
                if(balls() > 0) {                  
                    window.setTimeout(function(){
                        if(!started && !params.demo) return;                        
                        if(!params.demo) {
                            balls(balls()-1);
                        }
                        params.div.style.display = "block";
                        paused = false;
                    },timeout); 
                }
                else {
                  balls(-1);  
                }
            };
            function pause(p) {
                if(p !== undefined) {
                    paused = p;
                }
                return paused;
            };
            function reset() {
                paused = true;
                started = false;
                params.div.style.display = "none";
                numBalls(numBalls());             
            };
            function start() { 
                params.demo = false;
                started = true;
                balls(numBalls());
                nextBall(1500);
            };
            var speed = (function() {
                var spd = 7;              
                return function(s) {
                    if(s !== undefined) {                        
                        spd = s;                       
                        setPath();
                    }
                    return spd;
                };
            })();           
            var numBalls = (function() {
                var ballsMax = 20;
                return function(b) {
                    if(b !== undefined) {
                         ballsMax = b;
                         balls(ballsMax);
                         
                    }
                    return ballsMax;
                };
                
            })();           
            var balls = (function(){
                var ball = 0;
                return function(b) {
                    if(b !== undefined) {
                        ball = b;
                        game.setPigsDisplay(parseInt(ball)); 
                      
                    }
                    return ball;
                };
            })();            
            function doDemo() {
                if(params.demo) {
                    nextBall(1);
                }
            };
            function bounds() {
                var rect = utils.getRelBounds(params.div);
                for(var prop in params) {
                    if(!rect.hasOwnProperty(prop) ){
                       rect[prop] = params[prop];
                    }
                }
                return rect;
            };
            function resize() {
                var court = game.court.bounds();
                params = bounds(true);
                moveTo(court.centerX-params.width/2,court.centerY-params.height/2,0);
            };
            function init() {
                params.div = document.querySelector("#ball");
                params.effect = params.div.querySelector("#effect");
                params.pig = params.div.querySelector("#pig");              
                params = bounds();
                reset();
            };           
            
            return {
              init: init,
              pause: pause,
              reset: reset,
              start: start,
              bounds: bounds,
              move:move,
              resize:resize,
              collisions:collisions,
              doDemo:doDemo,
              changePig:changePig,
              numBalls:numBalls,
              speed:speed
            };
            
    })();
    
    var utils = (function() {
        var html5_audiotypes = {
            "ogg": "audio/ogg",
            "aac": "audio/aac",
            "mp3": "audio/mpeg",
            "mp4": "audio/mp4",
            "wav": "audio/wav"
        };         
        function hasClass(div,className) {
            if (div.classList) {
                return div.classList.contains(className);
            }
            else {
                return !!div.className.match(new RegExp('(\\s|^)' +
                                                    className + '(\\s|$)'));
            }           
        };
        function addClass(div,className) {
            if (div.classList) {
                div.classList.add(className);
            }
            else if (!hasClass(div, className)) {
                div.className += " " + className;
            }           
        };
        function removeClass(div,className) {
            if (div.classList) {
                div.classList.remove(className);
            }
            else if (hasClass(div, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                div.className = div.className.replace(reg, ' ');
            }             
        };
        function getRelBounds(div) {
            var r = getBounds(div);
            var p = getBounds(div.parentNode);
            return {
                x: r.x-p.x,
                left:r.x-p.x,
                y: r.y-p.y,
                top:r.y-p.y,
                width:r.width,
                height:r.height,
                right:r.x-p.x+r.width,
                bottom:r.y-p.y+r.height,
                centerX:r.x-p.x+r.width/2,
                centerY:r.y-p.y+r.height/2
            };           
        };
        function getBounds(div) {
            var rect = div.getBoundingClientRect();
            return {
                x:      rect.left,
                left:   rect.left,
                y:      rect.top,
                top:    rect.top,
                width:  rect.width,
                height: rect.height,
                right:  rect.left+rect.width,
                bottom: rect.top+rect.height
            };        
        };
        function intersectRect(r1, r2) {
            return !(r2.left > r1.right || 
               r2.right < r1.left || 
               r2.top > r1.bottom ||
               r2.bottom < r1.top);
        };       
        function cssEffect(div, className, text, callback) {
            var oldText = div.textContent;
            div.textContent = text;
            function endAnim() {
                removeClass(div, className);
                div.removeEventListener("animationend",endAnim);
                div.textContent = oldText;
                if(callback !== undefined) {
                    callback();
                }
            };
            addClass(div,className);
            div.addEventListener("animationend",endAnim);                        
        };
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        function createsoundbite(sounds){
           
            if(!Array.isArray(sounds)){
                sounds = [sounds];
            }
            var html5audio = document.createElement('audio');
            if (html5audio.canPlayType){ //check support for HTML5 audio
                for (var i=0; i<sounds.length; i++){
                    var sourceel = document.createElement('source');
                    sourceel.setAttribute('src', sounds[i]);
                    if (sounds[i].match(/\.(\w+)$/i))
                        sourceel.setAttribute('type', html5_audiotypes[RegExp.$1]);
                        html5audio.appendChild(sourceel);
                }
                try{
                    html5audio.load();
                    return html5audio;             
                }catch(e) {
                    console.error(e);
                    return null;
                }
            }
            else{
                console.error(
                    "This browser doesn't support HTML5 audio unfortunately");
                return null;
            }
        };
        function localStorage(key,obj) {
            if(key !== undefined) {
                var store = window.localStorage;
                if(obj !== undefined) {
                    store.setItem(key,JSON.stringify(obj));
                }
                else {
                    var item = store.getItem(key);
                    if(item) {
                        return JSON.parse(item);
                    }
                    return null;
                }
            }
        };
        function orientation(orient) {
            try {
                screen.orientation.lock(orient).then(
                    function(){},
                    function(){}
                ).catch(function(){});                                          
           }catch(e){};      
        };
        
        function fullScreen(enter) {
            var funcs = [
                function() {
                    try {
                        if(enter) {
                            document.documentElement.requestFullScreen();
                        }
                        else {
                            document.exitFullscreen();
                        }
                        return true;
                    }catch(e){return false;}
                },  
                function() {
                    try {
                        if(enter) {
                            document.documentElement.mozRequestFullScreen();
                        }
                        else {
                            document.mozCancelFullscreen();
                        }
                        return true;
                    }catch(e){return false;}
                },
                function() {
                    try {
                        if(enter) {
                            document.documentElement.webkitRequestFullScreen();
                        }
                        else {
                            document.webkitExitFullscreen();
                        }
                        return true;
                    }catch(e){return false;}
                },
                function() {
                    try {
                        if(enter) {
                            document.documentElement.msRequestFullScreen();
                        }
                        else {
                            document.msExitFullscreen();
                        }
                        return true;
                    }catch(e){return false;}
                } 
              
            ];
            for(var i = 0; i < funcs.length; i++) {
                if(funcs[i].apply()) {
                    break;
                }           
            }
           
        };
        function fullScreenChange(callback) {
            document.onfullscreenchange = callback;
            document.onwebkitfullscreenchange = callback;
            document.onmozfullscreenchange = callback;              
            document.onmsfullscreenchange = callback;              
        };
        
        function toggleFullScreen() {
          if (!document.fullscreenElement) {
              fullScreen(true);
          } else {
              fullScreen(false);
          }
        };

        function polyFills() {
            if(!String.prototype.padLeft) {
            String.prototype.padLeft = 
                 function(l,c) {return Array(l-this.length+1).join(c||" ")+this;};
            }
            if(!Math.radians) {
                Math.radians = function(degrees) {
                   return degrees * Math.PI / 180; 
                };
            }
            if(!Math.degrees) {
                Math.degrees = function(radians) {
                    return radians * 180 / Math.PI;
                };
            }
        };
        
        return {
            hasClass:       hasClass,
            addClass:       addClass,
            removeClass:    removeClass,
            getBounds:      getBounds,
            intersectRect:  intersectRect,
            getRelBounds:   getRelBounds,
            cssEffect:      cssEffect,
            getRandomInt:   getRandomInt,
            createsoundbite:createsoundbite,
            localStorage:   localStorage,
            orientation:    orientation,
            fullScreen:     fullScreen,
            fullScreenChange: fullScreenChange,
            toggleFullScreen:toggleFullScreen,
            polyFills:      polyFills          
        };
        
    })();
    
    var game = (function(){    
        var     started         =   false,
                startButton     =   null,
                pauseButton     =   null,
                screenButton    =   null,
                sounds          = {
                   "Oink" : {
                       file:["soundFiles/Oink.mp3","soundFiles/Oink.ogg"],                        
                       audio:null
                   },
                   "Boom" : {
                       file:["soundFiles/Clang.mp3","soundFiles/Clang.ogg"],
                       audio:null
                    },
                   "aahh" : {
                       file:["soundFiles/Groan.mp3","soundFiles/Groan.ogg"],
                       audio:null
                   },
                   "HeHe" : {
                       file:["soundFiles/Giggle.mp3","soundFiles/Giggle.ogg"],
                       audio:null
                   }
                },
                muteSounds      =   false,
                defaultBalls    =   10,
                defaultSpeed    =   7,
                gameObjs        =  [splash,score,racket,ball];
                
                
        function pauseClick() {
            var alt = pauseButton.textContent;
            pauseButton.textContent = pauseButton.getAttribute("data-alt");
            pauseButton.setAttribute("data-alt",alt);             
            if(pause()) {
                pause(false);
            }
            else {
                pause(true);              
            }
        };
        var pause = (function(){
            var paused = false;
            return function(p) {
                if(p !== undefined) {
                    paused = p;
                    gameObjs.forEach(function(obj){
                        obj.pause(paused);
                    });                     
                }                
                return paused;
            };
        }());
        
        function startClick() {
            var alt = startButton.textContent;
            startButton.textContent = startButton.getAttribute("data-alt");
            startButton.setAttribute("data-alt",alt); 
            if(pause()) {
                pauseClick(); 
            }
            if(started) {
                started = false;
                gameObjs.forEach(function(obj){
                    obj.reset();
                });
            }
            else {
                started = true;
                gameObjs.forEach(function(obj){
                    obj.start();
                });
            }            
        };
        function gameOver() {
            splash.endGame(score.scoreDisplay());
        };
        function setPigsDisplay(pigs) {
            if(pigs < 0){
                gameOver();
            }
            else {             
                score.pigsDisplay(parseInt(pigs));
            }
        };                      
        function animate(timestamp) {
            window.requestAnimationFrame(animate);
            if(!ball.pause()) {
              ball.collisions();
              ball.move();
            }           
        };
        function buttonInit() {
           startButton = document.querySelector("#button02");
           pauseButton = document.querySelector("#button01");
           screenButton = document.querySelector("#button03");           
           startButton.addEventListener("click",startClick);
           pauseButton.addEventListener("click",pauseClick);
           utils.fullScreenChange(function(){
                utils.orientation("landscape");
                resize();
           });
           
           screenButton.addEventListener("click",utils.toggleFullScreen);          
        };
        function settings() {           
           var params = document.querySelector("#settings");
           var container = document.querySelector("#splashContainer");
           container.removeChild(params);
           var pigs = params.querySelector("input[name=pigs]");
           defaultBalls = pigs.value;
           pigs.addEventListener("change", function(){
                var max = parseInt(this.getAttribute("max"));
                var min = parseInt(this.getAttribute("min")); 
                if(this.value >= min && this.value <= max) {
                    setPigsDisplay(this.value);
                    ball.numBalls(this.value);
                }
                else {
                    this.value = ball.numBalls();
                }
           });
           var speed = params.querySelector("input[name=speed]");
           defaultSpeed = speed.value;
           speed.addEventListener("change",function(){
                var max = parseInt(this.getAttribute("max"));
                var min = parseInt(this.getAttribute("min"));               
                if(this.value >= min && this.value <= max) {
                    ball.speed(this.value);
                }               
                else {
                    this.value = ball.speed();                  
                }
           });
           var sound = params.querySelector("input[name=sound]");
           muteSounds = !sound.checked;
           sound.addEventListener("change",function(){
                  mute(!this.checked);
                  if(this.checked) {
                      soundsInit();
                  }
           });
           return params;
        };
        var soundsInit = (function () {
            var init = false;
            return function() {
                if(init === true) return;
                for(var key in sounds) {
                    if(sounds.hasOwnProperty(key)){
                        sounds[key]["audio"] = 
                                utils.createsoundbite(sounds[key]["file"]);                  
                    }
                }               
                init = true; 
            };
        })();       
        function sound(name) {
            var audio = sounds[name].audio;
            if(audio) {
                audio.muted = muteSounds;
                return audio;
            }
            return null;
        };
        function playSound(name) {
            if(muteSounds) return;
            var s = sound(name);
            if(s) {
                s.play();
            }
        };
        function mute(m) {
            if(m !== undefined){
                muteSounds = m;
            }
            return muteSounds;
        };
        function resize() {
            court.resize();
            racket.resize();
            ball.resize();
        };
        var court = (function(){
            var SPIN        = 2;
            var bounds = (function() {
                var rect = null;
                function setRect() {
                    var courRect = utils.getRelBounds(document.querySelector("#corp"));
                    var r = utils.getRelBounds(document.querySelector("#droite"));
                    var width = courRect.width+r.width/2; 
                    rect = {
                       x:0,
                       y:0,
                       width:width,
                       height:courRect.height,
                       right:width,
                       bottom:courRect.height,
                       centerX: width/2,
                       centerY: courRect.height/2
                    };                   
                };
                return function(resize) {
                    if(resize === true) {
                       rect = null; 
                    }
                    if(rect === null) {
                        setRect();
                    }
                    return rect;
                };
            })();           

            function hit(pig) {
                var rect = bounds();
                var dir = {x:1,y:1,side:-1,r:0};
                
                if(pig.right >= rect.right){ 
                    if(pig.demo) {
                        ball.changePig();
                        dir.x = -1;
                        return dir;
                    }
                    var rak = racket.hit(pig);
                    if(rak !== 0) {
                        score.addScore(1);
                        dir.x = -1;
                        dir.r = rak*SPIN;
                        return dir;
                    }
                    dir.side = 1;
                    return dir;
                }                 
                if(pig.y <= rect.y) {
                    dir.y = -1;
                    dir.side = 0;
                }
                if(pig.bottom >= rect.bottom){
                    dir.y = -1;
                    dir.side = 2;
                }
                if(pig.x <= rect.x) {
                    dir.x = -1;
                    dir.side = 3;
                }              
                return dir;   
            };             
            function resize() {
                bounds(true);
            }            
            
            return {
                bounds:bounds,
                resize:resize,
                hit:hit
            };
        })();
        
        function iosvhFix() {
          
            window.addEventListener("orientationchange",function(){
                if(navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
                    var container = document.querySelector("#container");
                    utils.removeClass(container,"contnorm");
                    container.style.width = (window.innerWidth - 5)+"px";
                    container.style.height = (window.innerHeight - 7)+"px";
                    /*
                    document.documentElement.innerHTML =
                            document.documentElement.innerHTML;
                    */
                    court.resize();
                }
            }, false);
        };

        function init(){
            iosvhFix();
            utils.polyFills();
            buttonInit();
            gameObjs.forEach(function(obj){
                obj.init();
            });
            window.addEventListener("resize",resize,false);
            splash.startMessage(settings());            
            ball.numBalls(defaultBalls);
            ball.speed(defaultSpeed);
            animate();
            ball.doDemo();
        };
        
        return {
           init:init,
           court:court,
           setPigsDisplay:setPigsDisplay,
           playSound:playSound
        };
        
    })();
     
    return {
        init : game.init 
    };
    
 })();

