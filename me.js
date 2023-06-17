var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let me=days.find((v,i)=>{
   return v.startsWith("S")
  })

  
  
  const weekday = days.indexOf(me) + 1;
  console.info(weekday)