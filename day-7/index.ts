import * as fs from "fs";

function readFile(): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile("day-7/input.txt", "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

enum ItemType {
    File,
    Folder,
}

type Item = {
    name: string;
    size: number;
    type: ItemType;
    parent?: Item;
    children?: Item[];
};

readFile()
    .then((data) => {
        return data.split("\n");
    })
    .then((lines) => {
        return processLines(lines);
    })
    .then((fs) => {
        // Calculate size of each folder
        fs.size = calculateSize(fs);
        return fs;
    })
    .then((fs) => {
        let sumSize = 0;
        filterRecursiveSizeLower(fs, 100000).forEach((folder) => {
            sumSize += folder.size;
        });

        console.log("PART 1 ----");
        console.log("Sum of size of folders with size > 100000: ", sumSize);
    });

readFile()
    .then((data) => {
        return data.split("\n");
    })
    .then((lines) => {
        return processLines(lines);
    })
    .then((fs) => {
        // Calculate size of each folder
        fs.size = calculateSize(fs);
        return fs;
    })
    .then((fs) => {
        const DEVICE_SIZE = 70000000;
        const UPDATE_SIZE = 30000000;
        const requiredSpace = UPDATE_SIZE - (DEVICE_SIZE - fs.size);
        if (requiredSpace <= 0) {
            console.log("PART 2 ----");
            console.log("No need to delete any folder");
            return;
        }
        const smallestFolderSize = filterRecursiveSizeGreater(
            fs,
            requiredSpace
        ).sort((a, b) => a.size - b.size)[0].size;

        console.log("PART 2 ----");
        console.log(
            "Size of the smallest folder needed to delete: ",
            smallestFolderSize
        );
    });

function processLines(lines: string[]): Item {
    const fs: Item = {
        name: "",
        size: 0,
        type: ItemType.Folder,
        parent: undefined,
        children: [],
    };

    let currentFolder: Item = fs;

    lines.forEach((line) => {
        if (line.startsWith("$")) {
            if (line.startsWith("$ cd")) {
                const folderName = line.split(" ")[2];
                if (folderName === "..") {
                    currentFolder = currentFolder.parent;
                } else {
                    const folder: Item = {
                        name: folderName,
                        size: 0,
                        type: ItemType.Folder,
                        parent: currentFolder,
                        children: [],
                    };
                    currentFolder.children.push(folder);
                    currentFolder = folder;
                }
            }
        } else {
            const [size, name] = line.split(" ");
            if (size === "dir") {
                const folder: Item = {
                    name,
                    size: 0,
                    type: ItemType.Folder,
                    parent: currentFolder,
                    children: [],
                };
                currentFolder.children.push(folder);
            } else {
                const file: Item = {
                    name,
                    size: parseInt(size),
                    type: ItemType.File,
                };
                currentFolder.children.push(file);
            }
        }
    });

    return fs;
}

function calculateSize(folder: Item): number {
    let size = 0;
    folder.children.forEach((child) => {
        if (child.type === ItemType.Folder) {
            child.size = calculateSize(child);
        }
        size += child.size;
    });
    return size;
}

function filterRecursiveSizeLower(fs: Item, size: number): Item[] {
    const result: Item[] = [];

    if (fs.size <= size) {
        result.push(fs);
    }

    fs.children.forEach((child) => {
        if (child.type === ItemType.Folder) {
            result.push(...filterRecursiveSizeLower(child, size));
        }
    });

    return result;
}

function filterRecursiveSizeGreater(fs: Item, size: number): Item[] {
    const result: Item[] = [];

    if (fs.size >= size) {
        result.push(fs);
    }

    fs.children.forEach((child) => {
        if (child.type === ItemType.Folder) {
            result.push(...filterRecursiveSizeGreater(child, size));
        }
    });

    return result;
}
