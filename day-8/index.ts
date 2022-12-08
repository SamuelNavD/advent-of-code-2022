import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-8/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type MapCoordinates = {
    centerNumber: number;
    edges: {
        left: Array<number>;
        right: Array<number>;
        top: Array<number>;
        bottom: Array<number>;
    };
};

readFile()
    .then(processInput)
    .then(getEdges)
    .then(calculateEdgesWithVisibility)
    .then((result) => {
        console.log("PART 1 ----");
        console.log("Trees with visibility:", result);
    });

readFile()
    .then(processInput)
    .then(getEdges)
    .then(calculateScenicScores)
    .then((scores) => scores.sort((a, b) => b - a)[0])
    .then((result) => {
        console.log("PART 2 ----");
        console.log("Scenic scores:", result);
    });

function processInput(input: string): Array<Array<number>> {
    let map = new Array<Array<number>>();
    const lines = input.split("\n");

    lines.forEach((line) => {
        let row = new Array<number>();
        line.split("").forEach((number) => {
            row.push(parseInt(number));
        });
        map.push(row);
    });

    return map;
}

function getEdges(
    map: Array<Array<number>>
): [Array<Array<number>>, Array<MapCoordinates>] {
    const width = map[0].length;
    const height = map.length;

    let edges = new Array<MapCoordinates>();

    for (let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            const edge = {
                centerNumber: map[i][j],
                edges: {
                    left: new Array<number>(),
                    right: new Array<number>(),
                    top: new Array<number>(),
                    bottom: new Array<number>(),
                },
            };

            edge.edges.left.push(...map[i].slice(0, j));
            edge.edges.right.push(...map[i].slice(j + 1));
            edge.edges.top.push(...map.slice(0, i).map((row) => row[j]));
            edge.edges.bottom.push(...map.slice(i + 1).map((row) => row[j]));

            edges.push(edge);
        }
    }

    return [map, edges];
}

function getEdgesWithEdge(
    map: Array<Array<number>>
): [Array<Array<number>>, Array<MapCoordinates>] {
    const width = map[0].length;
    const height = map.length;

    let edges = new Array<MapCoordinates>();

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const edge = {
                centerNumber: map[i][j],
                edges: {
                    left: new Array<number>(),
                    right: new Array<number>(),
                    top: new Array<number>(),
                    bottom: new Array<number>(),
                },
            };

            edge.edges.left.push(...map[i].slice(0, j));
            edge.edges.right.push(...map[i].slice(j + 1));
            edge.edges.top.push(...map.slice(0, i).map((row) => row[j]));
            edge.edges.bottom.push(...map.slice(i + 1).map((row) => row[j]));

            edges.push(edge);
        }
    }

    return [map, edges];
}

function calculateEdgesWithVisibility(
    input: [Array<Array<number>>, Array<MapCoordinates>]
): number {
    const [map, edges] = input;
    let count = 2 * (map.length - 1) + 2 * (map[0].length - 1);

    edges.forEach((edge) => {
        if (
            edge.edges.left.every((number) => number < edge.centerNumber) ||
            edge.edges.right.every((number) => number < edge.centerNumber) ||
            edge.edges.top.every((number) => number < edge.centerNumber) ||
            edge.edges.bottom.every((number) => number < edge.centerNumber)
        ) {
            count++;
        }
    });

    return count;
}

function calculateScenicScores(
    input: [Array<Array<number>>, Array<MapCoordinates>]
): Array<number> {
    const [map, edges] = input;

    let scores = new Array<number>();

    edges.forEach((edge) => {
        let leftScore = 0;
        let cont = true;
        for (let i = edge.edges.left.length - 1; i >= 0 && cont; i--) {
            leftScore++;
            if (edge.edges.left[i] >= edge.centerNumber) {
                cont = false;
            }
        }

        let rightScore = 0;
        cont = true;
        for (let i = 0; i < edge.edges.right.length && cont; i++) {
            rightScore++;
            if (edge.edges.right[i] >= edge.centerNumber) {
                cont = false;
            }
        }

        let topScore = 0;
        cont = true;
        for (let i = edge.edges.top.length - 1; i >= 0 && cont; i--) {
            topScore++;
            if (edge.edges.top[i] >= edge.centerNumber) {
                cont = false;
            }
        }

        let bottomScore = 0;
        cont = true;
        for (let i = 0; i < edge.edges.bottom.length && cont; i++) {
            bottomScore++;
            if (edge.edges.bottom[i] >= edge.centerNumber) {
                cont = false;
            }
        }

        console.log("score", leftScore * rightScore * topScore * bottomScore);

        scores.push(leftScore * rightScore * topScore * bottomScore);
    });

    return scores;
}
