import api from "./api";

export const getAllPlans = async () => {
    const response = await api.get("/Plan");
    return response.data;
};

export const getPlanById = async (id) => {
    const response = await api.get(`/Plan/${id}`);
    return response.data;
};