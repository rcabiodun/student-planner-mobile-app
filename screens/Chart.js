import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, StatusBar, TouchableOpacity,ScrollView } from 'react-native';
import colorsheme from '../setup';
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import dbConnector, { timestamp } from '../dbConnector';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

let db = dbConnector()

const screenWidth = Dimensions.get("window").width;


const piechartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};
const chartConfig = {
  color: (opacity = 1) => `rgba(40,228, 252, ${opacity})`,
  decimalPlaces: 0,
  labelColor: (opacity = 1) => `rgba(252,252, 255, ${opacity})`,
  propsForVerticalLabels: {
    fontFamily: 'medium',
    marginRight: 30
  },
  fromZero: true,
  style: {
    borderRadius: 16
  },
  propsForBackgroundLines: {
    color: (opacity = 1) => `rgba(252,252, 255, ${opacity})`
  }
};




export default function ChartHistory(props) {
  const [completedSessions, setCompletedSessions] = useState([])
  const [incompleteSessions, setIncompleteSessions] = useState([])
  const [stuckToTime, setStuckToTime] = useState([])
  const [didNotStickToTime, setdidNotStickToTime] = useState([])
  const [pie_completed_sessions, setPieCompletedSessions] = useState(0)
  const [pie_incompleted_sessions, setPieINcompletedSessions] = useState(0)
  const [selectedTimeStamp, setSelectedTimestamp] = useState("minutes")
  const curveRadius = useRef(new Animated.Value(0)).current

  const piedata = [
    {
      name: "Completed Session",
      value: pie_completed_sessions,
      color: colorsheme.black, // red
      legendFontColor: '#000000',
      legendFontSize: 12
    },
    {
      name: "Bailed sessions",
      value: pie_incompleted_sessions,
      color: "rgba(204, 0, 0, 1)", // blue
      legendFontColor: '#000000',
      legendFontSize: 12
    }
  ];
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', "Sun"],
    datasets: [
      {
        data: completedSessions.length > 1 ? completedSessions : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(153, 255, 44, ${opacity})`,

      },
      {
        data: incompleteSessions.length > 1 ? incompleteSessions : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(204, 0, 0, ${opacity})`,


      },
      {
        data: stuckToTime.length > 1 ? stuckToTime : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(3,138, 255, ${opacity})`,

      },
      {
        data: didNotStickToTime.length > 1 ? didNotStickToTime : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(255, 240, 0, ${opacity})`,

      },


    ],
    legend: ["CS", "BS", "ST", "DST"],
    legendFontSize: 20
  };
  function AnimateCurveRadius() {
    // reset the value if it's already reached the target
    // start the animation
    Animated.sequence([
      Animated.delay(2000),
      Animated.loop(
        Animated.spring(curveRadius, {
          toValue: 40, // final value
          friction: 3,
          // lower means more bouncy
          useNativeDriver: false, // required for borderRadius animation
        }))]).start();

  }


  useEffect(() => {
    db.transaction(tx => {
      // sending 4 arguments in executeSql
      tx.executeSql('SELECT * FROM scheduleHistory', null, // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => {
          let complete = []
          let notComplete = []
          let stuck_to_time = []
          let did_Not_Stick_To_Time = []
          _array.forEach((v, i) => {
            complete.push(v.times_completed)
            notComplete.push(v.times_not_completed)
            stuck_to_time.push(v.stuck_to_time)
            did_Not_Stick_To_Time.push(v.not_stuck_to_time)
          })
          setCompletedSessions(complete)
          setIncompleteSessions(notComplete)
          setStuckToTime(stuck_to_time)
          setdidNotStickToTime(did_Not_Stick_To_Time)
        },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { console.log('Error ', error) }
      ) // end executeSQL

      tx.executeSql('SELECT * FROM timeHistory WHERE duration = ?', [selectedTimeStamp], // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => { setPieCompletedSessions(_array[0].times_completed); setPieINcompletedSessions(_array[0].times_not_completed) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { console.log('Error ', error) }
      )
    })
    AnimateCurveRadius()
  }, [])

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM timeHistory WHERE duration = ?', [selectedTimeStamp], // passing sql query and parameters:null
        // success callback which sends two things Transaction object and ResultSet Object
        (txObj, { rows: { _array } }) => { console.log(_array); setPieCompletedSessions(_array[0].times_completed); setPieINcompletedSessions(_array[0].times_not_completed) },
        // failure callback which sends two things Transaction object and Error
        (txObj, error) => { console.log('Error ', error) }
      )
    })
    AnimateCurveRadius()
  }, [selectedTimeStamp])


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View />

        <Text style={styles.headerTxt}>Chart</Text>
        <View />

      </View>
      <ScrollView contentContainerStyle={[styles.container,{paddingTop:0}]}>

        <Animated.View style={{ backgroundColor: colorsheme.black, padding: 20, borderRadius: curveRadius, marginBottom: 20 }}>
          <LineChart
            data={data}
            width={screenWidth / 1.12}
            height={250}
            chartConfig={chartConfig}
            bezier
            withInnerLines={true}
            withOuterLines={true}
            showValuesOnTopOfBars={true}

          />
        </Animated.View>

        <PieChart
          data={piedata}
          width={screenWidth / 1.15}
          height={220}
          chartConfig={piechartConfig}
          accessor="value"
          backgroundColor="transparent"
          padding="15"
          absolute
        />
        <View style={{ borderRadius: 20, borderWidth: 1, width: 170, height: 44, }}>

          <Picker
            selectedValue={selectedTimeStamp}
            style={{ height: 44, borderColor: colorsheme.lightBlue }}
            onValueChange={(text) => { setSelectedTimestamp(text) }}
          >
            {timestamp.map((ts) => (
              <Picker.Item
                key={ts.id}
                label={ts.day}
                value={ts.day}
                style={{ fontFamily: "reg" }}
              />
            ))}
          </Picker>
        </View>
        <View style={{ marginTop: 19 }}>
          <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
            CS - COMPLETED SESSIONS
          </Text>
          <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
            BS - BAILED SESSIONS
          </Text>
          <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
            ST - STUCK TO TIME
          </Text>
          <Text style={[styles.headerTxt, { fontFamily: "reg", fontSize: 12 }]}>
            DST - DIDNT STICK TO TIME
          </Text>


        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          props.navigation.goBack()
        }}>
          <Ionicons name="arrow-back" size={24} color={colorsheme.white} />
        </TouchableOpacity>
      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: colorsheme.grey,
    paddingTop: StatusBar.currentHeight + 10
  },
  backBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colorsheme.black,
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",



  },
  headerTxt: {
    fontFamily: "bold",
    fontSize: 22,
    color: colorsheme.black,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22

  },
})


