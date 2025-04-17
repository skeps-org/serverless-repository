const axios = require("axios");
const { v4 } = require('uuid');
const constants = require('../utils/constant');
const {
    OAUTH_ACCESS_TOKEN_ENDPOINT,
    LENDER_CLIENT_ID,
    LENDER_CLIENT_SECRET,
    LENDER_ID,
    LENDER_GRANT_TYPE,
    APPLICANT_ORDER_DETAILS_URL,
    SEND_EMAIL_URL,
    EMAIL_TEMPLATE_ID_PENDING_WITH_LENDER,
    EMAIL_TEMPLATE_ID_DOCUMENT_SUBMITTED,
    EMAIL_VERSION_ID_PENDING_WITH_LENDER,
    EMAIL_VERSION_ID_DOCUMENT_SUBMITTED,
    FROM_EMAIL,
    LENDER_EMAIL,
} = constants;

async function getAccessToken() {
    try {
        // Append fields to the form data
  
        const response = await axios({
            method: "post",
            url: `${OAUTH_ACCESS_TOKEN_ENDPOINT}`,
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            data: {
              "client_id": `${LENDER_CLIENT_ID}`,
              "grant_type": `${LENDER_GRANT_TYPE}`,
              "client_secret": `${LENDER_CLIENT_SECRET}`,
              "lender_id": `${LENDER_ID}`,
            }
          });
          return response?.data?.data?.access_token ?? null;

    } catch (err) {
        if (err instanceof Error) {
            console.log(`error: getAccessToken error: ${err.message}`);
            throw new Error(`error: getAccessToken error: ${err.message}`);
        } else {
            console.log("error: getAccessToken error: unknown error");
            throw new Error("error: getAccessToken error: unknown error");
        }
    }
}

async function getOrderDetails(token, applicationId) {
    try {
      const Authorization = `Bearer ${token}`;
      const requestId = v4();

      const response = await axios({
        method: "post",
        url: `${APPLICANT_ORDER_DETAILS_URL}`,
        headers: {
          Authorization: Authorization,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: {
          "request_id": requestId,
          "id": applicationId
  
        },
      });
   
      const orderDetails = response?.data?.data;
      return orderDetails;
    } catch (err) {
      if (err instanceof Error) {
        console.log(`error: applicantOrderDetails error: ${err.message}`);
        throw new Error(`error: applicantOrderDetails error: ${err.message}`);
      } else {
        console.log("error: lenderWebhooks error: unknown error");
        throw new Error("error: lenderWebhooks error: unknown error");
      }
    }
  }

  function createSendEmailPayload(orderDetails, applicationId){
    let templateId;
    let versionId;

    if(orderDetails?.status == "PENDING_WITH_LENDER"){
      templateId = EMAIL_TEMPLATE_ID_PENDING_WITH_LENDER;
      versionId = EMAIL_VERSION_ID_PENDING_WITH_LENDER;
    }else if(orderDetails?.status == "DOCUMENT_SUBMITTED"){
      templateId = EMAIL_TEMPLATE_ID_DOCUMENT_SUBMITTED;
      versionId = EMAIL_VERSION_ID_DOCUMENT_SUBMITTED;
    }else{
      return {}; 
    }

    const payload = {
      method: "post",
      url: SEND_EMAIL_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        "email_params": {
          "application_id": applicationId,
          "dynamicData": {
            "borrower_first_name": orderDetails?.evaluation_data[0]?.applicant?.first_name,
            "borrower_last_name": orderDetails?.evaluation_data[0]?.applicant?.last_name,
            "app_id": applicationId
          },
          "emailParams": {
            "to": [`${LENDER_EMAIL}`],
            "from": {
              "email": `${FROM_EMAIL}`
            },
          },
          "templateData": {
            "versionId": versionId,
            "templateId": templateId
          }
        },      
      }
    }

    return payload;
  }

  async function sendEmail(orderDetails, applicationId) {
    try {
      const payload = createSendEmailPayload(orderDetails,applicationId);
      
      // Check if the payload is an empty object
      if (Object.keys(payload).length === 0) {
        throw new Error("Error: Email payload is empty. Cannot send email.");
    }
      const response = await axios(payload);

      return response?.data;

    } catch (err) {
      if (err instanceof Error) {
        console.log(`error: lenderWebhooks error: ${err.message}`);
        throw new Error(`error: lenderWebhooks error: ${err.message}`);
      } else {
        console.log("error: lenderWebhooks error: unknown error");
        throw new Error("error: lenderWebhooks error: unknown error");
      }
    }
  }

 async function lenderWebhook(req, res) {
    try {
        const applicationId = req.body.data.application_id;

        const token = await getAccessToken();
        const orderDetails = await getOrderDetails(token, applicationId);
        const email = await sendEmail(orderDetails,applicationId);

        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            data: {
              applicationId
            }
          });
          
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
          });
          
    }
};


module.exports = {
    lenderWebhook
}