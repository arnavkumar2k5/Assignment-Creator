import dotenv from 'dotenv';
import path from 'path';

const backendRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(backendRoot, '.env.local') });
dotenv.config({ path: path.join(backendRoot, '.env') });
