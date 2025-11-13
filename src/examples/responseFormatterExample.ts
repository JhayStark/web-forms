/**
 * Example demonstrating how to use the formatFormResponse utility
 */

import { formatFormResponse } from "@/utils/responseFormatter";
import type { FormConfig } from "@/types/form.types";

/**
 * Example 1: Basic usage with simple form
 */
export function basicExample() {
  const formConfig: FormConfig = {
    id: "12935",
    title: "Farmer Survey",
    questions: [
      {
        id: "23050313208755p5S-12935",
        name: "farmer_qr",
        label: "Scan Farmer ID",
        type: "qrcode",
        required: true,
      },
      {
        id: "2305031331489P2OL-12935",
        name: "farmer_name",
        label: "Farmer Name",
        type: "text",
        required: true,
      },
      {
        id: "2305031304593IIfb-12935",
        name: "gender",
        label: "Gender",
        type: "select",
        options: [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ],
      },
    ],
  };

  const formData = {
    "23050313208755p5S-12935": "hopebb", // QR code value
    "2305031331489P2OL-12935": "rubber1", // Text field
    "2305031304593IIfb-12935": "Female", // Select field
  };

  const formattedResponse = formatFormResponse({
    formId: "12935",
    formConfig,
    formData,
    timeSpent: 489000, // 8 minutes 9 seconds
  });

  console.log("Basic Example Result:", JSON.stringify(formattedResponse, null, 2));
  return formattedResponse;
}

/**
 * Example 2: With custom labels
 */
export function customLabelsExample() {
  const formConfig: FormConfig = {
    id: "12935",
    title: "Farm Survey",
    questions: [
      {
        id: "farmer-id",
        name: "farmerId",
        label: "Farmer ID",
        type: "qrcode",
        required: true,
      },
    ],
  };

  const formData = {
    "farmer-id": "FARMER-12345",
  };

  const formattedResponse = formatFormResponse({
    formId: "12935",
    formConfig,
    formData,
    timeSpent: 120000,
    labels: {
      imageLabel: "farm_photo_001",
      label1: "John Doe Farm",
      label2: "Region A",
    },
  });

  console.log("Custom Labels Example:", JSON.stringify(formattedResponse, null, 2));
  return formattedResponse;
}

/**
 * Example 3: Multi-select and polygon fields
 */
export function complexFieldsExample() {
  const formConfig: FormConfig = {
    id: "12935",
    title: "Crop Survey",
    questions: [
      {
        id: "2210051056133o0Re-12935",
        name: "crop_types",
        label: "Crop Types",
        type: "multiselect",
        options: [
          { value: "1", label: "Rubber" },
          { value: "2", label: "Cocoa" },
          { value: "3", label: "Coffee" },
        ],
      },
      {
        id: "2305031426590L2YF-12935",
        name: "farm_area",
        label: "Farm Area",
        type: "polygon",
      },
    ],
  };

  const formData = {
    "2210051056133o0Re-12935": ["1", "2"], // Multiple crops
    "2305031426590L2YF-12935": {
      area: 0.0035762,
      areaInAcres: 0.008837059221188414,
      areaInHectares: 0.0035762341479858547,
      coordinates: [
        { lat: 5.6027694, lng: -0.092486, accuracy: 4, latitude: 0, longitude: 0 },
        { lat: 5.6027071, lng: -0.0924145, accuracy: 3, latitude: 0, longitude: 0 },
        { lat: 5.6026658, lng: -0.0924604, accuracy: 3, latitude: 0, longitude: 0 },
        { lat: 5.6027694, lng: -0.092486, accuracy: 4, latitude: 0, longitude: 0 },
      ],
      keywordLabel: "farm_area",
    },
  };

  const formattedResponse = formatFormResponse({
    formId: "12935",
    formConfig,
    formData,
  });

  console.log("Complex Fields Example:", JSON.stringify(formattedResponse, null, 2));
  return formattedResponse;
}

/**
 * Example 4: All field types
 */
