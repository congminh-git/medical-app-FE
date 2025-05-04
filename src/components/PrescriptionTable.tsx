// components/PrescriptionTable.tsx
import React from 'react';

// Định nghĩa interface cho dữ liệu đơn thuốc
interface Prescription {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  time: string;
}

// Định nghĩa props cho component
interface PrescriptionTableProps {
  prescriptions: Prescription[];
  medicineTypes: any[]
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ prescriptions, medicineTypes }) => {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Đơn thuốc</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Tên thuốc</th>
              <th className="py-2 px-4 border-b text-left">Số lượng</th>
              <th className="py-2 px-4 border-b text-left">Đơn vị</th>
              <th className="py-2 px-4 border-b text-left">Thời gian sử dụng</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{prescription.id}</td>
                <td className="py-2 px-4 border-b">
                  {prescription.name || medicineTypes.find((medicine)=> medicine.id == prescription.id)?.name ||'Chưa có tên thuốc'}
                </td>
                <td className="py-2 px-4 border-b">{prescription.quantity}</td>
                <td className="py-2 px-4 border-b">{prescription.unit}</td>
                <td className="py-2 px-4 border-b">
                  {prescription.time || 'Chưa có thời gian'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionTable;