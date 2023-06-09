import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
// import { Accelerometer, Barometer } from 'expo-sensors';
// import * as Progress from 'react-native-progress';
import ProgressCircle from 'react-native-progress-circle'
import {StatusBar} from 'expo-status-bar';
import ApiService from './ApiService';
import { Audio } from 'expo-av';
import { Accelerometer, DeviceMotion, Gyroscope, Barometer, LightSensor } from 'expo-sensors';
import "./ignoreWarnings";
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import ActivityButton from './ActivityButton';
import { Entypo } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const headerImage = require('./assets/images/header.jpg');
const notification = require('./assets/images/Notification.png');
const banner = require('./assets/images/BG.png');
const fire = require('./assets/images/fire.png');
const model = require('./assets/images/model.png');
const quiet = require('./assets/images/quiet.jpeg');
const cycle = require('./assets/images/cycle.png');
const yoga = require('./assets/images/yoga.png');
const walk = require('./assets/images/walk.png');
const next = require('./assets/images/next.png');
const play = require('./assets/images/play.png');
const star = require('./assets/images/Star.png');
const book = require('./assets/images/Book.png');
const home = require('./assets/images/Home.png');
const heart = require('./assets/images/H.png');
const calendar = require('./assets/images/Calender.png');
const profile = require('./assets/images/User.png');
const plus = require('./assets/images/Plus.png');
const walking = require('./assets/images/walking.png');
const running = require('./assets/images/running.png');
const climbing = require('./assets/images/climbing.png');
const sitting = require('./assets/images/sitting.png');
const standing = require('./assets/images/standing.png');
const crowed = require('./assets/images/crowed.png');
const sunny = require('./assets/images/sunny.webp');
const dark = require('./assets/images/dark.jpeg');
const clearsky = require('./assets/images/clearsky.jpeg');
const indoor = require('./assets/images/indoor.jpeg');
const badair = require('./assets/images/badair.jpeg');
// import tensorflow


import {useFonts} from 'expo-font';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
console.disableYellowBox = true;





const App = ({routes, navigation}) => {
  // console.info(navigation, "navigation")
  // console.info(routes, "routes")
  if (routes) {
  
}

  const [{ illuminance }, setIData] = useState({ illuminance: 0 });
  const [usageTime, setUsageTime] = useState(0);
  const [{ pressure, relativeAltitude }, setBData] = useState({ pressure: 0, relativeAltitude: 0 });
  const [subscription, setSubscription] = useState(null);
  const [walkingGoal, setWalkingGoal] = useState(100);
  const [joggingGoal, setJoggingGoal] = useState(100);
  const [sittingGoal, setSittingGoal] = useState(100);
  const [standingGoal, setStandingGoal] = useState(100);
  const [screenTimeGoal, setScreenTimeGoal] = useState(100);
  LightSensor.setUpdateInterval(1000);


  const [value, setValue] = useState('');

  const getValue = async () => {
    try {
      const goals = ['walkingGoal', 'joggingGoal', 'sittingGoal', 'standingGoal', 'screenTimeGoal'
    ]
      goals.forEach(async (goal) => {
        const storedValue = await AsyncStorage.getItem(goal);
        // console.log('storedValue: ', storedValue) 
        if (storedValue !== null || storedValue !== '[object Undefined]') {
          switch (goal) { 
            case 'walkingGoal':
              setWalkingGoal(storedValue);
              break;
            case 'joggingGoal':
              setJoggingGoal(storedValue);
              break;
            case 'sittingGoal':
              setSittingGoal(storedValue);
              break;
            case 'standingGoal':
              setStandingGoal(storedValue);
              break;
            case 'screenTimeGoal':
              setScreenTimeGoal(storedValue);
              break;
            default:
              break;
          }
        }
      })
    } catch (error) {
      console.log('Error retrieving value from local storage:', error);
    }
  };

  // check freqently storage value and update the state
  useEffect(() => {
    const interval = setInterval(() => {
      getValue();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  const _subscribe = () => {
    setSubscription(
      LightSensor.addListener(setIData)
    )
    // setSubscription(Barometer.addListener(setBData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // store last 10 illuminance values
  const [illuminanceValues, setIlluminanceValues] = useState([]);

  useEffect(() => {
    // console.log('Start reading illuminance...')
    if (illuminanceValues.length > 10) {
      setIlluminanceValues(illuminanceValues.slice(1));
      // console.log('Illuminance values: ', illuminanceValues)
    }
    if (illuminance) {
      setIlluminanceValues(illuminanceValues => [...illuminanceValues, illuminance]);
      // console.log('Illuminance : ', illuminanceValues)
    }
    

  }, [illuminance]);

  // // average illuminance
  const averageIlluminance = illuminanceValues.reduce((a, b) => a + b, 0) / illuminanceValues.length;

  const isBright = averageIlluminance > 20;


  const [recording, setRecording] = useState(null);

  async function startRecording() {
    try {
      // console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      // console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
  }

  // // every 5s start recording and stop recording and save the file to the local storage and then upload it to the server

  // const [audio, setAudio] = useState(null);



  const [activityDuration, setActivityDuration] = useState(0);
  const [activityType, setActivityType] = useState('');

  const startTracking = (type) => {
    setActivityType(type);
    Accelerometer.setUpdateInterval(1000);
    const subscription = Accelerometer.addListener((accelerometerData) => {
      if (accelerometerData.z < 0) {
        setActivityDuration((prevDuration) => prevDuration + 1);
      }
    });
  };

  const stopTracking = () => {
    setActivityType('');
    setActivityDuration(0);
    subscription.remove();
  };
  
  return (
    <>
      <StatusBar style={isBright ? 'light' : 'dark'} backgroundColor={isBright ? '#35363a' : 'white'}/>
      
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: isBright? '#35363a': 'white' }]}>
        <View style={styles.screen}>
          <Header isBright={isBright} navigation={navigation}/>
          <Banner />
        </View>
        <View style={{marginHorizontal: '3%'}}>
          <Text style={[styles.label,{color: isBright? 'white' : 'black'}]}>Your Activities</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {data.map((item, index) => (
              <Card key={index} data={item} index={index} isBright={isBright} goals={ {"Walking": walkingGoal, "Jogging": joggingGoal, "Sitting": sittingGoal, "Standing": standingGoal} }/>
            ))}
          </ScrollView>
        
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={[styles.label, { color: isBright ? 'white' : 'black' }]}>Environment</Text>
            <Text
              style={{
                fontFamily: useFonts.PoppinsRegular,
                opacity: 0.5,
                fontSize: 12,
              }}>
              View All
            </Text>
          </View>
          {/* scrollable view */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {environments.map((item, index) => (
              <Environment key={index}  index={index} image={item.image} name={item.name} isBright={isBright} data={item} />
            ))}
          </ScrollView>
          <ScreenTimer isBright={isBright} usageTime={100} screenTimeGoal={screenTimeGoal}/>
        </View>
      </ScrollView>
    </>
  );
};

export default App;

const ScreenTimer = ({isBright, usageTime, screenTimeGoal}) => {

  const wellbeing = require('./assets/images/wellbeing.png');
  return (
    <View style={[styles.footer, { backgroundColor: isBright ? '#35363a' : 'white' }]}>
      <View style={{  alignItems: 'center', marginHorizontal: 30 }}>
        <Text style={[styles.label, { color: isBright ? 'white' : 'black' }]}>Screen Time</Text>
        <Text style={{ color: "#ff6b6b", fontSize: 30 }}>{'2'} hrs {"30"} mins</Text>
      </View>
      <ProgressCircle percent={parseInt(usageTime / screenTimeGoal * 100)} radius={45} borderWidth={8} color="#ff6b6b" shadowColor="#999" bgColor={isBright ? '#35363a' : 'white'}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: isBright ? 'white' : 'black' }}>{parseInt(usageTime / screenTimeGoal * 100)}%</Text>
        </View>
      </ProgressCircle>
      
    </View>
    
    
  )
}

const Environment = ({index,image,name,isBright,data}) => (
  <View
    style={{
      borderRadius: 15,
      marginHorizontal: 12,
      shadowOffset: {width: -5, height: 3},
      shadowColor: 'grey',
      shadowOpacity: 0.5,
      shadowRadius: 3,
      backgroundColor: isBright ? '#35363a' : 'white'
    }}>
    <View style={{ borderRadius: 10, overflow: 'hidden'}}>
      <ImageBackground
        source={image}
        style={{
          height: 150,
          width: 300,
        }}>
        <LinearGradient
          locations={[0, 1.0]}
          colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}></LinearGradient>
      </ImageBackground>
      <Text
        style={{
          position: 'absolute',
          bottom: 5,
          left: 10,
          fontFamily: useFonts.PoppinsRegular,
          color: '#fff',
        }}>
        {name}
      </Text>
      {/* <View
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          padding: 5,
          right: 10,
          top: 10,
          borderRadius: 5,
        }}>
        <Image source={star} style={{height: 10, width: 10}} />
      </View> */}
    </View>
    <View
      style={{
        backgroundColor: isBright ? '#35363a' : 'white',
        padding: 10,
        borderRadius: 15,
      }}>
      {/* <View
        style={{
          position: 'absolute',
          backgroundColor: '#8860a2',
          padding: 10,
          right: 25,
          top: -15,
          borderRadius: 15,
          zIndex: 3,
        }}>
        <Image source={play} style={{height: 10, width: 10}} />
      </View> */}
      <Text style={{ fontFamily: useFonts.PoppinsRegular, color: isBright ? 'white': 'black' }}>
        {data.text}
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontFamily: useFonts.PoppinsRegular,
            fontSize: 12,
            color: '#8860a2',
          }}>
          {data.hour} hrs 
        </Text>
        <Text
          style={{
            fontFamily: useFonts.PoppinsRegular,
            fontSize: 12,
            color: '#8860a2',
          }}>
          {data.min} Min
        </Text>
      </View>
    </View>
  </View>
);

const Card = ({data, index, isBright, goals}) => {

  progress = (data, goals) => {
    if (data.name == "Walking") {
      return (data.time / goals.Walking) * 100;
    } else if (data.name == "Jogging") {
      return (data.time / goals.Jogging) * 100;
    } else if (data.name == "Sitting") {
      return (data.time / goals.Sitting) * 100;
    } else if (data.name == "Cycling") {
      return (data.time / goals.Standing) * 100;
    } 
    
  }
  return (
    <View
      style={{
        flex: 1,
        height: 150,
        width: 100,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: isBright? data.darkColor: data.color,
        justifyContent: 'space-between',
        marginHorizontal: 8,
        borderRadius: 10,
        shadowColor: 'lightgrey',
        shadowOffset: {width: -5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginBottom: 10,
      }}>
      <Image source={data.image} style={{height: 25, width: 25}} />
      <View style={{alignSelf: 'center', margin: 5}}>
        <ProgressCircle
          percent={parseInt(progress(data, goals))}
          radius={25}
          borderWidth={5}
          color="#3399FF"
          shadowColor={isBright ? data.color : data.lightColor}
          borderColor="#ededed"
          bgColor={isBright? data.color: data.darkColor}
        >
          <Text style={{ fontSize: 15 }}>{parseInt(progress(data,goals))}%</Text>
        </ProgressCircle>
      </View>
      <View>
        <Text style={{fontSize: 10, fontFamily: useFonts.PoppinsLight}}>
          Day {data.day}
        </Text>
        <Text style={{fontSize: 10, fontFamily: useFonts.PoppinsLight}}>
          Time {data.time} mins
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontFamily: useFonts.PoppinsRegular}}>{data.name}</Text>
        
      </View>
    </View>
  );
};
const Header = (props) => (
  <View style={styles.header}>
    <ImageContainer image={headerImage} />
    <HeaderTitle isBright={props.isBright}/>
    {/* <ImageContainer image={notification} height={'50%'} width={'50%'} /> */}
    {/* notification button with icon */}
    
    <View style={{margin:10}}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Goal')}>
        <Entypo name="edit" size={24} color={props.isBright ? "white" : "black"} />
      </TouchableOpacity>
    </View>
  </View>
);
const Banner = () => {
  const [predictions, setPredictions] = useState([]);
  const [activity, setActivity] = useState('Standing');
  const [environment, setEnvironment] = useState('On Quiet Place');
  const [activityImage, setActivityImage] = useState(sitting);
  const [bannerColor, setBannerColor] = useState('#b8e9df');
  const [{ illuminance }, setIData] = useState({ illuminance: 0 });
  const [aData, setAData] = useState({});
  const [gData, setGData] = useState({});
  const [dData, setDData] = useState({});
  const [subscription, setSubscription] = useState(null);
  const [a100Data, setA100Data] = useState([]);
  const [g100Data, setG100Data] = useState([]);
  const [d100Data, setD100Data] = useState([]);

  Accelerometer.setUpdateInterval(1000);
  Gyroscope.setUpdateInterval(1000);
  DeviceMotion.setUpdateInterval(1000);
  

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(setAData)
    );
    setSubscription(
      Gyroscope.addListener(setGData)
    )
    setSubscription(
      DeviceMotion.addListener(setDData)
    )
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // // store only the last 100 accelerometer readings


  useEffect(() => {
    if (a100Data.length < 100) {
      setA100Data([...a100Data, aData])
      // console.log('reading accelerometer data')
    } else {
      setA100Data([...a100Data.slice(1), aData])
    }
  }, [aData])

  useEffect(() => {
    if (g100Data.length < 100) {
      setG100Data([...g100Data, gData])
      // console.log('reading gyroscope data')
    } else {
      setG100Data([...g100Data.slice(1), gData])
    }
  }, [gData])

  useEffect(() => {
    if (d100Data.length < 100) {
      setD100Data([...d100Data, dData])
      // console.log('reading device motion data')
    } else {
      setD100Data([...d100Data.slice(1), dData])
    }
  }, [dData])

  const handlePredict = async () => {
    try {
      // console.log('Predicting...')
      const sensorData = {
        accelerometer: a100Data,
        gyroscope: g100Data,
        deviceMotion: d100Data
      }
      const predictions = await ApiService.predict([sensorData]);

      // console.log('Predictions: ', predictions);
      setPredictions(predictions);
      setActivity(predictions[0]);
    } catch (error) {
      // console.log(error);
    }
  };

  // do handlePredict every 1000 ms and check a100Data.length === 100
  useEffect(() => {
    // console.log('a100Data.length: ', a100Data.length)
    // console.log('g100Data.length: ', g100Data.length)
    // console.log('d100Data.length: ', d100Data.length)
    if (a100Data.length === 100 && g100Data.length === 100 && d100Data.length === 100) {
      // handlePredict();
    }

    const interval = setInterval(async () => {

        // console.log('doing handlePredict')
        // await handlePredict();
      

    }, 1000);
    return () => clearInterval(interval);
  }, [a100Data]);

  const [barometerData, setBarometerData] = useState({ pressure: 0 });
  const [subscriptionBarometer, setSubscriptionBarometer] = useState(null);
  const [barometer100Data, setBarometer100Data] = useState([]);

  const _subscribeBarometer = () => {
    setSubscriptionBarometer(
      Barometer.addListener(barometerData => {
        setBarometerData(barometerData);
      })
    );
  };

  const _unsubscribeBarometer = () => {
    subscriptionBarometer && subscriptionBarometer.remove();
    setSubscriptionBarometer(null);
  };

  // store only the last 100 barometer readings
  useEffect(() => {
    if (barometer100Data.length < 100) {
      setBarometer100Data([...barometer100Data, barometerData])
      // console.log('reading barometer data')
    } else {
      setBarometer100Data([...barometer100Data.slice(1), barometerData])
    }
  }, [barometerData])

  // check sudden drop in pressure (bad air quality)

  const isSuddenDrop = () => {
    let suddenDrop = false;
    for (let i = 0; i < barometer100Data.length - 1; i++) {
      if (barometer100Data[i].pressure - barometer100Data[i + 1].pressure > 5) {
        suddenDrop = true;
      }
    }
    return suddenDrop;
  }





  useEffect(() => {
    _subscribeBarometer();
    return () => _unsubscribeBarometer();

  }, []);

  useEffect(() => {
    if (isSuddenDrop()) {
      setEnvironment('On Polluted Place');
    } else {
      setEnvironment('On Quiet Place');
    }
  }, [barometer100Data])
  // 'Downstairs', 'Jogging', 'Sitting', 'Standing', 'Upstairs', 'Walking'
  useEffect(() => {
    let isMounted = true;
    if (activity === 'Jogging') {
      setBannerColor('#a2d2ff');
      setActivityImage(running);
      // save duration of activity
    } else if (activity === 'Upstairs') {
      setBannerColor('#ffc8dd');
      setActivityImage(climbing);
      // save duration of activity
    } else if (activity === 'Sitting') {
      setBannerColor('#b8e9df');
      setActivityImage(sitting);
      // save duration of activity
    } else if (activity === 'Walking') {
      setBannerColor('#cdb4db');
      setActivityImage(walking);
      // save duration of activity
    } else if (activity === 'Standing') {
      setBannerColor('#ffeac5');
      setActivityImage(standing);
      // save duration of activity
    }
    else {
      setBannerColor('#b8e9df');
      setActivityImage(sitting);
      // save duration of activity
    }
    return () => {
      isMounted = false;
    };
  }, [activity]);


  return (<>
    {/* backgroundColor: bannerColor add this to banner style  */} 
    <View style={[styles.banner, {backgroundColor: bannerColor}]}>
      <View style={styles.bannerContainer}>
        <View style={styles.rowLabel}>
          <View style={styles.fireContainer}>
            <Image
              source={fire}
              resizeMode="contain"
              style={styles.fireImage}
            />
          </View>
          <Text style={styles.offer}>Good for Health </Text>
        </View>
        <OfferText>{activity}</OfferText>
        <OfferText>{environment}</OfferText>
        {/* <Button onPress={handlePredict} title="Predict" /> */}
      </View>
    </View>
    <Image source={activityImage} style={styles.model} resizeMode="contain" />
  </>
);
}

