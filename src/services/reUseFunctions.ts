import { ChartData, ChartOptions } from 'chart.js'

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Định dạng 24 giờ
    timeZone: "Asia/Ho_Chi_Minh", // Đảm bảo múi giờ Việt Nam
  }).format(date);

  return `${formattedTime}, ${formattedDate}`;
}


export const generateSlug = (title: string, id: number) => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng "-"
    .replace(/[^a-z0-9-]/g, "") // Xóa ký tự đặc biệt
    .replace(/-+/g, "-"); // Xóa dấu "-" dư thừa
  return `/${id}?slug=${slug}`;
};


export const getCurrentWeekDates = () => {
  const today = new Date();

  // Chuyển về giờ Việt Nam
  const vietnamTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
  const dayOfWeek = vietnamTime.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7

  // Nếu là Chủ nhật thì tăng thêm 1 tuần
  if (dayOfWeek === 0) {
    vietnamTime.setDate(vietnamTime.getDate() + 1); // sang Thứ 2 tuần sau
  }

  // Lùi về Thứ Hai của tuần hiện tại (hoặc tuần sau nếu là Chủ nhật)
  const adjustedDayOfWeek = vietnamTime.getDay(); // cập nhật lại sau khi cộng ngày nếu là CN
  const monday = new Date(vietnamTime);
  monday.setDate(vietnamTime.getDate() - adjustedDayOfWeek + 1); // về Thứ 2

  const weekDates: string[] = [];
  let todayIndex = -1;

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    weekDates.push(formattedDate);

    // Kiểm tra nếu là ngày hôm nay thì lưu index
    if (
      date.getDate() === vietnamTime.getDate() &&
      date.getMonth() === vietnamTime.getMonth() &&
      date.getFullYear() === vietnamTime.getFullYear()
    ) {
      todayIndex = i;
    }
  }

  return { weekDates, todayIndex };
};

export const convertToTimestamp = (dateStr: string) => {
  const [time, date] = dateStr.split(" ");
  const [day, month, year] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Tạo Date object theo giờ Việt Nam
  const dateObj = new Date(Date.UTC(year, month - 1, day, hour - 7, minute)); // Giảm 7 giờ để chuyển sang UTC
  return Math.floor(dateObj.getTime() / 1000);
};

export const isFutureTimestamp = (timestamp: number): boolean => {
  const nowUTC = Math.floor(Date.now() / 1000); // Timestamp hiện tại theo UTC
  return timestamp > nowUTC;
};

export const hasObject = (objects: any, targetData: number): boolean => {
  return objects.some((obj:any) => {
    return obj.appointment_time == targetData})
}

export const getCurrentDateTimeString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const generateGpayRequestDatetime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // tháng tính từ 0
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}

export const generateRequestID = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const generateOrderID = (): string => {
  return (1e7 + '-' + 1e3 + '-' + 4e3 + '-' + 8e3 + '-' + 1e11).replace(/[018]/g, c =>
    (parseInt(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c) / 4).toString(16)
  );
}

