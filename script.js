document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;
        
        testimonialSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Initialize Flatpickr Date Picker
    if (document.querySelector('.datepicker')) {
        flatpickr('.datepicker', {
            minDate: 'today',
            dateFormat: 'Y-m-d',
            disable: [
                function(date) {
                    // Disable Sundays
                    return date.getDay() === 0;
                }
            ],
            onChange: function(selectedDates, dateStr) {
                generateTimeSlots(dateStr);
            }
        });
    }

    // Generate Time Slots based on selected date
    function generateTimeSlots(date) {
        const timeSlotContainer = document.querySelector('.time-slot-container');
        if (!timeSlotContainer) return;
        
        timeSlotContainer.innerHTML = '';
        
        // Sample time slots (8am to 6pm, 1-hour intervals)
        const startHour = 8;
        const endHour = 18;
        const selectedDay = new Date(date).getDay();
        
        // Saturday has limited hours
        const isSaturday = selectedDay === 6;
        const saturdayEndHour = 14;
        
        for (let hour = startHour; hour < (isSaturday ? saturdayEndHour : endHour); hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            
            // Format the time (e.g., "8:00 AM")
            const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
            timeSlot.textContent = timeString;
            
            // Randomly make some slots unavailable
            const isAvailable = Math.random() > 0.3;
            if (!isAvailable) {
                timeSlot.classList.add('unavailable');
            } else {
                timeSlot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(slot => {
                        slot.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    
                    // Store the selected time
                    sessionStorage.setItem('selectedTime', timeString);
                });
            }
            
            timeSlotContainer.appendChild(timeSlot);
        }
    }

    // Booking Form Steps Navigation
    const bookingSteps = document.querySelectorAll('.step');
    const bookingForms = document.querySelectorAll('.booking-form');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = this.closest('.booking-form');
            const currentStep = parseInt(currentForm.id.split('-').pop());
            
            if (validateStep(currentStep)) {
                // If it's step 1, update the appointment summary
                if (currentStep === 1) {
                    updateAppointmentSummary();
                }
                
                // Move to the next step
                moveToStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = this.closest('.booking-form');
            const currentStep = parseInt(currentForm.id.split('-').pop());
            
            // Move to the previous step
            moveToStep(currentStep - 1);
        });
    });

    function moveToStep(stepNumber) {
        // Hide all forms and deactivate all steps
        bookingForms.forEach(form => form.classList.remove('active'));
        bookingSteps.forEach(step => step.classList.remove('active'));
        
        // Show the current form and activate the current step
        if (stepNumber === 4) {
            // For the confirmation step
            document.getElementById('booking-confirmation').classList.add('active');
        } else {
            document.getElementById(`booking-form-step-${stepNumber}`).classList.add('active');
        }
        
        // Activate all steps up to the current one
        bookingSteps.forEach(step => {
            if (parseInt(step.dataset.step) <= stepNumber) {
                step.classList.add('active');
            }
        });
    }

    function validateStep(stepNumber) {
        const form = document.getElementById(`booking-form-step-${stepNumber}`);
        
        // Basic validation for required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Additional validation for step 1 (combined details)
        if (stepNumber === 1) {
            const selectedTimeSlot = document.querySelector('.time-slot.selected');
            if (!selectedTimeSlot) {
                alert('Please select an available time slot.');
                return false;
            }
        }
        
        if (!isValid) {
            alert('Please fill in all required fields.');
        }
        
        return isValid;
    }

    // Update Appointment Summary
    function updateAppointmentSummary() {
        const consultType = document.getElementById('consult-type');
        const physio = document.getElementById('physio');
        const appointmentDate = document.getElementById('appointment-date');
        const selectedTime = sessionStorage.getItem('selectedTime');
        
        // Get the consultation fee from the selected option text
        const consultText = consultType.options[consultType.selectedIndex].text;
        const feeMatch = consultText.match(/\$(\d+)/);
        const fee = feeMatch ? feeMatch[0] : '$0';
        
        // Update the summary
        document.getElementById('summary-consult').textContent = consultText;
        document.getElementById('summary-physio').textContent = physio.options[physio.selectedIndex].text;
        document.getElementById('summary-datetime').textContent = `${appointmentDate.value} at ${selectedTime}`;
        document.getElementById('summary-fee').textContent = fee;
        
        // Store the fee for later use
        sessionStorage.setItem('consultationFee', fee);
    }

    // Rebate Button Click
    const rebateButton = document.getElementById('rebate-button');
    if (rebateButton) {
        rebateButton.addEventListener('click', function() {
            document.getElementById('insurance-form').classList.remove('hidden');
        });
    }

    // Calculate Rebate Button Click
    const calculateRebateButton = document.getElementById('calculate-rebate');
    if (calculateRebateButton) {
        calculateRebateButton.addEventListener('click', function() {
            // Validate insurance form
            const insuranceProvider = document.querySelector('input[name="insurance"]:checked');
            const memberNumber = document.getElementById('member-number').value;
            const referenceNumber = document.getElementById('reference-number').value;
            
            if (!insuranceProvider || !memberNumber || !referenceNumber) {
                alert('Please fill in all insurance details.');
                return;
            }
            
            // Calculate rebate (for demo purposes, we'll use a random percentage)
            const consultationFee = sessionStorage.getItem('consultationFee');
            const feeValue = parseInt(consultationFee.replace('$', ''));
            const rebatePercentage = Math.floor(Math.random() * 41) + 30; // Random between 30-70%
            const rebateAmount = Math.floor(feeValue * (rebatePercentage / 100));
            const gapAmount = feeValue - rebateAmount;
            
            // Update the rebate result
            document.getElementById('rebate-fee').textContent = consultationFee;
            document.getElementById('rebate-amount').textContent = `$${rebateAmount}`;
            document.getElementById('gap-amount').textContent = `$${gapAmount}`;
            
            // Show the rebate result
            document.getElementById('rebate-result').classList.remove('hidden');
            
            // Store the gap amount for payment
            sessionStorage.setItem('gapAmount', `$${gapAmount}`);
            
            // Send email to healthcare insurer
            sendHealthcareEmail(insuranceProvider.value, memberNumber, referenceNumber);
        });
    }

    // Handle the "Proceed to Payment" button
    const proceedToPaymentButton = document.querySelector('#booking-form-step-2 .btn-next');
    if (proceedToPaymentButton) {
        proceedToPaymentButton.addEventListener('click', function() {
            // Update payment amount
            document.getElementById('payment-amount').textContent = sessionStorage.getItem('gapAmount') || '$0';
        });
    }

    // Complete Payment Button Click
    const completePaymentButton = document.getElementById('complete-payment');
    if (completePaymentButton) {
        completePaymentButton.addEventListener('click', function() {
            // Validate payment form
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            if (paymentMethod === 'credit-card') {
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('card-name').value;
                
                if (!cardNumber || !expiryDate || !cvv || !cardName) {
                    alert('Please fill in all credit card details.');
                    return;
                }
            }
            
            // Generate a random appointment ID
            const appointmentId = 'PHY-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            
            // Update confirmation details
            document.getElementById('confirmation-id').textContent = appointmentId;
            document.getElementById('confirmation-datetime').textContent = document.getElementById('summary-datetime').textContent;
            document.getElementById('confirmation-physio').textContent = document.getElementById('summary-physio').textContent;
            document.getElementById('confirmation-email').textContent = document.getElementById('email').value;
            
            // Move to confirmation step
            moveToStep(4);
            
            // Send confirmation emails
            sendPatientEmail();
            sendPracticeEmail();
        });
    }

    // Add to Calendar Button Click
    const addToCalendarButton = document.getElementById('add-to-calendar');
    if (addToCalendarButton) {
        addToCalendarButton.addEventListener('click', function() {
            const appointmentDate = document.getElementById('appointment-date').value;
            const selectedTime = sessionStorage.getItem('selectedTime');
            const physio = document.getElementById('physio').options[document.getElementById('physio').selectedIndex].text;
            
            // Create calendar event URL (Google Calendar format)
            const startDateTime = new Date(`${appointmentDate} ${selectedTime}`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour
            
            const eventTitle = `Physiotherapy Appointment with ${physio}`;
            const eventLocation = '123 Healing Street, Wellness District, Sydney, NSW 2000';
            const eventDetails = `Your appointment with ${physio} at PhysioPlus.`;
            
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateTime.toISOString().replace(/-|:|\.\d+/g, '')}/${endDateTime.toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(eventLocation)}&sf=true&output=xml`;
            
            window.open(googleCalendarUrl, '_blank');
        });
    }

    // Print Confirmation Button Click
    const printConfirmationButton = document.getElementById('print-confirmation');
    if (printConfirmationButton) {
        printConfirmationButton.addEventListener('click', function() {
            window.print();
        });
    }

    // Email Functions using the API
    async function sendEmail(to, subject, body) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to, subject, body })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('Email sent successfully:', data.previewUrl);
                return true;
            } else {
                console.error('Failed to send email:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }

    async function sendHealthcareEmail(insuranceProvider, memberNumber, referenceNumber) {
        console.log('Sending email to healthcare insurer...');
        
        // Generate a claim code
        const claimCode = 'CLM' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        // Store the claim code for confirmation
        sessionStorage.setItem('claimCode', claimCode);
        
        const emailBody = `
            <h2>Healthcare Claim Submission</h2>
            <p>The following claim has been submitted to ${insuranceProvider}:</p>
            <ul>
                <li><strong>Member Number:</strong> ${memberNumber}</li>
                <li><strong>Reference Number:</strong> ${referenceNumber}</li>
                <li><strong>Claim Code:</strong> ${claimCode}</li>
                <li><strong>Service:</strong> ${document.getElementById('summary-consult').textContent}</li>
                <li><strong>Provider:</strong> PhysioPlus</li>
                <li><strong>Date:</strong> ${document.getElementById('summary-datetime').textContent}</li>
                <li><strong>Amount:</strong> ${document.getElementById('rebate-amount').textContent}</li>
            </ul>
            <p>This is an automated message. Please do not reply to this email.</p>
        `;
        
        await sendEmail(
            'jzhuhe@gmail.com',
            `Healthcare Claim Submission - ${insuranceProvider}`,
            emailBody
        );
    }

    async function sendPatientEmail() {
        console.log('Sending email to patient...');
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const appointmentId = document.getElementById('confirmation-id').textContent;
        const appointmentDateTime = document.getElementById('confirmation-datetime').textContent;
        const physio = document.getElementById('confirmation-physio').textContent;
        
        const emailBody = `
            <h2>Appointment Confirmation</h2>
            <p>Dear ${name},</p>
            <p>Your appointment with PhysioPlus has been confirmed:</p>
            <ul>
                <li><strong>Appointment ID:</strong> ${appointmentId}</li>
                <li><strong>Date & Time:</strong> ${appointmentDateTime}</li>
                <li><strong>Physiotherapist:</strong> ${physio}</li>
                <li><strong>Location:</strong> 123 Healing Street, Wellness District, Sydney, NSW 2000</li>
            </ul>
            <p><a href="https://maps.google.com/?q=123+Healing+Street,+Wellness+District,+Sydney,+NSW+2000">View on Google Maps</a></p>
            <p><a href="#">Add to Calendar</a> | <a href="#">Reschedule</a> | <a href="#">Cancel</a></p>
            <p>If you have any questions, please contact us at (02) 1234 5678.</p>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br>The PhysioPlus Team</p>
        `;
        
        await sendEmail(
            'jzhuhe@gmail.com', // In a real app, this would be the patient's email
            'Your PhysioPlus Appointment Confirmation',
            emailBody
        );
    }

    async function sendPracticeEmail() {
        console.log('Sending email to practice...');
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const issue = document.getElementById('issue').value;
        const appointmentId = document.getElementById('confirmation-id').textContent;
        const appointmentDateTime = document.getElementById('confirmation-datetime').textContent;
        const physio = document.getElementById('confirmation-physio').textContent;
        const consultType = document.getElementById('summary-consult').textContent;
        
        const emailBody = `
            <h2>New Appointment Booking</h2>
            <h3>Patient Information</h3>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Issue:</strong> ${issue}</li>
            </ul>
            <h3>Appointment Details</h3>
            <ul>
                <li><strong>Appointment ID:</strong> ${appointmentId}</li>
                <li><strong>Date & Time:</strong> ${appointmentDateTime}</li>
                <li><strong>Physiotherapist:</strong> ${physio}</li>
                <li><strong>Consultation Type:</strong> ${consultType}</li>
                <li><strong>Payment Status:</strong> Paid</li>
            </ul>
            <p>This appointment has been automatically added to the practice calendar.</p>
        `;
        
        await sendEmail(
            'jzhuhe@gmail.com', // In a real app, this would be the practice's email
            `New Appointment Booking - ${appointmentId}`,
            emailBody
        );
    }

    // Hero Image Cycling
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Array of images from the Images folder
        const heroImages = [
            'Images/nightingale-home-nurse-4e017fuMeXE-unsplash.jpg',
            'Images/sincerely-media-5uLbdKsUXMg-unsplash.jpg',
            'Images/sincerely-media-wGFibXDQlBI-unsplash.jpg',
            'Images/annie-spratt-Nt5eeIKH-1s-unsplash.jpg',
        ];
        
        let currentImageIndex = 0;
        
        // Set initial background
        heroSection.style.backgroundImage = `url('${heroImages[0]}')`;
        
        // Function to change the background image
        function cycleHeroImage() {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            heroSection.style.backgroundImage = `url('${heroImages[currentImageIndex]}')`;
            
            // Add fade effect
            heroSection.classList.add('fade-transition');
            setTimeout(() => {
                heroSection.classList.remove('fade-transition');
            }, 1000);
        }
        
        // Change image every 5 seconds
        setInterval(cycleHeroImage, 5000);
    }
}); 