function setModalConfirm({
  data, title, elem = null, onSubmit,
}) {
  if (elem === null) {
    elem = '<ul>';
    data.forEach((item) => {
      elem += `<li>${item.param} - ${item.msg}</li>`;
    });

    elem += '</ul>';
  }
  $('#modal-confirm').modal('toggle');
  $('#modal-confirm').css('z-index', 1050);
  $('#modal-confirm').find('.modal-body').html(elem);
  $('#modal-confirm').find('.modal-title').text(title);
  $('#submit').click(() => {
    onSubmit();
  });
}

function setModalInfo({
  data, title, elem = null,
}) {
  if (!elem) {
    let elem = '<ul>';
    data.forEach((item) => {
      elem += `<li>${item.param} - ${item.msg}</li>`;
    });

    elem += '</ul>';
  }
  $('#modal-info').modal('toggle');
  $('#modal-info').find('.modal-body').html(elem);
  $('#modal-info').find('.modal-title').text(title);
  setTimeout(() => {
    $('#modal-info').modal('toggle');
  }, 1000);
}
