import React, { useState, useEffect, createRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    SafeAreaView,
    StatusBar,
    ToastAndroid,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { Divider } from "react-native-elements";
import ActionSheet from "react-native-actions-sheet";
import LinearGradient from "react-native-linear-gradient";
// import Picker from "@gregfrench/react-native-wheel-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { messagesEmployerList, employerList } from "./messagesEmployerList";
import { AVSafeArea } from "../../components/Common/SafeArea";
import { useSelector, useDispatch } from "react-redux";
import { getEmployeesJobListAction } from '../../components/actions/EmployeerAppliedJobAction/EmployerAppliedJobListAction';
import { getChatListAction } from '../../components/actions/ChatAction/ChatListAction';
import { createRoomAction, chatRoomRes } from '../../components/actions/ChatAction/CreateRoomAction';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import ProgressCircle from 'react-native-progress-circle';
import { getEmployeerJobListAction } from '../../components/actions/EmployeeOnboardingActions/EmployeerJobListAction';
import { employeerAppliedJobWithPostAction } from '../../components/actions/EmployeeOnboardingActions/EployeerAppliedJobwithPostAction';
import { images } from "../../../assets/images";
import SocketIOClient from "socket.io-client";
import Toast, { DURATION } from 'react-native-easy-toast';
import { employeerScheduleListAction } from '../../components/actions/ChatAction/EmployeerScheduleListAction';
import { scheduleFeedbackAction, scheduleFeedbackRes } from '../../components/actions/ChatAction/ScheduleFeedbackAction';
import colors from '../../../assets/color';
import { Platform } from 'react-native';
import { AVSocialIcon } from "../../components/Common/SocialIcon";
import DropDownPicker from 'react-native-dropdown-picker'; // import this at the top of your file
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome or any other icon library

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';




var PickerItem = Picker.Item;

const { width } = Dimensions.get("screen");
var ws = null;
ws = SocketIOClient('https://api.avda.pineappleworkshop.com', {
    transports: ['websocket'],
    jsonp: false,
});

var actJob = ''

export const MessagesEmployerScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const getEmployeesJobList = useSelector(state => state.getEmployeesJobListRes);
    const getChatListRedux = useSelector(state => state.getChatListRes.getChatList);
    const createRoomRedux = useSelector(state => state.chatRoomRes);
    const getEmployerJobListRedux = useSelector(state => state.getEmployeerjobListRes.getEmployeerJobListData);
    const getPostAppliedListRedux = useSelector(state => state.employerAppliedJobwithPostRes.employerAppliedJobwithPost);
    const employerScheduleListRedux = useSelector(state => state.employeerScheduleListRes);
    console.log('employerScheduleListRedux', employerScheduleListRedux);
    const scheduleFeedbackRedux = useSelector(state => state.scheduleFeedbackRes ? state.scheduleFeedbackRes.scheduleFeedbackData : '');

    const [isEmployerApplied, setIsEmployerApplied] = useState(true);
    const [isEmployerMessages, setIsEmployerMessages] = useState(false);
    const [isEmployerScheduled, setIsEmployerScheduled] = useState(false);
    const [date, setDate] = useState(new Date(2020, 10, 30));
    const [mode, setMode] = useState("date");
    const [startDate, setStartDate] = useState("");
    const [show, setShow] = useState(false);
    const openScheduledPopUp = React.createRef();
    const openScheduledCalendarPopUp = React.createRef();
    const [appliedJobList, setAppliedJobList] = useState([]);
    const [allChatList, setAllChatList] = useState([]);
    const [itemUser, setItemUser] = useState({});
    const [getCreateRoomId, setGetCreateRoomId] = useState(null);
    const [employeJobList, setEmployeJobList] = useState([]);
    const [employeAppliedJobJobList, setEmployeAppliedJobJobList] = useState([]);
    const toastDisplayRef = createRef();
    const [employerSchedulerList, setEmployerSchedulerList] = useState([]);
    const [scheduleUserReview, setScheduleUserReview] = useState({});
    const [currentActiveJob, setCurrentActiveJob] = useState(null);
    const [selectedJob, setSelectedJob] = useState('No job selected');
    
    const [isSwitchJobsPressed, setSwitchJobsPressed] = useState(false);



    const [modalVisible, setModalVisible] = useState(false);


    const handleOpenBottomSheet = (item) => {
        setScheduleUserReview(item);
        openScheduledPopUp.current?.setModalVisible(true);
    }

    const closeModal = () => {
        openScheduledPopUp.current?.setModalVisible(false);
    }

    const onPressButton = (select) => {
        if (select === 'applied') {
            setIsEmployerApplied(true)
            setIsEmployerMessages(false)
            setIsEmployerScheduled(false)
            dispatch(employeerAppliedJobWithPostAction(currentActiveJob))
        }
        else if (select === 'messages') {
            setIsEmployerApplied(false)
            setIsEmployerMessages(true)
            setIsEmployerScheduled(false)
            dispatch(getChatListAction(currentActiveJob ? currentActiveJob.id : ''));

        } else if (select === "scheduled") {
            setIsEmployerApplied(false)
            setIsEmployerMessages(false)
            setIsEmployerScheduled(true)
            dispatch(employeerScheduleListAction(currentActiveJob))
        }
    }

    useEffect(() => {
        ws.on('chatlist', (msg) => {
            console.log('onMessage useEffect', msg)
            dispatch(getChatListAction(actJob.id));
        });
    }, []);

    useEffect(() => {
        console.log('didmount');
        const unsb = navigation.addListener('focus', () => {
            console.log('willmount');
            refreshData()
            const request = {
                UserId: 3,
                time: 'DateTime'
            };
            ws.emit('activeTimeStatus', 'request');
        })
        return unsb

    }, []);

    const refreshData = () => {
        dispatch(getEmployeesJobListAction());
        // dispatch(getChatListAction());
        dispatch(getEmployeerJobListAction());
        // dispatch(employeerScheduleListAction())
    }

    useEffect(() => {
        if (scheduleFeedbackRedux !== '' && scheduleFeedbackRedux !== null && scheduleFeedbackRedux !== undefined) {
            console.log('scheduleFeedbackRedux', scheduleFeedbackRedux)
            openScheduledPopUp.current?.setModalVisible(false);
            toastDisplayRef.current?.show(scheduleFeedbackRedux.message, DURATION.LENGTH_SHORT);
            setTimeout(() => {
                dispatch(scheduleFeedbackRes(''));
            }, 200);
        }
    }, [scheduleFeedbackRedux]);

    useEffect(() => {
        if (getEmployeesJobList.getAllEmployeJobList) {
            if (getEmployeesJobList.getAllEmployeJobList.length > 0) {
                setAppliedJobList(getEmployeesJobList.getAllEmployeJobList)
            }
        }
    }, [getEmployeesJobList.getAllEmployeJobList]);

    useEffect(() => {
        if (getChatListRedux !== '' && getChatListRedux !== null && getChatListRedux !== undefined) {
            console.log('inside if getChatListRedux', getChatListRedux)
            setAllChatList(getChatListRedux)
        }
    }, [getChatListRedux]);

    useEffect(() => {
        if (getEmployerJobListRedux !== null && getEmployerJobListRedux !== undefined && getEmployerJobListRedux !== '') {
            setEmployeJobList(getEmployerJobListRedux);
            if (getEmployerJobListRedux.length > 0 && getEmployerJobListRedux[0].JobPosterTitles && getEmployerJobListRedux[0].JobPosterTitles.length > 0) {

                appliedDataWithPost(getEmployerJobListRedux[0].JobPosterTitles[0],getEmployerJobListRedux)
            }
        }
    }, [getEmployerJobListRedux]);

    useEffect(() => {
        if (getPostAppliedListRedux !== '' && getPostAppliedListRedux !== null && getPostAppliedListRedux !== undefined) {
            setEmployeAppliedJobJobList(getPostAppliedListRedux);
        }
    }, [getPostAppliedListRedux]);

    useEffect(() => {
        setEmployerSchedulerList([])
        if (employerScheduleListRedux.employerScheduleListData) {
            if (employerScheduleListRedux.employerScheduleListData.data) {
                if (employerScheduleListRedux.employerScheduleListData.data.length > 0) {
                    console.log("come");
                    setEmployerSchedulerList(employerScheduleListRedux.employerScheduleListData.data)
                }
            }
        }
    }, [employerScheduleListRedux.employerScheduleListData]);

    useEffect(() => {
        if (createRoomRedux.roomData !== '' && createRoomRedux.roomData !== null && createRoomRedux.roomData !== undefined) {
            if (createRoomRedux.roomData) {
                if (createRoomRedux.roomData.success) {
                    setGetCreateRoomId(createRoomRedux.roomData.data)
                    ws.emit('chatlist', 'sendMessageRequest')
                    navigation.navigate('FrontEndDeveloperScreen', { roomId: createRoomRedux.roomData.data, fileType: 0, selectItem: itemUser, screenName: 'employerChat' })
                    setTimeout(() => {
                        dispatch(chatRoomRes(''));
                    }, 500);
                } else {
                    setGetCreateRoomId(createRoomRedux.roomData.data)
                    navigation.navigate('FrontEndDeveloperScreen', { roomId: createRoomRedux.roomData.data, fileType: createRoomRedux.roomData.fileType, selectItem: itemUser, screenName: 'employerChat' })
                    setTimeout(() => {
                        dispatch(chatRoomRes(''));
                    }, 500);
                }
            }
        } else if (createRoomRedux.error) {
            if (createRoomRedux.error.message) {
                toastDisplayRef.current?.show(createRoomRedux.error.message, DURATION.LENGTH_SHORT);
                dispatch(chatRoomRes(''));
            }
        }
    }, [createRoomRedux]);

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const __ = dayjs(selectedDate).format("MM/DD/YYYY");
        setStartDate(__);
        setShow(false);
    };

    const goToChat = (item) => {
        setItemUser(item)
        createRoomId(item);
    }


    const getProgressPercent = (date, time) => {
        let downTimeProgress = 0;
        if (time && date) {
            // setInterval(() => {
            let splittedTime = time.split(":");
            var lastVar = splittedTime.pop();
            var restVar = splittedTime.join(":");
            let dt = `${date}T${restVar}`;
            let dt1 = new Date(dt);
            let dt2 = new Date();
            // console.log('dt2===>', dt2, dt1, dt)

            var ms = moment(dt2, "DD/MM/YYYY HH:mm").diff(moment(dt1, "DD/MM/YYYY HH:mm"));
            var d = moment.duration(ms);
            let progressValue = (d.asHours() / 48) * 100;
            downTimeProgress = progressValue > 100 ? 100 : progressValue < 0 ? 0 : progressValue;
            // console.log('downTimeProgress===>', downTimeProgress, ms, d.asHours())
            return 100 - downTimeProgress;
            // }, 3000);
        }

        return downTimeProgress;
    };

    async function createRoomId(item) {
        const userId = await AsyncStorage.getItem('@user_id');
        console.log("empuserId", userId);
        setTimeout(() => {
            const sendRoomData = {
                "adminId": userId,
                "date": moment().format('L'),
                "time": moment().format('LTS'),
                "userArray": [
                    {
                        "user_id": userId
                    },
                    {
                        "user_id": String(item.UserId)
                    }
                ],
                post_id: String(item.post_id),
                userId: item.UserId,
                companyId: userId

            }
            console.log('sendRoomData', sendRoomData);
            dispatch(createRoomAction(sendRoomData));
        }, 500);
    }

    const appliedDataWithPost = (item,employeJobList) => {
        //employeJobList
        console.log('item===>', item);
        console.log('employeJobList===>', JSON.stringify(employeJobList));

        let selectedJobt = item.title
        let selectedJobID = item.id
        console.log('item===>', item);
        for (let jobItem of employeJobList[0].JobPosterTitles) {
            console.log('??????',jobItem);
          if (jobItem.id === item.id) {
           jobItem.isSelected = true
           } else {
             jobItem.isSelected = false
           }
         }

        if (item) {
            setCurrentActiveJob(item)
            actJob = item;
        }
        dispatch(getChatListAction(item.id));
        dispatch(employeerScheduleListAction(item))
        dispatch(employeerAppliedJobWithPostAction(item))

        if (item) {
            setCurrentActiveJob(item)
            actJob = item;
            setSelectedJob(item.title); // Update the selected job
        }

    }

    const goToChatScreen = (item) => {
        var fileType = '';
        if (item.messsage) {
            fileType = item.messsage.fileType
        }
        navigation.navigate('FrontEndDeveloperScreen', { roomId: item.roomId, fileType: fileType, chatId: item.UserId, selectItem: item, screenName: 'employerChat' })
    }

    const getMesssageTime = (previous, msgDate) => {
        let lastTimeText = '';
        var lstMsgDate = '';
        var lstMsgMonth = '';
        var lstMsgYear = '';
        var lstMsgHour = '';
        var lstMsgMin = '';
        var lstMsgSec = '';
        if (msgDate && previous) {
            const convertTime = moment(previous, 'hh:mm:ss A').format('HH:mm:ss')
            const lastMessageDate = msgDate.split('/');
            const lastMessageTime = convertTime.split(' ');
            const lastMessageSplitTime = lastMessageTime[0].split(':');
            lstMsgDate = lastMessageDate[1];
            lstMsgMonth = lastMessageDate[0];
            lstMsgYear = lastMessageDate[2];
            lstMsgHour = lastMessageSplitTime[0];
            lstMsgMin = lastMessageSplitTime[1];
            lstMsgSec = lastMessageSplitTime[2];

            var currentDate = new Date();
            var previousDate = new Date(lstMsgYear, lstMsgMonth - 1, lstMsgDate, lstMsgHour, lstMsgMin, lstMsgSec);

            var msPerMinute = 60 * 1000;
            var msPerHour = msPerMinute * 60;
            var msPerDay = msPerHour * 24;
            var msPerMonth = msPerDay * 30;
            var msPerYear = msPerDay * 365;

            var elapsed = currentDate - previousDate;

            if (elapsed < msPerMinute) {
                lastTimeText = Math.round(elapsed / 1000) + ' seconds ago';
            }

            else if (elapsed < msPerHour) {
                lastTimeText = Math.round(elapsed / msPerMinute) + ' minutes ago';
            }

            else if (elapsed < msPerDay) {
                lastTimeText = Math.round(elapsed / msPerHour) + ' hours ago';
            }

            else if (elapsed < msPerMonth) {
                lastTimeText = Math.round(elapsed / msPerDay) + ' days ago';
            }

            else if (elapsed < msPerYear) {
                lastTimeText = Math.round(elapsed / msPerMonth) + ' months ago';
            }

            else {
                lastTimeText = Math.round(elapsed / msPerYear) + ' years ago';
            }
            return lastTimeText;
        }

    }

    const ManageTime = (time) => {
        const convert = moment(time, 'HH:mm').format('hh:mm A')
        return convert;
    }

    const setFeedback = (status) => {
        const request = {
            msgScheduleId: scheduleUserReview.id,
            schedulePerformanceStatus: status
        }
        dispatch(scheduleFeedbackAction(request));
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setSelectedJob(currentActiveJob ? currentActiveJob.title : 'No job selected'); // Update the selected job when navigating away
        });

        return unsubscribe;
    }, [navigation, currentActiveJob]);

    return (
        <AVSafeArea>
            <StatusBar barStyle={'dark-content'}/>




            <View style={styles.container}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10, marginTop: 50 }}>
    <Text style={{ fontStyle: "normal", fontWeight: "bold", fontSize: 24, lineHeight: 29, color: "#25324D" }}>Messages</Text>

    {employeJobList[0]?.JobPosterTitles.length <= 1 ? (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          height: 54,
          justifyContent: 'center',
          borderRadius: 8,
          paddingHorizontal: 10, 
        }}
        onPress={() => setModalVisible(true)}
      >
      <View style={{ width: 54, height: 54, borderRadius: 27, borderWidth: 1, borderColor: colors.disabledColor, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Image
          source={images.PlusNew}
          style={{ width: 19, height: 19 }}
        />
      </View>
      <Text
        numberOfLines={1}
        style={styles.text2}
      >
        Add Job
      </Text>
    </TouchableOpacity>
  ) : (
<TouchableOpacity
  style={{
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 10,
    borderRadius: 8,
    paddingHorizontal: 10, 
  }}
  onPress={() => {
    setModalVisible(true);
    setSwitchJobsPressed(true); // Update the state when the button is pressed
  }}
>
  <View style={isSwitchJobsPressed ? { width: 24, height: 24, borderRadius: 27, borderWidth: 1, borderColor: colors.disabledColor, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' ,marginRight: 5 , marginBottom: 5} 
                                   : { width: 50, height: 50, borderRadius: 27, borderWidth: 1, borderColor: colors.disabledColor, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}}>
    <Image
      source={isSwitchJobsPressed ? images.addJobOpen : images.Switchjob} // Use different images based on the state
      style={isSwitchJobsPressed ? { width: 24, height: 24 } : { width: 24, height: 24 }} // Use different dimensions based on the state
    />
  </View>
  {!isSwitchJobsPressed && ( // Only show the text if the button hasn't been pressed
    <Text
      numberOfLines={1}
      style={styles.text2}
    >
      Switch Jobs
    </Text>
  )}
</TouchableOpacity>


  )}

{/* marginRight: 20 , marginBottom: 20 */}

<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(false)
    setSwitchJobsPressed(false);
    }}

