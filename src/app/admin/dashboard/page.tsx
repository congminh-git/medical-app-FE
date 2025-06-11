"use client";

import AdminSideBar from "@/components/adminSideBar";
import ChartWrapper from "@/components/chartWrapper";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { getAllPaymentTransactions } from "@/services/payment/functions";
import {
  getDailyIncomeData,
  getDoctorAndUserCounts,
  getMonthlyIncomeBarChartData,
  getPaymentMethodPieData,
  getTotalIncome,
} from "@/services/reUseFunctions";
import { ChartData, ChartOptions } from "chart.js";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminDashBoardPage() {
  const [allPaymentTransactions, setAllPaymentTransactions] = useState([]);
  const [paymentMethodData, setPaymentMethodData] =
    useState<ChartData<"pie"> | null>(null);
  const [paymentMethodOptions, setPaymentMethodOptions] =
    useState<ChartOptions<"pie"> | null>(null);
  const [dailyIncomeData, setDailyIncomeData] =
    useState<ChartData<"line"> | null>(null);
  const [dailyIncomeOptions, setDailyIncomeOptions] =
    useState<ChartOptions<"line"> | null>(null);
  const [monthlyIncomeData, setMonthlyIncomeData] =
    useState<ChartData<"bar"> | null>(null);
  const [monthlyIncomeOptions, setMonthlyIncomeOptions] =
    useState<ChartOptions<"bar"> | null>(null);

  const fetchData = async () => {
    try {
      const payments = await getAllPaymentTransactions();
      setAllPaymentTransactions(payments);
    } catch (error) {
      console.error("Error fetching payment transactions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allPaymentTransactions?.length > 0) {
      const paymentMethod = getPaymentMethodPieData(allPaymentTransactions);
      setPaymentMethodData(paymentMethod.data);
      setPaymentMethodOptions(paymentMethod.options);

      const dailyIncome = getDailyIncomeData(allPaymentTransactions);
      setDailyIncomeData(dailyIncome.data);
      setDailyIncomeOptions(dailyIncome.options);

      const monthlyIncome = getMonthlyIncomeBarChartData(
        allPaymentTransactions
      );
      setMonthlyIncomeData(monthlyIncome.data);
      setMonthlyIncomeOptions(monthlyIncome.options);
    }
  }, [allPaymentTransactions]); // Only runs when allPaymentTransactions changes

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full m-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Dashboard</h1>
            <div className="grid grid-cols-3 gap-8 mt-8">
              <div className="col-span-1 border rounded-md flex flex-col h-full">
                <h3 className="font-bold text-2xl py-4 w-full text-center border-b">
                  Thống kê
                </h3>
                {allPaymentTransactions ? (
                  <div className="flex-grow p-8 flex flex-col justify-between items-center">
                    <div className="flex-col items-center">
                      <h4 className="font-bold">Doanh thu</h4>
                      <p className="text-center mt-2">
                        {getTotalIncome(allPaymentTransactions)}
                      </p>
                    </div>
                    <div className="flex-col items-center">
                      <h4 className="font-bold">Số giao dịch</h4>
                      <p className="text-center mt-2">
                        {allPaymentTransactions.length}
                      </p>
                    </div>
                    <div className="flex-col items-center">
                      <h4 className="font-bold">Số bác sĩ hoạt động</h4>
                      <p className="text-center mt-2">
                        {
                          getDoctorAndUserCounts(allPaymentTransactions)
                            .uniqueDoctorCount
                        }
                      </p>
                    </div>
                    <div className="flex-col items-center">
                      <h4 className="font-bold">Số bệnh nhân hoạt động</h4>
                      <p className="text-center mt-2">
                        {
                          getDoctorAndUserCounts(allPaymentTransactions)
                            .uniqueUserCount
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <LoadingSpinner />
                )}
              </div>

              <div className="col-span-2 border rounded-md">
                <h3 className="font-bold text-2xl my-4 w-full text-center">
                  Phương thức thanh toán
                </h3>
                {paymentMethodData && paymentMethodOptions ? (
                  <ChartWrapper
                    type="pie"
                    data={paymentMethodData}
                    options={paymentMethodOptions}
                  />
                ) : (
                  <LoadingSpinner />
                )}
              </div>

              <div className="col-span-3 border rounded-md">
                <h3 className="font-bold text-2xl my-4 w-full text-center">
                  Doanh thu hàng ngày
                </h3>
                {dailyIncomeData && dailyIncomeOptions ? (
                  <ChartWrapper
                    type="line"
                    data={dailyIncomeData}
                    options={dailyIncomeOptions}
                  />
                ) : (
                  <LoadingSpinner />
                )}
              </div>

              <div className="col-span-3 border rounded-md">
                <h3 className="font-bold text-2xl my-4 w-full text-center">
                  Doanh thu hàng tháng
                </h3>
                {monthlyIncomeData && monthlyIncomeOptions ? (
                  <ChartWrapper
                    type="bar"
                    data={monthlyIncomeData}
                    options={monthlyIncomeOptions}
                  />
                ) : (
                  <LoadingSpinner />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}