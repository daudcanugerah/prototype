const moment = require('moment');

module.export.moment = () =>{
    moment.locale('id');
    return moment;
}