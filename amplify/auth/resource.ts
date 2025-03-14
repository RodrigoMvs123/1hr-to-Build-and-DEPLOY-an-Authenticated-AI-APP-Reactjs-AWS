import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to the Travel Destination Generator!",
      verificationEmailBody: (createCode) =>
          `Use this code to confirm your account: ${createCode()}`,
    },
  },
});
