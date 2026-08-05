import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { paymentService } from '../services/dotnet/paymentService';
import { subscriptionService } from '../services/dotnet/subscriptionService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = location.state?.plan;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!plan) {
    return <Navigate to="/premium" replace />;
  }

  const validateField = (name, value) => {

    switch (name) {

      case "name":

        if (!value.trim())
          return "Card holder name is required.";

        if (!/^[A-Za-z ]+$/.test(value))
          return "Only letters and spaces allowed.";

        return "";

      case "cardNumber":

        const digits = value.replace(/\D/g, "");

        if (digits.length !== 16)
          return "Card number must contain 16 digits.";

        return "";

      case "expiry":

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value))
          return "Enter expiry as MM/YY.";

        return "";

      case "cvv":

        if (!/^\d{3}$/.test(value))
          return "CVV must contain 3 digits.";

        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {

    let { name, value } = e.target;

    if (name === "cardNumber") {

      value = value.replace(/\D/g, "");
      value = value.substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {

      value = value.replace(/\D/g, "");

      if (value.length > 2)
        value = value.substring(0, 2) + "/" + value.substring(2, 4);

      value = value.substring(0, 5);
    }

    if (name === "cvv") {

      value = value.replace(/\D/g, "");
      value = value.substring(0, 3);
    }

    if (name === "name") {

      value = value.replace(/[^A-Za-z ]/g, "");
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const formValid =

    formData.name &&
    formData.cardNumber.replace(/\s/g, "").length === 16 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry) &&
    /^\d{3}$/.test(formData.cvv);

  const handleCheckout = async (e) => {

    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      cardNumber: validateField("cardNumber", formData.cardNumber),
      expiry: validateField("expiry", formData.expiry),
      cvv: validateField("cvv", formData.cvv)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(x => x !== "")) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);

    try {

      const paymentPayload = {
        userId: user.userId,
        planId: plan.planId,
        amount: plan.price,
        paymentMethod: "Credit Card"
      };

      const paymentRes = await paymentService.processPayment(paymentPayload);

      if (!paymentRes?.success)
        throw new Error(paymentRes?.message || "Payment failed");

      await subscriptionService.purchaseSubscription({
        userId: user.userId,
        planId: plan.planId
      });

      toast.success("Subscription activated successfully!");

      navigate("/profile/subscription");

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Checkout failed."
      );

    } finally {

      setLoading(false);
    }
  };
  return (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Typography variant="h4" fontWeight="bold" gutterBottom>
      Checkout
    </Typography>

    <Grid container spacing={4}>

      {/* Payment Form */}

      <Grid item xs={12} md={7}>
        <Card
          sx={{
            borderRadius: 3,
            elevation: 0,
            border: "1px solid #E2E8F0"
          }}
        >
          <CardContent sx={{ p: 4 }}>

            <Typography variant="h6" fontWeight="bold" mb={3}>
              Payment Details
            </Typography>

            <form onSubmit={handleCheckout} noValidate>

              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Holder Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    placeholder="John Smith"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={Boolean(errors.cardNumber)}
                    helperText={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    inputProps={{
                      maxLength: 19
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiry"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    error={Boolean(errors.expiry)}
                    helperText={errors.expiry}
                    placeholder="MM/YY"
                    inputProps={{
                      maxLength: 5
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleChange}
                    error={Boolean(errors.cvv)}
                    helperText={errors.cvv}
                    inputProps={{
                      maxLength: 3
                    }}
                  />
                </Grid>

              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.7,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16
                }}
              >
                {loading ? (
                  <CircularProgress
                    color="inherit"
                    size={24}
                  />
                ) : (
                  `Pay ₹${plan.price}`
                )}
              </Button>

            </form>

          </CardContent>
        </Card>
      </Grid>

      {/* Order Summary */}

      <Grid item xs={12} md={5}>
        <Card
          sx={{
            borderRadius: 3,
            bgcolor: "#F8FAFC",
            elevation: 0
          }}
        >
          <CardContent sx={{ p: 4 }}>

            <Typography variant="h6" fontWeight="bold" mb={3}>
              Order Summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2
              }}
            >
              <Typography color="text.secondary">
                {plan.planName}
              </Typography>

              <Typography fontWeight="bold">
                ₹{plan.price}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2
              }}
            >
              <Typography color="text.secondary">
                Duration
              </Typography>

              <Typography>
                {plan.durationDays} days
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
              >
                ₹{plan.price}
              </Typography>

            </Box>

          </CardContent>
        </Card>
      </Grid>

    </Grid>
  </Container>
);
};

export default Checkout;