/*
 * Title: Alarm Clock Using Vanilla JavaScript
 * Description: This is is simple alarm clock project created using html, css and vanilla javascript(no npm packages) 
 * Author: Zabir
 * Date: 14/Apr/2023
 *
 */


// Initializing the Variables (Element Selectors)
const liveClock = document.querySelector('.card-title');
const userHour = document.querySelector('#userHour');
const userMinute = document.querySelector('#userMinute');
const userSecond = document.querySelector('#userSecond');
const userMeridiem = document.querySelector('#userMeridiem');
const userMessage = document.querySelector('#userMessage');
const userForm = document.querySelector('#userForm');
const alarmItems = document.querySelector('.alarmItems');
const clearAlarmsBtn = document.querySelector('#clearAlarms');

function clock() {
    const date = new Date();
    const innerRealTime = date.toLocaleTimeString();
    liveClock.innerHTML = `Current Time is</br>${innerRealTime}`;
}
setInterval(clock, 1000);

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (userMeridiem.value === 'PM') {
        addAlarm(12);
    } else {
        addAlarm(0);
    }
    function addAlarm(meridiem) {
        if (localStorage.getItem('alarmList') == null) {
            let userModifiedHour = Number.parseInt(userHour.value) + meridiem;
            localStorage.setItem('alarmList', JSON.stringify([[userModifiedHour, userMinute.value, userSecond.value, userMessage.value]]));
        } else {
            let userModifiedHour = Number.parseInt(userHour.value) + meridiem;
            let alarmsArray = JSON.parse(localStorage.getItem('alarmList'));
            alarmsArray.push([userModifiedHour, userMinute.value, userSecond.value, userMessage.value]);
            localStorage.setItem('alarmList', JSON.stringify(alarmsArray));
        }
    }
    checkAlarmList();
});
  
function checkAlarmList() {
    if (JSON.parse(localStorage.getItem('alarmList')) === null) {
        alarmItems.innerHTML = '';
    } else {
        alarmItems.innerHTML = '';
        JSON.parse(localStorage.getItem('alarmList')).map((value, index) => {
            alarmItems.innerHTML += `
            <tr>
            <th scope="row">${index + 1}</th>
            <td>${value[0]}:${value[1]}:${value[2]}</td>
            <td>${value[3]}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeAlarmItem(${index})">Delete Alarm</button></td>
        </tr>
        `;
        });
    }
}
  
checkAlarmList();
  
const removeAlarmItem = (index) => {
    let alarmsArray = JSON.parse(localStorage.getItem('alarmList'));
    alarmsArray.splice(index, 1);
    localStorage.setItem('alarmList', JSON.stringify(alarmsArray));
    checkAlarmList();
};
  
clearAlarmsBtn.addEventListener('click', () => {
    const confirmAlarmList = confirm('Are you sure do you want to clear all the alarms???');
    if (confirmAlarmList) {
        localStorage.clear();
        checkAlarmList();
    }
});


function callAlarm() {
    if (localStorage.getItem('alarmList') !== null) {
        let alarmsArray = JSON.parse(localStorage.getItem('alarmList'));
        alarmsArray.forEach((element, index) => {
            let alarmHour = Number.parseInt(element[0]);
            let alarmMinute = Number.parseInt(element[1]);
            let alarmSeconds = Number.parseInt(element[2]);
            let currentHour = new Date().getHours();
            let currentMinute = new Date().getMinutes();
            let currentSeconds = new Date().getSeconds();
            if (alarmHour === currentHour && alarmMinute == currentMinute && alarmSeconds === currentSeconds) {
                let aud = new Audio('../assets/audio.mp3');
                aud.play();
                Notification.requestPermission().then((e) => {
                    if (e === 'granted') {
                        new Notification(element[3], {
                            icon: '../assets/js.svg.ico',
                            body: 'Your alarm is calling you'
                        });
                    }
                });
                removeAlarmItem(index);
            }
        });
    }
}
setInterval(callAlarm, 1000);
