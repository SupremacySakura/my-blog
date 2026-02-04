interface VerificationCode {
  code: string;
  expires: number;
}

export const verificationCodes = new Map<string, VerificationCode>();
