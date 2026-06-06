import app from "./app";

const PORT = process.env.PORT;

const bootstrap = () => {
    try {
        app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    })
    } catch (error) {
        console.log('error occures on server', error);
    }
}

bootstrap();