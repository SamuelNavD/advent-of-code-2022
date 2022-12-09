import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-9/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type Movement = {
    direction: "U" | "D" | "L" | "R";
    steps: number;
};

type Coordinate = {
    x: number;
    y: number;
};

type Rope = {
    length: number;
    headPosition: Coordinate;
    knot: Array<Coordinate>;
};

readFile()
    .then(processInput)
    .then((movements) => getCoordinates(movements, 1))
    .then(getDistinct)
    .then((result) => {
        console.log("PART 1 ----");
        console.log(result);
    });

readFile()
    .then(processInput)
    .then((movements) => getCoordinates(movements, 9))
    .then(getDistinct)
    .then((result) => {
        console.log("PART 2 ----");
        console.log(result);
    });

function processInput(input: string): Array<Movement> {
    const lines = input.split("\n");

    const movements: Array<Movement> = new Array<Movement>();

    lines.forEach((line) => {
        const [direction, steps] = line.split(" ");
        movements.push({
            direction: direction as "U" | "D" | "L" | "R",
            steps: parseInt(steps),
        });
    });

    return movements;
}

function getCoordinates(
    movements: Array<Movement>,
    ropeLength: number
): Array<Coordinate> {
    const coordinates: Array<Coordinate> = new Array<Coordinate>();

    const rope = {
        length: ropeLength,
        headPosition: { x: 0, y: 0 },
        knot: new Array<Coordinate>(),
    };

    for (let i = 0; i < rope.length; i++) {
        rope.knot.push({ x: 0, y: 0 });
    }

    movements.forEach((movement) => {
        for (let i = 0; i < movement.steps; i++) {
            switch (movement.direction) {
                case "U":
                    rope.headPosition.y++;
                    break;
                case "D":
                    rope.headPosition.y--;
                    break;
                case "L":
                    rope.headPosition.x--;
                    break;
                case "R":
                    rope.headPosition.x++;
                    break;
            }

            rope.knot = updateTailPositions({ ...rope });

            coordinates.push({ ...rope.knot[rope.length - 1] });
        }
    });

    return coordinates;
}

function updateTailPositions(rope: Rope): Array<Coordinate> {
    let previousNode = { ...rope.headPosition };
    rope.knot = rope.knot.map((currentNode) => {
        if (
            previousNode !== currentNode &&
            calculateDistance(previousNode, currentNode) >= 2
        ) {
            // Move tailPosition to be 1 step away from headPosition
            if (previousNode.x === currentNode.x) {
                if (previousNode.y > currentNode.y) {
                    currentNode.y++;
                } else {
                    currentNode.y--;
                }
            } else if (previousNode.y === currentNode.y) {
                if (previousNode.x > currentNode.x) {
                    currentNode.x++;
                } else {
                    currentNode.x--;
                }
            } else {
                if (previousNode.x > currentNode.x) {
                    currentNode.x++;
                } else {
                    currentNode.x--;
                }
                if (previousNode.y > currentNode.y) {
                    currentNode.y++;
                } else {
                    currentNode.y--;
                }
            }
        }
        previousNode = { ...currentNode };
        return currentNode;
    });

    return rope.knot;
}

function calculateDistance(
    position1: Coordinate,
    position2: Coordinate
): number {
    return Math.sqrt(
        Math.pow(Math.abs(position1.x - position2.x), 2) +
            Math.pow(Math.abs(position1.y - position2.y), 2)
    );
}

function getDistinct(coordinates: Array<Coordinate>): number {
    return new Set(
        coordinates.map((coordinate) => `${coordinate.x},${coordinate.y}`)
    ).size;
}
