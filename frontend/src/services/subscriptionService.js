import api from "./api";

// Purchase a subscription plan
export const purchasePlan = async (userId, planId) => {
    const response = await api.post("/Subscription/purchase", {
        userId,
        planId
    });

    return response.data;
};

// Get subscription details
export const getSubscription = async (userId) => {

    const response = await api.get(`/Subscription/user/${userId}`);

    return response.data;

};

// Renew subscription
export const renewSubscription = async (userId) => {

    const response = await api.post(`/Subscription/renew/${userId}`);

    return response.data;

};

// Check whether user can view another product
export const canViewProduct = async (userId) => {

    const response = await api.get(`/Subscription/canview/${userId}`);

    return response.data;

};

// Record one product view
export const recordProductView = async (userId) => {

    const response = await api.post(`/Subscription/view/${userId}`);

    return response.data;

};

// Get remaining product views
export const getRemainingProducts = async (userId) => {

    const response = await api.get(`/Subscription/remaining/${userId}`);

    return response.data;

};

// Check if subscription is expired
export const isSubscriptionExpired = async (userId) => {

    const response = await api.get(`/Subscription/isexpired/${userId}`);

    return response.data;

};

// Cancel subscription
export const cancelSubscription = async (userId) => {

    const response = await api.post(`/Subscription/cancel/${userId}`);

    return response.data;

};