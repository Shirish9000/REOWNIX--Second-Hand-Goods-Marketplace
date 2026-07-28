import React from "react";

function FeatureTable() {
    return (
        <div className="container mt-5">

            <h2 className="text-center fw-bold mb-4">
                Compare Plans
            </h2>

            <div className="table-responsive shadow rounded-4">

                <table className="table table-bordered text-center align-middle mb-0">

                    <thead className="table-dark">

                        <tr>
                            <th>Features</th>
                            <th>Free</th>
                            <th>Own</th>
                            <th>ReOwn</th>
                            <th>ReOwn Max</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>Monthly Product Views</td>
                            <td>10</td>
                            <td>50</td>
                            <td>75</td>
                            <td>100</td>
                        </tr>

                        <tr>
                            <td>Validity</td>
                            <td>One Time</td>
                            <td>30 Days</td>
                            <td>30 Days</td>
                            <td>30 Days</td>
                        </tr>

                        <tr>
                            <td>Premium Badge</td>
                            <td>❌</td>
                            <td>✅</td>
                            <td>✅</td>
                            <td>✅</td>
                        </tr>

                        <tr>
                            <td>Priority Support</td>
                            <td>❌</td>
                            <td>✅</td>
                            <td>✅</td>
                            <td>✅</td>
                        </tr>

                        <tr>
                            <td>Upgrade Anytime</td>
                            <td>❌</td>
                            <td>✅</td>
                            <td>✅</td>
                            <td>✅</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default FeatureTable;