const TWO_FACTOR_API_KEY = '0f2e1911-1834-11f0-8b17-0200cd936042';

export async function sendOTP(phone: string) {
  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${phone}/AUTOGEN/OTP1`
    );
    const data = await response.json();
    
    if (data.Status === 'Success') {
      return {
        success: true,
        sessionId: data.Details,
        error: null
      };
    } else {
      return {
        success: false,
        sessionId: null,
        error: data.Details || 'Failed to send OTP'
      };
    }
  } catch (error) {
    return {
      success: false,
      sessionId: null,
      error: 'Failed to send OTP'
    };
  }
}

export async function verifyOTP(sessionId: string, otp: string) {
  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );
    const data = await response.json();
    
    return {
      success: data.Status === 'Success',
      error: data.Status === 'Success' ? null : (data.Details || 'Invalid OTP')
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify OTP'
    };
  }
}