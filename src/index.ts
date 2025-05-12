import app from "./app";

const PORT = process.env.PORT || 4000;

const startSever = async () => {
    app.listen({port: Number(PORT), host: '0.0.0.0'}, (error, address) => {
        if (error) {
            console.log(error);
            app.log.error(error);
            process.exit(1);
        } else {
            console.log(`
        🖥️  SERVER STARTED 🚀  
        ┌───────────────────┐
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │
        │   [■■■■■■■■■■■]   │ 
        │   [■■■■■■■■■■■]   │
        └───────────────────┘
        http://localhost:${PORT}
      `);
        }
    })
}

startSever();