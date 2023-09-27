import jwt from 'jsonwebtoken';

export const generateAccessToken = function (payload: any) {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'vinadia_access_token',
    { expiresIn: '10m' }
  );
  return accessToken;
};
