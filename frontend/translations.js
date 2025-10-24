// Multi-language translations for Homeless Report System
const translations = {
    en: {
        appTitle: 'Homeless Report System',
        reportForm: 'Report a Homeless Person',
        locationPrompt: 'Click on the map or enter coordinates',
        latitude: 'Latitude',
        longitude: 'Longitude',
        getLocation: 'Get My Location',
        healthStatus: 'Health Status',
        selectStatus: 'Select status...',
        appearsHealthy: 'Appears Healthy',
        minorConcern: 'Minor Concern',
        urgentMedical: 'Urgent Medical Attention',
        unknown: 'Unknown',
        urgencyLevel: 'Urgency Level',
        selectUrgency: 'Select urgency...',
        low: 'Low - Information Only',
        medium: 'Medium - Assistance Needed',
        high: 'High - Urgent Attention Required',
        additionalInfo: 'Additional Information',
        additionalInfoPlaceholder: 'Describe the situation, number of people, special needs, etc.',
        submitReport: 'Submit Report',
        reportsList: 'Recent Reports',
        reportId: 'Report ID',
        location: 'Location',
        status: 'Status',
        urgency: 'Urgency',
        description: 'Description',
        reporter: 'Reporter',
        contact: 'Contact',
        timestamp: 'Timestamp',
        noReports: 'No reports yet. Submit the first one!',
        reportSubmitted: 'Report submitted successfully!',
        errorLocation: 'Could not get location',
        errorSubmit: 'Error submitting report',
        languageSelector: 'Language',
        reporterName: 'Your Name',
        reporterNamePlaceholder: 'Enter your name',
        reporterContact: 'Contact (Phone/Email)',
        reporterContactPlaceholder: 'Optional: Your phone or email'
    },
    pt: {
        appTitle: 'Sistema de Relatório de Sem-Abrigo',
        reportForm: 'Reportar Pessoa Sem-Abrigo',
        locationPrompt: 'Clique no mapa ou insira coordenadas',
        latitude: 'Latitude',
        longitude: 'Longitude',
        getLocation: 'Obter Minha Localização',
        healthStatus: 'Estado de Saúde',
        selectStatus: 'Selecionar estado...',
        appearsHealthy: 'Aparenta Saudável',
        minorConcern: 'Preocupação Menor',
        urgentMedical: 'Atenção Médica Urgente',
        unknown: 'Desconhecido',
        urgencyLevel: 'Nível de Urgência',
        selectUrgency: 'Selecionar urgência...',
        low: 'Baixa - Apenas Informação',
        medium: 'Média - Assistência Necessária',
        high: 'Alta - Atenção Urgente Necessária',
        additionalInfo: 'Informação Adicional',
        additionalInfoPlaceholder: 'Descreva a situação, número de pessoas, necessidades especiais, etc.',
        submitReport: 'Enviar Relatório',
        reportsList: 'Relatórios Recentes',
        reportId: 'ID do Relatório',
        location: 'Localização',
        status: 'Estado',
        urgency: 'Urgência',
        description: 'Descrição',
        reporter: 'Relator',
        contact: 'Contacto',
        timestamp: 'Data/Hora',
        noReports: 'Ainda não há relatórios. Submita o primeiro!',
        reportSubmitted: 'Relatório enviado com sucesso!',
        errorLocation: 'Não foi possível obter a localização',
        errorSubmit: 'Erro ao enviar o relatório',
        languageSelector: 'Idioma',
        reporterName: 'Seu Nome',
        reporterNamePlaceholder: 'Insira seu nome',
        reporterContact: 'Contacto (Telefone/Email)',
        reporterContactPlaceholder: 'Opcional: Seu telefone ou email'
    }
};

// Get current language from localStorage or default to English
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to get translated text
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Function to change language
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageTranslations();
    }
}

// Function to update all page elements with translations
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = t(key);
        } else {
            element.textContent = t(key);
        }
    });

    // Update select options
    document.querySelectorAll('[data-i18n-value]').forEach(element => {
        const key = element.getAttribute('data-i18n-value');
        element.textContent = t(key);
    });
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePageTranslations();
    
    // Set up language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
});