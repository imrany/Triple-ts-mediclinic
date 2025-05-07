import { useAppContext } from '@/context';
import { useState } from 'react';

const medicationCategories = [
  'Antibiotics',
  'Painkillers',
  'Vitamins',
  'Cardiovascular',
  'Respiratory',
  'Diabetes',
  'Gastrointestinal',
  'Dermatological',
  'Antihistamines',
  'Psychiatric',
  'Other'
];

const suppliers = [
  'Pharma Solutions Ltd',
  'MedSupply International',
  'Global Pharmaceuticals',
  'HealthCare Distributors',
  'African Medical Supplies',
  'Nairobi Pharma Wholesale',
  'Kenyan MedSource',
  'East Africa Pharmaceuticals'
];

export default function NewMedicationModal() {
  const { isNewMedicationModalOpen, setIsNewMedicationModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: '',
    dosage: '',
    form: 'tablet',
    quantity: '',
    unitPrice: '',
    batchNumber: '',
    expiryDate: '',
    manufacturer: '',
    supplier: '',
    reorderLevel: '',
    description: '',
    sideEffects: '',
    storageInstructions: '',
    requiresPrescription: false,
    isControlledSubstance: false
  });

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Medication data submitted:', formData);
    // Here you would typically save the data to your backend
    setIsNewMedicationModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      genericName: '',
      category: '',
      dosage: '',
      form: 'tablet',
      quantity: '',
      unitPrice: '',
      batchNumber: '',
      expiryDate: '',
      manufacturer: '',
      supplier: '',
      reorderLevel: '',
      description: '',
      sideEffects: '',
      storageInstructions: '',
      requiresPrescription: false,
      isControlledSubstance: false
    });
    setActiveTab('basic');
  };

  const closeModal = () => {
    setIsNewMedicationModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      genericName: '',
      category: '',
      dosage: '',
      form: 'tablet',
      quantity: '',
      unitPrice: '',
      batchNumber: '',
      expiryDate: '',
      manufacturer: '',
      supplier: '',
      reorderLevel: '',
      description: '',
      sideEffects: '',
      storageInstructions: '',
      requiresPrescription: false,
      isControlledSubstance: false
    });
    setActiveTab('basic');
  };

  const FormTab = ({ id, label, active, onClick }:{ id:string, label:string, active:boolean, onClick:any }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
        active 
          ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
  
  if (!isNewMedicationModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Medication</h2>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="border-b border-gray-200">
            <div className="flex space-x-4">
              <FormTab id="basic" label="Basic Information" active={activeTab === 'basic'} onClick={setActiveTab} />
              <FormTab id="inventory" label="Inventory Details" active={activeTab === 'inventory'} onClick={setActiveTab} />
              <FormTab id="clinical" label="Clinical Information" active={activeTab === 'clinical'} onClick={setActiveTab} />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Medication Name*
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="genericName">
                    Generic Name
                  </label>
                  <input
                    id="genericName"
                    name="genericName"
                    type="text"
                    value={formData.genericName}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {medicationCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dosage">
                    Dosage*
                  </label>
                  <input
                    id="dosage"
                    name="dosage"
                    type="text"
                    required
                    placeholder="e.g. 500mg, 5mg/ml"
                    value={formData.dosage}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="form">
                    Form*
                  </label>
                  <select
                    id="form"
                    name="form"
                    required
                    value={formData.form}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="injection">Injection</option>
                    <option value="cream">Cream/Ointment</option>
                    <option value="drops">Drops</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="suspension">Suspension</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="requiresPrescription"
                      name="requiresPrescription"
                      type="checkbox"
                      checked={formData.requiresPrescription}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700" htmlFor="requiresPrescription">
                      Requires Prescription
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'inventory' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="quantity">
                    Initial Quantity*
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="unitPrice">
                    Unit Price (KES)*
                  </label>
                  <input
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="batchNumber">
                    Batch Number
                  </label>
                  <input
                    id="batchNumber"
                    name="batchNumber"
                    type="text"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate">
                    Expiry Date*
                  </label>
                  <input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="manufacturer">
                    Manufacturer
                  </label>
                  <input
                    id="manufacturer"
                    name="manufacturer"
                    type="text"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="supplier">
                    Supplier
                  </label>
                  <select
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reorderLevel">
                    Reorder Level
                  </label>
                  <input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      id="isControlledSubstance"
                      name="isControlledSubstance"
                      type="checkbox"
                      checked={formData.isControlledSubstance}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-700" htmlFor="isControlledSubstance">
                      Is Controlled Substance
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'clinical' && (
              <div className="mt-6 grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sideEffects">
                    Side Effects
                  </label>
                  <textarea
                    id="sideEffects"
                    name="sideEffects"
                    rows={3}
                    value={formData.sideEffects}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="storageInstructions">
                    Storage Instructions
                  </label>
                  <textarea
                    id="storageInstructions"
                    name="storageInstructions"
                    rows={2}
                    value={formData.storageInstructions}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={closeModal}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              
              <div className="flex space-x-3">
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'inventory' ? 'basic' : 'inventory')}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                )}
                
                {activeTab !== 'clinical' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'inventory' : 'clinical')}
                    className="py-2 px-4 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="py-2 px-4 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Medication
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
)};