import React, { useEffect, useState } from "react";

interface Medicine {
  id: string;
  name: string;
}

interface MedicineData {
  id: string;
  quantity: number;
  unit: string;
  time: string;
}

const MedicineTable = ({
  selectedIds,
  medicines,
  setPrescriptions
}: {
  selectedIds: string[];
  medicines: Medicine[];
  setPrescriptions: any
}) => {
  // Khởi tạo medicineData từ selectedIds và medicines
  const [medicineData, setMedicineData] = useState<MedicineData[]>(() => {
    return selectedIds.map((id: string) => ({
      id: id,
      quantity: 1,
      unit: "vỉ",
      time: "",
    }));
  });

  // Các tùy chọn cho select loại
  const unitOptions = ["chai", "hộp", "vỉ", "viên"];

  // Hàm xử lý thay đổi dữ liệu
  const handleInputChange = (
    index: number,
    field: keyof MedicineData,
    value: string | number
  ) => {
    const newData = [...medicineData];
    newData[index] = { ...newData[index], [field]: value };
    setMedicineData(newData);
  };

  // Đồng bộ medicineData khi selectedIds hoặc medicines thay đổi
  useEffect(() => {
    const newMedicines = selectedIds.map((id: string) => {
      // Tìm thuốc hiện có trong medicineData để giữ lại các giá trị quantity, unit, time
      const existingMed = medicineData.find((med) => med.id === id);
      return {
        id,
        name: medicines.find((med) => med.id === id)?.name || "",
        quantity: existingMed?.quantity || 1,
        unit: existingMed?.unit || "vỉ",
        time: existingMed?.time || "",
      };
    });

    // Cập nhật medicineData với danh sách mới
    setMedicineData(newMedicines);
    setPrescriptions(newMedicines)
  }, [selectedIds, medicines]);

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Tên loại thuốc
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Số lượng
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Loại</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Thời điểm uống
            </th>
          </tr>
        </thead>
        <tbody>
          {medicineData.length > 0 ? (
            medicineData.map((med, index) => (
              <tr key={med.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {
                    medicines.find((medicine)=> medicine.id == med.id)?.name || ""
                  }
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="number"
                    value={med.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      handleInputChange(
                        index,
                        "quantity",
                        isNaN(value) || value < 1 ? 1 : value
                      );
                    }}
                    className="w-full outline-none border-none"
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <select
                    value={med.unit}
                    onChange={(e) =>
                      handleInputChange(index, "unit", e.target.value)
                    }
                    className="w-full outline-none border-none"
                  >
                    {unitOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <input
                    type="text"
                    value={med.time}
                    onChange={(e) =>
                      handleInputChange(index, "time", e.target.value)
                    }
                    placeholder="VD: Sáng, Tối"
                    className="w-full outline-none border-none"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "8px" }}>
                Chưa chọn loại thuốc nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineTable;
