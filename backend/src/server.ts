import app from "./app";
import { envVerse } from "./config/env";


const bootstrap = () => {
    try {
        app.listen(envVerse.PORT, () => {
        console.log(`server is running on http://localhost:${envVerse.PORT}`);
    })
    } catch (error) {
        console.log('error occures on server', error);
    }
}

bootstrap();