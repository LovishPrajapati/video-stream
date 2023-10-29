import express, { Request, Response } from "express"
import fs from "fs"

const app = express()
const PORT = process.env.PORT || 5000;


app.get("/ping", (req: Request, res: Response) => {
    res.send("pong")
})

app.get("/video", function (req, res) {
    const range = req.headers.range as string;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "sample.mp4";
    const videoSize = fs.statSync("sample.mp4").size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`)
})