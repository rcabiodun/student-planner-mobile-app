
import * as SQLite from 'expo-sqlite'

const days = [{ id: 1, day: "Mon" },
{ id: 2, day: "Tue" },
{ id: 3, day: "Wed" },
{ id: 4, day: "Thur" },
{ id: 5, day: "Fri" },
{ id: 6, day: "Sat" },
{ id: 7, day: "Sun" }
]

export const timestamp = [{ id: 1, day: "minutes" },
{ id: 2, day: "over an hour" },
{ id: 3, day: "close to two hours" },
{ id: 4, day: "over two hours" },
{ id: 5, day: "close to three hours" },
{ id: 6, day: "over three hours" },
]

export default function dbConnector() {
    const db = SQLite.openDatabase('main.db')
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, lecturer TEXT,location TEXT,start_time TEXT,end_time TEXT,week_day TEXT,notif_id TEXT)'
        )
        //we need to be able to keep track of whether the use is actually reading 
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS scheduleHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, week_day TEXT, times_completed INTEGER,times_not_completed INTEGER,stuck_to_time INTEGER,not_stuck_to_time INTEGER, UNIQUE(week_day))'
        )

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS timeHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, duration TEXT, times_completed INTEGER,times_not_completed INTEGER, UNIQUE(duration))'
        )



        days.map((v, i) => {
            tx.executeSql('INSERT OR IGNORE INTO scheduleHistory (week_day,times_completed,times_not_completed,stuck_to_time,not_stuck_to_time) values(?,?,?,?,?)', [v.day, 0, 0,0,0], // passing sql query and parameters:null
                // success callback which sends two things Transaction object and ResultSet Object
                (txObj, resultSet) => { console.log(resultSet) },
                // failure callback which sends two things Transaction object and Error
                (txObj, error) => { console.log('Error ', error) }
            )
        })

        timestamp.map((v, i) => {
            tx.executeSql('INSERT OR IGNORE INTO timeHistory (duration,times_completed,times_not_completed) values(?,?,?)', [v.day, 0, 0], // passing sql query and parameters:null
                // success callback which sends two things Transaction object and ResultSet Object
                (txObj, resultSet) => { console.log(resultSet) },
                // failure callback which sends two things Transaction object and Error
                (txObj, error) => { console.log('Error ', error) }
            )
        })



    })
    return db
}


function clearDB(tx) {
    tx.executeSql(
        'DROP TABLE scheduleHistory'
    )
    tx.executeSql(
        'DROP TABLE items'
    )
    tx.executeSql(
        'DROP TABLE timeHistory'
    )
}