import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (fileName, folder) => {

    if (fileName) {
        const directoryPath = path.join(__dirname, '../uploads', folder);
        const filePath = path.join(directoryPath, fileName);

        // Check if directory exists before trying to list files or delete
        if (fs.existsSync(directoryPath)) {
            console.log("Files in directory:", fs.readdirSync(directoryPath));

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete the file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.log("File does not exist at path:", filePath);
            }
        } else {
            console.error("Directory does not exist:", directoryPath);
        }
    } else {
        console.error("No file name provided");
    }
};
