/*** HELPER FUNCTIONS ***/

//enables toggling of element's display style between '' and 'None'
function displayElement(element, alternator){
	
	if (alternator === true){
		element.style.display = '';
	} else if (alternator === false){
		element.style.display = 'None';
	}
}

//allows a list to be fed into displayElement
function listDisplay(list, alternator){
	for (let e of list){
		displayElement(e, alternator)
	}
}


/*** Job Role Event Activity***/

//code fo dynamically adding the job role input field if that is later required. 
//I added it to index.html for now so that the field would appear absent the javascript running



// const otherInput = document.createElement("INPUT")
// otherInput.name = "job_role_other";
// otherInput.placeholder = "Your Job Role";
// otherInput.id = "other-title";
// otherInput.style.display = 'None';

// const firstFieldSet = document.querySelector(".container form")[0]
// firstFieldSet.appendChild(otherInput);


//listen for 'Other' to be selected in the title field and then display the input field
const otherInput = document.getElementById('other-title')
otherInput.style.display = 'None';

const titleOptions= document.querySelector('#title');
titleOptions.addEventListener('change', (e)=>{
	if (e.target.value === 'other'){
		otherInput.style.display = '';
		displayElement(otherInput, true);
	} else {
		displayElement(otherInput, false);
	}
})


/*** T-Shirt Event Activity***/

//select elements related to selecting theme and color of the shirt
const shirtDesign = document.getElementById('design');
const shirtColorSelect = document.getElementById('color');
const shirtColorLabel = shirtColorSelect.previousElementSibling
const shirtColorOptions = shirtColorSelect.getElementsByTagName("OPTION");

for (let option of shirtColorOptions) {
	if (option.value !== 'default'){
		displayElement(option, false);
	}
}

//initially hide the color selector until a theme has been selected
listDisplay([shirtColorSelect, shirtColorLabel], false);

shirtDesign.addEventListener('change', (e)=>{
	
	const themeSearchDictionary = 
	{
		"js puns":"JS Puns", 
		"heart js": "I ♥ JS"
	}

	const selectedTheme = themeSearchDictionary[e.target.value]; 
	let themeList = []

	//this is going through the list of available colors, testing whether the match the theme using the .search() function,
	//and then hiding all the color elements that don't match the theme
	for (o = 0; o < shirtColorOptions.length; o++){
		const currentOption = shirtColorOptions[o]
		if (currentOption.text.search(selectedTheme) > -1 && selectedTheme !== undefined) {
			displayElement(currentOption, true);
			themeList.push(currentOption)
		} else {
			displayElement(currentOption, false);
		}
	}

	//this ensures the color element will remain hidden if a theme isn't selected and it will makes the default selection the 
	//first color that matches the theme

	if (themeList.length === 0) {
		listDisplay([shirtColorSelect, shirtColorLabel], false);
	} else {
		listDisplay([shirtColorSelect, shirtColorLabel], true);
		shirtColorSelect.value = themeList[0].value
	}
});


/*** Register for Activities Event Activity***/

//global variables for selecting activities
const activitiesField = document.querySelector('.activities')
const activitiesInputs = activitiesField.querySelectorAll('input')
const activitiesLabels = activitiesField.getElementsByTagName('LABEL')
const lastLabelOfActivities = activitiesLabels[activitiesLabels.length-1]


//listening for any of the checkboxes within activities to be changed
activitiesField.addEventListener('change', (e)=>{
	const eventChecked = e.target.checked
	const eventDT = e.target.getAttribute('data-day-and-time');
	const eventName = e.target.name
	let totalCostSum = 0

	//iterating through all of the checkboxes to take action depending on whether or not they are checked
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

			//function that offsets the red text color chanages that would happen if there's an error when clicking 'Register'
			for (let a of activitiesField.getElementsByTagName('LABEL')){
				a.style.color = "#000";
			}

			if (lastLabelOfActivities.nextElementSibling){
				if(lastLabelOfActivities.nextElementSibling.className === "error-message"){
					lastLabelOfActivities.nextElementSibling.remove()
				}
			}
		}

	}

	//cleaning up previous totals that may have been added
	const currentTotalCostElement = activitiesField.getElementsByTagName("P");
	if (currentTotalCostElement[0] !== undefined) {
		currentTotalCostElement[0].remove()
	}

	//adding a paragraph element to show the total cost
	const totalCostElement = document.createElement("P")
	if (totalCostSum > 0) {
		totalCostElement.textContent = "Total Cost: $" + totalCostSum
		activitiesField.appendChild(totalCostElement)
	}
})


