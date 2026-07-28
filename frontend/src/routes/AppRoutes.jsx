import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

import Home from "../pages/Home";
import Plans from "../pages/Plans";
import Payment from "../pages/Payment";
import Subscription from "../pages/Subscription";
import Invoice from "../pages/Invoice";
import NotFound from "../pages/NotFound";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/plans" element={<Plans />} />

                <Route path="/payment" element={<Payment />} />

                <Route path="/subscription" element={<Subscription />} />

                <Route path="/invoice" element={<Invoice />} />

                <Route path="*" element={<NotFound />} />

            </Routes>

            <Footer />

        </BrowserRouter>

    );

}

export default AppRoutes;