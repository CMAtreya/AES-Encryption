import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://hnpranavkarthik:Pranav1665@cluster0.d2c0izv.mongodb.net/?appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || '9f93427f4042775b7630fdf1349c84dd39571a4c3009e3c1b07f9ea920935e49dd11646b6057919f9d71625e6830010672c8e2a04f611998b00ee1b313ed2ed8',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
