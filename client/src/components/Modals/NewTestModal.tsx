import { useAppContext } from "@/context";
import { X } from "lucide-react";
import { useState } from "react";

// Mock data for dropdown options
const testTypes = [
  { id: 1, name: "Complete Blood Count (CBC)" },
  { id: 2, name: "Lipid Panel" },
  { id: 3, name: "Comprehensive Metabolic Panel" },
  { id: 4, name: "Liver Function Test" },
  { id: 5, name: "Thyroid Function Test" },
  { id: 6, name: "Urinalysis" },
  { id: 7, name: "Hemoglobin A1C" },
  { id: 8, name: "Electrolyte Panel" },
  { id: 9, name: "Kidney Function Test" },
  { id: 10, name: "Blood Glucose Test" }
];

export default function NewTestModal() {
  const { isNewTestModalOpen, setIsNewTestModalOpen } = useAppContext() || {
    isNewTestModalOpen: false,
    setIsNewTestModalOpen: () => {}
  };

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    requestingDoctor: "",
    priority: "normal",
    instructions: "",
    collectionDate: "",
    collectionTime: "",
    fasting: false
  });

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Submitted test request:", formData);
    // Here you would typically send the data to your API
    
    // Reset form and close modal
    setFormData({
      patientName: "",
      patientId: "",
      testType: "",
      requestingDoctor: "",
      priority: "normal",
      instructions: "",
      collectionDate: "",
      collectionTime: "",
      fasting: false
    });
    setIsNewTestModalOpen(false);
  };

  if (!isNewTestModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full no-scrollbar max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add New Test Request</h3>
          <button
            onClick={() => setIsNewTestModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Information */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Test Details</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
                  Test Type
                </label>
                <select
                  id="testType"
                  name="testType"
                  value={formData.testType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Select a test type</option>
                  {testTypes.map(test => (
                    <option key={test.id} value={test.name}>
                      {test.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="requestingDoctor" className="block text-sm font-medium text-gray-700 mb-1">
                  Requesting Doctor
                </label>
                <input
                  type="text"
                  id="requestingDoctor"
                  name="requestingDoctor"
                  value={formData.requestingDoctor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="priorityNormal"
                      name="priority"
                      value="normal"
                      checked={formData.priority === "normal"}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                    />
                    <label htmlFor="priorityNormal" className="ml-2 text-sm text-gray-700">
                      Normal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="priorityUrgent"
                      name="priority"
                      value="urgent"
                      checked={formData.priority === "urgent"}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                    />
                    <label htmlFor="priorityUrgent" className="ml-2 text-sm text-gray-700">
                      Urgent
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Collection Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="collectionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Date
                </label>
                <input
                  type="date"
                  id="collectionDate"
                  name="collectionDate"
                  value={formData.collectionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="collectionTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Time
                </label>
                <input
                  type="time"
                  id="collectionTime"
                  name="collectionTime"
                  value={formData.collectionTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fasting"
                  name="fasting"
                  checked={formData.fasting}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="fasting" className="ml-2 text-sm text-gray-700">
                  Fasting Required
                </label>
              </div>
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="mb-6">
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Special requirements or instructions for this test..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsNewTestModalOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}