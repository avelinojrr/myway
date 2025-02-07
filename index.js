import app from './app.js';
import dotenv from 'dotenv';
import { googleConfig } from './src/api/v1/config/googleConfig.js';

dotenv.config();



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
