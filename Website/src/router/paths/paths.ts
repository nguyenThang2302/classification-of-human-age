const ROOT_PATH = "/";
const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";
const METRICS_PATH = "/metrics";
const USERS_PATH = "/users";
const USER_PATH = "/users/:id";
const DASHBOARD_PATH = "/dashboard";
const HISTORYIMAGEDETAIL_PATH = "/history/image-details/:image_id";
const IMAGES_AGE = "/images-age";
const VERIFY_2FA_PATH = 'verify-2fa';
const FORGOT_PASSWORD_PATH = 'forgot-password';
const VERIFY_FORGOT_CODE_PATH = 'verify-forgot-code';

const paths = {
  ROOT_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  METRICS_PATH,
  USERS_PATH,
  USER_PATH,
  DASHBOARD_PATH,
  HISTORYIMAGEDETAIL_PATH,
  IMAGES_AGE,
  VERIFY_2FA_PATH,
  FORGOT_PASSWORD_PATH,
  VERIFY_FORGOT_CODE_PATH
} as const;

export default paths;
