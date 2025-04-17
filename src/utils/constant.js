const Constant = {
    SERVICE_NAME: 'serverless-repository',
    OAUTH_ACCESS_TOKEN_ENDPOINT: "http://tguc-uat-vm.private.tguc.uat.skeps.dev:8086/oauth/lender/server/token",
    LENDER_CLIENT_ID: "79134182-9e38-4907-a8f9-dbafb441e75b",
    LENDER_CLIENT_SECRET: "d1pbaVjNVEj1jH3pAtAT4l3yObIkPa",
    LENDER_ID: "OY26I2",
    LENDER_GRANT_TYPE: "CLIENT_CREDENTIALS",
    APPLICANT_ORDER_DETAILS_URL: "http://tguc-uat-vm.private.tguc.uat.skeps.dev:3031/reader/public/application/status",
    EMAIL_TEMPLATE_ID_PENDING_WITH_LENDER: "d-b04f6a11007d42e7af5c9e3dbe5b8032",
    EMAIL_TEMPLATE_ID_DOCUMENT_SUBMITTED: "d-b915e8dd01ef47dfad87e8d85da9cff2",
    EMAIL_VERSION_ID_PENDING_WITH_LENDER: "9a5d1047-907c-47a0-beeb-3257297e0f42",
    EMAIL_VERSION_ID_DOCUMENT_SUBMITTED: "38649481-4a30-4970-833b-b3a4af6625e1",
    SEND_EMAIL_URL: "http://tguc-uat-vm.private.tguc.uat.skeps.dev:3041/external/send-email",
    FROM_EMAIL: "noreply@pos.tgucfinancial.com",
    LENDER_EMAIL: "qa@skeps.com"
}


module.exports = Constant;