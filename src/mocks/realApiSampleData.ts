/**
 * Sample data in the real API format (with pages structure)
 * This simulates the actual API response from your backend
 */

interface RealApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    title: string;
    description?: string;
    posted_by?: string;
    start_date?: string;
    end_date?: string;
    active_data: {
      pages: Array<{
        name?: string;
        type?: string;
        questions: Array<any>;
      }>;
    };
  };
}

/**
 * Sample farmer profile form in real API format
 */
export const realApiFarmerProfileForm: RealApiResponse = {
  statusCode: 200,
  message: "Form data fetched successfully",
  data: {
    id: "farmer-profile-001",
    title: "Farmer Profile",
    description: "Complete farmer registration and profile information",
    posted_by: "Admin User",
    start_date: "2024-01-01",
    end_date: "2024-12-31",
    active_data: {
      pages: [
        {
          name: "FARMER IDENTIFICATION",
          type: "page",
          questions: [
            {
              id: "qr-farmer-id-001",
              type: "qrcode",
              index: 0,
              title: "Scan Farmer ID Card",
              hint: "Scan the QR code on the farmer's ID card",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "farmer-name-001",
              type: "text",
              index: 1,
              title: "Full Name",
              hint: "Enter farmer's full name",
              source: {
                editable: true,
              },
              validation: {
                required: true,
                minLength: 2,
                maxLength: 100,
              },
              countryCode: "GH",
            },
            {
              id: "farmer-phone-001",
              type: "phone",
              index: 2,
              title: "Phone Number",
              hint: "Primary contact number",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "farmer-gender-001",
              type: "single-select",
              index: 3,
              title: "Gender",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              options: [
                { key: "male", value: "Male" },
                { key: "female", value: "Female" },
                { key: "other", value: "Other" },
              ],
              countryCode: "GH",
            },
          ],
        },
        {
          name: "FARM INFORMATION",
          type: "page",
          questions: [
            {
              id: "farm-name-001",
              type: "text",
              index: 4,
              title: "Farm Name",
              hint: "Name of the farm",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "farm-location-001",
              type: "location",
              index: 5,
              title: "Farm Location",
              hint: "Capture GPS coordinates of the farm",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "farm-size-001",
              type: "number",
              index: 6,
              title: "Farm Size (Acres)",
              hint: "Total cultivated area",
              source: {
                editable: true,
              },
              validation: {
                required: true,
                min: 0,
              },
              countryCode: "GH",
            },
            {
              id: "crop-types-001",
              type: "multi-select",
              index: 7,
              title: "Crops Cultivated",
              hint: "Select all crops grown on the farm",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              options: [
                { key: "maize", value: "Maize" },
                { key: "rice", value: "Rice" },
                { key: "cassava", value: "Cassava" },
                { key: "yam", value: "Yam" },
                { key: "cocoa", value: "Cocoa" },
                { key: "vegetables", value: "Vegetables" },
              ],
              countryCode: "GH",
            },
          ],
        },
        {
          name: "FINANCIAL INFORMATION",
          type: "page",
          questions: [
            {
              id: "bank-account-001",
              type: "text",
              index: 8,
              title: "Bank Account Number",
              hint: "For subsidy payments",
              source: {
                editable: true,
              },
              validation: {
                required: false,
                minLength: 10,
                maxLength: 20,
              },
              countryCode: "GH",
            },
            {
              id: "bank-name-001",
              type: "single-select",
              index: 9,
              title: "Bank Name",
              source: {
                editable: true,
              },
              validation: {
                required: false,
              },
              options: [
                { key: "gcb", value: "GCB Bank" },
                { key: "ecobank", value: "Ecobank Ghana" },
                { key: "stanbic", value: "Stanbic Bank" },
                { key: "absa", value: "Absa Bank" },
                { key: "fidelity", value: "Fidelity Bank" },
              ],
              countryCode: "GH",
            },
            {
              id: "annual-income-001",
              type: "number",
              index: 10,
              title: "Estimated Annual Income (GHS)",
              hint: "Approximate income from farming",
              source: {
                editable: true,
              },
              validation: {
                required: false,
                min: 0,
              },
              countryCode: "GH",
            },
          ],
        },
        {
          name: "VERIFICATION",
          type: "page",
          questions: [
            {
              id: "farmer-photo-001",
              type: "image",
              index: 11,
              title: "Farmer Photo",
              hint: "Upload or capture photo",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "farmer-signature-001",
              type: "signature",
              index: 12,
              title: "Farmer Signature",
              hint: "Sign to confirm the information is accurate",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "verification-date-001",
              type: "date",
              index: 13,
              title: "Verification Date",
              source: {
                editable: true,
              },
              validation: {
                required: true,
              },
              countryCode: "GH",
            },
            {
              id: "notes-001",
              type: "textarea",
              index: 14,
              title: "Additional Notes",
              hint: "Any other relevant information",
              source: {
                editable: true,
              },
              validation: {
                required: false,
              },
              countryCode: "GH",
            },
          ],
        },
      ],
    },
  },
};
