import { Storage } from '@google-cloud/storage';

let storage = null;

export const initializeStorage = () => {
  if (!storage) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
      
      storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        credentials
      });
    } catch (error) {
      console.error('Error initializing Google Cloud Storage:', error);
      throw error;
    }
  }
  return storage;
};

export const fetchKeywordData = async () => {
  try {
    const storage = initializeStorage();
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    const file = bucket.file('keyword-data.json');
    
    const [content] = await file.download();
    return JSON.parse(content.toString());
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    throw error;
  }
};