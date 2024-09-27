var text = "Haruki";
var index = 0;
var textElement = document.getElementById("autoText");
var cursor = document.getElementById("autoCursor");
var interval;

function type () {
    var t = text.substring(0, index + 1);

    textElement.innerHTML = t;
    index++;

    if (t == text) {
        clearInterval(interval);
        interval = setInterval(del, 300);
    }
}

function del () {
    var t = text.substring(0, index - 1);

    textElement.innerHTML = t;
    index--;

    if (t == "") {
        clearInterval(interval);
        index = 0
        interval = setInterval(type, 100);
    }
}

interval = setInterval(type, 300);


let skillPers = document.querySelectorAll('.skill-per');

document.addEventListener('scroll', checkScroll)
document.addEventListener('DOMContentLoaded', checkScroll)

function checkScroll(){
    let skills = document.querySelector("#skills")
    if(window.scrollY + window.innerHeight - 150 > skills.offsetTop){
        skillPers.forEach(function(skill){
            skill.classList.add('slide')
        })
    }
}
