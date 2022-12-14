import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-14/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

type Coordinates = {
    x: number;
    y: number;
};

type Rock = {
    coordinates: Coordinates[];
};

type RockMap = {
    rocks: Rock[];
    dimensions: {
        width: number;
        height: number;
    };
    map: string[][];
    sandDrop: Coordinates;
};

readFile()
    .then(processInput)
    .then(createMap)
    .then(simplifyMap)
    .then(simulate)
    .then((result) => {
        console.log("\nPART 1 ----");
        console.log("Sands dropped before falling into the abyss:", result);
    });

readFile()
    .then(processInput)
    .then(addFloor)
    .then(createMap)
    .then(simplifyMap)
    .then(simulatePart2)
    .then((result) => {
        console.log("\nPART 2 ----");
        console.log("Sands dropped before obstructing sand drop:", result);
    });

function processInput(input: string): Rock[] {
    const lines = input.split("\n");
    const rocks: Rock[] = [];

    lines.forEach((line) => {
        const coordinates: Coordinates[] = line.split(" -> ").map((coord) => {
            const [x, y] = coord.split(",");
            return { x: parseInt(x), y: parseInt(y) };
        });

        rocks.push({
            coordinates: coordinates,
        });
    });

    return rocks;
}

function addFloor(rocks: Rock[]): Rock[] {
    const FLOOR_DISTANCE = 2;

    const minX = 0;
    let maxX = 0;
    rocks.forEach((rock) => {
        rock.coordinates.forEach((coord) => {
            if (coord.x > maxX) {
                maxX = coord.x;
            }
        });
    });
    maxX *= 2;

    let maxY = 0;
    rocks.forEach((rock) => {
        rock.coordinates.forEach((coord) => {
            if (coord.y > maxY) {
                maxY = coord.y;
            }
        });
    });

    const floor: Rock = {
        coordinates: [
            { x: minX, y: maxY + FLOOR_DISTANCE },
            { x: maxX, y: maxY + FLOOR_DISTANCE },
        ],
    };

    rocks.push(floor);

    return rocks;
}

function createMap(rocks: Rock[]): RockMap {
    const dimensions = getDimensions(rocks);
    const map = createEmptyMap(dimensions);

    rocks.forEach((rock) => {
        // Connect the coordinates in rect lines
        rock.coordinates.forEach((coord, index) => {
            if (index + 1 < rock.coordinates.length) {
                const nextCoord = rock.coordinates[index + 1];

                if (coord.x === nextCoord.x) {
                    // Vertical line
                    if (coord.y < nextCoord.y) {
                        for (let i = coord.y; i <= nextCoord.y; i++) {
                            map[i][coord.x] = "#";
                        }
                    } else {
                        for (let i = coord.y; i >= nextCoord.y; i--) {
                            map[i][coord.x] = "#";
                        }
                    }
                } else if (coord.y === nextCoord.y) {
                    // Horizontal line
                    if (coord.x < nextCoord.x) {
                        for (let i = coord.x; i <= nextCoord.x; i++) {
                            map[coord.y][i] = "#";
                        }
                    } else {
                        for (let i = coord.x; i >= nextCoord.x; i--) {
                            map[coord.y][i] = "#";
                        }
                    }
                }
            }
        });
    });

    const sandDrop = { x: 500, y: 0 };

    map[sandDrop.y][sandDrop.x] = "+";

    return {
        rocks: rocks,
        dimensions: dimensions,
        map: map,
        sandDrop: sandDrop,
    };
}

function getDimensions(rocks: Rock[]): { width: number; height: number } {
    let width = 0;
    let height = 0;

    rocks.forEach((rock) => {
        rock.coordinates.forEach((coord) => {
            if (coord.x > width) {
                width = coord.x;
            }

            if (coord.y > height) {
                height = coord.y;
            }
        });
    });

    return { width: width, height: height };
}

function createEmptyMap(dimensions: {
    width: number;
    height: number;
}): string[][] {
    const map: string[][] = [];

    for (let i = 0; i <= dimensions.height; i++) {
        map.push([]);
        for (let j = 0; j <= dimensions.width; j++) {
            map[i].push(".");
        }
    }

    return map;
}

