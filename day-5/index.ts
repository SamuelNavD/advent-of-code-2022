import * as fs from "fs";
import { Stack } from "@datastructures-js/stack";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-5/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type CratesStack = {
    index: number;
    crates: Stack<string>;
};

type Movement = {
    quantity: number;
    from: number;
    to: number;
};

readFile()
    .then((data) => {
        const [crates, movements] = data.split("\n\n");
        return {
            crates,
            movements,
        };
    })
    .then((data) => {
        const stacks = parseCrates(data);
        const movements = parseMovements(data.movements);
        return {
            stacks,
            movements,
        };
    })
    .then((data) => {
        const { stacks, movements } = data;
        // Move crates
        movements.forEach((movement) => {
            const fromStack = stacks.find(
                (stack) => stack.index === movement.from
            );
            const toStack = stacks.find((stack) => stack.index === movement.to);
            if (fromStack && toStack) {
                for (let i = 0; i < movement.quantity; i++) {
                    const crate = fromStack.crates.pop();
                    if (crate) {
                        toStack.crates.push(crate);
                    }
                }
            }
        });

        // Get the top crates from each stack
        const topCrates = stacks.map((stack) => {
            return stack.crates.peek();
        });

        console.log("PART 1 ----");
        console.log("TOP CRATES:", topCrates.join(""));
    });

readFile()
    .then((data) => {
        const [crates, movements] = data.split("\n\n");
        return {
            crates,
            movements,
        };
    })
    .then((data) => {
        const stacks = parseCrates(data);
        const movements = parseMovements(data.movements);
        return {
            stacks,
            movements,
        };
    })
    .then((data) => {
        const { stacks, movements } = data;
        // Move crates
        movements.forEach((movement) => {
            const fromStack = stacks.find(
                (stack) => stack.index === movement.from
            );
            const toStack = stacks.find((stack) => stack.index === movement.to);
            if (fromStack && toStack) {
                const tempStack = new Stack<string>();
                for (let i = 0; i < movement.quantity; i++) {
                    const crate = fromStack.crates.pop();
                    if (crate) {
                        tempStack.push(crate);
                    }
                }
                while (!tempStack.isEmpty()) {
                    toStack.crates.push(tempStack.pop());
                }
            }
        });

        // Get the top crates from each stack
        const topCrates = stacks.map((stack) => {
            return stack.crates.peek();
        });

        console.log("PART 2 ----");
        console.log("TOP CRATES:", topCrates.join(""));
    });

// Parse stack of crates
function parseCrates(data: {
    crates: string;
    movements: string;
}): CratesStack[] {
    const chars = data.crates
        .split("\n")
        .sort(() => -1)
        .map((line) => {
            return line.split("");
        });
    let transposed = [];
    // Transpose the array
    for (let i = 0; i < chars[0].length; i++) {
        transposed.push(chars.map((row) => row[i]));
    }

    const stackLines = transposed
        .map((row) => row.join(""))
        .filter((row) => !row.startsWith(" "))
        .map((row) => row.trim());

    const stacks: CratesStack[] = stackLines.map((row: string, index) => {
        const stackIndex = +row[0];
        // Remove numbers from the string
        const crates = row.replace(/\d+/g, "").split("");

        return {
            index: stackIndex,
            crates: new Stack(crates),
        };
    });

    return stacks;
}

// Parse movements with following format:
// move 2 from 1 to 3
function parseMovements(data: string): Movement[] {
    const lines = data.split("\n");

    // Get values from the lines
    const movements = lines.map((line) => {
        const [, quantity, , from, , to] = line.split(" ");
        return {
            quantity: +quantity,
            from: +from,
            to: +to,
        };
    });

    return movements;
}
