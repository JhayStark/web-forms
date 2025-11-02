import type { ApiFormConfig } from "@/types/api.types";

/**
 * Sample form data in API format (matching your actual API structure)
 */
export const apiSampleContactForm: ApiFormConfig = {
  id: "contact-form-001",
  title: "Contact Us",
  description: "Please fill out this form and we'll get back to you as soon as possible.",
  questions: [
    {
      id: "2006090713793-8379",
      type: "text",
      index: 0,
      title: "Full Name",
      source: {
        editable: true,
      },
      validation: {
        required: true,
        minLength: 2,
        message: "Name must be at least 2 characters",
      },
      countryCode: "GH",
      placeholder: "John Doe",
    },
    {
      id: "2006090746912ucPc-8379",
      type: "phone",
      index: 1,
      title: "Phone Number",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
    },
    {
      id: "contact-email-001",
      type: "email",
      index: 2,
      title: "Email Address",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      placeholder: "john@example.com",
      description: "We'll never share your email with anyone else.",
    },
    {
      id: "contact-subject-001",
      type: "single-select",
      index: 3,
      title: "Subject",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      options: [
        { key: "general", value: "General Inquiry" },
        { key: "support", value: "Technical Support" },
        { key: "sales", value: "Sales Question" },
        { key: "feedback", value: "Feedback" },
      ],
    },
    {
      id: "contact-message-001",
      type: "textarea",
      index: 4,
      title: "Message",
      source: {
        editable: true,
      },
      validation: {
        required: true,
        minLength: 10,
        message: "Message must be at least 10 characters",
      },
      countryCode: "GH",
      placeholder: "Tell us more about your inquiry...",
    },
    {
      id: "contact-location-001",
      type: "location",
      index: 5,
      title: "Your Location",
      source: {
        editable: true,
      },
      validation: {
        required: false,
      },
      countryCode: "GH",
      description: "Optional: Share your location to help us serve you better",
    },
    {
      id: "contact-signature-001",
      type: "signature",
      index: 6,
      title: "Signature",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      description: "Please sign to confirm your request",
    },
  ],
};

export const apiSampleSurveyForm: ApiFormConfig = {
  id: "survey-form-001",
  title: "Customer Satisfaction Survey",
  description: "Help us improve by sharing your feedback.",
  questions: [
    {
      id: "survey-name-001",
      type: "text",
      index: 0,
      title: "Your Name",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
    },
    {
      id: "2006090759623KAmx-8379",
      type: "single-select",
      index: 1,
      title: "Gender",
      source: {
        editable: true,
      },
      options: [
        { key: "Male", value: "Male" },
        { key: "Female", value: "Female" },
      ],
      countryCode: "GH",
    },
    {
      id: "survey-rating-001",
      type: "radio",
      index: 2,
      title: "How would you rate our service?",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      options: [
        { key: "5", value: "Excellent" },
        { key: "4", value: "Good" },
        { key: "3", value: "Average" },
        { key: "2", value: "Poor" },
        { key: "1", value: "Very Poor" },
      ],
    },
    {
      id: "survey-features-001",
      type: "multi-select",
      index: 3,
      title: "Which features did you use?",
      source: {
        editable: true,
      },
      countryCode: "GH",
      options: [
        { key: "feature1", value: "Online Ordering" },
        { key: "feature2", value: "Customer Support" },
        { key: "feature3", value: "Mobile App" },
        { key: "feature4", value: "Delivery Service" },
      ],
    },
    {
      id: "survey-recommend-001",
      type: "radio",
      index: 4,
      title: "Would you recommend us to a friend?",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      options: [
        { key: "yes", value: "Yes" },
        { key: "no", value: "No" },
        { key: "maybe", value: "Maybe" },
      ],
    },
    {
      id: "survey-comments-001",
      type: "textarea",
      index: 5,
      title: "Additional Comments",
      source: {
        editable: true,
      },
      countryCode: "GH",
      placeholder: "Share any additional thoughts...",
      description: "Since you wouldn't recommend us, please tell us why.",
      dependsOn: {
        field: "survey-recommend-001",
        value: "no",
      },
    },
  ],
};

