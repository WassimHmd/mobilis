import SibApiV3Sdk from "../config/brevo";

export const sendEmail = async (to, subject, html) => {
  const client = SibApiV3Sdk.ApiClient.instance;

  // Set API Key
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env;

  const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  // Create email details
  const sendSmtpEmail = {
    to: [{ email: to }],
    sender: { email: "512.devmail@gmail.com", name: "512dev" },
    subject: subject,
    htmlContent: html,
  };

  // Send the email
  return transactionalEmailApi.sendTransacEmail(sendSmtpEmail);
};
