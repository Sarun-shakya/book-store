import axios from "axios";
import crypto from "crypto";

const PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;
const SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const GATEWAY_URL = process.env.ESEWA_GATEWAY_URL;

// Generate signature for initiating payment
export const getEsewaPaymentHash = (amount, transaction_uuid) => {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${PRODUCT_CODE}`;

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(data)
        .digest("base64");

    return {
        signature,
        signed_field_names: "total_amount,transaction_uuid,product_code"
    };
};

// Verify eSewa payment
export const verifyEsewaPayment = async (encodedData) => {
    try {
        // Decode base64
        let decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
        decodedData = JSON.parse(decodedData);

        // Recreate signature
        const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

        const hash = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(data)
            .digest("base64");

        if (hash !== decodedData.signature) {
            throw new Error("Invalid signature");
        }

        // Verify with eSewa server
        const response = await axios.get(`${GATEWAY_URL}/api/epay/transaction/status/`, {
            params: {
                product_code: PRODUCT_CODE,
                total_amount: decodedData.total_amount,
                transaction_uuid: decodedData.transaction_uuid
            }
        });

        if (
            response.data.status !== "COMPLETE" ||
            response.data.transaction_uuid !== decodedData.transaction_uuid ||
            Number(response.data.total_amount) !== Number(decodedData.total_amount)
        ) {
            throw new Error("Payment verification failed");
        }

        return { decodedData, response: response.data };
    } catch (error) {
        throw error;
    }
};