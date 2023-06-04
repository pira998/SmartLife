import React, { useEffect, useState } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { Accelerometer, DeviceMotion, Gyroscope, Barometer, LightSensor } from 'expo-sensors';
import { Formik, ErrorMessage } from 'formik';
import Slider from '@react-native-community/slider';
import * as Yup from 'yup';


import "./ignoreWarnings";


import { useFonts } from 'expo-font';
console.disableYellowBox = true;

const headerImage = require('./assets/images/header.jpg');

const App = ({ navigation }) => {
    const [{ illuminance }, setIData] = useState({ illuminance: 0 });
    const [{ pressure, relativeAltitude }, setBData] = useState({ pressure: 0, relativeAltitude: 0 });
    const [subscription, setSubscription] = useState(null);
    LightSensor.setUpdateInterval(1000);

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
            console.log('Illuminance : ', illuminanceValues)
        }


    }, [illuminance]);

    // // average illuminance
    const averageIlluminance = illuminanceValues.reduce((a, b) => a + b, 0) / illuminanceValues.length;

    const isBright = averageIlluminance > 20;

    
    return (
        <>
            <StatusBar style={isBright ? 'light' : 'dark'} backgroundColor={isBright ? '#35363a' : 'white'} />

            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: isBright ? '#35363a' : 'white' }]}>
                <View style={styles.screen}>
                    <Header isBright={isBright} navigation={navigation}/>
                </View>
                <FormCard isBright={isBright} navigation={navigation} />
                
            </ScrollView>
        </>
    );
};

export default App;

const FormCard = ({isBright, navigation}) => {
    // classes = ['Walking', 'Downstairs', 'Jogging', 'Sitting', 'Standing', 'Upstairs', ]
    const [walkingGoal, setWalkingGoal] = useState(100);
    const [joggingGoal, setJoggingGoal] = useState(100);
    const [sittingGoal, setSittingGoal] = useState(100);
    const [standingGoal, setStandingGoal] = useState(100);
    const [screenTimeGoal, setScreenTimeGoal] = useState(100);
    const [color_, setColor] = useState('white');

    const handleWalkingSliderChange = (value) => {
        setWalkingGoal(value);
    };

    const handleJoggingSliderChange = (value) => {
        setJoggingGoal(value);
    };

    const handleSittingSliderChange = (value) => {
        setSittingGoal(value);
    };

    const handleStandingSliderChange = (value) => {
        setStandingGoal(value);
    };

    const handleScreenTimeSliderChange = (value) => {
        setScreenTimeGoal(value);
    };

    useEffect(() => {
        if (isBright) {
            setColor('white');
        } else {
            setColor('black');
        }
    }, [isBright]);

    const handleSubmit = () => {
        console.log('submitting')
        return navigation.navigate('Home', {
            walkingGoal: walkingGoal,
            joggingGoal: joggingGoal,
            sittingGoal: sittingGoal,
            standingGoal: standingGoal,
            screenTimeGoal: screenTimeGoal,
        });
    }


    return (
        <View style={styles.form}>
            <Formik
                initialValues={{ walkingGoal: 100, joggingGoal: 100, sittingGoal: 100, standingGoal: 100, screenTimeGoal: 100 }}
                validationSchema={Yup.object({
                    walkingGoal: Yup.number(),
                    joggingGoal: Yup.number(),
                    sittingGoal: Yup.number(),
                    standingGoal: Yup.number(),
                    screenTimeGoal: Yup.number(),

                })}
                onSubmit={(values, formikActions) => {
                    setTimeout(() => {
                        // Alert.alert(JSON.stringify(values));
                        // Important: Make sure to setSubmitting to false so our loading indicator
                        // goes away.
                        navigation.navigate('Home',{
                            values: values
                        });
                        formikActions.setSubmitting(false);
                    }, 1000);
                }}>
                {props => (
                    <View>
                        <Text style={[styles.label, { color: color_ }]}>
                            Walking {walkingGoal} mins
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={200}
                            step={1}
                            value={60}
                            minimumTrackTintColor="purple"
                            maximumTrackTintColor="#000000"
                            onValueChange={handleWalkingSliderChange}
                        />

                        <Text style={[styles.label, { color: color_ }]}>
                            Jogging {joggingGoal} mins
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={200}
                            step={1}
                            value={60}
                            minimumTrackTintColor="purple"
                            maximumTrackTintColor="#000000"
                            onValueChange={handleJoggingSliderChange}
                        />

                        <Text style={[styles.label, { color: color_ }]}>
                            Sitting {sittingGoal} mins
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={200}
                            step={1}
                            value={60}
                            minimumTrackTintColor="purple"
                            maximumTrackTintColor="#000000"
                            onValueChange={handleSittingSliderChange}
                        />

                        <Text style={[styles.label, { color: color_ }]}>
                            Standing {standingGoal} mins
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={200}
                            step={1}
                            value={60}
                            minimumTrackTintColor="purple"
                            maximumTrackTintColor="#000000"
                            onValueChange={handleStandingSliderChange}
                        />

                        <Text style={[styles.label, { color: color_ }]}>
                            Total Screen Time {screenTimeGoal} mins
                        </Text>
                        <Slider
                            style={{ width: "100%", height: 40 }}
                            minimumValue={0}
                            maximumValue={200}
                            step={1}
                            value={60}
                            minimumTrackTintColor="purple"
                            maximumTrackTintColor="#000000"
                            onValueChange={handleScreenTimeSliderChange}
                        />

                        
                        <Button
                            onPress={props.handleSubmit}
                            color="black"
                            mode="contained"
                            loading={props.isSubmitting}
                            disabled={props.isSubmitting}
                            style={{ marginTop: 16 }}>
                            Submit
                        </Button>
                        <Button
                            onPress={props.handleReset}
                            color="black"
                            mode="outlined"
                            disabled={props.isSubmitting}
                            style={{ marginTop: 16 }}>
                            Reset
                        </Button>
                    </View>
                )}
            </Formik>
        </View>
    )
}

