// changing canvas height and width


const canvasId = document.getElementById("myCanvas");
let parent;
if(canvasId){
  parent = canvasId.parentElement;

  function resizeCanvas() {
    // Set canvas width and height to match the parent dimensions
    canvasId.width = parent.offsetWidth;
    canvasId.height = parent.offsetHeight;

    // Optional: Redraw content after resizing
    const ctx = canvasId.getContext("2d");
    ctx.clearRect(0, 0, canvasId.width, canvasId.height);
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvasId.width, canvasId.height);
}

// Resize canvas initially
resizeCanvas();
}



// Resize canvas on window resize
window.addEventListener("resize", resizeCanvas);





/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 








// scratch and win


console.log('ppppppppppppppppppp');

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const scratchCardCover = document.querySelector('.scratch-card-cover');
const scratchCardCanvasRender = document.querySelector('.scratch-card-canvas-render');
const scratchCardCoverContainer = document.querySelector('.scratch-card-cover-container');
const scratchCardText = document.querySelector('.scratch-card-text');
const scratchCardImage = document.querySelector('.scratch-lauching-soon');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let isPointerDown = false;
let positionX;
let positionY;
let clearDetectionTimeout = null;

const devicePixelRatio = window.devicePixelRatio || 1;

const canvasWidth = canvas.offsetWidth * devicePixelRatio;
const canvasHeight = canvas.offsetHeight * devicePixelRatio;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

context.scale(devicePixelRatio, devicePixelRatio);



if (isSafari) {
  canvas.classList.add('hidden');
}

canvas.addEventListener('pointerdown', (e) => {
  console.log('hahhahahaha');
  
  scratchCardCover.classList.remove('shine');
  ({ x: positionX, y: positionY } = getPosition(e));
  clearTimeout(clearDetectionTimeout);
  
  canvas.addEventListener('pointermove', plot);
  
  window.addEventListener('pointerup', (e) => {
    canvas.removeEventListener('pointermove', plot);
    clearDetectionTimeout = setTimeout(() => {
      checkBlackFillPercentage();
    }, 500);
  }, { once: true });
});

const checkBlackFillPercentage = () => {
   
  const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  const pixelData = imageData.data;

  let blackPixelCount = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    const red = pixelData[i];
    const green = pixelData[i + 1];
    const blue = pixelData[i + 2];
    const alpha = pixelData[i + 3];

    if (red === 0 && green === 0 && blue === 0 && alpha === 255) {
      blackPixelCount++;
    }
  }

  const blackFillPercentage = blackPixelCount * 100 / (canvasWidth * canvasHeight);
 
  if (blackFillPercentage >= 45) {
    scratchCardCoverContainer.classList.add('clear');
    confetti({
      particleCount: 100,
      spread: 90,
      origin: {
         y: (scratchCardText.getBoundingClientRect().bottom + 60) / window.innerHeight,
      },
    });
    // handlePopup()
    // scratchCardText.textContent = '🎉 You got a $50 Apple gift card!';
    scratchCardImage.style.display = 'block'
    scratchCardImage.classList.add('animate');

    scratchCardCoverContainer.addEventListener('transitionend', () => {
      scratchCardCoverContainer.classList.add('hidden');
    }, { once: true });
  }
}

const getPosition = ({ clientX, clientY }) => {
  const { left, top } = canvas.getBoundingClientRect();
  return {
    x: clientX - left,
    y: clientY - top,
  };
}

const plotLine = (context, x1, y1, x2, y2) => {
  var diffX = Math.abs(x2 - x1);
  var diffY = Math.abs(y2 - y1);
  var dist = Math.sqrt(diffX * diffX + diffY * diffY);
  var step = dist / 50;
  var i = 0;
  var t;
  var x;
  var y;

  while (i < dist) {
    t = Math.min(1, i / dist);

    x = x1 + (x2 - x1) * t;
    y = y1 + (y2 - y1) * t;

    context.beginPath();
    context.arc(x, y, 16, 0, Math.PI * 2);
    context.fill();

    i += step;
  }
}

const setImageFromCanvas = () => {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    previousUrl = scratchCardCanvasRender.src;
    scratchCardCanvasRender.src = url;
    if (!previousUrl) {
      scratchCardCanvasRender.classList.remove('hidden');
    } else {
      URL.revokeObjectURL(previousUrl);
    }
    previousUrl = url;
  });
}

let setImageTimeout = null;

const plot = (e) => {
  const { x, y } = getPosition(e);
  plotLine(context, positionX, positionY, x, y);
  positionX = x;
  positionY = y;
  if (isSafari) {
    clearTimeout(setImageTimeout);

    setImageTimeout = setTimeout(() => {
      setImageFromCanvas();
    }, 5);
  }
};








function closePopupScratch() {

  const popup = document.getElementById('scratch-lauching-soon');
  popup.style.display = 'none';
  window.location.reload()
}


function showColorCode(){
  console.log('haiiii');
  
  const colorcode = document.getElementById('colorcode-choose')
  colorcode.style.display = 'block'
}


function showLaunchingSoon(color){
const colorcode = document.getElementById('colorcode-choose')
// const colorId = document.querySelector('');
// const color = document.getElementById
const scratchCardImage = document.getElementById('scratchcard-lauching-soon');
const scratchCard = document.getElementById(`scratch-card-popup-${color}`)


  colorcode.style.display = 'none'

  console.log('haiii');
  
  scratchCardImage.style.display = 'block'
  scratchCard.style.display = 'block'


  confetti({
    particleCount: 100,
    spread: 90,
    origin: {
       y: (scratchCard.getBoundingClientRect().bottom + 60) / window.innerHeight,
    },
  });


}