export function getDoctorDailyIncomeData(listTransactions: any[]): {
  data: ChartData<'line'>
  options: ChartOptions<'line'>
} {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const allDatesInMonth: string[] = []
  const fullDateMap: Record<string, string> = {}

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = new Date(year, month, day).toISOString().slice(0, 10)
    const label = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`
    allDatesInMonth.push(label)
    fullDateMap[label] = fullDate
  }

  const filtered = listTransactions.filter(tx => tx.status === 'success')

  const incomeByDate: Record<string, number> = {}
  const countByDate: Record<string, number> = {}

  filtered.forEach(tx => {
    const fullDate = tx.created_at.split(' ')[0]
    const date = new Date(fullDate)
    const label = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
    incomeByDate[label] = (incomeByDate[label] || 0) + tx.amount * 0.9
    countByDate[label] = (countByDate[label] || 0) + 1
  })

  const incomeValues = allDatesInMonth.map(label => incomeByDate[label] || 0)

  const data: ChartData<'line'> = {
    labels: allDatesInMonth,
    datasets: [
      {
        label: 'Thu nhập (VNĐ)',
        data: incomeValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const income = context.raw as number
            const count = countByDate[label] || 0
            return `${income.toLocaleString('vi-VN')} VNĐ (${count} lần tư vấn)`
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: string | number) {
            return `${Number(value).toLocaleString('vi-VN')} VNĐ`
          },
        },
      },
    },
  }

  return { data, options }
}

export function getDoctorMonthlyIncomeBarChartData(listTransactions: any[]): {
  data: ChartData<'bar'>
  options: ChartOptions<'bar'>
} {
  const incomeByMonth: number[] = Array(12).fill(0) // index 0 -> Jan, ..., 11 -> Dec
  const countByMonth: number[] = Array(12).fill(0)

  listTransactions.forEach(tx => {
    if (tx.status === 'success') {
      const date = new Date(tx.created_at)
      const monthIndex = date.getMonth() // 0-based
      incomeByMonth[monthIndex] += tx.amount * 0.9
      countByMonth[monthIndex] += 1
    }
  })

  const monthLabels = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const data: ChartData<'bar'> = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Doanh thu theo tháng (VNĐ)',
        data: incomeByMonth,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const monthIndex = context.dataIndex
            const value = context.raw as number
            const count = countByMonth[monthIndex]
            return `${value.toLocaleString('vi-VN')} VNĐ (${count} lần tư vấn)`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `${Number(value).toLocaleString('vi-VN')} VNĐ`
          }
        }
      }
    }
  }

  return { data, options }
}

export function getDoctorPaymentMethodPieData(listTransactions: any[]): {
  data: ChartData<'pie'>;
  options: ChartOptions<'pie'>;
} {
  const methodMap: Record<string, { label: string; count: number }> = {
    INTERNATIONAL: { label: 'Thẻ tín dụng - VJPH', count: 0 },
    QRPAY: { label: 'Mobile Banking VietQR', count: 0 },
    DOMESTIC: { label: 'Napas', count: 0 },
  };

  const currentMonth = new Date().getMonth(); // 0-based (0 = Jan)

  listTransactions.forEach(tx => {
    if (tx.status === 'success') {
      const txDate = new Date(tx.created_at);
      if (txDate.getMonth() === currentMonth) {
        try {
          const methodObj = JSON.parse(tx.method);
          const method = methodObj.paymentMethod;
          if (methodMap[method]) {
            methodMap[method].count += 1;
          }
        } catch (err) {
          console.warn('Lỗi parse method JSON:', err);
        }
      }
    }
  });

  const labels = Object.values(methodMap).map(m => m.label);
  const dataPoints = Object.values(methodMap).map(m => m.count);

  const data: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        data: dataPoints,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',    // Thẻ tín dụng
          'rgba(75, 192, 192, 0.6)',    // VietQR
          'rgba(255, 206, 86, 0.6)',    // Napas
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            return `${label}: ${value} giao dịch`;
          },
        },
      },
    },
  };

  return { data, options };
}

export function getDoctorTotalIncome(listTransactions: any[]): number {
  return listTransactions
    .filter(tx => tx.status === 'success')
    .reduce((total, tx) => total + tx.amount * 0.9, 0)
}

export function getTotalIncome(listTransactions: any[]): number {
  return listTransactions
    .filter(tx => tx.status === 'success')
    .reduce((total, tx) => total + tx.amount * 0.1, 0)
}

export function getDoctorAndUserCounts(listTransactions: any[]): { uniqueDoctorCount: number, uniqueUserCount: number } {
  const doctorIds = new Set<number>();
  const userIds = new Set<number>();

  listTransactions.forEach(tx => {
    if (tx.doctor_id != null) {
      doctorIds.add(tx.doctor_id);
    }
    if (tx.user_id != null) {
      userIds.add(tx.user_id);
    }
  });

  return {
    uniqueDoctorCount: doctorIds.size,
    uniqueUserCount: userIds.size
  };
}

export function getDailyIncomeData(listTransactions: any[]): {
  data: ChartData<'line'>
  options: ChartOptions<'line'>
} {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const allDatesInMonth: string[] = []
  const fullDateMap: Record<string, string> = {}

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = new Date(year, month, day).toISOString().slice(0, 10)
    const label = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`
    allDatesInMonth.push(label)
    fullDateMap[label] = fullDate
  }

  const filtered = listTransactions.filter(tx => tx.status === 'success')

  const incomeByDate: Record<string, number> = {}
  const countByDate: Record<string, number> = {}

  filtered.forEach(tx => {
    const fullDate = tx.created_at.split(' ')[0]
    const date = new Date(fullDate)
    const label = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
    incomeByDate[label] = (incomeByDate[label] || 0) + tx.amount * 0.1
    countByDate[label] = (countByDate[label] || 0) + 1
  })

  const incomeValues = allDatesInMonth.map(label => incomeByDate[label] || 0)

  const data: ChartData<'line'> = {
    labels: allDatesInMonth,
    datasets: [
      {
        label: 'Thu nhập (VNĐ)',
        data: incomeValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const income = context.raw as number
            const count = countByDate[label] || 0
            return `${income.toLocaleString('vi-VN')} VNĐ (${count} giao dịch)`
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: string | number) {
            return `${Number(value).toLocaleString('vi-VN')} VNĐ`
          },
        },
      },
    },
  }

  return { data, options }
}

