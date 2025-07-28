import config from '../config';
import { IPhoneLogin } from '../types/smsTemplate';

const loginOtp = (values: IPhoneLogin) => {
  const data = {
    body: `Your OTP is: ${values.otp}. Do not share this code. It expires soon.`,
    from: config.twilio.phone_number!,
    to: values.phone,
  };
  return data;
};

export const smsTemplate = {
  loginOtp,
};
