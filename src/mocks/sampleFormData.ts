import type { FormConfig } from "@/types/form.types";

/**
 * Sample form data for testing and development
 * This simulates data that would come from your API
 */
export const sampleContactForm: FormConfig = {
  id: "contact-form-001",
  title: "Contact Us",
  description: "Please fill out this form and we'll get back to you as soon as possible.",
  questions: [
    {
      id: "q1",
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      required: true,
      validation: [
        {
          type: "minLength",
          value: 2,
          message: "Name must be at least 2 characters",
        },
      ],
    },
    {
      id: "q2",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
      required: true,
      description: "We'll never share your email with anyone else.",
    },
    {
      id: "q3",
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+1 (555) 000-0000",
      required: false,
    },
    {
      id: "q4",
      name: "subject",
      label: "Subject",
      type: "select",
      placeholder: "Select a subject",
      required: true,
      options: [
        { value: "general", label: "General Inquiry" },
        { value: "support", label: "Technical Support" },
        { value: "sales", label: "Sales Question" },
        { value: "feedback", label: "Feedback" },
      ],
    },
    {
      id: "q5",
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Tell us more about your inquiry...",
      required: true,
      validation: [
        {
          type: "minLength",
          value: 10,
          message: "Message must be at least 10 characters",
        },
      ],
    },
    {
      id: "q6",
      name: "newsletter",
      label: "Subscribe to our newsletter",
      type: "checkbox",
      description: "Receive updates about our products and services",
      required: false,
      defaultValue: false,
    },
  ],
  submitUrl: "/api/forms/contact-form-001/submit",
};

export const sampleSurveyForm: FormConfig = {
  id: "survey-form-001",
  title: "Customer Satisfaction Survey",
  description: "Help us improve by sharing your feedback.",
  questions: [
    {
      id: "q1",
      name: "customerName",
      label: "Your Name",
      type: "text",
      required: true,
    },
    {
      id: "q2",
      name: "rating",
      label: "How would you rate our service?",
      type: "radio",
      required: true,
      options: [
        { value: "5", label: "Excellent" },
        { value: "4", label: "Good" },
        { value: "3", label: "Average" },
        { value: "2", label: "Poor" },
        { value: "1", label: "Very Poor" },
      ],
    },
    {
      id: "q3",
      name: "features",
      label: "Which features did you use?",
      type: "multiselect",
      required: false,
      options: [
        { value: "feature1", label: "Online Ordering" },
        { value: "feature2", label: "Customer Support" },
        { value: "feature3", label: "Mobile App" },
        { value: "feature4", label: "Delivery Service" },
      ],
    },
    {
      id: "q4",
      name: "wouldRecommend",
      label: "Would you recommend us to a friend?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "maybe", label: "Maybe" },
      ],
    },
    {
      id: "q5",
      name: "additionalComments",
      label: "Additional Comments",
      type: "textarea",
      placeholder: "Share any additional thoughts...",
      required: false,
      dependsOn: {
        field: "wouldRecommend",
        value: "no",
      },
      description: "Since you wouldn't recommend us, please tell us why.",
    },
  ],
};

export const sampleRegistrationForm: FormConfig = {
  id: "registration-form-001",
  title: "Account Registration",
  description: "Create your account to get started.",
  questions: [
    {
      id: "q1",
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      validation: [
        {
          type: "minLength",
          value: 3,
          message: "Username must be at least 3 characters",
        },
        {
          type: "pattern",
          value: "^[a-zA-Z0-9_]+$",
          message: "Username can only contain letters, numbers, and underscores",
        },
      ],
    },
    {
      id: "q2",
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      id: "q3",
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      validation: [
        {
          type: "minLength",
          value: 8,
          message: "Password must be at least 8 characters",
        },
      ],
    },
    {
      id: "q4",
      name: "age",
      label: "Age",
      type: "number",
      required: true,
      validation: [
        {
          type: "min",
          value: 18,
          message: "You must be at least 18 years old",
        },
      ],
    },
    {
      id: "q5",
      name: "country",
      label: "Country",
      type: "select",
      required: true,
      options: [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
      ],
    },
    {
      id: "q6",
      name: "interests",
      label: "Interests",
      type: "multiselect",
      required: false,
      options: [
        { value: "tech", label: "Technology" },
        { value: "sports", label: "Sports" },
        { value: "music", label: "Music" },
        { value: "travel", label: "Travel" },
        { value: "food", label: "Food" },
      ],
    },
    {
      id: "q7",
      name: "terms",
      label: "I agree to the Terms and Conditions",
      type: "checkbox",
      required: true,
    },
  ],
};