/*** Payment Event Activity***/

//global variables for selecting payment mtehods
const paymentSelect = document.getElementById('payment')
const paymentOptions = paymentSelect.getElementsByTagName("OPTION")

//remove 'select method' from payment options
//'select method' should only show it the Javascript isn't running
paymentOptions[0].remove()
listDisplay([document.getElementById('paypal'), document.getElementById('bitcoin')], false);

//only display the payment information for the selected payment method
paymentSelect.addEventListener('change', (e)=>{
	const selectedValue = paymentSelect.value
	for (let p of paymentOptions){

		if (p.value !== "select method"){
			const alterElement = document.getElementById(p.value)
			if(p.value !== selectedValue){
				displayElement(alterElement, false);

			} 
			else if (p.value === selectedValue) {
				displayElement(alterElement, true);
			}
		}
		
	}	
	
})


/*** Error Checking and Input Validation***/

//dictionary for storing error messagesand Regex validators for elements that need to be validated
//the keys are the elements className
const errorDictionary = {
	"name": {
		"regex": /^[A-Za-z ]+$/,
		"errorMessage": "Name should be letters and spaces only.",
		"blankMessage": "Please enter something in the name field."
	},
	"mail": {
		"regex": /^[^@]+@[^@.]+\.[a-z]+$/i,
		"errorMessage":"Need a valid email.",
		"blankMessage": "Please enter an email."
	},
	"cc-num": {
		"regex": /^\d{13,16}$/,
		"errorMessage":"Credit Card must be between 13 and 16 characters",
		"blankMessage": "Please enter a credit card number."
	},
	"zip": {
		"regex": /^\d{5}$/,
		"errorMessage":"Zip code must be five digits.",
		"blankMessage": "Please enter a zip code."
	},
	"cvv": {
		"regex": /^\d{3}$/,
		"errorMessage":"CVV must be only 3 numbers.",
		"blankMessage": "Please enter a CVV"
	}
}

//helper functions for validateElement
function addErrorMessage(element, errorText){
	element.style.borderColor = "red";
	element.insertAdjacentHTML('afterend', '<span class="error-message">' + errorText + '</span>')
	element.style.marginBottom = "0em";
}

function removePriorErrorMessage(element){
	element.style.borderColor=null;
	element.nextSibling.remove()
	element.style.marginBottom = "1.125em";
}

//event handler for adding and removing error messages from the page
function validateElement(elementId){
	const element = document.getElementById(elementId)
	const elementValue = element.value; 
	const regex = errorDictionary[elementId].regex
	const validation = regex.test(element.value)
	const errorMessage = errorDictionary[elementId].errorMessage
	const blankMessage = errorDictionary[elementId].blankMessage

	//if there isn't an existing error message, it will add a blankMessage or errorMessage
	if(validation !== true && element.nextSibling.className !== "error-message"){
		if (elementValue === ''){
			addErrorMessage(element, blankMessage)
		} else {
			addErrorMessage(element, errorMessage)
		}
	//these next two conditions look for existing error messages and changes 
	//or removes the error message depending on the current state of the input field
	}else if (validation !== true && element.nextSibling.className === "error-message"){
		const priorError = element.nextSibling.innerText 
		if (elementValue === ''){
			if (priorError !== blankMessage){
				removePriorErrorMessage(element)
				addErrorMessage(element, blankMessage)
			}
		} else {
			if (priorError === blankMessage){
				removePriorErrorMessage(element)
				addErrorMessage(element, errorMessage)
			}
		}
	}else if(validation===true && element.nextSibling.className === "error-message") {
		removePriorErrorMessage(element)
	}
}

//function that creates event handlers for every element in the error dictionary
function loadValidationListen(errorDictionary){
	for (let id in errorDictionary){
		document.getElementById(id).addEventListener('input', ()=>{validateElement(id)})
	}
}

loadValidationListen(errorDictionary)


//'Register' button event listener
document.getElementsByTagName("BUTTON")[0].addEventListener('click', (e)=>{
	e.preventDefault()

	//does a validation check for every element in the errorDictionary
	for (let id in errorDictionary){
		validateElement(id)
	}

	//ensure that at least one activity is checked or errors will throw
	let truthCheck = false;
	for (a of activitiesInputs){
		if (a.checked === true){
			truthCheck = true;
		}
	}
	
	if (truthCheck === false){
		for (let a of activitiesLabels){
			a.style.color = "red";
		}
		lastLabelOfActivities.insertAdjacentHTML('afterend', '<span class="error-message">Must select at least one activity.</span>')
	}

})