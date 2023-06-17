import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, ScrollView, FlatList, Button } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import colorsheme from '../setup';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Message from '../components/messagetoast';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { Picker } from '@react-native-picker/picker';
import dbConnector from '../dbConnector';
import { schedulePushNotification } from '../Notifications';

let counter = 0
const days = [{ id: 1, day: "Mon" },
{ id: 2, day: "Tue" },
{ id: 3, day: "Wed" },
{ id: 4, day: "Thur" },
{ id: 5, day: "Fri" },
{ id: 6, day: "Sat" },
{ id: 7, day: "Sun" }
]

let dt = new Date(1598051730000)

export default function AddSchedule(props) {
    const [isStartTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [selectedStartTime, setselectedStartTime] = useState(null);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [selectedEndTime, setselectedEndTime] = useState(null);
    const [selectedDay, setselectedDay] = useState("Mon")
    const [title, setTitle] = useState("")
    const [messages, setmessages] = useState([])
    const [location, setLocation] = useState("")

    const [lecturer, setLecturer] = useState("")

    const showStartTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideStartTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirm = (time) => {
        setselectedStartTime(time.toLocaleTimeString());
        hideStartTimePicker();
    };


    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true);
    };

    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };

    const handleConfirm2 = (time) => {
        setselectedEndTime(time.toLocaleTimeString());
        hideEndTimePicker();
    };

    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }



    let newItem = async () => {
        let db = dbConnector()
        console.info(`Date set is ${selectedDay}`)
        let notIf_id = await schedulePushNotification(selectedDay, selectedStartTime, title, location)

        db.transaction(tx => {
            tx.executeSql('INSERT INTO items (title, lecturer,location,start_time,end_time,week_day,notif_id) values (?,?,?,?,?,?,?)', [title, lecturer, location, selectedStartTime, selectedEndTime, selectedDay, notIf_id],
                (txObj, resultSet) => { addMessage(`Item added `); console.log(txObj) },
                (txObj, error) => console.log('Error', error))
        })
    }


    useEffect(() => {

    }, [])

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


            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                    <Ionicons name="close-outline" size={25} color={colorsheme.black} />

                </TouchableOpacity>

                <Text style={styles.headerTxt}>Add Session</Text>

                <TouchableOpacity onPress={async () => { await newItem(); props.navigation.goBack() }}>
                    <Ionicons name="checkmark-outline" size={25} color={colorsheme.black} />

                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 66, paddingHorizontal: 30 }}>
                <View>
                    <Text style={styles.textInputPlaceholder} >
                        Title
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(txt) => {
                            setTitle(txt)
                        }}
                    />
                </View>

                <View>
                    <Text style={styles.textInputPlaceholder}>
                        Location
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(txt) => {
                            setLocation(txt)
                        }}
                    />
                </View>

                <View>
                    <Text style={styles.textInputPlaceholder}>
                        Lecturer
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(txt) => {
                            setLecturer(txt)
                        }}
                    />
                </View>




                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <View>

                        <TouchableOpacity onPress={showStartTimePicker} style={[styles.setTimeBtn, { backgroundColor: colorsheme.white, borderWidth: 1, borderColor: colorsheme.black }]}>
                            <Text style={[styles.textInputPlaceholder]}>
                                Start time
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isStartTimePickerVisible}
                            mode="time"
                            onConfirm={handleConfirm}
                            onCancel={hideStartTimePicker}
                        />
                        <Text style={[styles.textInputPlaceholder,{color:"grey"}]} > {selectedStartTime}</Text>

                    </View>

                    <View>
                        <TouchableOpacity onPress={showEndTimePicker} style={styles.setTimeBtn} >
                            <Text style={[styles.textInputPlaceholder, { color: colorsheme.white }]}>
                                End time
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isEndTimePickerVisible}
                            mode="time"
                            onConfirm={handleConfirm2}
                            onCancel={hideEndTimePicker}
                        />
                        <Text style={[styles.textInputPlaceholder,{color:"grey"}]}> {selectedEndTime}</Text>

                    </View>

                </View>
                <View style={{ backgroundColor: colorsheme.white, borderRadius: 20, borderWidth: 1, width: 170, height: 44,marginTop:10 }}>

                    <Picker
                        selectedValue={selectedDay}
                        style={{ height: 44, borderColor: colorsheme.lightBlue }}
                        onValueChange={(text) => { setselectedDay(text) }}
                    >
                        {days.map((day) => (
                            <Picker.Item
                                key={day.id}
                                label={day.day}
                                value={day.day}
                                style={{ fontFamily: "reg" }}
                            />
                        ))}
                    </Picker>
                </View>



            </View>


        </View>
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
        paddingHorizontal: 30

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

    setTimeBtn: {
        width: 140,
        height: 44,
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
    textInput: {
        width: "100%",
        height: 44,
        borderRadius: 20,
        backgroundColor: colorsheme.white,
        borderWidth: 1,
        borderColor: colorsheme.lightBlue,
        marginTop: 8,
        padding: 10,
        fontFamily: "reg",
        marginBottom: 25,
        opacity: 0.6,
        color: colorsheme.black
    },
    textInputPlaceholder: {
        fontFamily: "reg",
        fontSize: 12,
        color: colorsheme.black

    },

});
