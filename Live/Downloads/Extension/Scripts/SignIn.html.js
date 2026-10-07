const names = [
	"john smith",
	"bellpepper",
	"giant",
	"the creator",
	"root beer",
	"keyboard user",
	"printer",
	"embrace",
	"mr. tyler"
];

document.querySelector('#up_username').placeholder = names[getRandomNumber(0, names.length - 1)];

// const signInPage = document.getElementById("sign_in");
// const signUpPage = document.getElementById("sign_up");

// const signInMenuButton = document.getElementById("sign_in_menu_button");
// const signUpMenuButton = document.getElementById("sign_up_menu_button");

const up_username = document.getElementById('up_username');
const color = document.getElementById('color');

let changedTheColor = false;

color.onchange = () => {
	changedTheColor = true;
	color.style.backgroundColor = color.value;
	color.style.boxShadow = `box-shadow: 0px 4px 6px ${color.value}`;
}

const in_username = document.getElementById('in_username');
const in_pass = document.getElementById('in_pass');

const signUpButton = document.getElementById('button-sign_up');

const preview = document.getElementById('preview');

let currentWindow = null;

const reset = document.getElementById('reset');
reset.addEventListener('click', resetClient)

// switchActionWindow("SignUp");

// preview.innerText = ""



signUpButton.addEventListener('click', async () => {
	const account = new Accounts();

	const accountData = {
		"username": up_username.value,
		"password": "this_is_a_very_secure_thing",
		"fullName": up_username.value,
		"color": color.value
	};

	if(!changedTheColor && accountData.username && accountData.password) {
		color.value = `rgb(${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)}, ${getRandomNumber(0, 255)})`;
	}

	const response = await account.signUp(accountData);

	if(response.ok !== true) {
		preview.innerText = response.message;
	} else {
		preview.innerText = "";

		setTimeout(async () => {
			window.location.href = "MainPage.html";
		}, 4.5e+2);
	}
});


chrome.storage.local.get().then(async (response) => {
    if(response.authorization) {
		const res = await ServerCommunicator.post("TestAuth", {data: response.authorization});
		if(res.ok) {
			window.location.href = window.location.href = "MainPage.html";

		} else {
			chrome.storage.local.remove("authorization");
			chrome.storage.local.remove("username");

		}

    }
});