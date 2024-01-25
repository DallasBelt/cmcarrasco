$(document).ready(function () {
  let date = new Date();
  let year = date.getFullYear();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let _month = (month < 10) ? `0${month}` : month.toString();

  let minDate = `${year}-${_month}-${day}`
  document.getElementById('appt-edit-date').min = minDate;
});