import * as Notifications from "expo-notifications";

export async function schedulePushNotification(

  day, start_time, title, location
) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let fullday = days.find((v, i) => {
    return v.startsWith("S")
  })

  const weekday = days.indexOf(fullday) + 1;
  let [hour, minute] = start_time.split(":").map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time is fast approaching",
      body: ` Your scheduled ${title} is scheduled to happen in 5 minutes time`,
      // sound: 'default',
    },
    trigger: {
      weekday: weekday,
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
  console.log("notif id on scheduling", id)
  return id;
}

export async function cancelNotification(notifId) {
  await Notifications.cancelScheduledNotificationAsync(notifId);
}