const OfferText = ({children}) => (
  <Text style={styles.offerText}>{children}</Text>
);

const ImageContainer = ({image, height = '100%', width = '100%'}) => (
  <View style={styles.imageContainer}>
    <Image source={image} style={[{ height, width}]} />
  </View>
);
const HeaderTitle = (props) => (
  <View style={styles.title}>
    <Text style={[styles.bigTitle, { color: props.isBright ? 'white' : 'black' }]}>Hi, Jane</Text>
    <Text style={styles.smallTitle}>Aug 12, 2021</Text>
  </View>
);

const Label = ({children}) => <Text style={styles.label}>{children}</Text>;
const styles = StyleSheet.create({
  container: {flex: 1, marginTop: 30 },
  header: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {paddingHorizontal: 10, flex: 1, justifyContent: 'center'},
  bigTitle: {fontSize: 16, fontFamily: useFonts.PoppinsMedium},
  smallTitle: {fontSize: 10, fontFamily: useFonts.PoppinsRegular, opacity: 0.6},
  image: {height: '100%', width: '100%'},
  fireImage: {height: 15, width: 15, alignSelf: 'center', margin: 5},
  banner: {
    marginTop: 20,
    padding: 30,
    resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    padding: 30,
    resizeMode: 'contain',
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContainer: {flex: 1},
  label: {fontFamily: useFonts.PoppinsMedium, fontSize: 20, marginVertical: 10},
  model: {
    position: 'absolute',
    right: 0,
    bottom: -10,
    zIndex: 10,
    height: "85%",// walking 85 
    width: '50%',
    transform: [{rotateY: '180deg'}],
  },
  wellbeing: {
    position: 'absolute',
    right: 150,
    bottom: 10,
    zIndex: 10,
    height: "100%",// walking 85 
    width: '100%',
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

  },
  screen: {margin: '3%'},
  offer: {color: 'black', fontFamily: useFonts.PoppinsRegular, fontSize: 10},
  offerText: {color: 'black', fontSize: 16, fontFamily: useFonts.PoppinsRegular},

  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fireContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const data = [
  
  {
    name: 'Walking',
    status: 25,
    day: '1',
    time: '30',
    image: walk,
    lightColor: '#d7f0f7',
    color: '#e8f7fc',
    darkColor: '#aceafc',
  },
  {
    name: 'Sitting',
    status: 94,
    day: '1',
    time: '40',
    image: yoga,
    lightColor: '#dad5fe',
    color: '#e7e3ff',// #8860a2
    darkColor: '#8860a2',
  },
  {
    name: 'Jogging',
    status: 55,
    day: '1',
    time: '50',
    image: running,
    lightColor: '#f8e4d9',
    color: '#fcf1ea',
    darkColor: '#fac5a4',
  },
  {
    name: 'Cycling',
    status: 85,
    day: '1',
    time: '20',
    image: cycle,
    lightColor: '#d7f0f7',
    color: '#e8f7fc',
    darkColor: '#aceafc',
  }
 


];

const environments = [
  {
    name: 'Quiet Place',
    image: quiet,
    hour: '1',
    min: '20',
    completed: 80,
    text: 'Good for your ears and your mental health'
  },
  {
    name: 'Sunny Place',
    image: sunny,
    hour: '3',
    min: '30',
    completed: 60,
    text: 'Good for your skin'

  },
  {
    name: 'Dark Place',
    image: dark,
    hour: '5',
    min: '40',
    completed: 40,
    text: 'Good for your eyes'
  },
  {
    name: "Clear Sky",
    image: clearsky,
    hour: '6',
    min: '50',
    completed: 20,
    text: "Don't forget your sunscreen"
  },
  {
    name: "Indoor",
    image: indoor,
    hour: '3',
    min: '20',
    completed: 80,
    text: 'Stay safe from the sun'
  },
  {
    name: "Bad Air",
    image: badair,
    hour: '1',
    min: '20',
    completed: 80,
    text: 'Get some fresh air'
  }



]
