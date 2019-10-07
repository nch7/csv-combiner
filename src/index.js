const csvToJson = require('csvtojson');
const { parseAsync } = require('json2csv');

const pathA = process.argv[2];
const pathB = process.argv[3];
const column = process.argv[4];

const combiner = async (files, column) => {
    let resultsMap = {};
    let resultsArr = [];
    let fieldsMap = {};

    for (let file of files) {
        const rows = await csvToJson().fromFile(file);
        for (let row of rows) {
            if (!row[column]) {
                continue;
            }
            if (!resultsMap[row[column]]) {
                resultsMap[row[column]] = {}
            }
            resultsMap[row[column]] = {
                ...resultsMap[row[column]],
                ...row
            }
        }
    }

    for (let key in resultsMap) {
        resultsArr.push(resultsMap[key])
        for (let fieldName in resultsMap[key]) {
            fieldsMap[fieldName] = true;
        }
    }

    const csv = parseAsync(resultsArr, {
        fields: Object.keys(fieldsMap),
    });

    return csv;
};

combiner([pathA, pathB], column).then(console.log).catch(console.error)
