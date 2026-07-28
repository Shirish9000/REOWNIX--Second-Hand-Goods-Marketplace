import api from "./api";

const PremiumService = {

    getPlans: () => api.get("/Plan"),

    purchasePlan: (data) =>
        api.post("/Subscription/purchase", data),

    makePayment: (data) =>
        api.post("/Payment", data),

    getSubscription: (userId) =>
        api.get(`/Subscription/user/${userId}`),

    getRemainingProducts: (userId) =>
        api.get(`/Subscription/remaining/${userId}`),

    canView: (userId) =>
        api.get(`/Subscription/canview/${userId}`),

    renewSubscription: (userId) =>
        api.post(`/Subscription/renew/${userId}`),

    cancelSubscription: (userId) =>
        api.post(`/Subscription/cancel/${userId}`),

};

export default PremiumService;