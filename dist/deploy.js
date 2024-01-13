// Packages
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import * as dotenv from "dotenv";
import * as path from "path";
// Configure dotenv
dotenv.config();
// Initalize REST
const rest = new REST({
    version: "9",
}).setToken(process.env.TOKEN);
// Get files from directory
const getFilesInDirectory = (dir) => {
    let files = [];
    const filesInDir = fs.readdirSync(dir);
    for (const file of filesInDir) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory())
            files = files.concat(getFilesInDirectory(filePath));
        else
            files.push(filePath);
    }
    return files;
};
// Slash Commands
let commands = [];
const commandFiles = getFilesInDirectory("./dist/commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    import(`../${file}`)
        .then((module) => {
        const i = module.default;
        commands.push(i.data.toJSON());
    })
        .catch((error) => {
        console.error(`Error importing ${file}: ${error}`);
    });
}
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
})
    .then(console.log)
    .catch(console.error);
