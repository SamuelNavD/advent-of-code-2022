import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-10/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type Operation = {
    type: "addx" | "noop";
    value?: number;
};

type Cycle = {
    id: number;
    X: number;
};

readFile()
    .then(processInput)
    .then(simulateCycles)
    .then(getSignalStrength)
    .then((result) => {
        console.log("PART 1 ----");
        console.log(result);
    });

readFile()
    .then(processInput)
    .then(simulateCycles)
    .then(draw)
    .then((result) => {
        console.log("PART 2 ----");
        console.log(result);
    });

function processInput(input: string): Array<Operation> {
    const lines = input.split("\n");
    const operations: Array<Operation> = lines.map((line) => {
        const [type, value] = line.split(" ");
        return {
            type: type as "addx" | "noop",
            value: parseInt(value),
        };
    });
    return operations;
}

const MAX_CYCLE = 240;

function simulateCycles(operations: Array<Operation>): Array<Cycle> {
    const cycles: Array<Cycle> = [];
    let X = 1;

    let operationIndex = 0;
    for (let i = 1; i <= MAX_CYCLE && operationIndex < operations.length; i) {
        cycles.push({ id: i++, X });
        switch (operations[operationIndex].type) {
            case "noop":
                break;
            case "addx":
                cycles.push({ id: i++, X });
                X += operations[operationIndex].value;
                break;
        }
        operationIndex++;
    }

    return cycles;
}

function getSignalStrength(cycles: Array<Cycle>): number {
    let signalStrength = 0;
    for (let i = 20; i <= MAX_CYCLE; i += 40) {
        const cycle = cycles.find((c) => c.id === i);
        if (cycle) {
            signalStrength += cycle.id * cycle.X;
        }
    }
    return signalStrength;
}

const LINE_LENGTH = 40;
const SPRITE_LENGTH = 3;

function draw(cycles: Array<Cycle>): string {
    let output = "";

    let cycleString = "";

    cycles.forEach((cycle, index) => {
        if (index % LINE_LENGTH === 0) {
            output += "\n";
        }

        const LEFT_PAD = (cycle.X - 1) % LINE_LENGTH;
        const RIGHT_PAD = LINE_LENGTH - (cycle.X - 1) - SPRITE_LENGTH;
        cycleString =
            ".".repeat(LEFT_PAD > 0 ? LEFT_PAD : 0) +
            "#".repeat(SPRITE_LENGTH) +
            ".".repeat(RIGHT_PAD > 0 ? RIGHT_PAD : 0);
        cycleString = cycleString.slice(0, LINE_LENGTH + 1);

        output += cycleString[index % LINE_LENGTH];
    });

    return output;
}
