
function displayElement(element, alternator){
	if (alternator === true){
		element.display = '';
	} else if (alternator === false){
		element.display = 'None';
	}
}

// just below the ‘Job Role’ `select` element, create a text input
// element, set its `name` attribute to “job_role_other”, set its `placeholder` attribute to
// “Your Job Role”, and give it an `id` attribute of “other-title”

const otherInput = document.createElement("INPUT")
otherInput.name = "job_role_other";
otherInput.placeholder = "Your Job Role";
otherInput.id = "other-title";
otherInput.style.display = 'None';

const firstFieldSet = document.querySelector(".container form")[0]
firstFieldSet.appendChild(otherInput);

// In your JavaScript file, target the ‘Other’ input field, and hide it initially, so that it will
// display if JavaScript is disabled, but be hidden initially with JS.

const titleOptions= document.querySelector('#title');
titleOptions.addEventListener('change', (e)=>{
	if (e.target.value === 'other'){
		otherInput.style.display = '';
		displayElement(otherInput, true);
	} else {
		displayElement(otherInput, false);
	}
})


/***

Until a theme is selected from the “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.


For the T-Shirt "Color" menu, after a user selects a theme, only display the color options that match the design selected in the "Design" menu.

	If the user selects "Theme - JS Puns" then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."

	If the user selects "Theme - I ♥ JS" then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."

When a new theme is selected from the "Design" menu, both the "Color" field and drop down menu is updated.

***/

const shirtDesign = document.getElementById('design');
const shirtColorSelect = document.getElementById('color');
const shirtColorLabel = shirtColorSelect.previousElementSibling
const shirtColorOptions = shirtColorSelect.getElementsByTagName("OPTION");

for (let option of shirtColorOptions) {
	if (option.value !== 'default'){
		displayElement(option, false);
	}
}
shirtColorSelect.style.display = 'None'
shirtColorLabel.style.display = 'None'


shirtDesign.addEventListener('change', (e)=>{
	
	const themeSearchDictionary = {"js puns":"JS Puns", "heart js": "I ♥ JS"}
	const selectedTheme = themeSearchDictionary[e.target.value]; 
	let themeList = []

	for (o = 0; o < shirtColorOptions.length; o++){
		const currentOption = shirtColorOptions[o]
		if (currentOption.text.search(selectedTheme) > -1 && selectedTheme !== undefined) {
			currentOption.style.display = '';
			themeList.push(currentOption)
		}
		else {
			currentOption.style.display = 'None';
		}
	}


	//When the 'Select Theme' is chosen, hide the colors
	//When a theme is select, make the first color of that theme the default color
	if (themeList.length === 0) {
		shirtColorSelect.style.display = 'None'
		shirtColorLabel.style.display = 'None'

	} else {
		shirtColorSelect.style.display = ''
		shirtColorLabel.style.display = ''
		shirtColorSelect.value = themeList[0].value
	}

})


// Some events are at the same day and time as others. If the user selects a workshop, 
// don't allow selection of a workshop at the same day and time -- 
// you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.

// When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.

// As a user selects activities, a running total should display below the list of checkboxes. 
// For example, if the user selects "Main Conference", then Total: $200 should appear. If they add 1 workshop, the total should change to Total: $300.

const activitiesField = document.querySelector('.activities')
const activitiesInputs = activitiesField.querySelectorAll('input')

activitiesField.addEventListener('change', (e)=>{
	const eventChecked = e.target.checked
	const eventDT = e.target.getAttribute('data-day-and-time');
	const eventName = e.target.name
	let totalCostSum = 0

	for (let a of activitiesInputs){
		//disabling conflicting time slots
		const workshopDT = a.getAttribute('data-day-and-time')
		if (eventDT === workshopDT && eventChecked === true && a.name !== eventName){
			a.disabled = true;
		} 
		else if (eventDT === workshopDT && eventChecked === false) {
			a.disabled = false;
		}

		//adding the cost of the checkedboxes
		if (a.checked){
			totalCostSum += parseInt(a.getAttribute('data-cost'))
		}

	}

	const currentTotalCostElement = activitiesField.getElementsByTagName("P");
	if (currentTotalCostElement[0] !== undefined) {
		currentTotalCostElement[0].remove()
	}

	const totalCostElement = document.createElement("P")
	if (totalCostSum > 0) {
		totalCostElement.textContent = "Total Cost: $" + totalCostSum
		activitiesField.appendChild(totalCostElement)
	}
})


