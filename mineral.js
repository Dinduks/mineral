#!/usr/bin/env node

var fileName = process.argv[2];

if (fileName == undefined) {
    console.error("Please specify a Mineral script.");
}
