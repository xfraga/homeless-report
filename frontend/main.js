// API Configuration
const API_URL = 'http://localhost:3000/api';

// In-memory storage for development (will be replaced by backend calls)
let reports = [];

// DOM Elements
const reportForm = document.getElementById('reportForm');
const reportsList = document.getElementById('reportsList');
const getLocationBtn = document.getElementById('getLocation');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadReports();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    reportForm.addEventListener('submit', handleFormSubmit);
    getLocationBtn.addEventListener('click', getCurrentLocation);
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        location: document.getElementById('location').value,
        latitude: latitudeInput.value || null,
        longitude: longitudeInput.value || null,
        status: document.getElementById('status').value,
        urgency: document.getElementById('urgency').value,
        description: document.getElementById('description').value,
        reporterName: document.getElementById('reporterName').value || 'Anonymous',
        reporterContact: document.getElementById('reporterContact').value || 'Not provided',
        timestamp: new Date().toISOString()
    };

    try {
        // For now, store locally. In production, this would be a POST to backend
        await submitReport(formData);
        reportForm.reset();
        displaySuccess('Report submitted successfully!');
        loadReports();
    } catch (error) {
        displayError('Failed to submit report. Please try again.');
        console.error('Error submitting report:', error);
    }
}

// Submit report to backend
async function submitReport(data) {
    // Simulate API call with localStorage for now
    // In production, replace with: fetch(API_URL + '/reports', { method: 'POST', ... })
    
    return new Promise((resolve) => {
        setTimeout(() => {
            reports.push({
                id: Date.now(),
                ...data
            });
            localStorage.setItem('reports', JSON.stringify(reports));
            resolve();
        }, 500);
    });
}

// Load reports from backend
async function loadReports() {
    try {
        // Simulate API call
        // In production: const response = await fetch(API_URL + '/reports');
        // const data = await response.json();
        
        const storedReports = localStorage.getItem('reports');
        reports = storedReports ? JSON.parse(storedReports) : [];
        
        displayReports(reports);
    } catch (error) {
        console.error('Error loading reports:', error);
        displayError('Failed to load reports');
    }
}

// Display reports in the UI
function displayReports(reportsData) {
    if (reportsData.length === 0) {
        reportsList.innerHTML = '<p class="no-reports">No reports yet. Submit the first one above.</p>';
        return;
    }

    // Sort by urgency and timestamp
    const sortedReports = [...reportsData].sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    reportsList.innerHTML = sortedReports.map(report => createReportCard(report)).join('');
}

// Create HTML for a report card
function createReportCard(report) {
    const timestamp = new Date(report.timestamp).toLocaleString();
    const coordinates = report.latitude && report.longitude 
        ? `(${report.latitude}, ${report.longitude})` 
        : 'Not provided';

    return `
        <div class="report-card urgency-${report.urgency}">
            <div class="report-header">
                <strong>${report.location}</strong>
                <span class="report-urgency urgency-${report.urgency}">
                    ${report.urgency.toUpperCase()}
                </span>
            </div>
            <div class="report-details">
                <p><strong>Health Status:</strong> ${formatStatus(report.status)}</p>
                <p><strong>Coordinates:</strong> ${coordinates}</p>
                <p><strong>Description:</strong> ${report.description || 'No additional details provided'}</p>
                <p><strong>Reported by:</strong> ${report.reporterName}</p>
                <p><strong>Contact:</strong> ${report.reporterContact}</p>
                <p class="timestamp">Reported: ${timestamp}</p>
            </div>
        </div>
    `;
}

// Format status for display
function formatStatus(status) {
    const statusMap = {
        'healthy': 'Appears Healthy',
        'minor_concern': 'Minor Health Concern',
        'urgent': 'Urgent Medical Attention Needed',
        'unknown': 'Unknown'
    };
    return statusMap[status] || status;
}

// Get current location using Geolocation API
function getCurrentLocation() {
    if (!navigator.geolocation) {
        displayError('Geolocation is not supported by your browser');
        return;
    }

    getLocationBtn.textContent = 'Getting location...';
    getLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitudeInput.value = position.coords.latitude.toFixed(6);
            longitudeInput.value = position.coords.longitude.toFixed(6);
            getLocationBtn.textContent = 'Get Current Location';
            getLocationBtn.disabled = false;
            displaySuccess('Location obtained successfully!');
        },
        (error) => {
            getLocationBtn.textContent = 'Get Current Location';
            getLocationBtn.disabled = false;
            displayError('Unable to get location: ' + error.message);
        }
    );
}

// Display success message
function displaySuccess(message) {
    // Simple alert for now - could be replaced with a toast notification
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #27ae60; color: white; padding: 15px 25px; border-radius: 5px; z-index: 1000;';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Display error message
function displayError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #e74c3c; color: white; padding: 15px 25px; border-radius: 5px; z-index: 1000;';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}