// Display payment sections based on the payment option chosen in the select menu.
// The "Credit Card" payment option should be selected by default. Display the #credit-card div, 
//and hide the "PayPal" and "Bitcoin" information. Payment option in the select menu should match the payment option displayed on the page.
// When a user selects the "PayPal" payment option, the PayPal information should display, and the credit card and “Bitcoin” information should be hidden.
// When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.
// NOTE: The user should not be able to select the "Select Payment Method" option from the payment select menu, 
//because the user should not be able to submit the form without a chosen payment option.

const paymentSelect = document.getElementById('payment')
const paymentOptions = paymentSelect.getElementsByTagName("OPTION")

paymentOptions[0].remove()
document.getElementById('paypal').style.display = 'None'
document.getElementById('bitcoin').style.display = 'None'

paymentSelect.addEventListener('change', (e)=>{
	const selectedValue = paymentSelect.value
	for (let p of paymentOptions){

		if (p.value !== "select method"){
			const alterElement = document.getElementById(p.value)
			if(p.value !== selectedValue){
				alterElement.style.display = 'None'

			} 
			else if (p.value === selectedValue) {
				alterElement.style.display = ''
			}
		}
		
	}	
	
})

// Form validation
// Project Warm Up: Creating custom form input validation can be tricky, as it can have several moving parts. For some helpful practice, check out the project Warm Up Form Input Validation.
// If any of the following validation errors exist, prevent the user from submitting the form:
// User must select at least one checkbox under the "Register for Activities" section of the form.
// NOTE: Don't rely on the built in HTML5 validation by adding the required attribute to your DOM elements. You need to actually create your own custom validation checks and error messages.
// NOTE: Avoid using snippets or plugins for this project. To get the most out of the experience, you should be writing all of your own code for your own custom validation.
// NOTE: Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.

// Name field can't be blank.

// Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, just that it's formatted like one: dave@teamtreehouse.com for example.

// If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, a Zip Code, and a 3 number CVV value before the form can be submitted.
// Credit Card field should only accept a number between 13 and 16 digits.
// The Zip Code field should accept a 5-digit number.
// The CVV should only accept a number that is exactly 3 digits long.


// Form validation messages
// Provide some kind of indication when there’s a validation error. The field’s borders could turn red, for example, or even better for the user would be if a red text message appeared near the field.
// The following fields should have some obvious form of an error indication:
// Name field
// Email field
// Register for Activities checkboxes (at least one must be selected)
// Credit Card number (Only if Credit Card payment method is selected)
// Zip Code (Only if Credit Card payment method is selected)
// CVV (Only if Credit Card payment method is selected)

const errorDictionary = {
	"name": {
		"regex": /^[A-Za-z ]+$/,
		"errorMessage": "Name should be letters and spaces only."
	},
	"mail": {
		"regex": /^[^@]+@[^@.]+\.[a-z]+$/i,
		"errorMessage":"Need a valid email."
	},
	"cc-num": {
		"regex": /^\d{13,16}$/,
		"errorMessage":"Credit Card must be between 13 and 16 characters"
	},
	"zip": {
		"regex": /^\d{5}$/,
		"errorMessage":"Zip code must be five digits."
	},
	"cvv": {
		"regex": /^\d{3}$/,
		"errorMessage":"CVV must be only 3 numbers."
	}
}


function validateElement(elementId){
	const element = document.getElementById(elementId)
	const elementValue = element.value; 
	const regex = errorDictionary[elementId].regex
	const validation = regex.test(element.value)
	const errorMessage = errorDictionary[elementId].errorMessage

	if(validation !== true && element.nextSibling.className !== "error-message"){
		element.style.borderColor = "red";
		element.insertAdjacentHTML('afterend', '<span class="error-message">' + errorMessage + '</span>')
		element.style.marginBottom = "0em";
	}else if(validation===true && element.nextSibling.className === "error-message") {
		element.style.borderColor=null;
		element.nextSibling.remove()
		element.style.marginBottom = "1.125em";
	}
}

function loadValidationListen(errorDictionary){
	for (let id in errorDictionary){
		console.log(id)
		document.getElementById(id).addEventListener('input', ()=>{validateElement(id)})
	}
}

loadValidationListen(errorDictionary)


document.getElementsByTagName("BUTTON")[0].addEventListener('click', (e)=>{
	e.preventDefault()
	for (let id in errorDictionary){
		validateElement(id)
	}
})



// Note: Error messages or indications should not be visible by default. They should only show upon submission, or after some user interaction.

// Note: Avoid use alerts for your validation messages.

// Note: If a user tries to submit an empty form, there should be an error indication or message displayed for the name field, the email field, the activity section, and the credit card fields if credit card is the selected payment method.