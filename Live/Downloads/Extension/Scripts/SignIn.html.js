const signInPage = document.getElementById("sign_in");
const signUpPage = document.getElementById("sign_up");

const signInMenuButton = document.getElementById("sign_in_menu_button");
const signUpMenuButton = document.getElementById("sign_up_menu_button");

const up_username = document.getElementById('up_username');
const up_pass = document.getElementById('up_pass');
const fullName = document.getElementById('fullname');
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
const signInButton = document.getElementById('button-sign_in');

const preview = document.getElementById('preview');

signInMenuButton.addEventListener('click', () => {
	switchActionWindow();
});

signUpMenuButton.addEventListener('click', () => {
	switchActionWindow("SignUp");
});

let currentWindow = null;

function switchActionWindow(sel = "SignIn") {
	const trans = "all 0.3s"; // You see? I am not transphobic. I'm including them
	preview.innerText = "";

	currentWindow = sel;
	
	signUpPage.style.display = "none";
	signInPage.style.display = "none";
	
	signUpPage.style.transition = "";
	signInPage.style.transition = "";
	
	signUpPage.style.opacity = 0;
	signInPage.style.opacity = 0;
	
	signUpPage.style.transition = trans;
	signInPage.style.transition = trans;
	
	// Sign in
	if(sel === "SignIn") {
		signUpMenuButton.style.filter = "scale(0.7)";
		signUpMenuButton.style.color = "gray";
		signInMenuButton.style.filter = "scale(1)";
		signInMenuButton.style.color = "white";
		
		signUpPage.style.opacity = 0;
		setTimeout(() => {
			if(currentWindow === sel) signUpPage.style.display = "none";
		}, 500);
		signInPage.style.display = "inline";
		signInPage.style.opacity = 1;
	} 
	
	// Sign In
	else {
		signInMenuButton.style.filter = "scale(0.7)";
		signInMenuButton.style.color = "gray";
		signUpMenuButton.style.filter = "scale(1)";
		signUpMenuButton.style.color = "white";
		
		signInPage.style.opacity = 0;
		setTimeout(() => {
			if(currentWindow === sel) signInPage.style.display = "none";
		}, 500);
		signUpPage.style.display = "inline";
		signUpPage.style.opacity = 1;
	}
}

document.getElementById('up_pfp').addEventListener('change', function(event) {
	const el = document.getElementById('custom-file-label');
    
	el.style.color = "white";
	el.style.fontStyle = "";
	el.innerText = "Import a Profile Picture";

	if (event.target.files.length > 0) {

		el.style.color = "gray";
		el.style.fontStyle = "italic";
		el.innerText = "Reimport a Profile Picture";

    }
});

const reset = document.getElementById('reset');
reset.addEventListener('click', resetClient)

switchActionWindow("SignUp");

// preview.innerText = "MOTHERFUCKER"
const signIn = async () => {
	const account = new Accounts();

	const answer = await account.signIn(in_username.value, in_pass.value);

	// Upon error
	if(typeof answer !== "object") {
		preview.innerText = answer;
		
		// Remove account data
		chrome.storage.local.remove("username");
		chrome.storage.local.remove("password");
		chrome.storage.local.remove("authorization");
	} 
	
	// Upon success
	else {
		if(!answer.authorization) window.alert("answer.authorization doesn't 'xist");
		
		if(!answer.username) window.alert("answer.username doesn't 'xist");
		
		await chrome.storage.local.set({"username": answer.username, "password": in_pass.value, "authorization": answer.authorization, "admin": answer.admin, "role": answer.role}); // Never trust the client when it comes to admin privileges PLEASE
		
		preview.innerText = "";
		window.location.href = "/MainPage.html";
	}
};

signInButton.addEventListener('click', signIn)
signUpButton.addEventListener('click', async () => {
	const account = new Accounts();

	const accountData = {
		"username": up_username.value,
		"password": up_pass.value,
		"fullName": fullName.value,
		"color": color.value
	};

	if(!changedTheColor && accountData.username && accountData.password) {
		preview.innerText = "User Color is required!"
		return; 
	}

	const inputElement = document.getElementById("up_pfp");

    // Get the selected file (if any)
    const selectedFile = inputElement.files[0];
	if (selectedFile) {
        const reader = new FileReader();
        
        reader.onload = async function(event) {
            // The result will be a Base64 string
            accountData.picture = event.target.result; // Set the Base64 image data

			const response = await account.signUp(accountData);

			if(response !== true) {
				preview.innerText = response;
			} else {
				preview.innerText = "";
				switchActionWindow('SignIn');
	
				setTimeout(async () => {
					in_username.value = accountData.username;
					in_pass.value = accountData.password;
	
					await sleep(500);
	
					signIn();
				}, 4.5e+2);
			}
        };

        reader.readAsDataURL(selectedFile); // Read the image file as a Base64 string
    } else {
		const response = await account.signUp(accountData);

		if(response !== true) {
			preview.innerText = response;
		} else {
			preview.innerText = "";
			switchActionWindow('SignIn');

			setTimeout(async () => {
				in_username.value = accountData.username;
				in_pass.value = accountData.password;

				await sleep(500);

				signIn();
			}, 4.5e+2);
		}
	}
});

chrome.storage.local.get().then((response) => {
    if(response.username && response.password) {
	   in_username.value = response.username;
	   in_pass.value = response.password;
	   switchActionWindow("SignIn");
	   signIn();
    }
});