function simplifyMap(rockMap: RockMap): RockMap {
    const minY = 0;
    let maxY = 0;
    rockMap.map.forEach((row, y) => {
        if (row.includes("#")) {
            maxY = y;
        }
    });

    let minX = rockMap.dimensions.width;
    let maxX = 0;
    rockMap.map.forEach((row, y) => {
        if (y >= minY && y <= maxY) {
            row.forEach((cell, x) => {
                if (cell === "#") {
                    if (x < minX) {
                        minX = x;
                    }

                    if (x > maxX) {
                        maxX = x;
                    }
                }
            });
        }
    });

    console.log(minX, maxX, minY, maxY);

    const newMap: string[][] = [];

    for (let i = 0; i <= maxY - minY; i++) {
        newMap.push([]);
        for (let j = 0; j <= maxX - minX; j++) {
            newMap[i].push(rockMap.map[i + minY][j + minX]);
        }
    }

    rockMap.map = newMap;
    rockMap.dimensions = { width: maxX, height: maxY };

    rockMap.map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === "+") {
                rockMap.sandDrop = { x: x, y: y };
                return;
            }
        });
    });

    console.log("Simplified map:");
    rockMap.map.forEach((row, y) => {
        console.log(
            row.slice(rockMap.sandDrop.x - 50, rockMap.sandDrop.x + 50).join("")
        );
    });

    return rockMap;
}

function simulate(rockMap: RockMap): number {
    let cont = true;
    let time = 0;
    while (cont) {
        time++;

        if (rockMap.map[rockMap.sandDrop.y + 1][rockMap.sandDrop.x] === ".") {
            let coord = {
                x: rockMap.sandDrop.x,
                y: rockMap.sandDrop.y + 1,
            };

            rockMap.map[coord.y][coord.x] = "o";

            while (++coord.y <= rockMap.dimensions.height) {
                if (rockMap.map[coord.y][coord.x] === ".") {
                    rockMap.map[coord.y][coord.x] = "o";
                    rockMap.map[coord.y - 1][coord.x] = ".";
                } else {
                    if (
                        coord.x - 1 < 0 ||
                        coord.x + 1 >= rockMap.dimensions.width
                    ) {
                        break;
                    }
                    if (
                        coord.x - 1 >= 0 &&
                        rockMap.map[coord.y][coord.x - 1] === "."
                    ) {
                        rockMap.map[coord.y][--coord.x] = "o";
                        rockMap.map[coord.y - 1][coord.x + 1] = ".";
                    } else if (
                        coord.x + 1 < rockMap.dimensions.width &&
                        rockMap.map[coord.y][coord.x + 1] === "."
                    ) {
                        rockMap.map[coord.y][++coord.x] = "o";
                        rockMap.map[coord.y - 1][coord.x - 1] = ".";
                    } else {
                        break;
                    }
                }
            }

            if (coord.y > rockMap.dimensions.height) {
                rockMap.map[coord.y - 1][coord.x] = ".";
                cont = false;
                time--;
            }
        } else {
            cont = false;
        }
    }

    console.log("\nFinal map:");
    rockMap.map.forEach((row, y) => {
        console.log(
            row.slice(rockMap.sandDrop.x - 50, rockMap.sandDrop.x + 50).join("")
        );
    });

    return time;
}

function simulatePart2(rockMap: RockMap): number {
    let cont = true;
    let time = 0;
    while (cont) {
        time++;

        if (rockMap.map[rockMap.sandDrop.y][rockMap.sandDrop.x] === ".") {
            rockMap.map[rockMap.sandDrop.y][rockMap.sandDrop.x] = "+";
        }

        if (rockMap.map[rockMap.sandDrop.y][rockMap.sandDrop.x] === "+") {
            let coord = {
                x: rockMap.sandDrop.x,
                y: rockMap.sandDrop.y,
            };

            rockMap.map[coord.y][coord.x] = "o";

            while (++coord.y <= rockMap.dimensions.height) {
                if (rockMap.map[coord.y][coord.x] === ".") {
                    rockMap.map[coord.y][coord.x] = "o";
                    rockMap.map[coord.y - 1][coord.x] = ".";
                } else {
                    if (
                        coord.x - 1 < 0 ||
                        coord.x + 1 >= rockMap.dimensions.width
                    ) {
                        break;
                    }
                    if (
                        coord.x - 1 >= 0 &&
                        rockMap.map[coord.y][coord.x - 1] === "."
                    ) {
                        rockMap.map[coord.y][--coord.x] = "o";
                        rockMap.map[coord.y - 1][coord.x + 1] = ".";
                    } else if (
                        coord.x + 1 < rockMap.dimensions.width &&
                        rockMap.map[coord.y][coord.x + 1] === "."
                    ) {
                        rockMap.map[coord.y][++coord.x] = "o";
                        rockMap.map[coord.y - 1][coord.x - 1] = ".";
                    } else {
                        break;
                    }
                }
            }

            if (coord.y > rockMap.dimensions.height) {
                rockMap.map[coord.y - 1][coord.x] = ".";
                console.log("Breaking at " + coord.x + ", " + coord.y);
                rockMap.map[coord.y - 1][coord.x] = ".";
                cont = false;
                time--;
            }
        } else {
            cont = false;
            time--;
        }
    }

    console.log("\nFinal map:");
    rockMap.map.forEach((row, y) => {
        console.log(
            row.slice(rockMap.sandDrop.x - 50, rockMap.sandDrop.x + 50).join("")
        );
    });

    return time;
}