export const apiSampleRegistrationForm: ApiFormConfig = {
  id: "registration-form-001",
  title: "Account Registration",
  description: "Create your account to get started.",
  questions: [
    {
      id: "reg-username-001",
      type: "text",
      index: 0,
      title: "Username",
      source: {
        editable: true,
      },
      validation: {
        required: true,
        minLength: 3,
        pattern: "^[a-zA-Z0-9_]+$",
        message: "Username must be at least 3 characters and can only contain letters, numbers, and underscores",
      },
      countryCode: "GH",
    },
    {
      id: "reg-email-001",
      type: "email",
      index: 1,
      title: "Email",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
    },
    {
      id: "reg-password-001",
      type: "password",
      index: 2,
      title: "Password",
      source: {
        editable: true,
      },
      validation: {
        required: true,
        minLength: 8,
        message: "Password must be at least 8 characters",
      },
      countryCode: "GH",
    },
    {
      id: "reg-age-001",
      type: "number",
      index: 3,
      title: "Age",
      source: {
        editable: true,
      },
      validation: {
        required: true,
        min: 18,
        message: "You must be at least 18 years old",
      },
      countryCode: "GH",
    },
    {
      id: "reg-country-001",
      type: "single-select",
      index: 4,
      title: "Country",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      options: [
        { key: "us", value: "United States" },
        { key: "uk", value: "United Kingdom" },
        { key: "ca", value: "Canada" },
        { key: "au", value: "Australia" },
        { key: "gh", value: "Ghana" },
      ],
    },
    {
      id: "reg-interests-001",
      type: "multi-select",
      index: 5,
      title: "Interests",
      source: {
        editable: true,
      },
      countryCode: "GH",
      options: [
        { key: "tech", value: "Technology" },
        { key: "sports", value: "Sports" },
        { key: "music", value: "Music" },
        { key: "travel", value: "Travel" },
        { key: "food", value: "Food" },
      ],
    },
    {
      id: "reg-location-001",
      type: "location",
      index: 6,
      title: "Registration Location",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      description: "We need to verify your location for account security",
    },
    {
      id: "reg-terms-001",
      type: "checkbox",
      index: 7,
      title: "I agree to the Terms and Conditions",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
    },
    {
      id: "reg-signature-001",
      type: "signature",
      index: 8,
      title: "Electronic Signature",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      description: "Sign to confirm your registration",
    },
  ],
};

/**
 * Sample QR Code form demonstrating camera-based QR scanning
 */
export const apiSampleQRCodeForm: ApiFormConfig = {
  id: "qrcode-form-001",
  title: "QR Code Scanner Demo",
  description: "Test the QR code scanner with your device camera",
  questions: [
    {
      id: "qr-product-001",
      type: "qrcode",
      index: 0,
      title: "Product QR Code",
      source: {
        editable: true,
      },
      validation: {
        required: true,
      },
      countryCode: "GH",
      placeholder: "Scan product barcode or enter manually",
      description: "Scan the QR code on the product packaging or enter the code manually",
    },
    {
      id: "qr-id-001",
      type: "qrcode",
      index: 1,
      title: "ID Card QR Code",
      source: {
        editable: true,
      },
      validation: {
        required: false,
      },
      countryCode: "GH",
      placeholder: "Scan ID card QR code (optional)",
      description: "Optional: Scan the QR code on your ID card for verification",
    },
    {
      id: "qr-notes-001",
      type: "textarea",
      index: 2,
      title: "Additional Notes",
      source: {
        editable: true,
      },
      validation: {
        required: false,
      },
      countryCode: "GH",
      placeholder: "Add any additional notes...",
    },
  ],
};
