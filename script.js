// theme switcher
const themeSwitcher = document.getElementById('theme-switch');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
var theme = localStorage.getItem('theme') || 'light';

function setTheme(t) {
    if (t == 'light') {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        document.body.classList.add('dark');
    } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        document.body.classList.remove('dark');
    }
}

setTheme(theme);

themeSwitcher.addEventListener('click', () => {
    const nextTheme = (theme == 'light')? 'dark' : 'light';
    theme = nextTheme;
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
});




// meal plan vars
const blueUsedLabel = document.getElementById('blue:used-swipes');
const blueRemainingLabel = document.getElementById('blue:remaining-swipes');
const goldUsedLabel = document.getElementById('gold:used-swipes');
const goldRemainingLabel = document.getElementById('gold:remaining-swipes');
const mealPlanMaxData = {blue: 12, gold: 10};
var mealPlan = localStorage.getItem('mealplan') || 'blue';
var mealMax = mealPlanMaxData[mealPlan];


// switch notes/plans
const notes = document.getElementsByClassName('note');
var disabledNote = document.querySelector('.note.disabled');
var activeNote = document.querySelector('.note.active');

function switchPlans() {
    // swap plans
    mealPlan = disabledNote.id.substring(0, 4);
    localStorage.setItem('mealplan', mealPlan);
    mealMax = mealPlanMaxData[mealPlan];
    if (mealMax < numDots)
        clearDots();

    // swap classes
    disabledNote.classList.replace('disabled', 'active');
    activeNote.classList.replace('active', 'disabled');

    // swap names
    const l = activeNote;
    activeNote = disabledNote;
    disabledNote = l;

    updateLabels();
}

for (let i = 0; i < notes.length; i++) {
    const note = notes.item(i);
    note.addEventListener('click', () => {
        // skip if not active
        if (note !== activeNote)
            return;

        // swap plans
        switchPlans();
    });
}

if (mealPlan == 'gold')
    switchPlans();



// add dots
const dayButtons = document.getElementsByClassName('day');
const dots = getCookie('dots') ? JSON.parse(getCookie('dots')) : {mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0};
var numDots = parseInt(getCookie('numDots')) || 0;

if (dots) {
    for (let d in dots) {
        const dotsContainer = document.querySelector(`.dots-${d}`);
        for (let i = 0; i < dots[d]; i++) {
            dotsContainer.appendChild(makeDot(d));
        }
    }
    updateLabels();
}

function makeDot(day) {
    // create svg
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '35');
    svg.setAttribute('height', '35');
    svg.setAttribute('viewBox', '0 0 35 35');
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '17.5');
    circle.setAttribute('cy', '17.5');
    circle.setAttribute('r', '17.5');
    svg.appendChild(circle);

    // add individual remove functionality
    svg.addEventListener('click', () => {
        svg.remove();
        numDots--;
        dots[day]--;
        updateDotsCookies();
        updateLabels();
    })

    return svg;
}

// day button functionality: add dot
for (let i = 0; i < dayButtons.length; i++) {
    const btn = dayButtons.item(i);
    btn.addEventListener('click', () => {
        const day = btn.innerHTML.toLowerCase();
        const dotsContainer = document.querySelector(`.dots-${day}`);
        if (dots[day] >= 5 || numDots >= mealMax) {
            return;
        } else {
            numDots++;
            dots[day]++;
            dotsContainer.appendChild(makeDot(day));
            updateDotsCookies();
            updateLabels();
        }
    });
}



// clear dots
function clearDots() {
    // remove data
    numDots = 0;
    for (let d in dots) {
        dots[d] = 0;
    }

    // clear visual svgs
    const dotsContainers = document.querySelectorAll('.dots');
    for (let i = 0; i < dotsContainers.length; i++) {
        dotsContainers.item(i).innerHTML = '';
    }

    // update labels and cookies
    updateDotsCookies();
    updateLabels();
}

// add functionality to button
const trashIcon = document.getElementById('trash');
trashIcon.addEventListener('click', clearDots);



// update meal plan labels
function updateLabels() {
    if (mealPlan == 'blue') {
        blueUsedLabel.innerHTML = numDots;
        blueRemainingLabel.innerHTML = mealMax - numDots;
    } else {
        goldUsedLabel.innerHTML = numDots;
        goldRemainingLabel.innerHTML = mealMax - numDots;
    }
}


// store dots in cookies
function updateDotsCookies() {
    setCookie('dots', JSON.stringify(dots));
    setCookie('numDots', numDots);
}


// set cookie (from w3schools)
function setCookie(key, value, exdays=30) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
}

// read cookie (from w3schools)
function getCookie(key) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieList = decodedCookie.split(';');
    for (let i = 0; i < cookieList.length; i++) {
        let c = cookieList[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(`${key}=`) == 0)
            return c.substring(key.length+1, c.length);
    }
    return "";
}


