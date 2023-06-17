import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, ScrollView } from 'react-native';
import { hideAsync } from 'expo-splash-screen';
import colorsheme from '../setup';




export default function Login(props) {
    return (
        <View style={styles.container} onLayout={async () => { await hideAsync() }}>
            <StatusBar style="auto" />
            <ScrollView style={{ paddingHorizontal: 20, flex: 1, backgroundColor: colorsheme.grey }}>

                <View style={styles.headerContainer}>
                    <Text style={{ fontFamily: "medium", fontSize: 25, color: colorsheme.black }}>Get Started Now</Text>
                    <Text style={{ fontFamily: "reg", fontSize: 12, color: colorsheme.black, marginTop: 5 }}>Enter your credentials to access your account</Text>
                </View>
                <View style={styles.authContainer}>
                    <TouchableOpacity style={styles.singleAuthContainer}>
                        <View style={styles.singleAuthContainerBall}></View>
                        <Text style={{ fontFamily: "reg", fontSize: 11, color: colorsheme.black }}>Login with Google</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={styles.singleAuthContainer}>
                        <View style={styles.singleAuthContainerBall}></View>
                        <Text style={{ fontFamily: "reg", fontSize: 11, color: colorsheme.black }}>Login with Apple</Text>
                    </TouchableOpacity>


                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 34, padding: 5, justifyContent: "space-between" }}>

                    <View style={{ width: "45%", borderWidth: 0.2, backgroundColor: colorsheme.black }} />

                    <Text style={{ fontFamily: "reg", fontSize: 12, color: colorsheme.black, marginHorizontal: 5 }}>
                        or
                    </Text>
                    <View style={{ width: "45%", borderWidth: 0.2, backgroundColor: colorsheme.black }} />

                </View>

                <View style={{ flex: 1, marginTop: 15 }}>
                    <View>
                        <Text style={styles.textInputPlaceholder}>
                            Name
                        </Text>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.textInputPlaceholder}>
                            Email Address
                        </Text>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <View>
                        <Text style={styles.textInputPlaceholder}>
                            Password
                        </Text>
                        <TextInput
                            style={styles.textInput}
                        />
                    </View>

                    <TouchableOpacity style={[styles.loginBtn]}
                        onPress={() => {
                            //props.navigation.push("Chart")

                            props.navigation.push("Home")
                        }}

                    >
                        <Text style={[styles.textInputPlaceholder, { fontSize: 15, fontFamily: "medium", color: colorsheme.white }]}>
                            Login
                        </Text>
                    </TouchableOpacity>



                </View>



            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorsheme.white,

    },
    headerContainer: {
        marginTop: 120,
    }, authContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 21,
        alignItems: "center"
    },
    singleAuthContainerBall: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: colorsheme.black,
        marginHorizontal: 18

    },
    singleAuthContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%",
        height: 31,
        borderWidth: 1,
        borderColor: colorsheme.black,
        borderRadius: 5,
        backgroundColor: colorsheme.white
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
        color: colorsheme.black

    },
    loginBtn: {
        width: "100%",
        height: 44,
        borderRadius: 20,
        backgroundColor: colorsheme.black,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15

    },
    descriptionTxt: {
        fontFamily: "reg",
        fontSize: 12,
        color: colorsheme.black,
        position: "absolute",
        bottom: 40

    },

});
