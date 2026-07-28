import React from "react";

function PlanCard({
    planName,
    price,
    productLimit,
    duration,
    description,
    badge,
    buttonText,
    onSelect
}) {
    return (
        <div className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-lg border-0 rounded-4 plan-card">

                {badge && (
                    <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-warning text-dark px-3 py-2">
                            {badge}
                        </span>
                    </div>
                )}

                <div className="card-body text-center p-4">

                    <h3 className="fw-bold mb-3">
                        {planName}
                    </h3>

                    <h1 className="display-5 fw-bold text-primary">
                        ₹{price}
                    </h1>

                    <p className="text-muted mb-4">
                        Per Month
                    </p>

                    <hr />

                    <div className="text-start mt-4">

                        <p>
                            ✅ <strong>{productLimit}</strong> Product Views
                        </p>

                        <p>
                            ✅ {duration} Days Validity
                        </p>

                        <p>
                            ✅ Premium Access
                        </p>

                        <p>
                            ✅ Priority Support
                        </p>

                        <p>
                            {description}
                        </p>

                    </div>

                </div>

                <div className="card-footer bg-white border-0 p-4">

                    <button
                        className="btn btn-primary w-100 rounded-pill py-2"
                        onClick={onSelect}
                    >
                        {buttonText}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default PlanCard;