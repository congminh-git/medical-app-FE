"use client";

import { generateGpayRequestDatetime, generateOrderID, generateRequestID } from "@/services/reUseFunctions";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import Script from "next/script";
import { postGpayCheckout, postSavePaymentTransactions } from "@/services/payment/functions";

declare global {
  function galaxyPaySubmitPayment(
    endpoint: string,
    callbackPaymentResult: (resultData: any) => void,
    callbackOnCloseModal: () => void,
    options: { language: string }
  ): void;
}

type PaymentModalProps = {
  totalCost: number;
  userID: number;
  doctorID: number
  onClose: () => void;
  setPaymentStatus: (status: boolean) => void;
};

const PaymentModal = ({ totalCost, userID, doctorID, onClose, setPaymentStatus }: PaymentModalProps) => {
  const [paymentMethodGpay, setPaymentMethodGpay] = useState<{
    paymentMethod: string;
    sourceOfFund: string;
    sourceType: string;
  }>({
    paymentMethod: "",
    sourceOfFund: "",
    sourceType: "",
  });
  const [requestID, setRequestID] = useState("")
  const [orderID, setOrderID] = useState("")

  function callbackOnCloseModal() {
    console.log("====== close modal ======");
  }

  async function callbackPaymentResult(resultData: any) {
    console.log(resultData)
    let body
    if (String(resultData.transactionStatus) === '200') {
      body = {
        trans_id: resultData.transactionID,
        order_id: orderID,
        request_id: requestID,
        user_id: userID, 
        doctor_id: doctorID,
        amount: totalCost,
        method: JSON.stringify(paymentMethodGpay),
        status: "success"
      }

      setPaymentStatus(true)
    } else {
      body = {
        trans_id: resultData.transactionID,
        order_id: orderID,
        request_id: requestID,
        user_id: userID, 
        doctor_id: doctorID,
        amount: totalCost,
        method: JSON.stringify(paymentMethodGpay),
        status: "failed"
      }
      setPaymentStatus(false)
    }
    console.log(body)
    await postSavePaymentTransactions(body)
    onClose()
  }

  const gpayCheckoutFunction = async (jsonData:any) => {
    const data = await postGpayCheckout(jsonData)
    return data
  }

  const gpayCheckout = async () => {
    if(totalCost) {
      const jsonData = {
        "requestID": requestID,
        "requestDateTime": generateGpayRequestDatetime(),
        "requestData": {
          "apiOperation": "PAY",
          "orderID": orderID,
          "orderNumber": 205249008064,
          "orderAmount": totalCost,
          "orderCurrency": "VND",
          "orderDateTime": generateGpayRequestDatetime(),
          "orderDescription": "DEMO TRANSACTION",
          "paymentMethod": paymentMethodGpay.paymentMethod,
          "sourceType": paymentMethodGpay.sourceType,
          "sourceOfFund": paymentMethodGpay.sourceOfFund,
          "language": "vi",
          "extraData": {}
        }
      };      
      
      return await gpayCheckoutFunction(jsonData)
    }
  }

  async function onPayment(){ 
    const option = {
        language: "vi" // vi or en
    };
    const checkoutResponse = await gpayCheckout()
    galaxyPaySubmitPayment(checkoutResponse.responseData.endpoint, callbackPaymentResult, callbackOnCloseModal, option);
    const iframePopup:any = document.getElementById("galaxy-pay-upc-popup");
    iframePopup.style.marginTop = "72px"
  }

  useEffect(()=>{
    if (totalCost) {
      const genOrderID = generateOrderID()
      setOrderID(genOrderID)
      const genRequestID = generateRequestID()
      setRequestID(genRequestID)
    }
  }, [totalCost])

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <Script src="https://uat-stc.galaxypay.vn/checkout/vietjet/script-modal.js?version=20230710"></Script>
      <div className="max-w-screen-lg w-full bg-white p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-2xl mb-4 ml-2">
            Chọn phương thức thanh toán
          </h3>
          <button
            onClick={() => onClose()}
            className="hover:border hover:bg-gray-300 hover:text-white border border-transparent rounded-md"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
        
        <div className="flex justify-between items-center">
            <p className="ml-2 max-w-[70%]">
                Bạn phải thanh toán trước chi phí tư vấn của bác sĩ, chi phí tư vấn của bác sĩ Minh là:
            </p>
            <p className="text-orange-500 font-bold text-xl">
                {(totalCost).toLocaleString()} VND
            </p>
        </div>

        <div className="flex justify-start items-end my-4 ml-2 w-full">
          <div className="w-[171px] h-[20px] bg-[url('https://s3.ap-southeast-1.amazonaws.com/statics.stg.vietjetict.com/-1710921287888.')]"></div>
        </div>
        <div className="mb-2">
          <h4 className="font-bold text-sm ml-3">Thẻ và tài khoản ngân hàng</h4>
          <div className="flex items-center border-b my-2">
            <label
              className="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="agencycredit"
            >
              <input
                name="type"
                type="radio"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                id="vjph"
                onChange={() => {
                  setPaymentMethodGpay({
                    paymentMethod: "INTERNATIONAL",
                    sourceOfFund: "CARD",
                    sourceType: "",
                  });
                }}
              />
              <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </span>
            </label>
            <label
              className="mt-px font-light text-gray-700 cursor-pointer select-none"
              htmlFor="html"
            >
              Credit Card
            </label>
          </div>
          <div className="flex items-center border-b my-2">
            <label
              className="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="agencycredit"
            >
              <input
                name="type"
                type="radio"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                id="vietQr"
                onChange={() => {
                  setPaymentMethodGpay({
                    paymentMethod: "QRPAY",
                    sourceOfFund: "CARD",
                    sourceType: "QRPAY",
                  });
                }}
              />
              <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </span>
            </label>
            <label
              className="mt-px font-light text-gray-700 cursor-pointer select-none"
              htmlFor="html"
            >
              Mobile Banking VietQR
            </label>
          </div>
          <div className="flex items-center">
            <label
              className="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor="agencycredit"
            >
              <input
                name="type"
                type="radio"
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                id="napas"
                onChange={() => {
                  setPaymentMethodGpay({
                    paymentMethod: "DOMESTIC",
                    sourceOfFund: "CARD",
                    sourceType: "",
                  });
                }}
              />
              <span className="absolute text-blue-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                </svg>
              </span>
            </label>
            <label
              className="mt-px font-light text-gray-700 cursor-pointer select-none"
              htmlFor="html"
            >
              Napas
            </label>
          </div>
          <div id="galaxy-pay-sdk"></div>
        </div>
        <Button disabled={paymentMethodGpay.paymentMethod || paymentMethodGpay.sourceOfFund || paymentMethodGpay.sourceType ? false : true} onPress={()=>onPayment()} className={`${paymentMethodGpay.paymentMethod || paymentMethodGpay.sourceOfFund || paymentMethodGpay.sourceType ? "bg-[#F39C12]" : "bg-gray-300"} text-white mt-6 w-full`}>Thanh toán</Button>
      </div>
    </div>
  );
};

export default PaymentModal;
