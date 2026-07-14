let session = {
        running: false,
        timeout: null,
        shutdownTimeout: null,
        userId: null
    }


module.exports = {

    session,

    async shutdown() {
        if (!session.running) return;

        session.running = false;

        clearTimeout(session.timeout);
        clearTimeout(session.shutdownTimeout);

        try {
            await run("pm2 stop tunnel");
        } catch {}

        try {
            await run("docker stop trek");
        } catch {}

        console.log("Session shut down.");
    }
}