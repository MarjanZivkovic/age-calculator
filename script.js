const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
const inputDay = document.querySelector('#day');
const inputMonth = document.querySelector('#month');
const inputYear = document.querySelector('#year');
const outputYears = document.querySelector('.age-years');
const outputMonths = document.querySelector('.age-months');
const outputDays = document.querySelector('.age-days');

let enteredDay;
let enteredMonth;
let enteredYear;
let dayIsValid = false;
let monthIsValid = false;
let yearIsValid = false;

const currentDate = new Date();

// helper functions
function addIvalidClass(el, msg){
    el.nextElementSibling.textContent = msg;
    el.classList.add('invalid');
    el.previousElementSibling.classList.add('invalid');
}

function removeIvalidClass(el){
    el.nextElementSibling.textContent = '';
    el.classList.remove('invalid');
    el.previousElementSibling.classList.remove('invalid');
}

// days validation
function validateDays(){
    if ( inputDay.value === '' ){
        addIvalidClass( inputDay, 'This field is required' );
        dayIsValid = false;
    } else if ( +inputDay.value >= 1 && +inputDay.value <= 31) {
        removeIvalidClass( inputDay );
        enteredDay = parseInt(inputDay.value);
        dayIsValid = true;
    } else {
        addIvalidClass( inputDay, 'Must be a valid day' );
        dayIsValid = false;
    }
}

// months validation
function validateMonths(){
    if ( inputMonth.value === '' ){
        addIvalidClass( inputMonth, 'This field is required' );
        monthIsValid = false;
    } else if ( +inputMonth.value >= 1 && +inputMonth.value <= 12) {
        removeIvalidClass( inputMonth );
        enteredMonth = parseInt((inputMonth.value),10);
        monthIsValid = true;
    } else {
        addIvalidClass( inputMonth, 'Must be a valid month' );
        monthIsValid = false;
    }
}

// years validation
function validateYear(){
    if ( inputYear.value === '' ){
        addIvalidClass( inputYear, 'This field is required' );
        yearIsValid = false;
    } else if ( +inputYear.value > currentDate.getFullYear() ){
        addIvalidClass( inputYear, 'Must be in the past' );
        yearIsValid = false;
    } else if ( +inputYear.value <= currentDate.getFullYear() ){
        removeIvalidClass( inputYear );
        enteredYear = parseInt(inputYear.value);
        yearIsValid = true;
    }  else {
        addIvalidClass( inputYear, 'Must be a valid year' );
        yearIsValid = false;
    }
}

// whole date validation function
function isDateValid(day, month, year) {
    let date = new Date(year, month - 1, day);
  
    if ( date.getFullYear() !== year || date.getMonth() + 1 !== month ||
      date.getDate() !== day || (month === 2 && day === 29 && !isLeapYear(year))
    ){
        return false;
    }
    return true;
}

// function to checking if it is a leap year
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// calculating age
function calculateAge( year, month, day ){
    let date = new Date(year, month - 1, day);
    let difference =  currentDate.getTime() - date.getTime() ;
    // getting years, months, and days in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30.4375; //aproximately
    const oneYear = oneMonth * 12;

    let passedYears = Math.floor(difference / oneYear);
    difference -= passedYears * oneYear;
    let passedMonths = Math.floor(difference / oneMonth);
    difference -= passedMonths * oneMonth;
    let passedDays = Math.floor(difference / oneDay);

    // calling animateNumbers function for each field to put passed years/months/days in the DOM
    animateNumbers( outputYears, passedYears );
    animateNumbers( outputMonths, passedMonths );
    animateNumbers( outputDays, passedDays );
}

// animate numbers function
function animateNumbers(el, target){
    let increment = 0;

    function updateNumber(){
        el.textContent = increment;
        if ( increment < target ){
            increment++;
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// on blur listeners
inputDay.addEventListener('blur', validateDays);
inputMonth.addEventListener('blur', validateMonths);
inputYear.addEventListener('blur', validateYear);

// form submit handler
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    // validate each field
    validateDays();
    validateMonths();
    validateYear();
    // validating whole date and calling function to calculate age
    if( dayIsValid && monthIsValid && yearIsValid ){  
        if(isDateValid( enteredDay, enteredMonth, enteredYear )){
            calculateAge( enteredYear, enteredMonth, enteredDay );
            inputs.forEach( input =>{ removeIvalidClass( input )})
        } else {
            inputs.forEach(input =>{ addIvalidClass( input, '' )});
            addIvalidClass( inputDay, 'Must be a valid date' );
        } 
    }
});