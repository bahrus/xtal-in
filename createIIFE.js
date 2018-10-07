const jiife = require('jiife');
const xtal = 'node_modules/xtal-latx/';
const base = [xtal + 'define.js', xtal + 'getHost.js', xtal + 'observeCssSelector.js'];
const xtalIn = base.concat('xtal-in.js');
jiife.processFiles(xtalIn, 'xtal-in.iife.js');