>
<TouchableOpacity
    style={{flex: 1}}
    activeOpacity={1}
    onPressOut={() => {
      setModalVisible(false);
      setSwitchJobsPressed(false); // Reset the state when the modal is closed
    }}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
      >
           <View style={{ backgroundColor: 'white', padding: 7, borderRadius: 10, height: 245, width: 243, marginLeft: 100, marginBottom: 220, shadowColor: '#3A79F4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 15, elevation: 15 }}>

          {/* New field to display selected job */}


          <View style={{ marginBottom: 10, marginRight: 15, alignSelf: 'center', height: 25, width: 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  <Text style={{ fontSize: 13, fontFamily: 'SF Pro Text', fontWeight: '400', color: '#25324D', textAlign: 'left' }}>{selectedJob}</Text>
  <Image source={images.Checked_Icon} style={{ width: 19, height: 19, marginRight: -23 }}/>
</View>

          {/* addJobOpen */}

          {/* Checked_Icon */}
          <TouchableOpacity style={{ backgroundColor: 'white',  alignSelf: 'center',  justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ fontSize: 12, fontFamily: 'SF Pro Text', fontWeight: '600', color: '#8692AC', textAlign: 'center', borderWidth: 1, borderColor: '#386BD4', borderRadius: 6, width: 216, height: 24 ,lineHeight: 24 }}>Edit job</Text>

          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: '#E4E7EE' , marginBottom: 11, marginTop: 15}} />

          <ScrollView>
  {employeJobList[0]?.JobPosterTitles.map((item) => (
    <TouchableHighlight
      key={item.id}
      onPress={() => {
        appliedDataWithPost(item, employeJobList);
        setSelectedJob(item.title); 
        setModalVisible(false);
        setSwitchJobsPressed(false); // Reset the state when a job is selected
      }}
      style={{ paddingBottom: 7, }}
    >
      <Text style={{ marginLeft: 7,fontSize: 13, fontFamily: 'SF Pro Text', fontWeight: '400', color: '#25324D' }}>{item.title}</Text>
    </TouchableHighlight>
  ))}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PostJobSteps', { prevScreen: 'CompanyProfile' })
                setModalVisible(false)
              }}
              style={{ marginLeft: 15, marginTop: 5 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={images.Vector} style={{ width: 14, height: 14 , marginRight: 5, marginLeft: -10}}/>
                <Text style={{ fontSize: 16, fontFamily: 'SF Pro Text', fontWeight: 'bold', color: '#386BD4', textAlign: 'center'}}>Add a new job</Text>
                </View>

            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>


</View>














                <View style={{ paddingHorizontal: 16, flex: 1 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            borderRadius: 6,
                            backgroundColor: '#F2F2F2',
                            alignSelf: "center",
                            marginTop: 30,
                            paddingVertical: 4,
                            paddingHorizontal: 2,
                            width: '100%',
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => onPressButton('applied')}
                            style={[styles.touchableApplied, { backgroundColor: isEmployerApplied ? '#FFFFFF' : '#F2F2F2', width: '33%' }]}>
                            <Text style={styles.textApplied, { color: isEmployerApplied ? '#24324D' : '#667287', fontWeight: isEmployerApplied ? 'bold' : 'normal' }}>Applied</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onPressButton('messages')}
                            style={[styles.touchableApplied, { backgroundColor: isEmployerMessages ? '#FFFFFF' : '#F2F2F2', width: '33%' }]}>
                            <Text style={styles.textMessages, { color: isEmployerMessages ? '#25324D' : '#667287', fontWeight: isEmployerMessages ? 'bold' : 'normal' }}>Messages</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onPressButton('scheduled')}
                            style={[styles.touchableApplied, { backgroundColor: isEmployerScheduled ? '#FFFFFF' : '#F2F2F2', width: '33%' }]}>
                            <Text style={styles.textScheduled, { color: isEmployerScheduled ? '#25324D' : '#667287', fontWeight: isEmployerScheduled ? 'bold' : 'normal' }}>Scheduled</Text>
                        </TouchableOpacity>
                    </View>











                    <ScrollView showsVerticalScrollIndicator={false}>
                        {isEmployerApplied ?
                            <View alignItems="center" style={{ paddingVertical: 20 }}>
                                {employeAppliedJobJobList && employeAppliedJobJobList.length > 0 ?
                                    employeAppliedJobJobList.map((item, index) => {
                                        return (
                                            <View key={index} style={{ width: '100%', paddingVertical: 2, marginBottom: 10, backgroundColor: '#FFFFFF', borderRadius: 8, shadowColor: '#25324D10', shadowOffset: { width: 0, height: 4 }, shadowRadius: 15, shadowOpacity: 1, elevation: 1 }}>
                                                <TouchableOpacity
                                                    style={{
                                                        width: width - 10,
                                                        minHeight: 68,
                                                        // marginTop: 10,
                                                        paddingHorizontal: 12,
                                                        paddingVertical: 10,
                                                        // justifyContent: "center",
                                                        // backgroundColor: "#FFFFFF",
                                                        // borderRadius: 10,
                                                        // elevation: 1
                                                    }}
                                                    onPress={() => { goToChat(item) }}
                                                >
                                                    <View style={{ flexDirection: "row", alignItems: "center", maxWidth: '80%', elevation: 1 }}>
                                                        <View>
                                                            <ProgressCircle
                                                                percent={getProgressPercent(item.date, item.time)}
                                                                radius={27}
                                                                borderWidth={1}
                                                                // color="#3399FF"
                                                                // bgColor="#f2f2f2"
                                                                color="#3399FF"
                                                                shadowColor="#f2f2f2"
                                                                bgColor="#f2f2f2"
                                                            >
                                                                {
                                                                    (item.image != '' && item.image != null && item.image != undefined) ?
                                                                        <Image
                                                                            source={{ uri: item.image }}
                                                                            resizeMode="cover"
                                                                            style={{ height: 48, width: 48, borderRadius: 48 }}
                                                                        /> :
                                                                        <Image
                                                                            resizeMode="cover"
                                                                            style={{ height: 48, width: 48, borderRadius: 48 }}
                                                                            source={images.defaultUser}
                                                                        />
                                                                }
                                                            </ProgressCircle>
                                                        </View>
                                                        <View style={{ marginLeft: 5 }}>
                                                            <Text numberOfLines={1} style={[styles.nameGoogle, { marginBottom: 4 }]}>
                                                                {item?.name}
                                                            </Text>
                                                            <Text numberOfLines={1} style={{ fontSize: 13, marginLeft: 10, color: '#667287' }}>
                                                                {item.jobtitle ? item.jobtitle : ''}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }) : <View flex={1} alignItems="center" justifyContent="center">
                                        <Text>Click on the job to see the applied chat list.</Text>
                                    </View>
                                }
                            </View> : isEmployerMessages ?
                                <View flexDirection="column" width="100%" justifyContent="center" alignItems="center" style={{ paddingVertical: 20 }}>
                                    {allChatList && allChatList.length > 0 ?
                                        allChatList.map((item, index) => {
                                            return (
                                                <View key={index} alignItems="center">
                                                    <TouchableOpacity onPress={() => { goToChatScreen(item) }}>
                                                        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, width: width - 20 }}>
                                                            <View style={{ flexDirection: "row", justifyContent: "center", paddingLeft: 7 }}>
                                                                <ProgressCircle
                                                                    percent={100}
                                                                    radius={27}
                                                                    borderWidth={1}
                                                                    color="#999"
                                                                    shadowColor="#999"
                                                                    bgColor="#fff"
                                                                >
                                                                    {
                                                                        (item.image != '' && item.image != null && item.image != undefined) ?
                                                                            <Image
                                                                                source={{ uri: item.image }}
                                                                                resizeMode="cover"
                                                                                style={{ height: 51, width: 51, borderRadius: 51 }}
                                                                            />
                                                                            :
                                                                            <Image
                                                                                style={{ height: 51, width: 51, borderRadius: 51 }}
                                                                                source={images.defaultUser}
                                                                                resizeMode="cover"
                                                                            >

                                                                            </Image>}
                                                                </ProgressCircle>
                                                                <View style={{ height: 15, width: 15, backgroundColor: colors.white, borderRadius: 9, position: "absolute", bottom: 0, right: 0, alignItems: "center", justifyContent: "center" }}>
                                                                    <View style={{ height: 11, width: 11, backgroundColor: item.online == 1 ? "#4CD964" : "#8692AC", borderRadius: 7, }} />
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 5, marginLeft: 8, }}>
                                                                <View flexDirection={'row'}>
                                                                    <Text style={styles.nameGoogle}>
                                                                        {item?.name}
                                                                    </Text>
                                                                    {item.messsage ?
                                                                        <Text style={styles.messageTime}>
                                                                            <Text>•</Text> {getMesssageTime(item.messsage.time, item.messsage.date)}
                                                                        </Text> : null}
                                                                </View>
                                                                <View>
                                                                    {(item.messsage && item.messsage.id) ?
                                                                        <View>
                                                                            {
                                                                                item.messsage.contentType == 'text' &&
                                                                                <Text numberOfLines={2} style={styles.messageText}>{item.messsage.message}</Text>
                                                                            }
                                                                            {
                                                                                (item.messsage.contentType == 'image' || item.messsage.fileType == '1') &&
                                                                                <Text style={styles.messageText}>Image</Text>
                                                                            }
                                                                            {
                                                                                item.messsage.contentType == 'docx' &&
                                                                                <Text style={styles.messageText}>Document</Text>
                                                                            }
                                                                            {
                                                                                item.messsage.contentType == 'pdf' &&
                                                                                <Text style={styles.messageText}>Pdf</Text>
                                                                            }
                                                                            {
                                                                                item.messsage.contentType == 'schedule' &&
                                                                                <Text style={styles.messageText}>Scheduled interview</Text>
                                                                            }
                                                                            {
                                                                                item.messsage.fileType == 5 &&
                                                                                <Text style={styles.messageText}>Chat Blocked</Text>
                                                                            }
                                                                        </View>
                                                                        : null}
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={{ width: width, height: 0.5, backgroundColor: '#CAD0DC', alignSelf: "center", marginTop: 4 }} />
                                                </View>
                                            )
                                        }) : <View flex={1} alignItems="center" justifyContent="center">
                                            <Text>No messages available</Text>
                                        </View>
                                    }

                                </View> :
                                <View alignItems="center" style={{ paddingVertical: 20 }}>
                                    {employerSchedulerList && employerSchedulerList.length > 0 && employerSchedulerList.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={{ alignSelf: "center", marginBottom: 10, width: "100%" }} onPress={() => handleOpenBottomSheet(item)}>
                                                <View style={styles.scheduleListMainTouch}>
                                                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <View style={{ justifyContent: "center", paddingHorizontal: 5 }}>
                                                                <Image
                                                                    resizeMode='contain'
                                                                    source={require("../../../assets/images/calendar_vector1.png")}
                                                                />
                                                            </View>
                                                            <View style={{ marginLeft: 15 }}>
                                                                <Text style={styles.textDate}>
                                                                    {item.scheduleDate}
                                                                </Text>
                                                                <Text style={styles.textTime2}>
                                                                    {item.scheduleTime ? ManageTime(item.scheduleTime) : 'No time found'}
                                                                </Text>
                                                                <View style={{ marginTop: 10 }}>
                                                                    <Text style={styles.textTitle1}>
                                                                        {item.seekerName}
                                                                    </Text>
                                                                    <Text style={styles.textDescription1}>
                                                                        {item.title}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                                            {
                                                                item.schedulePerformanceStatus == 1 &&
                                                                <Image
                                                                    resizeMode='contain'
                                                                    source={require("../../../assets/images/good.png")}
                                                                    style={{ position: 'absolute', top: -5, right: -3 }}
                                                                />
                                                            }
                                                            {
                                                                item.schedulePerformanceStatus == 2 &&
                                                                <Image
                                                                    resizeMode='contain'
                                                                    source={require("../../../assets/images/bad.png")}
                                                                    style={{ position: 'absolute', top: -5, right: -3 }}
                                                                />
                                                            }
                                                            {
                                                                item.schedulePerformanceStatus == 3 &&
                                                                <Image
                                                                    resizeMode='contain'
                                                                    source={require("../../../assets/images/no_show.png")}
                                                                    style={{ position: 'absolute', top: -5, right: -3 }}
                                                                />
                                                            }
                                                            <TouchableOpacity>
                                                                <Image
                                                                    resizeMode='contain'
                                                                    source={require("../../../assets/images/right_arrow.png")}
                                                                // style={{ alignSelf: 'flex-end', marginTop: 10 }}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })}
                                    {
                                        employerSchedulerList.length == 0 &&
                                        <View flex={1} alignItems="center" justifyContent="center">
                                            <Text>No scheduled available</Text>
                                        </View>
                                    }
                                </View>
                        }
                    </ScrollView>
                </View>
            </View>
            <ActionSheet
                ref={openScheduledPopUp}
                headerAlwaysVisible
                gestureEnabled
                footerAlwaysVisible
                footerHeight={4}
            >
                <View style={styles.actionSheetContainer}>
                    <TouchableOpacity style={styles.actionImg} onPress={() => closeModal()}>
                        <Image
                            resizeMode='contain'
                            source={require("../../../assets/images/Close_Vector.png")}
                        />
                    </TouchableOpacity>

                    <View style={{ marginTop: 15 }}>
                        <Image
                            resizeMode='cover'
                            style={styles.actionImg2}
                            source={scheduleUserReview ? { uri: scheduleUserReview.profile_picture } : require("../../../assets/images/profile_round10.png")}
                        />
                        <Text style={styles.actionText1}>
                            {scheduleUserReview ? scheduleUserReview.seekerName : ''}
                        </Text>
                        <Text style={styles.actionText2}>
                            {scheduleUserReview ? scheduleUserReview.title : ''}
                        </Text>

                        <Image
                            resizeMode='contain'
                            style={styles.actionImg1}
                            source={require("../../../assets/images/calendar_vector1.png")}
                        />

                        <Text style={styles.actionText3}>
                            {scheduleUserReview ? scheduleUserReview.scheduleDate : ''}
                        </Text>
                        <Text style={styles.actionText4}>
                            {scheduleUserReview ? ManageTime(scheduleUserReview.scheduleTime) : ''}
                        </Text>

                        <Divider style={{ width: '80%', height: 0.5, borderColor: '#CAD0DC', marginTop: 30, alignSelf: 'center' }} />

                        <Text style={styles.actionText5}>How did it go?</Text>

                        <TouchableOpacity style={[styles.actionTouchable1, { borderColor: scheduleUserReview.schedulePerformanceStatus == 1 ? '#110FAE' : '#E0E5F2' }]} onPress={() => {
                            setFeedback('1')
                            openScheduledPopUp.current?.setModalVisible(false);
                        }}>
                            <Image
                                resizeMode='contain'
                                style={{ alignSelf: 'center' }}
                                source={require("../../../assets/images/like_vector.png")}
                            />
                            <Text style={styles.actionText6}>Good</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionTouchable2, { borderColor: scheduleUserReview.schedulePerformanceStatus == 2 ? '#110FAE' : '#E0E5F2' }]} onPress={() => {
                            setFeedback('2')
                            openScheduledPopUp.current?.setModalVisible(false);
                        }}>
                            <Image
                                resizeMode='contain'
                                style={{ alignSelf: 'center' }}
                                source={require("../../../assets/images/unlike_vector.png")}
                            />
                            <Text style={styles.actionText6}>Bad</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.noShowTouchStyle, { borderColor: scheduleUserReview.schedulePerformanceStatus == 3 ? '#110FAE' : '#E0E5F2' }]} onPress={() => {
                            setFeedback('3')
                            openScheduledPopUp.current?.setModalVisible(false);
                        }}>
                            <Image
                                resizeMode='contain'
                                style={{ width: 12, height: 12, alignSelf: 'center' }}
                                source={require("../../../assets/images/Close_Vector.png")}
                            />
                            <Text style={styles.actionText6}>No show</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ActionSheet>
            <Toast ref={toastDisplayRef} position="top" positionValue={0} />
        </AVSafeArea>
    )
}

