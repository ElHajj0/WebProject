let isToggled = false;
function toggleMenue(){
    if(isToggled){
        document.getElementById('navMenu').style.right = '-200%';
        isToggled = false;
    }else{
        document.getElementById('navMenu').style.right = '0';
        isToggled = true;
    }

    const header = document.querySelector('header');
    const navMenu = document.querySelector('#navMenu');
    const nav = document.querySelector('.navig');
    header.classList.toggle('active');
    nav.classList.toggle('active');
    navMenu.classList.toggle('active');
}

let image = [
    "img/crazysale.webp",
    "img/palestine.webp",
];

let currentindex = 0;

let nextbtn = document.getElementById("next");
let prevbtn = document.getElementById("prev");
let imageslider = document.getElementById("image-slider");


function updateimage(direction = "next") {
    let slide = direction === "next" ? "translateX(100%)" : "translateX(-100%)";
    let reset = direction === "next" ? "translateX(-100%)" : "translateX(100%)";

    imageslider.style.transform = slide;

    setTimeout(() => {
        imageslider.src = image[currentindex];

        imageslider.style.transition = "none";
        imageslider.style.transform = reset;

        setTimeout(() => {
            imageslider.style.transition = "transform 0.2s ease"; 
            imageslider.style.transform = "translateX(0)";
        });
    }, 500);
}

prevbtn.addEventListener("click", () => {
    currentindex = (currentindex > 0) ? currentindex - 1 : image.length - 1;
    updateimage("prev");
});

nextbtn.addEventListener("click", () => {
    currentindex = (currentindex < image.length - 1) ? currentindex + 1 : 0;
    updateimage("next");
});

setInterval(() => {
    currentindex = (currentindex < image.length - 1) ? currentindex + 1 : 0;
    updateimage("next");
}, 3000);

updateimage();

