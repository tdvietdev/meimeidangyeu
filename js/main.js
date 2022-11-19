function countDate(date2, date1) {
  let difference = date2.getTime() - date1.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
}

var startDate = new Date("2022-10-26")
var currentDate = new Date()
var comebackDate = new Date("2023-03-31")

var loveDate = countDate(currentDate, startDate)
document.querySelector("#count-date").innerHTML = `${loveDate} (days)`