export default MessagesEmployerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        marginTop: 5,
    },
    text1: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "700",
        fontSize: 24,
        lineHeight: 28,
        color: '#25324D',
        left: 16,
        top: 64
    },
    text2: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 11,
        lineHeight: 13,
        textAlign: "center",
        marginTop: 5,
        color: '#667287'
    },
    text3: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 17,
        color: '#25324D',
        alignItems: "center"
    },
    textDate: {
        fontWeight: "700",
        fontSize: 14,
        lineHeight: 16,
        color: '#25324D',
        bottom: 5
    },
    textTime: {
        fontWeight: "normal",
        fontSize: 12,
        lineHeight: 14,
        color: '#667287'
    },
    textTitle: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16,
        color: '#25324D',
        marginLeft: 10,
        alignSelf: "center",
    },
    textTitle1: {
        fontWeight: "bold",
        fontSize: 12,
        lineHeight: 14,
        color: '#25324D'
    },
    textTime1: {
        fontWeight: "normal",
        fontSize: 12,
        lineHeight: 14,
        color: '#9CA6B9',
        // left: 10
    },
    textTime2: {
        fontWeight: "normal",
        fontSize: 14,
        lineHeight: 17,
        color: '#667287'
    },
    textDescription: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 12,
        lineHeight: 14,
        color: '#25324D',
        alignItems: "center"
    },
    textDescription1: {
        fontWeight: "normal",
        fontSize: 12,
        lineHeight: 14,
        color: '#667287',
        marginTop: 5,
    },
    touchableApplied: {
        width: 103,
        height: 37,
        // left: 3,
        // top: 3,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    touchableMessage: {
        width: 168,
        height: 37,
        left: 3,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    touchableScheduled: {
        width: 171,
        height: 37,
        left: 3,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    textApplied: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16,
        alignItems: "center",
        textAlign: "center",

    },
    textMessages: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 17,
        alignItems: "center",
        textAlign: 'center',
    },
    textScheduled: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 17,
        alignItems: "center",
        textAlign: 'center',
    },
    imgActive1: {
        width: 10,
        height: 10,
        right: 12,
        top: 35
    },
    nameGoogle: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        color: '#25324D',
        marginLeft: 10,
    },
    imgGoogle: {
        width: 40,
        height: 40
    },
    messageText: {
        fontSize: 14,
        color: '#667287',
        marginLeft: 10,
        marginTop: 4,
    },
    messageTime: {
        fontSize: 12,
        color: '#9CA6B9',
        marginLeft: 10,
        marginTop: 1
    },
    actionSheetContainer: {
        flex: 1,
        justifyContent: "center",
    },
    actionImg: {
        top: 7,
        alignSelf: 'flex-end',
        marginRight: '10%',
    },
    actionImg1: {
        width: 16,
        height: 16,
        marginTop: 30,
        alignSelf: 'center',
    },
    actionImg2: {
        width: 90,
        height: 90,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 15,
    },
    actionText1: {
        fontWeight: "bold",
        fontSize: 22,
        lineHeight: 28,
        textAlign: 'center',
    },
    actionText2: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "400",
        fontSize: 14,
        lineHeight: 16,
        color: '#667287',
        top: 5,
        textAlign: 'center',
    },
    actionText3: {
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center',
        marginTop: '5%'
    },
    actionText4: {
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 16,
        color: '#667287',
        textAlign: 'center',
        marginTop: '3%'
    },
    actionText5: {
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: 23,
        textAlign: 'center',
        marginTop: '7%'
    },
    actionText6: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16,
        color: '#667287',
        alignSelf: 'center',
        marginLeft: 5,
    },
    actionTouchable1: {
        width: '66%',
        height: 48,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '5%',
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
    },
    actionTouchable2: {
        width: '66%',
        height: 48,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E0E5F2',
        marginTop: '3%',
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center"
    },
    noShowTouchStyle: {
        width: '66%',
        height: 48,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E0E5F2',
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: '3%',
    },
    scheduleListMainTouch: {
        height: 114,
        marginTop: 10,
        paddingHorizontal: 15,
        justifyContent: "center",
        // width: 343,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        shadowColor: '#25324D10', shadowOffset: { width: 0, height: 4 }, shadowRadius: 15, shadowOpacity: 1, elevation: 1
    }
})
