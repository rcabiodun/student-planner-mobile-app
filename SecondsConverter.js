
export default function ConvertToSeconds(start, end) {

    let [hour1, minute1] = start.split(":").map(Number);
    let [hour2, minute2] = end.split(":").map(Number);

    // Calculate the total seconds for each time
    let seconds1 = hour1 * 3600 + minute1 * 60;
    let seconds2 = hour2 * 3600 + minute2 * 60;

    // Return the absolute difference between the two times in seconds
    return Math.abs(seconds1 - seconds2);
}

 export function GetTimeDuration(totalSeconds) {
    console.log(`Total seconds recieved ${totalSeconds}`)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    let durationLabel = ""
    if (hours == 0) {
        durationLabel = "minutes"
    } else if (hours == 1 && (minutes < 30)) {
        durationLabel = "over an hour"
    } else if (hours == 1 && (minutes > 30)) {
        durationLabel = "close to two hours"
    } else if (hours == 2 && (minutes < 30)) {
        durationLabel = "over two hours"
    } else if (hours == 2 && (minutes > 30)) {
        durationLabel = "close to three hours"
    } else if (hours == 3 && (minutes < 30)) {
        durationLabel = "over three hours"
    } else {
        durationLabel = "over three hours"

    }

    return durationLabel

}




// Define a export function that returns the current day of the week as a string
 export function getCurrentDayOfWeek(currentDay, start, end) {
    // Create a new Date object with the current date and time
    let date = new Date();
    // Get the day of the week as a number from 0 (Sunday) to 6 (Saturday)
    let day = date.getDay();
    // Define an array of the names of the days of the week
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let [startHour, startMinute] = start.split(":").map(Number);
    let [endHour, endMinute] = end.split(":").map(Number);
    // Return the name of the day that corresponds to the number
    console.log(currentDay)
    let currentFullDay=days.find((v,i)=>{
        return v.startsWith(currentDay)
       })
     
    let currentHour = date.getHours();
    let currentMinute = date.getMinutes();
    let obj = {}
    obj.ifDayIsSame = days[day] == currentFullDay;
    if (currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)) {
        obj.withTimeFrame = false;
        console.log(obj)
        return obj
    }
    if (currentHour > endHour || (currentHour === endHour && currentMinute > endMinute)) {
        obj.withTimeFrame = false;
        console.log(obj)
        return obj
    }
    obj.withTimeFrame = true;
    console.log(obj)
    return obj
}

//

export function checkIfStuckToSchedule(start) {
    let date = new Date();
    // Get the day of the week as a number from 0 (Sunday) to 6 (Saturday)
    let day = date.getDay();

    let [hour1, minute1] = start.split(":").map(Number);
    let currentHour = date.getHours();
    let currentMinute = date.getMinutes();

    // Calculate the total seconds for each time
    let seconds1 = hour1 * 3600 + minute1 * 60;
    let seconds2 = currentHour * 3600 + currentMinute * 60;

    
    // Return the absolute difference between the two times in seconds
    if(Math.abs(seconds1 - seconds2)<600){
        console.log("stuck to time") 
        return true
    }else{
        console.log("didnt stick to time") 

        return false //this means that the user started 2 minutes late
    }
}

