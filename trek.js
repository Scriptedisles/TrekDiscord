let session = {
        running: false,
        timeout: null,
        shutdownTimeout: null,
        userId: null
    }
    
const { exec } = require("child_process");

module.exports = {

    session,

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