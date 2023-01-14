(function () {
  'use strict';

  var moment = document.getElementById('moment');
  var slider = document.getElementById('slider');
  var dataSelect = document.getElementById('data_select');
  var momentSelect = document.getElementById('moment_select');
  var reload = document.getElementById('reload');
  var progress = {
    ratio: 0
  };
  var scrubEvt = new CustomEvent('seek', {
    detail: progress
  });
  var copy;

  function scrub() {
    progress.ratio = slider.value * 0.001;
    moment.contentWindow.dispatchEvent(scrubEvt);
  }

  function loadData() {
    var req = new XMLHttpRequest();
    req.open('GET', dataSelect.value);
    req.responseType = 'json';
    req.send();

    req.onload = function () {
      moment.contentWindow.initMoment(req.response, copy);
      slider.value = 0;
      scrub();
      dataSelect.style.display = 'none';
      slider.style.display = 'inline';
    };
  }

  function loadCopy() {
    var req = new XMLHttpRequest();
    req.open('GET', '../localization.json');
    req.responseType = 'json';
    req.send();

    req.onload = function () {
      copy = req.response;
      momentSelect.style.display = 'inline';
    };
  }

  function loadMoment() {
    moment.src = momentSelect.value;
    momentSelect.style.display = 'none';
    dataSelect.style.display = 'inline';
    reload.style.display = 'inline';
  }

  slider.addEventListener('input', scrub);
  dataSelect.addEventListener('change', loadData);
  momentSelect.addEventListener('change', loadMoment);
  reload.addEventListener('click', function () {
    window.location.reload(true);
  });
  loadCopy();

}());
