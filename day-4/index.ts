import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-4/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type Range = {
    min: number;
    max: number;
};

type Pair = {
    elf1: Range;
    elf2: Range;
};

readFile()
    .then((data) => {
        const pairs: Array<Pair> = data.split("\n").map((line) => {
            const [elf1, elf2] = line.split(",");

            const [elf1Min, elf1Max] = elf1
                .split("-")
                .map((num) => parseInt(num, 10));
            const [elf2Min, elf2Max] = elf2
                .split("-")
                .map((num) => parseInt(num, 10));

            return {
                elf1: { min: elf1Min, max: elf1Max },
                elf2: { min: elf2Min, max: elf2Max },
            };
        });

        return pairs;
    })
    .then((pairs) => {
        let invalidPairs = 0;
        pairs.forEach((pair: Pair) => {
            if (
                (pair.elf1.min <= pair.elf2.min &&
                    pair.elf1.max >= pair.elf2.max) ||
                (pair.elf2.min <= pair.elf1.min &&
                    pair.elf2.max >= pair.elf1.max)
            ) {
                invalidPairs++;
            }
        });
        console.log("PART 1 ----");
        console.log("Invalid pairs: " + invalidPairs);
    });

readFile()
    .then((data) => {
        const pairs: Array<Pair> = data.split("\n").map((line) => {
            const [elf1, elf2] = line.split(",");

            const [elf1Min, elf1Max] = elf1
                .split("-")
                .map((num) => parseInt(num, 10));
            const [elf2Min, elf2Max] = elf2
                .split("-")
                .map((num) => parseInt(num, 10));

            return {
                elf1: { min: elf1Min, max: elf1Max },
                elf2: { min: elf2Min, max: elf2Max },
            };
        });

        return pairs;
    })
    .then((pairs) => {
        let overlappingPairs = 0;
        pairs.forEach((pair: Pair) => {
            if (
                (pair.elf1.min <= pair.elf2.min &&
                    pair.elf2.min <= pair.elf1.max) ||
                (pair.elf2.min <= pair.elf1.min &&
                    pair.elf1.min <= pair.elf2.max)
            ) {
                overlappingPairs++;
            }
        });
        console.log("PART 2 ----");
        console.log("Overlapping pairs: " + overlappingPairs);
    });
