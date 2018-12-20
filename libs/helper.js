const multer = require('multer');

let isset = function isset(v) {
    if (typeof v !== 'undefined' && v !== null) {
        return true;
    }
    return false;
}

let upload = function (args) {
    const upload = multer({ dest: 'public/uploads', ...args })
    return upload;
};


let imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(Promise.reject('error'), false);
    }
};


let extractForm = function (data) {
    let newa = {};
    for (const object in data) {
        newa[object] = {};
        for (const key in data[object]) {
            let temp = data[object][key];
            if (key == "range") {
                newa[object][key] = [];
                for (let i = 0; i < temp['from'].length; i++) {
                    newa[object][key].push([temp['from'][i], temp['to'][i]]);
                }
            } else {
                newa[object][key] = temp;
            }
        }
    }
    return newa;
};

let converToCron = function (data, name) {
    if (isset(data[name])) {
        let result = "";
        let object = data[name];
        for (const key in object) {
            switch (key) {
                case 'range':
                    for (let i = 0; i < object[key].length; i++) {
                        result += `${object[key][i][0]}-${object[key][i][1]},`;
                    }
                    break;
                case 'multiples':
                    object[key].forEach(item => {
                        result += `${item},`
                    });
                    break;
                case 'step':
                    object[key].forEach(item => {
                        result += `*/${item},`
                    });
                    break;
            }
        }
        return result.substr(0, result.length - 1);
    } else {
        return '*';
    }
};

let getCronFormat = (data, layout = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek']) => {
    let result = "";
    layout.forEach(item => {
        result += converToCron(data, item) + " ";
    })
    return result.trimRight();
};

let mix = function (...mixins) {
    class Mix { }

    // Programmatically add all the methods and accessors
    // of the mixins to class Mix.
    for (let mixin of mixins) {
        copyProperties(Mix, mixin);
        copyProperties(Mix.prototype, mixin.prototype);
    }

    return Mix;
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== "constructor" && key !== "prototype" && key !== "name") {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
module.exports = {
    isset, upload, imageFilter, extractForm, getCronFormat, converToCron, mix
}
