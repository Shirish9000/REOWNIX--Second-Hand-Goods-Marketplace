import api from "./api";

export const createInvoice = async (paymentId) => {

    const response = await api.post("/Invoice", {

        paymentId

    });

    return response.data;

};