import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-6/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

readFile()
    .then((data) => {
        return new Promise<number>((resolve, reject) => {
            // Split text into groups of four characters
            const groups = splitToSubstrings(data, 4);

            groups.forEach((group, index) => {
                // Check if all the characters are different
                const isDifferent = group.split("").every((char, i, arr) => {
                    return arr.indexOf(char) === i;
                });
                if (isDifferent) {
                    resolve(index + 4);
                }
            });
        });
    })
    .then((result) => {
        console.log("PART 1 ----");
        console.log("First marker after character", result);
    });

readFile()
    .then((data) => {
        return new Promise<number>((resolve, reject) => {
            // Split text into groups of four characters
            const groups = splitToSubstrings(data, 14);

            groups.forEach((group, index) => {
                // Check if all the characters are different
                const isDifferent = group.split("").every((char, i, arr) => {
                    return arr.indexOf(char) === i;
                });
                if (isDifferent) {
                    resolve(index + 14);
                }
            });
        });
    })
    .then((result) => {
        console.log("PART 2 ----");
        console.log("First start-message marker after character", result);
    });

function splitToSubstrings(str, n) {
    const arr = [];

    for (let index = 0; index < str.length; index++) {
        arr.push(str.slice(index, index + n));
    }

    return arr;
}
