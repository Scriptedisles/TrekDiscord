let session = {
        running: false,
        timeout: null,
        shutdownTimeout: null,
        userId: null
    }
    
const { exec } = require("child_process");

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
    },

    run(command) {
        return new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                    reject(err);
                    return;
                }

                console.log(stdout);
                resolve(stdout);
            });
    });
}
}