const Header = (props) => (
    <View style={styles.header}>
        <ImageContainer image={headerImage} />
        <HeaderTitle isBright={props.isBright} />
        {/* <ImageContainer image={notification} height={'50%'} width={'50%'} /> */}
        {/* notification button with icon */}

        <View style={{ margin: 10 }}>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('Home')}>
                <AntDesign name="back" size={24} color={props.isBright ? "white" : "black"} />
            </TouchableOpacity>
        </View>
    </View>
);

const ImageContainer = ({ image, height = '100%', width = '100%' }) => (
    <View style={styles.imageContainer}>
        <Image source={image} style={[{ height, width }]} />
    </View>
);
const HeaderTitle = (props) => (
    <View style={styles.title}>
        <Text style={[styles.bigTitle, { color: props.isBright ? 'white' : 'black' }]}>GOAL SETTING</Text>
        {/* <Text style={styles.smallTitle}>Aug 12, 2021</Text> */}
    </View>
);

const styles = StyleSheet.create({
    form: {
        flex: 1,
        marginTop: 30,
        paddingHorizontal: 10,
    },
    container: { 
        flex: 1, 
        marginTop: 30 ,
        // paddingHorizontal: 5,
    },
    header: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
    bigTitle: { fontSize: 16, fontFamily: useFonts.PoppinsMedium },
    smallTitle: { fontSize: 10, fontFamily: useFonts.PoppinsRegular, opacity: 0.6 },
    image: { height: '100%', width: '100%' },
    fireImage: { height: 15, width: 15, alignSelf: 'center', margin: 5 },
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
        borderColor: 'black',
        borderWidth: 5,
    },
    bannerContainer: { flex: 1 },
    label: { fontFamily: useFonts.PoppinsMedium, fontSize: 20, marginVertical: 10 },
    model: {
        position: 'absolute',
        right: 0,
        bottom: -10,
        zIndex: 10,
        height: "85%",// walking 85 
        width: '50%',
        transform: [{ rotateY: '180deg' }],
    },
    imageContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',

    },
    screen: { margin: '3%' },
    offer: { color: 'black', fontFamily: useFonts.PoppinsRegular, fontSize: 10 },
    offerText: { color: 'black', fontSize: 16, fontFamily: useFonts.PoppinsRegular },

    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        margin: 8,
        fontSize: 14,
        color: 'red',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        paddingHorizontal: 8,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
});
