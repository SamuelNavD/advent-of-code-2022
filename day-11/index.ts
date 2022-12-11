import * as fs from "fs";
import { Queue } from "@datastructures-js/queue";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-11/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

enum OperationType {
    SUM = "sum",
    MULTIPLY = "multiply",
}

type Operation = {
    opType: OperationType;
    left: number | "old";
    right: number | "old";
};

type Monkey = {
    id: number;
    items: Queue<number>;
    operation: Operation;
    testDivisibleBy: number;
    trueCaseThrowMonkey: number;
    falseCaseThrowMonkey: number;
};

type Turn = {
    id: number;
    monkeysState: Monkey[];
    inspections: number[];
};

readFile()
    .then(processInput)
    .then(playSimulation)
    .then(getMonkeyBusiness)
    .then((result) => {
        console.log("PART 1 ----");
        console.log("Monkey business:", result);
    });

readFile()
    .then(processInput)
    .then(playSimulationPart2)
    .then(getMonkeyBusiness)
    .then((result) => {
        console.log("PART 2 ----");
        console.log("Monkey business:", result);
    });

function processInput(input: string): Monkey[] {
    const monkeys = input.split("\n\n");

    const monkeyList: Monkey[] = monkeys.map((monkey, index) => {
        const [
            monkeyId,
            items,
            operation,
            testDivisibleBy,
            trueCaseThrowMonkey,
            falseCaseThrowMonkey,
        ] = monkey.split("\n");

        const newMonkeyId = monkeyId.split("Monkey ")[1].slice(0, -1);
        const newMonkeyItems = items.split("Starting items: ")[1];
        const newMonkeyOperationDescription =
            operation.split("Operation: new = ")[1];
        const newMonkeyOperationDescriptionParts =
            newMonkeyOperationDescription.split(" ");
        const newMonkeyOperation = {
            opType: newMonkeyOperationDescription.includes("+")
                ? OperationType.SUM
                : OperationType.MULTIPLY,
            left:
                newMonkeyOperationDescriptionParts[0] == "old"
                    ? "old"
                    : parseInt(newMonkeyOperationDescriptionParts[0]),
            right:
                newMonkeyOperationDescriptionParts[2] == "old"
                    ? "old"
                    : parseInt(newMonkeyOperationDescriptionParts[2]),
        } as Operation;

        const newMonkeyTestDivisibleBy = testDivisibleBy.split(
            "Test: divisible by "
        )[1];
        const newMonkeyTrueCaseThrowMonkey = trueCaseThrowMonkey.split(
            "If true: throw to monkey "
        )[1];
        const newMonkeyFalseCaseThrowMonkey = falseCaseThrowMonkey.split(
            "If false: throw to monkey "
        )[1];
        return {
            id: parseInt(newMonkeyId),
            items: new Queue(newMonkeyItems.split(", ").map(Number)),
            operation: newMonkeyOperation,
            testDivisibleBy: parseInt(newMonkeyTestDivisibleBy),
            trueCaseThrowMonkey: parseInt(newMonkeyTrueCaseThrowMonkey),
            falseCaseThrowMonkey: parseInt(newMonkeyFalseCaseThrowMonkey),
        };
    });

    return monkeyList;
}

function playSimulation(monkeys: Monkey[]): Turn[] {
    const TURNS = 20;

    const turns: Turn[] = [
        {
            id: 0,
            monkeysState: [
                ...monkeys.map((monkey) => ({
                    ...monkey,
                    items: monkey.items.clone(),
                })),
            ],
            inspections: new Array<number>(monkeys.length).fill(0),
        },
    ];

    for (let i = 1; i <= TURNS; i++) {
        let turn: Turn = {
            id: i,
            monkeysState: [
                ...turns[i - 1].monkeysState.map((monkey) => ({
                    ...monkey,
                    items: monkey.items.clone(),
                })),
            ],
            inspections: [...turns[i - 1].inspections],
        };

        turn.monkeysState.forEach((monkey) => {
            while (!monkey.items.isEmpty()) {
                turn.inspections[monkey.id]++;
                const item = monkey.items.dequeue();
                const left =
                    monkey.operation.left === "old"
                        ? item
                        : monkey.operation.left;
                const right =
                    monkey.operation.right === "old"
                        ? item
                        : monkey.operation.right;
                let result =
                    monkey.operation.opType === OperationType.SUM
                        ? left + right
                        : left * right;
                result = Math.floor(result / 3);
                if (result % monkey.testDivisibleBy === 0) {
                    turn.monkeysState[monkey.trueCaseThrowMonkey].items.enqueue(
                        result
                    );
                } else {
                    turn.monkeysState[
                        monkey.falseCaseThrowMonkey
                    ].items.enqueue(result);
                }
            }
        });

        turns.push({
            id: i,
            monkeysState: turn.monkeysState.map((monkey) => monkey),
            inspections: turn.inspections.map((inspection) => inspection),
        });
    }
    return turns;
}

function getMonkeyBusiness(turns: Turn[]): number {
    let monkeys = new Array<number>(turns[0].monkeysState.length).fill(0);

    turns[turns.length - 1].inspections.forEach((inspection, index) => {
        monkeys[index] = inspection;
    });

    monkeys = monkeys.sort((a, b) => b - a);

    return monkeys[0] * monkeys[1];
}

function playSimulationPart2(monkeys: Monkey[]): Turn[] {
    const TURNS = 10000;

    const divider = monkeys.reduce((acc, div) => {
        return acc * div.testDivisibleBy;
    }, 1);

    const turns: Turn[] = [
        {
            id: 0,
            monkeysState: [
                ...monkeys.map((monkey) => ({
                    ...monkey,
                    items: monkey.items.clone(),
                })),
            ],
            inspections: new Array<number>(monkeys.length).fill(0),
        },
    ];

    for (let i = 1; i <= TURNS; i++) {
        let turn: Turn = {
            id: i,
            monkeysState: [
                ...turns[i - 1].monkeysState.map((monkey) => ({
                    ...monkey,
                    items: monkey.items.clone(),
                })),
            ],
            inspections: [...turns[i - 1].inspections],
        };

        turn.monkeysState.forEach((monkey) => {
            while (!monkey.items.isEmpty()) {
                const item = monkey.items.dequeue();
                turn.inspections[monkey.id]++;
                const left =
                    monkey.operation.left === "old"
                        ? item
                        : monkey.operation.left;
                const right =
                    monkey.operation.right === "old"
                        ? item
                        : monkey.operation.right;
                let result =
                    monkey.operation.opType === OperationType.SUM
                        ? left + right
                        : left * right;

                result = Math.floor(result / 1);

                if (result % monkey.testDivisibleBy === 0) {
                    turn.monkeysState[monkey.trueCaseThrowMonkey].items.enqueue(
                        result % divider
                    );
                } else {
                    turn.monkeysState[
                        monkey.falseCaseThrowMonkey
                    ].items.enqueue(result % divider);
                }
            }
        });

        turns.push({
            id: i,
            monkeysState: turn.monkeysState.map((monkey) => monkey),
            inspections: turn.inspections.map((inspection) => inspection),
        });
    }

    return turns;
}
