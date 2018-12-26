/* eslint-disable */
const option = {
  minute(target) {
    let data = '';
    const length = 59;
    for (let i = 0; i <= length; i++) {
      data += `<option value=${i}>${(i < 10 ? (`0${i}`) : i)}</option>`;
    }
    return data;
  },
  hour(target) {
    let data = '';
    const length = 23;
    for (let i = 0; i <= length; i++) {
      data += `<option value=${i}>${(i < 10 ? (`0${i}`) : i)}</option>`;
    }
    return data;
  },
  dayOfMonth(target) {
    let data = '';
    const length = 31;
    for (let i = 1; i <= length; i++) {
      data += `<option value=${i}>${(i < 10 ? (`0${i}`) : i)}</option>`;
    }
    return data;
  },
  month(target) {
    let data = '';
    const months = moment.months();
    const length = 12;
    for (let i = 1; i <= length; i++) {
      data += `<option value=${i}>${months[i - 1]}</option>`;
    }
    return data;
  },
  dayOfWeek(target) {
    let data = '';
    const dayofweek = moment.weekdays();
    length = 7;
    for (let i = 1; i <= length; i++) {
      data += `<option value=${i}>${dayofweek[i - 1]}</option>`;
    }
    return data;
  },
};

const elem = {
  multiples: (elem, name) => `<div class="input-group ${name === 'month' || name == 'dayOfWeek' ? 'col-md-3' : 'col-md-3'} mb-3">
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
    </div>`,
  step: (elem, name) => `<div class="input-group ${name === 'month' || name == 'dayofweek' ? 'col-md-3' : 'col-md-3'} mb-3">
        <div class="input-group-append">
        <button class="btn btn-sm btn-outline-secondary" type="button" disable>S</button>
    </div>
        <input type="number" class="form-control" name="time[${name}][step][]">
        <div class="input-group-append">
            <button class="btn btn-sm btn-outline-secondary remove-minute"
                type="button">X</button>
        </div>
    </div>`,
  range: (elem, name) => `
    <div class="input-group ${name === 'month' || name == 'dayOfWeek' ? 'col-md-4' : 'col-md-3'} mb-3">
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
    </div > `,
};
const AddSchedule = (name) => { 
  $(`.dropdown-menu.add-${name} a`).on('click', function (event) {
    event.preventDefault();
    debugger;;
    const data = $(this).attr('data-id');
    $(`.${name}`).append(elem[data](option[name](data), name));
  });
};
$(document).on('click', '.input-group-append', function () {
  $(this).parent().remove();
});
