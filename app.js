const fetchedPicture = document.querySelector('#pictureDisplay');
const fetchedTitle = document.querySelector('#titleDisplay');
const fetchedText = document.querySelector('#textDisplay');

const currentYear = new Date().getFullYear();
const startYear = 1995;

const getPictureOfTheDay = async (date) => {
    try {
        const apiKey = 'nhgk2qRa0a1Zo7bBAoNzCXESrQTD9X5b601bKrzu';
        const url = date
        ? `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
        : `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
        const response = await axios.get(url);
        updateDOM(response);
    } catch (error) {
        updateDOM();
        const titleElement = document.querySelector('#titleDisplay');
        titleElement.textContent = "Sorry, couldn't find a picture.";
    };
};

const updateDOM = (response) => {
    fetchedPicture.innerHTML = '';
    fetchedTitle.textContent = '';
    fetchedText.textContent = '';
    addPicture(response);
    addTitle(response);
    addText(response);
};

const addTitle = async (response) => {
    fetchedTitle.textContent = response.data.title;
};

const addText = async (response) => {
    fetchedText.textContent = response.data.explanation;
};

const addPicture = async (response) => {
    const picture = document.querySelector('#pictureDisplay');
    const img = document.createElement('img');
    img.src = response.data.url;
    picture.append(img);
    const copyright = document.createElement('textarea');
    copyright.value = response.data.copyright;
    picture.append(`Author: ${response.data.copyright}`);
};

getPictureOfTheDay();

// Get picture by custom date:

const yearFromDropdown = document.querySelector('#years');
const monthFromDropdown = document.querySelector('#months');
const dayFromDropdown = document.querySelector('#days');
const fetchButton = document.querySelector('#fetchByDateButton');

monthFromDropdown.disabled = true;
dayFromDropdown.disabled = true;

fetchButton.addEventListener('click', fetchDataByDate);

yearFromDropdown.addEventListener('change', handleYearChange);
yearFromDropdown.addEventListener ('change', function() {
    handleYearChange();
    setDefaultDayOption();
    setDefaultDayOption();
});

function handleYearChange(){
    const selectedYear = parseInt(yearFromDropdown.value);
    populateMonths(selectedYear);
    monthFromDropdown.disabled = false;
    dayFromDropdown.disabled = true;
}

monthFromDropdown.addEventListener('change', function(){
    const selectedMonth = parseInt(monthFromDropdown.value);
    dayFromDropdown.disabled = false;
    updateDays();
});

function populateYears() {
    const defaultOption = document.createElement('option');
    defaultOption.value = '----';
    defaultOption.textContent = '----';
    yearFromDropdown.appendChild(defaultOption);

    for (let year = currentYear; year >= startYear; year--) {
        const dropdownOption = document.createElement('option');
        dropdownOption.value = year;
        dropdownOption.textContent = year;
        yearFromDropdown.appendChild(dropdownOption);
    }

    yearFromDropdown.value = '----'
    defaultOption.disabled = true;
};

function populateMonths(yearFromDropdown) {
    monthFromDropdown.innerHTML = '';
    addDefaultDropdownOption(monthFromDropdown);

    const currentMonth = (yearFromDropdown === currentYear)
    ? new Date().getMonth() + 1 : 1;

    let startMonth = (yearFromDropdown === startYear) 
    ? 6 : 1;

    let endMonth = (yearFromDropdown === currentYear)
    ? currentMonth : 12;

    for (let month = startMonth; month <= endMonth; month++) {
        const dropdownOption = document.createElement('option');
        dropdownOption.value = month;
        dropdownOption.textContent = month;
        monthFromDropdown.appendChild(dropdownOption);
    }
};

function setDefaultMonthOption() {
    monthFromDropdown.value = '--';
    monthFromDropdown.querySelector('option[value="--"]').disabled = true;
};

monthFromDropdown.addEventListener('change', function () {
    const selectedMonth = parseInt(monthFromDropdown.value);
    dayFromDropdown.disabled = false;
    updateDays();
});

function setDefaultDayOption() {
    dayFromDropdown.value = '--';
    dayFromDropdown.options[0].disabled = true;
};

function updateDays() {
    const selectedYear = parseInt(yearFromDropdown.value);
    const selectedMonth = parseInt(monthFromDropdown.value);
    populateDays(selectedYear, selectedMonth);
};

function populateDays(year, month) {
    dayFromDropdown.innerHTML = '';
    addDefaultDropdownOption(dayFromDropdown);
        // For 1995, start from 16th of june
    const daysInMonth = (year === 1995 && month === 6)
    ? 30 - 15
        // For other years, start from 1
    : new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dropdownOption = document.createElement('option');
        dropdownOption.value = (year === 1995 && month === 6) 
        ? day + 15
        : day;
        dropdownOption.textContent = dropdownOption.value;
        dayFromDropdown.appendChild(dropdownOption);
    }

    setDefaultDayOption();
}

function addDefaultDropdownOption(dropdown){
    const defaultOption = document.createElement('option');
    defaultOption.value = '--';
    defaultOption.textContent = '--';
    dropdown.appendChild(defaultOption);
}

function fetchDataByDate() {
    const selectedYear = parseInt(yearFromDropdown.value);
    const selectedMonth = parseInt(monthFromDropdown.value);
    const selectedDay = parseInt(dayFromDropdown.value);
    
     if (!selectedYear || !selectedMonth || !selectedDay) {
        if(!selectedYear){
            yearFromDropdown.classList.add('notSelected');
        }
        if(!selectedMonth){
            monthFromDropdown.classList.add('notSelected');
        }
        if(!selectedDay){
            dayFromDropdown.classList.add('notSelected');
        }
        return;
    };

    const selectedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`
    getPictureOfTheDay(selectedDate);
    resetDropdowns();
};

function resetDropdowns() {
    yearFromDropdown.value = '----';
    monthFromDropdown.value = '--';
    dayFromDropdown.value = '--';

    dayFromDropdown.classList.remove('notSelected');
    monthFromDropdown.classList.remove('notSelected');
    yearFromDropdown.classList.remove('notSelected');

    monthFromDropdown.disabled = true;
    dayFromDropdown.disabled = true;
    setDefaultMonthOption();
    setDefaultDayOption();
};

populateYears();
populateMonths(currentYear);
setDefaultMonthOption();
populateDays(new Date().getFullYear(), new Date().getMonth());