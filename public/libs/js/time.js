
let option = {
    minute: function (target) {
        let data = "";
        let length = 59;
        for (let i = 0; i <= length; i++) {
            data += `<option value=${i}>${(i < 10 ? ('0' + i) : i)}</option>`;
        }
        return data;
    },
    hour: function (target) {
        let data = "";
        let length = 23;
        for (let i = 0; i <= length; i++) {
            data += `<option value=${i}>${(i < 10 ? ('0' + i) : i)}</option>`;
        }
        return data;
    },
    dayOfMonth: function (target) {
        let data = "";
        let length = 31;
        for (let i = 1; i <= length; i++) {
            data += `<option value=${i}>${(i < 10 ? ('0' + i) : i)}</option>`;
        }
        return data;
    },
    month: function (target) {
        let data = "";
        let months = moment.months();
        let length = 12;
        for (let i = 1; i <= length; i++) {
            data += `<option value=${i}>${target == 'step' ? i : months[i - 1]}</option>`;
        }
        return data;
    },
    dayOfWeek: function (target) {
        let data = "";
        let dayofweek = moment.weekdays();
        length = 7;
        for (let i = 1; i <= length; i++) {
            data += `<option value=${i}>${target == 'step' ? i : dayofweek[i-1]}</option>`;
        }
        return data;
    }
}

let elem = {
    multiples: (elem, name) => {

        return `<div class="input-group ${name === "month" || name == "dayOfWeek" ? 'col-sm-3' : 'col-sm-3'} mb-3">
        <div class="input-group-append">
        <button class="btn btn-sm btn-outline-secondary" type="button" disable>M</button>
    </div>
        <select class="custom-select" name="time[${name}][multiples][]">
        ${elem}
        </select>
        <div class="input-group-append">
            <button class="btn btn-sm btn-outline-secondary remove-minute"
                type="button">X</button>
        </div>
    </div>`;
    },
    step: (elem, name) => {
        return `<div class="input-group ${name === "month" || name == "dayofweek" ? 'col-sm-3' : 'col-sm-3'} mb-3">
        <div class="input-group-append">
        <button class="btn btn-sm btn-outline-secondary" type="button" disable>S</button>
    </div>
        <select class="custom-select" name="time[${name}][step][]">
        ${elem}
        </select>
        <div class="input-group-append">
            <button class="btn btn-sm btn-outline-secondary remove-minute"
                type="button">X</button>
        </div>
    </div>`
    },
    range: (elem, name) => {
        return `
    <div class="input-group ${name === "month" || name == "dayOfWeek" ? 'col-sm-4' : 'col-sm-3'} mb-3">
        <div class="input-group-append">
        <button class="btn btn-sm btn-outline-secondary" type="button" disable>R</button>
    </div>
        <select class="custom-select" name="time[${name}][range][from][]">
            <option value="">From</option>
            ${elem}
        </select>
        <select class="custom-select" name="time[${name}][range][to][]">
            <option value="">To</option>
            ${elem}
        </select>
        <div class="input-group-append">
            <button class="btn btn-sm btn-outline-secondary remove-minute" type="button">X</button>
        </div>
    </div > `
    }
}
let AddSchedule = (name) => {
    $(`.dropdown-menu.add-${name} a`).on('click', function (event) {
        event.preventDefault();
        let data = $(this).attr('data-id');
        $(`.${name}`).append(elem[data](option[name](data), name));
    });

}
$(document).on('click', ".input-group-append", function () {
    $(this).parent().remove();
});