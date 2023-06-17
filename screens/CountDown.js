import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, ScrollView, FlatList, Button, } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import colorsheme from '../setup';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import Message from '../components/messagetoast';
import { Audio } from 'expo-av';
import dbConnector from '../dbConnector';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import ConvertToSeconds, { GetTimeDuration, checkIfStuckToSchedule } from '../SecondsConverter';

let counter = 0
const quotes = [
    {
        top: "YOU DO NOT FIND A",
        middle: "HAPPY LIFE",
        bottom: "YOU MAKE IT"
    },
    {
        top: "WE ARE ALL IN THE GUTTER, BUT",
        middle: "SOME OF US",
        bottom: "ARE LOOKING AT THE STARS"
    },
    {
        top: "THE ONLY WAY TO DO",
        middle: "GREAT WORK",
        bottom: "IS TO LOVE WHAT YOU DO"
    },
    {
        top: "THE MORE YOU KNOW,THE MORE",
        middle: "YOU REALISE",
        bottom: "HOW MUCH YOU DON'T KNOW"
    },
]

let db = dbConnector()
export default function CountDown(props) {
    const [audioFile, setAudioFile] = useState(null);
    const [sound, setSound] = useState(null);
    const [messages, setmessages] = useState([])
    const [timer, setTimer] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [durationLabel, setDuration] = useState("")

    const pickAudio = async () => {
        // Display the system UI for choosing an audio file
        const result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*', // filter by audio files
        });
        if (!result.cancelled) {
            // Store the selected audio file URI
            setAudioFile(result.uri);
        }
    };

    const playAudio = async () => {
        // Load and play the audio file using Expo's audio package
        const { sound } = await Audio.Sound.createAsync({ uri: audioFile });
        setSound(sound);
        await sound.playAsync();
        setIsPlaying(true); // update the playback status
    };

    const pauseAudio = async () => {
        // Pause the audio file
        await sound.pauseAsync();
        setIsPlaying(false); // update the playback status
    };

    const resumeAudio = async () => {
        await sound.playAsync();
        setIsPlaying(true); /// update the playback status
    };
    const stopAudio = async () => {
        // Stop and unload the audio file
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false); // update the playback status
    };
    function addMessage(message) {
        console.log("adding function")
        setmessages(messages => [...messages, message])
        console.log(messages)
    }



    useEffect(() => {
        console.log(props.route.params.item)

        db.transaction(tx => {
            // sending 4 arguments in executeSql
            let IfStuckToSchedule = checkIfStuckToSchedule(props.route.params.item.start_time)

            let statement1 = 'UPDATE scheduleHistory  SET times_not_completed= times_not_completed + 1 , stuck_to_time = stuck_to_time + 1  WHERE week_day = ?'
            let statement2 = 'UPDATE scheduleHistory  SET times_not_completed= times_not_completed + 1 , not_stuck_to_time=not_stuck_to_time+1 WHERE week_day= ?'
            tx.executeSql(IfStuckToSchedule ? statement1 : statement2, [props.route.params.item.week_day], // passing sql query and parameters:null
                // success callback which sends two things Transaction object and ResultSet Object
                (txObj, { rows: { _array } }) => { console.log(_array); },
                // failure callback which sends two things Transaction object and Error
                (txObj, error) => { console.log('Error ', error) }
            ) // end executeSQL
            let time_in_seconds = ConvertToSeconds(props.route.params.item.start_time, props.route.params.item.end_time)
            setTimer(time_in_seconds)
            let label = GetTimeDuration(time_in_seconds)
            setDuration(label)

            tx.executeSql('UPDATE timeHistory SET times_not_completed= times_not_completed + 1  WHERE duration = ?', [label], // passing sql query and parameters:null
                // success callback which sends two things Transaction object and ResultSet Object
                (txObj, { rows: { _array } }) => { console.log(_array); },
                // failure callback which sends two things Transaction object and Error
                (txObj, error) => { console.log('Error ', error) }
            ) // end executeSQL
        })


    }, [])

    return (

        <ScrollView  contentContainerStyle={styles.container} onLayout={async () => { await hideAsync() }} >
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

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                <Text style={styles.textInputPlaceholder} >{quotes[Math.floor(Math.random() * 4)].top}
                </Text>
                <Text style={styles.headerTxt}>{quotes[Math.floor(Math.random() * 4)].middle}</Text>
                <Text style={styles.textInputPlaceholder}>{quotes[Math.floor(Math.random() * 4)].bottom}</Text>
            </View>

            <View style={{ flex: 2, alignItems: "center" }}>

                <CountdownCircleTimer

                    isPlaying
                    duration={timer}
                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                    colorsTime={[200, 150, 100, 0]}
                    isGrowing={true}
                    size={240}
                    onComplete={() => {
                        // do your stuff here
                        db.transaction(tx => {
                            // sending 4 arguments in executeSql
                            tx.executeSql('UPDATE scheduleHistory SET times_not_completed = times_not_completed - 1 , times_completed = times_completed + 1 WHERE week_day = ?', [props.route.params.item.week_day], // passing sql query and parameters:null
                                // success callback which sends two things Transaction object and ResultSet Object
                                (txObj, { rows: { _array } }) => { console.log(_array); },
                                // failure callback which sends two things Transaction object and Error
                                (txObj, error) => { console.log('Error ', error) }
                            ) // end executeSQL
                            tx.executeSql('UPDATE timeHistory SET times_not_completed= times_not_completed - 1, times_completed = times_completed + 1  WHERE duration = ?', [durationLabel], // passing sql query and parameters:null
                                // success callback which sends two things Transaction object and ResultSet Object
                                (txObj, { rows: { _array } }) => { console.log(_array); },
                                // failure callback which sends two things Transaction object and Error
                                (txObj, error) => { console.log('Error ', error) }
                            ) // end executeSQL
                        })

                        return { shouldRepeat: false, } // repeat animation in 1.5 seconds
                    }}
                >
                    {
                        ({ remainingTime }) => {
                            const hours = Math.floor(remainingTime / 3600)
                            const minutes = Math.floor((remainingTime % 3600) / 60)
                            const seconds = remainingTime % 60
                            return (
                                <Text style={styles.headerTxt}>
                                    {hours}:{minutes}:{seconds}
                                </Text>
                            )
                        }}


                </CountdownCircleTimer>

                <Text style={[styles.textInputPlaceholder, { fontSize: 9, marginTop: 10, fontFamily: "reg" }]}>
                    Leaving before the time runs out would be counted as a failed session
                </Text>
                <TouchableOpacity onPress={pickAudio} style={{ width: 150, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: colorsheme.black, marginTop: 20, borderRadius: 20 }}>
                    <Text style={[styles.textInputPlaceholder, { color: colorsheme.white }]}>Pick an audio book</Text>

                </TouchableOpacity>
                {audioFile && (
                    <View style={styles.audioContainer}>


                        {!sound ? (
                            <TouchableOpacity onPress={playAudio} style={{ width: 150, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: colorsheme.black, marginTop: 20, borderRadius: 20 }}>
                                <Text style={[styles.textInputPlaceholder, { color: colorsheme.white }]}>Play</Text>

                            </TouchableOpacity>
                        ) : isPlaying ? ( // check the playback status
                            <TouchableOpacity onPress={pauseAudio} style={{ width: 150, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: colorsheme.black, marginTop: 20, borderRadius: 20 }}>
                                <Text style={[styles.textInputPlaceholder, { color: colorsheme.white }]}>Pause</Text>

                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={resumeAudio} style={{ width: 150, height: 40, justifyContent: "center", alignItems: "center", backgroundColor: colorsheme.black, marginTop: 20, borderRadius: 20 }}>
                                <Text style={[styles.textInputPlaceholder, { color: colorsheme.white }]}>Resume</Text>

                            </TouchableOpacity>
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.backBtn} onPress={async () => {
                    if (sound) {
                        await stopAudio()
                    }
                    props.navigation.goBack()

                }}>
                    <Ionicons name="arrow-back" size={24} color={colorsheme.white} />

                </TouchableOpacity>


            </View>

        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorsheme.grey,
        justifyContent: "center",
        alignItems: "center"

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
        fontSize: 20,
        color: colorsheme.black,
        textAlign: "center",
        marginTop: 5,
        marginBottom: 11


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
        opacity: 0.3
    },
    textInputPlaceholder: {
        fontFamily: "reg",
        fontSize: 12,
        color: colorsheme.black,
        textAlign: "center"

    },
    backBtn: {
        width: 60, height: 60, borderRadius: 30,
        backgroundColor: colorsheme.black,
        position: "absolute",
        bottom: 10,
        justifyContent: "center",
        alignItems: "center"


    }

});
