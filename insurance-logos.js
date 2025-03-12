document.addEventListener('DOMContentLoaded', function() {
    // Health insurance logos
    const insuranceLogos = {
        'Medibank': 'Logos/medibank-logo.png',
        'AHM': 'Logos/AHM.png',
        'Bupa': 'Logos/Bupa.png',
        'HCF': 'Logos/hcf.png',
        'NIB': 'Logos/NIB.png',
        'HBF': 'Logos/hbf.png'        
    };

    // Function to add logos to insurance options
    function addInsuranceLogos() {
        const insuranceOptions = document.querySelectorAll('.insurance-option');
        
        insuranceOptions.forEach(option => {
            const label = option.querySelector('.insurance-label');
            const insuranceName = label.textContent.trim();
            
            if (insuranceLogos[insuranceName]) {
                // Create logo element
                const logoImg = document.createElement('img');
                logoImg.src = insuranceLogos[insuranceName];
                logoImg.alt = `${insuranceName} logo`;
                logoImg.classList.add('insurance-logo');
                
                // Clear the label and add the logo
                label.innerHTML = '';
                label.appendChild(logoImg);
                
                // Add the name back as a span
                const nameSpan = document.createElement('span');
                nameSpan.textContent = insuranceName;
                label.appendChild(nameSpan);
            }
        });
    }

    // Call the function when the rebate button is clicked
    const rebateButton = document.getElementById('rebate-button');
    if (rebateButton) {
        rebateButton.addEventListener('click', function() {
            // Wait a bit for the insurance form to be displayed
            setTimeout(addInsuranceLogos, 100);
        });
    }
}); 