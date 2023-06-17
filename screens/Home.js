import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, ScrollView, FlatList, Modal, Pressable } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import colorsheme from '../setup';
import Message from '../components/messagetoast';
import { useEffect, useState } from 'react';
import dbConnector from '../dbConnector';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getCurrentDayOfWeek } from '../SecondsConverter';
import { cancelNotification } from '../Notifications';

const days = [{ id: 1, day: "Mon" },
{ id: 2, day: "Tue" },
{ id: 3, day: "Wed" },
{ id: 4, day: "Thur" },
{ id: 5, day: "Fri" },
{ id: 6, day: "Sat" },
{ id: 7, day: "Sun" }
]

const schedules = [{ id: 1, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" },
{ id: 2, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" },
{ id: 3, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" },
{ id: 4, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" },
{ id: 5, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" },
{ id: 6, Title: "CSC 402 - System Performance", location: "Mass Comm Building", lecturer: "Dr Olumoye", start_time: "8:00", end_time: "10:00" }
]

let db = dbConnector()

let counter = 0

export default function Home(props) {
    const [day, setDay] = useState("Mon")
    const [messages, setmessages] = useState([])
    const [schedules, setSchedules] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)




    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }
    function refreshData() {
        setIsRefreshing(true)
        db.transaction(tx => {
            // sending 4 arguments in executeSql
            tx.executeSql('SELECT * FROM items WHERE week_day = ?', [day], // passing sql query and parameters:null
                // success callback which sends two things Transaction object and ResultSet Object
                (txObj, { rows: { _array } }) => { setSchedules(_array); console.log(_array); setIsRefreshing(false) },
                // failure callback which sends two things Transaction object and Error
                (txObj, error) => { console.log('Error ', error), setIsRefreshing(false) }
            ) // end executeSQL
        }) // end transaction

    }

    useEffect(() => {
        refreshData()
        //check if current day of the week is the same as choosen day

    }, [day])

    async function deleteItem(id,notif_id) {
        addMessage(`Deleting Item `)
        await cancelNotification(notif_id)
        db.transaction(tx => {
            tx.executeSql('DELETE FROM items WHERE id = ? ', [id],
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let newList = schedules.filter(data => {
                            if (data.id === id)
                                return false
                            else
                                return true
                        })
                        setSchedules(newList)
                    }
                })
        })
    }

    return (

        <View style={styles.container} onLayout={async () => { await hideAsync() }}>

            <View style={{ position: 'absolute', top: 25, left: 0, right: 0, paddingHorizontal: 20 }}>
                {messages.map(m => {
                    return (
                        <Message
                            //sending a message 
                            key={counter + 1}
                            message={m}
                            onHide={() => {
                                setmessages((messages) => messages.filter((currentMessage) => {
                                    currentMessage !== m

                                }
                                ))
                            }}
                        />

                    )
                })}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {

                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 13,textAlign:"center" }]}>Item is not scheduled for this time</Text>





                        <Pressable style={styles.modalCloseBtn}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Ionicons name="ios-close-outline" size={24} color={colorsheme.white} />


                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => {

                }}>
                    <AntDesign name="barchart" size={24} color={colorsheme.grey} />
                </TouchableOpacity>
                <Text style={styles.headerTxt}>Home</Text>
                <TouchableOpacity onPress={() => {
                    props.navigation.push("Chart")

                }} style={{ padding: 5 }}>
                    <AntDesign name="barchart" size={24} color="black" />
                </TouchableOpacity>

            </View>
            <View>
                <FlatList
                    data={days}
                    contentContainerStyle={{ paddingHorizontal: 33, height: 60, marginTop: 54 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={styles.dayContainer} onPress={() => {
                                setSchedules([])
                                setDay(item.day)

                            }}>
                                <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12, color: item.day == day ? colorsheme.lightBlue : colorsheme.black }]}>
                                    {item.day}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            <View style={{ paddingHorizontal: 33 }}>
                <View style={styles.lineBarrier} />

            </View>


            <FlatList
                data={schedules}
                contentContainerStyle={{ paddingHorizontal: 33, marginTop: 54, }}
                onRefresh={() => {
                    refreshData()
                }}
                refreshing={isRefreshing}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {

                    return (
                        <TouchableOpacity onPress={
                            () => {

                                let { ifDayIsSame, withTimeFrame } = getCurrentDayOfWeek(day, item.start_time, item.end_time)// ADDLOGIC TO PREVENT USER FROM STARTING COUNTDWN OUTSIDE SCHEDULED TIME
                                if (ifDayIsSame == true && withTimeFrame == true) {
                                    props.navigation.push("CountDown", {
                                        item: item
                                    })
                                } else {
                                     setModalVisible(true)

                                }
                            }}
                            onLongPress={() => {
                                deleteItem(item.id,item.notif_id)
                            }}>

                            <View style={{ marginBottom: 26, flexDirection: "row" }}>

                                <View style={styles.scheduleListLeft}>
                                    <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 13 }]}>
                                        {item.title}
                                    </Text>

                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                                        <View style={styles.singleAuthContainerBall}>

                                        </View>
                                        <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
                                            {item.location}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.singleAuthContainerBall}>

                                        </View>
                                        <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
                                            {item.lecturer}
                                        </Text>
                                    </View>
                                </View>


                                <View style={{ height: 87, justifyContent: "space-between", paddingVertical: 5, width: "20f%" }}>
                                    <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
                                        {item.start_time}
                                    </Text>
                                    <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
                                        {item.end_time}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )
                }}
            />

            < View style={{ position: "absolute", bottom: 20, justifyContent: "center", alignItems: "center", width: "100%" }}>


                <TouchableOpacity style={styles.addScheduleBtn} onPress={() => {
                    props.navigation.push("AddSchedule")
                }}>
                    <Text style={[styles.headerTxt, { color: colorsheme.white, fontFamily: "medium" }]}>
                    {schedules.length > 0 ? "+ Add New Session" : "+ Add First Session"}  
                    </Text>

                </TouchableOpacity>
            </View >

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorsheme.grey,

    },
    headerContainer: {
        marginTop: 52,
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 7

    }, dayContainer: {
        height: 45,
        width: 35,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 30,

    },
    scheduleListLeft: {
        height: 87,
        width: "80%",
        borderRadius: 20,
        paddingLeft: 25,
        paddingTop: 20,
        marginRight: 30,
        backgroundColor: colorsheme.white

    },
    singleAuthContainerBall: {
        width: 6,
        height: 6,
        borderRadius: 4,
        backgroundColor: colorsheme.black,
        marginHorizontal: 18

    },
    lineBarrier: {
        backgroundColor: "red",
        borderWidth: 0.3,
        borderColor: colorsheme.black,
        marginTop: 10,
        paddingHorizontal: 33
    },

    addScheduleBtn: {
        width: 300,
        height: 52,
        borderRadius: 14,
        backgroundColor: colorsheme.black,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15

    },
    headerTxt: {
        fontFamily: "bold",
        fontSize: 22,
        color: colorsheme.black,
    },
    modalCloseBtn: {
        padding: 10,
        backgroundColor: colorsheme.black,
        borderRadius: 25,
        position: "absolute",
        bottom: -22
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: colorsheme.grey,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "70%",
        height: "30%"
    },


});
