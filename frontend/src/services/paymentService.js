import api from "./api";


export const makePayment = async(paymentData)=>{


    const response = await api.post(

        "/Payment",

        paymentData

    );


    return response.data;

};