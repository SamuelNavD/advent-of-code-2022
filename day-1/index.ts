import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-1/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

readFile().then((data) => {
    const maxNumberOfCalories = data
        .split("\n\n")
        .reduce((maxValue, elfCalories) => {
            // Sum all the lines
            const sum = elfCalories.split("\n").reduce((acc, line) => {
                return acc + Number.parseInt(line);
            }, 0);

            if (sum > maxValue) {
                maxValue = sum;
            }

            return maxValue;
        }, 0);

    console.log("Maximum number of calories: " + maxNumberOfCalories);
});

readFile().then((data) => {
    let calories: Array<number> = data.split("\n\n").map((elfCalories) => {
        // Sum all the lines
        const sum = elfCalories.split("\n").reduce((acc, line) => {
            return acc + Number.parseInt(line);
        }, 0);

        return sum;
    }, 0);

    calories = calories.sort((a, b) => b - a);

    const topCalories = calories
        .slice(0, 3)
        .reduce((previousValue, calorie) => {
            return previousValue + calorie;
        });

    console.log("Calories of the TOP 3 elves: " + topCalories);
});
