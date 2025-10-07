const form = document.getElementById('uploadForm');
const rollNumbersList = document.getElementById('rollNumbers');
const datePicker = document.getElementById('datePicker');
const viewBtn = document.getElementById('viewBtn');
const pickerBtn = document.getElementById('pickerBtn');
const fileInfoDiv = document.getElementById('fileInfo');
const rollNoInput = document.getElementById('rollNoInput');

// PASTE YOUR WEB APP URL HERE
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydC3H1BvRh4rG7zIIZZptrOWAYBbCjKgAmJyCsIgFbUW0Tf1ZLCN5F1-rtSbOGXzW-/exec';
// PASTE YOUR CREDENTIALS HERE
const DEVELOPER_KEY = 'AIzaSyBt-QMgu5Yj2_DVh5cmlsGfnTJpI_ejpqk';
const CLIENT_ID = '887186094221-5vupnfv0r2srdaohgdr034lmsbpjp659.apps.googleusercontent.com';

let uploadedFileId = null;
let oauthToken = null;

// --- Google Picker API Setup ---
function onApiLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            clientId: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.file'
        }).then(() => {
            const auth = gapi.auth2.getAuthInstance();
            if (auth.isSignedIn.get()) {
                oauthToken = auth.currentUser.get().getAuthResponse().access_token;
            } else {
                auth.signIn().then(() => {
                    oauthToken = auth.currentUser.get().getAuthResponse().access_token;
                });
            }
        });
    });
    gapi.load('picker', onPickerApiLoad);
}

function onPickerApiLoad() {
    pickerBtn.onclick = createPicker;
}

function createPicker() {
    if (!oauthToken) {
        alert('Authentication failed. Please refresh the page.');
        return;
    }

    const view = new google.picker.View(google.picker.ViewId.DOCS);
    const picker = new google.picker.PickerBuilder()
        .setOAuthToken(oauthToken)
        .setDeveloperKey(DEVELOPER_KEY)
        .setAppId(CLIENT_ID.split('-')[0])
        .addView(view)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
}

function pickerCallback(data) {
    if (data.action == google.picker.Action.PICKED) {
        const doc = data.docs[0];
        uploadedFileId = doc.id;
        fileInfoDiv.textContent = `File selected: ${doc.name}`;
    }
}

// Load the API library
(function() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js?onload=onApiLoad';
    document.body.appendChild(script);
})();

// --- Your existing code, modified ---
form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!uploadedFileId) {
        alert("Please select a file using the 'Select Permission Letter' button.");
        return;
    }

    const rollNumbers = rollNoInput.value;
    const formData = new FormData();
    formData.append('fileId', uploadedFileId);
    formData.append('rollNumbers', rollNumbers);

    fetch(APP_SCRIPT_URL, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.error) {
            alert('Submission failed: ' + data.error);
        } else {
            alert('Submission successful!');
            form.reset();
            uploadedFileId = null;
            fileInfoDiv.textContent = '';
            fetchRollNumbers();
        }
    })
    .catch(error => {
        console.error('Submission failed:', error);
        alert('Submission failed due to a network error.');
    });
});

// Event listener for date selection
viewBtn.addEventListener('click', function() {
    fetchRollNumbers(datePicker.value);
});

// Load today's data when the page first opens
fetchRollNumbers();
