'use strict';

// had enabled by egg
// exports.static = true;

exports.cors = {
    enable: true,
    package: 'egg-cors',
};

exports.security = {
    enable: false,
};

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};