# 🚀 Kickstart - Career Guidance & Credential Management Platform

**Kickstart** is a modern web application designed to empower students and professionals by providing personalized career guidance, secure credential storage, and access to valuable educational resources using **AI** and **blockchain technologies**.

## 🌟 Features

- 🔍 **AI Career Guidance** – Personalized career path recommendations based on user profiles.
- 🔐 **Secure Document Management** – Upload and verify academic credentials securely via blockchain.
- 📚 **Learning Resources** – Curated learning materials tailored to user goals.
- 🧾 **Certification Programs** – Enroll in top certification courses across domains like IT, medicine, and music.
- 🤖 **AI Chat Support** – 24/7 chat assistant for career-related queries.
- 🤝 **Mentorship Network** – Connect with experienced professionals for mentorship.

## 🎨 Pages Included

| Page               | Description                                                             |
|--------------------|-------------------------------------------------------------------------|
| `Home.tsx`         | Landing page with call to action and app highlights.                    |
| `About.tsx`        | Mission, vision, values, and institutional details.                     |
| `Services.tsx`     | Interactive cards detailing all platform services.                      |
| `Certification.tsx`| Browse and filter industry-recognized certification programs.           |
| `Contact.tsx`      | Contact form and contact info, email integration via EmailJS.           |
| `Login.tsx`        | Secure login page with password visibility toggle.                      |
| `Signup.tsx`       | User registration form with validation and feedback.                    |
| `Profile.tsx`      | Detailed profile management including file uploads and resume sharing.  |

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS  
- **Routing:** React Router  
- **State Management:** React Context API  
- **Animations:** Framer Motion  
- **Icons:** Lucide React  
- **Email Integration:** EmailJS  
- **Blockchain (Credential Verification):** *Planned backend integration*

## 📦 Getting Started

### Prerequisites

- Node.js ≥ 14.x  
- Yarn or npm

### Installation

```bash
git clone https://github.com/your-username/kickstart-career.git
cd kickstart-career
npm install
```

# Run Locally
```bash
npm start
```

This runs the app in development mode at http://localhost:3000.

# API & Backend
Make sure the backend is running on http://localhost:5000. See Profile.tsx and Signup.tsx for API usage patterns.

# 🧪 Environment Variables
Create a .env file for local credentials (e.g. for EmailJS):
```bash
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```
