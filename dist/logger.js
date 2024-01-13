// Functions
const info = (service, data) => {
    console.log(`${"[INFO]".red} [${service.green}] => ${data}`);
};
const error = (service, data) => {
    console.log(`${"[ERROR]".red} [${service.green}] => ${data.red}`);
};
const debug = (service, data) => {
    console.log(`${"[DEBUG]".red} [${service.green}] => ${data.yellow}`);
};
// Export
export default {
    info,
    error,
    debug,
};
