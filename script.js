const fileInput = document.getElementById('fileInput');
const fileInfoDiv = document.getElementById('fileInfo');
const form = document.getElementById('uploadForm');
const rollNumbersList = document.getElementById('rollNumbers');
const datePicker = document.getElementById('datePicker');
const viewBtn = document.getElementById('viewBtn');

// <<< PASTE YOUR WEB APP URL HERE
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbynFAbxrYDxtbzK7BbLu1ZF2eSk0VLOD3lMg17AnHjYqjaCqG1XyMkDDMQNjNW1ko9I/exec'; 

// Function to fetch and display roll numbers based on date
function fetchRollNumbers(date = null) {
  const url = new URL(APP_SCRIPT_URL);
  if (date) {
    url.searchParams.append('date', date);
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      rollNumbersList.innerHTML = '';
      if (data && data.length > 0) {
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

// Event listener for form submission
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
    if (data && data.error) {
      alert('Submission failed: ' + data.error);
    } else {
      alert('Submission successful!');
      form.reset(); // Clear the form
      fetchRollNumbers(); // Refresh the list with today's data
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

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        fileInfoDiv.textContent = `File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    } else {
        fileInfoDiv.textContent = 'No file selected.';
    }
});

// Load today's data when the page first opens
fetchRollNumbers();
