# PhysioPlus - Physiotherapy MVP Website

This is an MVP (Minimum Viable Product) website for a physiotherapy business with a fully functional booking portal. The website includes features like appointment scheduling, health insurance rebate processing, and payment processing.

## Features

- Responsive design that works on all devices
- Information sections: Services, Team, Testimonials, About Us, Contact
- Fully functional booking portal with:
  - Personal details collection
  - Appointment scheduling with date and time selection
  - Health insurance rebate processing
  - Payment processing
  - Confirmation emails
  - Add to calendar functionality

## Technologies Used

- HTML5, CSS3, JavaScript (Frontend)
- Node.js, Express (Backend)
- Nodemailer (Email functionality)
- Flatpickr (Date picker)
- Font Awesome (Icons)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or download the files
2. Navigate to the project directory
3. Install the dependencies:

```bash
npm install
```

### Running the Application

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

## Demo Flow

1. Browse the website to learn about the physiotherapy services
2. Click on "Book Now" to start the booking process
3. Fill in your personal details
4. Select a consultation type, physiotherapist, date, and time
5. Process your rebate with RebateNow
6. Select your health insurance provider and enter your details
7. Complete the payment
8. Receive confirmation and emails

## Email Functionality

For demo purposes, the application uses Ethereal Email, a fake SMTP service. When an email is sent, a preview URL will be logged to the console. You can click on this URL to view the email in your browser.

## Notes

- This is a demo application and not intended for production use without further development and security enhancements.
- The payment processing is simulated and does not actually process real payments.
- The health insurance rebate calculation is randomized for demonstration purposes.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 