export function allFieldTypesExample() {
  const formConfig: FormConfig = {
    id: "12935",
    title: "Complete Survey",
    questions: [
      // QR Code
      {
        id: "qr-1",
        name: "qrcode",
        label: "QR Code",
        type: "qrcode",
      },
      // Text
      {
        id: "text-1",
        name: "fullName",
        label: "Full Name",
        type: "text",
      },
      // Number
      {
        id: "num-1",
        name: "age",
        label: "Age",
        type: "number",
      },
      // Phone
      {
        id: "phone-1",
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
      },
      // Email
      {
        id: "email-1",
        name: "email",
        label: "Email",
        type: "email",
      },
      // Date
      {
        id: "date-1",
        name: "birthDate",
        label: "Birth Date",
        type: "date",
      },
      // Select
      {
        id: "select-1",
        name: "country",
        label: "Country",
        type: "select",
        options: [
          { value: "GH", label: "Ghana" },
          { value: "NG", label: "Nigeria" },
        ],
      },
      // Multi-select
      {
        id: "multi-1",
        name: "interests",
        label: "Interests",
        type: "multiselect",
        options: [
          { value: "1", label: "Farming" },
          { value: "2", label: "Technology" },
          { value: "3", label: "Business" },
        ],
      },
      // Location
      {
        id: "loc-1",
        name: "currentLocation",
        label: "Current Location",
        type: "location",
      },
      // Polygon
      {
        id: "poly-1",
        name: "farmBoundary",
        label: "Farm Boundary",
        type: "polygon",
      },
      // Signature
      {
        id: "sig-1",
        name: "signature",
        label: "Signature",
        type: "signature",
      },
    ],
  };

  const formData = {
    "qr-1": "QR123456",
    "text-1": "John Doe",
    "num-1": 35,
    "phone-1": "233244556677",
    "email-1": "john@example.com",
    "date-1": "1989-05-15",
    "select-1": "GH",
    "multi-1": ["1", "3"],
    "loc-1": {
      latitude: 5.6037,
      longitude: -0.1870,
      accuracy: 10,
    },
    "poly-1": {
      area: 0.5,
      coordinates: [
        { lat: 5.6, lng: -0.1 },
        { lat: 5.7, lng: -0.1 },
        { lat: 5.7, lng: -0.2 },
        { lat: 5.6, lng: -0.2 },
      ],
    },
    "sig-1": "SIGNATURE_BLOBS/633/signature-uuid.png",
  };

  const formattedResponse = formatFormResponse({
    formId: "12935",
    formConfig,
    formData,
    timeSpent: 300000, // 5 minutes
    version: "25012211562956",
  });

  console.log("All Field Types Example:", JSON.stringify(formattedResponse, null, 2));
  return formattedResponse;
}

/**
 * Example 5: Using with pages
 */
export function pagesExample() {
  const formConfig: FormConfig = {
    id: "12935",
    title: "Multi-Page Survey",
    questions: [], // Will be populated from pages
    pages: [
      {
        name: "Personal Information",
        questions: [
          {
            id: "page1-q1",
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            id: "page1-q2",
            name: "age",
            label: "Age",
            type: "number",
          },
        ],
      },
      {
        name: "Farm Details",
        questions: [
          {
            id: "page2-q1",
            name: "farmSize",
            label: "Farm Size",
            type: "number",
          },
          {
            id: "page2-q2",
            name: "crops",
            label: "Crops",
            type: "multiselect",
            options: [
              { value: "1", label: "Maize" },
              { value: "2", label: "Rice" },
            ],
          },
        ],
      },
    ],
  };

  const formData = {
    "page1-q1": "Jane Farmer",
    "page1-q2": 42,
    "page2-q1": 5.5,
    "page2-q2": ["1", "2"],
  };

  const formattedResponse = formatFormResponse({
    formId: "12935",
    formConfig,
    formData,
    timeSpent: 420000, // 7 minutes
  });

  console.log("Pages Example:", JSON.stringify(formattedResponse, null, 2));
  return formattedResponse;
}

// Run all examples
export function runAllExamples() {
  console.log("\n=== Running Response Formatter Examples ===\n");

  console.log("\n1. Basic Example:");
  basicExample();

  console.log("\n2. Custom Labels Example:");
  customLabelsExample();

  console.log("\n3. Complex Fields Example:");
  complexFieldsExample();

  console.log("\n4. All Field Types Example:");
  allFieldTypesExample();

  console.log("\n5. Pages Example:");
  pagesExample();

  console.log("\n=== All Examples Completed ===\n");
}
