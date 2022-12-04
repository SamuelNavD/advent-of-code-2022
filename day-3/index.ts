import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-3/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const alphabet = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

readFile()
    .then((text) => {
        return text.split("\n");
    })
    .then((lines) => {
        // Make intersection
        const incorrectGifts = new Array<string>();

        lines.forEach((line) => {
            // Split in half
            const half = Math.floor(line.length / 2);

            const firstHalf = line.substring(0, half);
            const secondHalf = line.substring(half);

            let tempGift: string = "";

            firstHalf.split("").forEach((gift) => {
                if (tempGift === "" && secondHalf.includes(gift)) {
                    tempGift = gift;
                }
            });

            incorrectGifts.push(tempGift);
        });

        // Sum priorities
        let priorities = 0;
        incorrectGifts.forEach((gift) => {
            priorities += alphabet.indexOf(gift);
        });

        console.log("PART 1 ---");
        console.log("Priorities: " + priorities);
    });

readFile()
    .then((text) => {
        return text.split("\n");
    })
    .then((lines) => {
        // Group lines in groups of 3
        const groups = new Array<Array<string>>();

        for (let i = 0; i < lines.length; i += 3) {
            groups.push([lines[i], lines[i + 1], lines[i + 2]]);
        }

        return groups;
    })
    .then((groups) => {
        const commonGifts = new Array<string>();

        groups.forEach((group) => {
            let tempGift: string = "";

            group[0].split("").forEach((gift) => {
                if (
                    tempGift === "" &&
                    group.every((line) => line.includes(gift))
                ) {
                    tempGift = gift;
                }
            });

            commonGifts.push(tempGift);
        });

        // Sum priorities
        let priorities = 0;
        commonGifts.forEach((gift) => {
            priorities += alphabet.indexOf(gift);
        });

        console.log("PART 2 ---");
        console.log("Priorities: " + priorities);
    });
