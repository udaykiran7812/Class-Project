const form = document.getElementById('uploadForm');
const rollNumbersList = document.getElementById('rollNumbers');
const datePicker = document.getElementById('datePicker');
const viewBtn = document.getElementById('viewBtn');

const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpDnEJiT_G1KwMdU2tJeAhaQEuTUXl0UwaA1HNBKxeonE1OsCFKyZEYZsIUkuqelnK/exec'; // REPLACE THIS WITH YOUR WEB APP URL

// Function to fetch and display roll numbers
function fetchRollNumbers(date = null) {
    const url = new URL(APP_SCRIPT_URL);
    if (date) {
        url.searchParams.append('date', date);
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            rollNumbersList.innerHTML = '';
            if (data.length > 0) {
                data.forEach(rollNo => {
                    const li = document.createElement('li');
                    li.textContent = rollNo;
                    rollNumbersList.appendChild(li);
                });
            } else {
                rollNumbersList.innerHTML = '<li>No submissions for this date.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            rollNumbersList.innerHTML = '<li>Error loading data.</li>';
        });
}

// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const file = document.getElementById('fileInput').files[0];
    const rollNumbers = document.getElementById('rollNoInput').value;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('rollNumbers', rollNumbers);

    fetch(APP_SCRIPT_URL, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Submission failed: ' + data.error);
        } else {
            alert('Submission successful!');
            fetchRollNumbers(); // Refresh the list
        }
    })
    .catch(error => {
        console.error('Submission failed:', error);
        alert('Submission failed due to a network error.');
    });
});

// Handle date selection
viewBtn.addEventListener('click', function() {
    fetchRollNumbers(datePicker.value);
});

// Initial load
fetchRollNumbers();