export function getPaymentMethodPieData(listTransactions: any[]): {
  data: ChartData<'pie'>;
  options: ChartOptions<'pie'>;
} {
  const methodMap: Record<string, { label: string; count: number }> = {
    INTERNATIONAL: { label: 'Thẻ tín dụng - VJPH', count: 0 },
    QRPAY: { label: 'Mobile Banking VietQR', count: 0 },
    DOMESTIC: { label: 'Napas', count: 0 },
  };

  const currentMonth = new Date().getMonth(); // 0-based (0 = Jan)

  listTransactions.forEach(tx => {
    if (tx.status === 'success') {
      const txDate = new Date(tx.created_at);
      if (txDate.getMonth() === currentMonth) {
        try {
          const methodObj = JSON.parse(tx.method);
          const method = methodObj.paymentMethod;
          if (methodMap[method]) {
            methodMap[method].count += 1;
          }
        } catch (err) {
          console.warn('Lỗi parse method JSON:', err);
        }
      }
    }
  });

  const labels = Object.values(methodMap).map(m => m.label);
  const dataPoints = Object.values(methodMap).map(m => m.count);
  const total = dataPoints.reduce((sum, val) => sum + val, 0);

  const data: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        data: dataPoints,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',    // Thẻ tín dụng
          'rgba(75, 192, 192, 0.6)',    // VietQR
          'rgba(255, 206, 86, 0.6)',    // Napas
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
            return `${label}: ${value} giao dịch : ${percent}%`;
          },
        },
      },
    },
  };

  return { data, options };
}

export function getMonthlyIncomeBarChartData(listTransactions: any[]): {
  data: ChartData<'bar'>
  options: ChartOptions<'bar'>
} {
  const incomeByMonth: number[] = Array(12).fill(0) // index 0 -> Jan, ..., 11 -> Dec
  const countByMonth: number[] = Array(12).fill(0)

  listTransactions.forEach(tx => {
    if (tx.status === 'success') {
      const date = new Date(tx.created_at)
      const monthIndex = date.getMonth() // 0-based
      incomeByMonth[monthIndex] += tx.amount * 0.9
      countByMonth[monthIndex] += 1
    }
  })

  const monthLabels = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const data: ChartData<'bar'> = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Doanh thu theo tháng (VNĐ)',
        data: incomeByMonth,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const monthIndex = context.dataIndex
            const value = context.raw as number
            const count = countByMonth[monthIndex]
            return `${value.toLocaleString('vi-VN')} VNĐ (${count} lần tư vấn)`
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return `${Number(value).toLocaleString('vi-VN')} VNĐ`
          }
        }
      }
    }
  }

  return { data, options }
}