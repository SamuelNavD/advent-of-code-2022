import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-2/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/*
    A X - Rock
    B Y - Paper
    C Z - Scissors
*/

const winningConditions = {
    A: "C",
    B: "A",
    C: "B",
};

const losingConditions = {
    A: "B",
    B: "C",
    C: "A",
};

function countPoints(lines: string[]) {
    let total = 0;

    lines.forEach((line) => {
        const [player1, player2] = line.split(" ");

        // Adding points from the shape selected
        switch (player2) {
            case "A":
                total += 1;
                break;
            case "B":
                total += 2;
                break;
            case "C":
                total += 3;
                break;
        }

        // Adding points from the winning condition
        if (player1 === player2) {
            total += 3;
        } else if (winningConditions[player2] === player1) {
            total += 6;
        }
    });

    return total;
}

readFile()
    .then((data) => {
        console.log("Part 1 ---");

        // Replace chars to ensure we only have A, B, C
        const input = data
            .replace(/X/g, "A")
            .replace(/Y/g, "B")
            .replace(/Z/g, "C");

        return input.split("\n");
    })
    .then(countPoints)
    .then(console.log);

readFile()
    .then((lines) => {
        console.log("Part 2 ---");

        return lines.split("\n").map((line) => {
            const [player1, strategy] = line.split(" ");

            switch (strategy) {
                case "X": // Lose
                    return `${player1} ${winningConditions[player1]}`;
                case "Y": // Draw
                    return `${player1} ${player1}`;
                case "Z": // Win
                    return `${player1} ${losingConditions[player1]}`;
            }
        });
    })
    .then(countPoints)
    .then(console.log);
