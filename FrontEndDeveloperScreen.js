/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useState, createRef } from 'react';
import { View, Text, StyleSheet, Dimensions, BackHandler, Platform, KeyboardAvoidingView, TouchableOpacity, Image, TextInput, FlatList, SafeAreaView, StatusBar, ToastAndroid, PermissionsAndroid, ActivityIndicator } from 'react-native';
import SocketIOClient from "socket.io-client";
// import { w, h } from "../../utils/helper/responsive";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import { getChatMessageAction } from '../../components/actions/ChatAction/GetChatMessageAction';
import { images } from "../../../assets/images";
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ActionSheet from "react-native-actionsheet";
import { uploadProfileImage, uploadProfileImageSuccess } from '../../components/actions/ProfileImage/UploadProfileImageAction';
import { ChatHeaderComponent } from "../../components/ChatComponent/ChatHeader.Component";
import BottomActionSheet from "react-native-actions-sheet";
import Modal from 'react-native-modal';
import ImageViewer from "react-native-image-zoom-viewer";
import colors from '../../../assets/color';
import { WP } from "../../utils/helper/responsive";
import ImagePicker from "react-native-image-crop-picker";
import { Alert } from 'react-native';
import { getChatListAction } from '../../components/actions/ChatAction/ChatListAction';
import { matchUnmatchEmployeAction, matchUnmatchEmployeRes } from '../../components/actions/ChatAction/MatchUnMatchEmployeAction';
import { blockEmployeAction, blockEmployeRes } from '../../components/actions/ChatAction/BlockEmployerAction';
import { reportEmployeAction, reportEmployeRes } from '../../components/actions/ChatAction/ReportEmployerAction';
import { AVSafeArea } from "../../components/Common/SafeArea";
import { useFocusEffect } from '@react-navigation/native';
import { Divider } from "react-native-elements";
import firebase from "react-native-firebase";
import DatePicker from 'react-native-date-picker'

let Analytics = firebase.analytics();


const { width } = Dimensions.get("screen");

var messageList = true;
var ws = null;
ws = SocketIOClient('https://api.avda.pineappleworkshop.com', {
    transports: ['websocket'],
    jsonp: false,
});

let tempVar = [];
let allMessages = [];
const flatListRef = createRef();
const moreBs = createRef();
const reportBs = createRef();
const openShedule = createRef();
let primaryPhotoToUpload = [];

export const FrontEndDeveloperScreen = ({ navigation, ...props }) => {

    const BEHAVIOR = Platform.select({
        android: undefined,
        ios: 'padding',
    });

    const dispatch = useDispatch();
    const chatMessageRedux = useSelector(state => state.getChatMessageRes);
    const uploadDocRedux = useSelector(state => state.profileImageRes);
    const matchUnmatchChatRedux = useSelector(state => state.matchUnmatchEmployeRes ? state.matchUnmatchEmployeRes : '');
    const blockChatRedux = useSelector(state => state.blockEmployeRes ? state.blockEmployeRes : '');
    console.log('blockChatRedux', blockChatRedux);
    const reportChatRedux = useSelector(state => state.reportEmployeRes ? state.reportEmployeRes : '');

    const documentActionSheet = React.createRef();
    const downloadPdfActionSheet = React.createRef();
    const imageActionSheet = React.createRef();
    const [userId, setUserId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [allChatMessage, setAllChatMessage] = useState([]);
    const [uiRender, setUiRender] = useState(false);
    const [value, setValue] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [screenName, setScreenName] = useState("");
    const [contentType, setContentType] = useState("");
    const [fileLocation, setFileLocation] = useState("");
    const [selectedContentType, setSelectedContentType] = useState("");
    const [selectedChatItem, setSelectedChatItem] = useState("");
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [imageUrls, setImageUrl] = useState([]);
    const [permissionStorage, setPermissionStorage] = useState(false);
    const [selectDocumentDownload, setSelectDocumentDownload] = useState('');
    const [tempAllMessagesArray, setTempAllMessagesArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDateTime, setShowDateTime] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectNewDate, setSelectNewDate] = useState('');
    const [selectNewTime, setSelectNewTime] = useState('');
    const [selectNewDateTime, setSelectNewDateTime] = useState('');
    const [scheduleMessage, setScheduleMessage] = useState('');
    const [selectRoomId, setSelectRoomId] = useState('')
    const [blockChatData, setBlockChatData] = useState('')
    const [isBlocked, setisBlocked] = useState(false)

    var today = new Date();
    var todayCurrentDate = today.getDate();
    var todayCurrentMonth = today.getMonth();
    var todayCurrentYear = today.getFullYear();

    useFocusEffect(
        React.useCallback(() => {
            //   fetchMessages('firstconnect');
            ws = SocketIOClient('https://api.avda.pineappleworkshop.com', {
                transports: ['websocket'],
                jsonp: false,
            });
            return () => {
                console.log('useFocusEffect return')
                // ws.close();
                // fetchMessages('disconnect');
            };
        }, [])
    );

    useEffect(() => {
        // PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE && PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(response => {
        //     console.log(response)
        // })
        if (Platform.OS == 'android') {
            checkPermission();
        }
    }, [])

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                (PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE && PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE),
                {
                    title: "AVDA read and write permission",
                    message: "AVDA needs access to storage",
                    buttonNegative: "",
                    buttonPositive: "Okay"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setPermissionStorage(true)
                console.log("You can use the camera");
            } else {
                setPermissionStorage(false)
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
        if (props.route) {
            if (props.route.params) {
                if (props.route.params.roomId) {
                    fetchRoomId();
                    setSelectRoomId(props.route.params.roomId)
                }
            }
        }
        if (props.route) {
            if (props.route.params) {
                if (props.route.params.selectItem) {
                    console.log('props.route.params.selectItem', props.route.params.selectItem);
                    setSelectedUser(props.route.params.selectItem)
                    setScreenName(props.route.params.screenName)
                    setBlockChatData(props.route.params.fileType)
                }
            }
        }

        setUiRender(!uiRender);
        const backAction = () => {
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (chatMessageRedux.chatMessage) {
            if (chatMessageRedux.chatMessage.response) {
                allMessages = [];
                for (let item of chatMessageRedux.chatMessage.response) {
                    allMessages.push(item)
                }
                setUiRender(!uiRender)
                setTempAllMessagesArray(allMessages);
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            } else {
                allMessages = [];
                setAllChatMessage([])
            }
        }
        setUiRender(!uiRender);
    }, [chatMessageRedux.chatMessage]);

    useEffect(() => {
        if (matchUnmatchChatRedux.matchUnmatchEmployeData) {
            if (matchUnmatchChatRedux.matchUnmatchEmployeData.success) {

                if (!isBlocked) {
                    moreBs.current?.setModalVisible(false);
                    setTimeout(() => {
                        Alert.alert(
                            "",
                            "Unmatch Successfully.",
                              [  {
                                    text: "Ok",
                                    onPress: onBackPress
                                },]

                        );
                    }, 200);

                    // moreBs.current?.setModalVisible(false);
                } else {
                    moreBs.current?.setModalVisible(false);
                }
            }
        }
        setTimeout(() => {
            dispatch(matchUnmatchEmployeRes(''))
        }, 500);
        setUiRender(!uiRender);
    }, [matchUnmatchChatRedux.matchUnmatchEmployeData]);

    useEffect(() => {
        console.log('>>>>>', blockChatRedux);
        if (blockChatRedux.message) {
            Alert.alert('Blocked successfully');
            if (blockChatRedux.blockEmployeData.data) {
                setBlockChatData(blockChatRedux.blockEmployeData.data.fileType)
            }
            moreBs.current?.setModalVisible(false);
        } else {
            moreBs.current?.setModalVisible(false);
        }

        setTimeout(() => {
            dispatch(blockEmployeRes(''))
        }, 500);
        setUiRender(!uiRender);
    }, [blockChatRedux.message]);

    useEffect(() => {
        if (reportChatRedux.reportEmployeData) {
            if (reportChatRedux.reportEmployeData.success) {
                Alert.alert('Reported successfully');
                reportBs.current?.setModalVisible(false);
            } else {
                reportBs.current?.setModalVisible(false);
            }
        }
        setTimeout(() => {
            dispatch(reportEmployeRes(''))
        }, 500);
        setUiRender(!uiRender);
    }, [reportChatRedux.reportEmployeData]);

    useEffect(() => {
        if (uploadDocRedux.profileImageData) {
            setContentType(uploadDocRedux.profileImageData.contentType);
            setFileLocation(uploadDocRedux.profileImageData.location);
            var SelectFileType = '';
            if (selectedContentType == 'image') {
                SelectFileType = 1
            } else if (selectedContentType == 'pdf') {
                SelectFileType = 4
            } else if (selectedContentType == 'doc') {
                SelectFileType = 2
            }
            let msg = uploadDocRedux.profileImageData.originalname;
            var extention = '';
            if (uploadDocRedux.profileImageData.originalname != '') {
                var str = msg;
                var dotIndex = str.lastIndexOf(".");
                var ext = str.substring(dotIndex);
                extention = ext.split(".")[1];
            }
            const imageContent = uploadDocRedux.profileImageData.metadata ? uploadDocRedux.profileImageData.metadata.fieldName : '';
            const sendMessageRequest = {
                UserId: userId,
                roomId: props.route.params.roomId,
                senderId: userId,
                messages: uploadDocRedux.profileImageData.location,
                fileType: SelectFileType,
                contentType: (extention == undefined && imageContent == 'image') ? 'image' : extention,
                date: moment().format('L'),
                time: moment().format('LTS'),
                scheduleDate: '',
                scheduleTime: '',
                scheduleStatus: 0,
                scheduleUserId: 0,
                seekerId: userType == 1 ? userId : selectedUser.UserId,
                employeeId: userType == 2 ? userId : selectedUser.UserId,
                fileName: uploadDocRedux.profileImageData.originalname ? uploadDocRedux.profileImageData.originalname : '',
            }
            console.log('sendMessageRequest', sendMessageRequest)
            ws.emit('message', sendMessageRequest)
            setLoading(false);
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
                setContentType('');
                setFileLocation('');
                dispatch(uploadProfileImageSuccess(''));
                setSelectedContentType('');
                messageList = true;
            }, 1000);
        } else {
            // setLoading(false);
        }
    }, [uploadDocRedux.profileImageData]);

    useEffect(() => {
        ws.on('message', (msg) => {
            console.log('onMessage', msg)
            if (messageList) {
                console.log('onMessage inside if')
                messageList = false;
                setUiRender(!uiRender);
                allMessages.unshift(msg.message);
                console.log('allMessages', allMessages)
                setUiRender(!uiRender);
                setTimeout(() => {
                    setUiRender(!uiRender);
                    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
                    messageList = true;
                }, 200);
            }
            setUiRender(!uiRender);
        });
        ws.on('scheduleId', (msg) => {
            console.log('scheduleId', msg)
            if (messageList) {
                messageList = false;
                for (let item of allMessages) {
                    if (item.id == msg.message.msgScheduleId && item.fileType == 3) {
                        item.scheduleStatus = msg.message.scheduleStatus
                    }
                }
                setTimeout(() => {
                    setUiRender(!uiRender);
                    messageList = true;
                }, 200);
            }
            setUiRender(!uiRender);
        });
        ws.on('blockEmployee', (msg) => {
            console.log('blockEmployee', msg)
            if (messageList) {
                messageList = false;
                if (msg.message) {
                    setBlockChatData(msg.message.fileType)
                    setisBlocked(true)
                }
                moreBs.current?.setModalVisible(false);
                setTimeout(() => {
                    setUiRender(!uiRender);
                    messageList = true;
                }, 200);
            }
            setUiRender(!uiRender);
        });
        ws.on('activeStatus', (msg) => {
            console.log('activeStatus', msg)
        });
    }, [allMessages])


    async function fetchRoomId() {
        const userId = await AsyncStorage.getItem('@user_id');
        const userType = await AsyncStorage.getItem('@user_type');
        setUserId(userId)
        setUserType(userType)
        const roomData = {
            roomId: typeof (props.route.params.roomId) == 'string' ? props.route.params.roomId : props.route.params.roomId.toString(),
        }
        dispatch(getChatMessageAction(roomData));
    }

    const sendMessage = () => {
        console.log("sendMessage");
        if (value.trim() == '') {
            Alert.alert('please enter message');
        } else {
            const sendMessageRequest = {
                UserId: userId,
                roomId: props.route.params.roomId,
                senderId: userId,
                messages: value.trim(),
                fileType: 0,
                contentType: 'text',
                date: moment().format('L'),
                time: moment().format('LTS'),
                scheduleDate: '',
                scheduleTime: '',
                scheduleStatus: 0,
                scheduleUserId: 0,
                fileName: '',
                seekerId: userType == 1 ? userId : selectedUser.UserId,
                employeeId: userType == 2 ? userId : selectedUser.UserId,
            }
            console.log("sendMessageRequest", sendMessageRequest);
            messageList = true;
            ws.emit('message', sendMessageRequest)

            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
            }, 200);
            setValue('')
        }
    }

    const acceptInterView = (item) => {
        const acceptInterviewRequest = {
            msgScheduleId: item.id,
            scheduleStatus: 1,
            seekerId: userType == 1 ? userId : selectedUser.UserId,
            employeeId: userType == 2 ? userId : selectedUser.UserId,
        }
        messageList = true;
        ws.emit('scheduleId', acceptInterviewRequest);
        console.log("EVENT INTERVIEW REQUEST ACCEPTED-----------------------");
                Analytics.logEvent('interview_request_accepted', {
                  id: 43,
                  description: 'Interview request accepted',
                });
    }

    const declineInterView = (item) => {
        const declineInterviewRequest = {
            msgScheduleId: item.id,
            scheduleStatus: 2,
            seekerId: userType == 1 ? userId : selectedUser.UserId,
            employeeId: userType == 2 ? userId : selectedUser.UserId,
        }
        messageList = true;
        ws.emit('scheduleId', declineInterviewRequest);
        console.log("EVENT INTERVIEW REQUEST REJECTED-----------------------");
                Analytics.logEvent('interview_request_rejected', {
                  id: 44,
                  description: 'Interview request rejected',
                });
    }

    const removeSecond = (time) => {
        if (time != '' && time != null && time != undefined) {
            const convertTime = moment(time, 'hh:mm:ss A').format('hh:mm A')
            return convertTime
        }
    }

    const keyExtractor = item => item.id.toString();

    const renderItem = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 14, marginTop: 10, alignSelf: userId != item.senderId ? "flex-start" : "flex-end", marginBottom: 10 }}>
                {
                    item.fileType == 0 &&
                    <>
                        <TouchableOpacity style={userId != item.senderId ? styles.senderMessage : styles.myMessage}>
                            <View style={{ marginTop: 8, width: '55%' }}>
                                {Boolean(item.message.length) && <Text style={userId != item.senderId ? styles.itemTimeMessageSender : styles.itemTimeMy}>{item.message}</Text>}
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.itemTimeSender, { alignSelf: userId != item.senderId ? "flex-start" : "flex-end" }]}>
                            {removeSecond(item.time)}
                        </Text>
                    </>
                }
                {
                    (item.fileType == 4) &&
                    <View>
                        <TouchableOpacity style={userId != item.senderId ? styles.pdfSenderMessage : styles.pdfMyMessage} onPress={() => { openPdfActionSheet(item) }}>
                            <View style={{ marginTop: 10, width: '65%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        resizeMode='contain'
                                        style={{ width: 25, height: 25 }}
                                        source={require("../../../assets/images/pdf_icon.png")}
                                    />
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: userId != item.senderId ? "#000" : "#fff", marginLeft: 8, alignSelf: "center" }}>
                                        {item.fileName ? item.fileName : 'File Name.pdf'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.itemTimeSender, { alignSelf: userId != item.senderId ? "flex-start" : "flex-end" }]}>
                            {removeSecond(item.time)}
                        </Text>
                    </View>
                }
                {
                    item.fileType == 1 &&
                    <View>
                        <TouchableOpacity style={userId != item.senderId ? styles.imageSenderMessage : styles.imageMyMessage} onPress={() => { openImageActionSheet(item.message) }}>
                            <View style={{ marginTop: 5 }}>
                                <Image
                                    source={{ uri: item.message }}
                                    resizeMode="contain"
                                    style={userId != item.senderId ? styles.imageSenderStyle : styles.imageMyStyle}
                                />
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.itemTimeSender, { alignSelf: userId != item.senderId ? "flex-start" : "flex-end" }]}>
                            {removeSecond(item.time)}
                        </Text>
                    </View>
                }
                {
                    (item.fileType == 2) &&
                    <View>
                        <TouchableOpacity style={userId != item.senderId ? styles.pdfSenderMessage : styles.pdfMyMessage} onPress={() => { openPdfActionSheet(item) }}>
                            {/* <View style={{ marginTop: 10, minWidth: '30%' }}>
                                <WebView
                                    source={{ uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${item.message}` }}
                                    style={{ height: 200, width: 200 }}
                                    startInLoadingState={true}
                                />
                            </View> */}
                            <View style={{ marginTop: 10, width: '65%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        resizeMode='contain'
                                        style={{ width: 25, height: 25 }}
                                        source={userId != item.senderId ? require("../../../assets/images/file.png") : require("../../../assets/images/file.png")}
                                    />
                                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 17, color: userId != item.senderId ? "#000" : "#fff", marginLeft: 8, alignSelf: "center", width: '100%' }}>
                                        {item.fileName ? item.fileName : 'File Name.docx'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={[styles.itemTimeSender, { alignSelf: userId != item.senderId ? "flex-start" : "flex-end" }]}>
                            {removeSecond(item.time)}
                        </Text>
                    </View>
                }
                {
                    item.fileType == 3 &&
                    <>
                        <View style={userId != item.senderId ? styles.scheduleSenderView : styles.scheduleMyView}>

                            <Text style={styles.scheduleInterviewMainHeading}>
                                {userId != item.senderId ? 'You’re invited to schedule an interview!' : 'You’re sent a schedule interview!'}
                            </Text>

                            <View style={{ marginTop: 5 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        resizeMode='contain'
                                        style={styles.img1}
                                        source={require("../../../assets/images/calendar_vector1.png")}
                                    />
                                    <Text style={styles.scheduleDateTime}>
                                        {item.scheduleDate}  {item.scheduleTime}
                                    </Text>
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        resizeMode='contain'
                                        style={styles.img2}
                                        source={require("../../../assets/images/comment_vector.png")}
                                    />
                                    <Text style={styles.scheduleDateTime} numberOfLines={1}>
                                        {item.message}
                                    </Text>
                                </View>
                            </View>

                            {
                                (userId != item.senderId && item.scheduleStatus == 0) &&
                                <>
                                    <View style={{ borderWidth: 0.5, borderColor: '#CAD0DC', width: '100%', alignSelf: "center", marginTop: 10 }} />

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", marginTop: 10 }}>
                                        <TouchableOpacity onPress={() => { declineInterView(item) }}>
                                            <Text style={styles.text3}>Decline</Text>
                                        </TouchableOpacity>

                                        <View style={{ borderWidth: 0.8, height: '90%', borderColor: '#CAD0DC' }} />

                                        <TouchableOpacity onPress={() => { acceptInterView(item) }}>
                                            <Text style={styles.text4}>Accept</Text>
                                        </TouchableOpacity>

                                    </View>
                                </>
                            }

                            {
                                (userId == item.senderId && item.scheduleStatus == 0) &&
                                <>
                                    <View style={{ borderWidth: 0.5, borderColor: '#CAD0DC', width: '100%', alignSelf: "center", marginTop: 10 }} />

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", marginTop: 10 }}>
                                        <Text style={styles.pendingTextStyle}>Pending</Text>
                                        {/* <Image
                                            resizeMode='contain'
                                            style={styles.acceptImage}
                                            source={require("../../../assets/images/accept_interview.png")}
                                        /> */}
                                    </View>
                                </>
                            }

                            {
                                item.scheduleStatus == 1 &&
                                <>
                                    <View style={{ borderWidth: 0.5, borderColor: '#CAD0DC', width: '100%', alignSelf: "center", marginTop: 10 }} />

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", marginTop: 10 }}>
                                        <Text style={styles.acceptTextStyle}>Accepted</Text>
                                        <Image
                                            resizeMode='contain'
                                            style={styles.acceptImage}
                                            source={require("../../../assets/images/accept_interview.png")}
                                        />
                                    </View>
                                </>
                            }

                            {
                                item.scheduleStatus == 2 &&
                                <>
                                    <View style={{ borderWidth: 0.5, borderColor: '#CAD0DC', width: '100%', alignSelf: "center", marginTop: 10 }} />

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignSelf: "center", marginTop: 10 }}>
                                        <Text style={styles.declineTextStyle}>Declined</Text>
                                        <Image
                                            resizeMode='contain'
                                            style={styles.declineImage}
                                            source={require("../../../assets/images/decline_interview.png")}
                                        />
                                    </View>
                                </>
                            }

                        </View>

                        <Text style={[styles.itemTimeSender, { alignSelf: userId != item.senderId ? "flex-start" : "flex-end" }]}>
                            {removeSecond(item.time)}
                        </Text>

                    </>
                }
            </View>
        )
    }

    const listEmptyComponent = () => {
        return (
            <View style={styles.emptyComponent}>
                <Text style={styles.listEmptyText}>No messages</Text>
            </View>
        )
    };

    const openDocAction = () => {
        documentActionSheet.current.show();
    }

    const chatDocUploading = (fileName) => {
        var file = [{
            path: fileName.uri,
            mime: fileName.type,
            name: fileName.name,
        }];
        setLoading(true);
        dispatch(uploadProfileImage(file));
    }

    const chatDocUploadingImage = (image) => {
        primaryPhotoToUpload = [];
        if (Platform.OS === "ios") {
            let imageItem = {
                path: image.path,
                mime: image.mime,
                name: image.filename
            }
            primaryPhotoToUpload.push(imageItem)
        } else {
            let imageItem = {
                path: image.path,
                mime: image.mime,
                name: image.modificationDate
            }
            primaryPhotoToUpload.push(imageItem);
        }
        setLoading(true);
        dispatch(uploadProfileImage(primaryPhotoToUpload));
    }

    const onSelectActionSheet = async (index) => {
        console.log('index', index)
        if (index === 0) {
            ImagePicker.openPicker({
                multiple: false,
                cropping: true,
                includeBase64: true,
                freeStyleCropEnabled: true,
            })
                .then((image) => {
                    setSelectedContentType('image');
                    chatDocUploadingImage(image);
                })
                .catch((e) => { });
        } else if (index === 1) {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf],
                });
                console.log('res', res)
                setSelectedContentType('pdf');
                chatDocUploading(res);
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        } else if (index === 2) {
            try {
                const res = await DocumentPicker.pick({
                    type: [DocumentPicker.types.docx],
                });
                console.log('res', res)
                setSelectedContentType('doc');
                chatDocUploading(res);
            } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                    // User cancelled the picker, exit any dialogs or menus and move on
                } else {
                    throw err;
                }
            }
        }
    }

    const onBackPress = () => {
        if (props.route.params.isFrom == 'match') {
            navigation.pop(2);
        } else {
            navigation.goBack();
        }
    };

    const onMorePress = () => {

        moreBs.current?.setModalVisible(true);




    };

    const onShedulePress = () => {
        openShedule.current?.setModalVisible(true)
        setSelectNewDate('');
        setSelectNewTime('');
    }

    const onReportPress = () => {
        moreBs.current?.setModalVisible(false);
        setTimeout(() => {
            reportBs.current?.setModalVisible(true);
        }, 300);
    };

    const openPdfActionSheet = (item) => {
        setSelectDocumentDownload(item);
        downloadPdfActionSheet.current.show();
    }

    const openImageActionSheet = (item) => {
        setSelectedChatItem(item);
        // imageActionSheet.current.show();
        const images = [{
            url: item,
        }]
        setShowImageViewer(true)
        setImageUrl(images)
    }

    const onSelectDownloadPdfActionSheet = (index) => {
        // if (index == 0) {
        //     if (permissionStorage) {
        //         if (selectDocumentDownload.contentType != '') {
        //             const { config, fs } = RNFetchBlob
        //             let DownloadDir = fs.dirs.DownloadDir // this is the Downloads directory.
        //             var pdfName = ''
        //             if (selectDocumentDownload.message != '') {
        //                 const sortNamePd = selectDocumentDownload.message.split('/')
        //                 pdfName = sortNamePd[3]
        //             }
        //             let options = {
        //                 fileCache: true,
        //                 // appendExt : extension, //Adds Extension only during the download, optional
        //                 addAndroidDownloads: {
        //                     notification: true,
        //                     useDownloadManager: true, //uses the device's native download manager.
        //                     mime: `application/${selectDocumentDownload.contentType}`,
        //                     title: `${pdfName} ${selectDocumentDownload.contentType}`, // Title of download notification.
        //                     path: DownloadDir + `/${pdfName}` + '.' + `${selectDocumentDownload.contentType}`, // this is the path where your download file will be in
        //                     description: 'Downloading file.'
        //                 }
        //             }
        //             config(options)
        //                 .fetch('GET', selectDocumentDownload.message)
        //                 .then((res) => {
        //                     Platform.select({
        //                         android: () => { ToastAndroid.show('Download complete', ToastAndroid.SHORT); }
        //                     })();
        //                 })
        //                 .catch((err) => {
        //                     Platform.select({
        //                         android: () => { ToastAndroid.show('Download failed', ToastAndroid.SHORT); }
        //                     })();
        //                 }) // To execute when download cancelled and other errors
        //         }
        //     } else {
        //         Alert.alert(
        //             'Avda App',
        //             'Need Permission to download this file',
        //             [
        //                 { text: 'OK', onPress: () => console.log('ok') },
        //             ],
        //             { cancelable: false },
        //         );
        //     }
        // }
    }

    const onSelectImageActionSheet = (index) => {
        if (index == 0) {
            const images = [{
                url: selectedChatItem,
            }]
            setShowImageViewer(true)
            setImageUrl(images)
        }
    }

    const openDateTimePicker = () => {
        setShowDateTime(true);
        setUiRender(!uiRender);
    }

    const onChangeDate = ( selectedDate) => {
        setShowDateTime(Platform.OS === 'ios');
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setSelectNewDate(moment(currentDate).format("MMM D, YYYY"))
        setSelectNewTime(moment(currentDate).format("HH:mm"))
        setSelectNewDateTime(selectedDate)

        if (Platform.OS === 'ios') {
            setTimeout(() => {
                setShowDateTime(false);
            }, 50000);
            setUiRender(!uiRender);
        } else {
            setShowDateTime(false);
            setUiRender(!uiRender);
        }
    };

    const scheduleSend = () => {
        if (selectNewDateTime == '') {
            Alert.alert('Please select date & time');
        } else if (scheduleMessage == '') {
            Alert.alert('Please enter schedule message');
        } else {
            const sendScheduleRequest = {
                UserId: userId,
                roomId: props.route.params.roomId,
                senderId: userId,
                messages: scheduleMessage,
                fileType: 3,
                contentType: 'schedule',
                date: moment().format('L'),
                time: moment().format('LTS'),
                scheduleDate: selectNewDate,
                scheduleTime: selectNewTime,
                scheduleStatus: 0,
                scheduleUserId: selectedUser.UserId,
                fileName: '',
            }
            console.log('sendScheduleRequest', sendScheduleRequest)
            ws.emit('message', sendScheduleRequest)
            openShedule.current?.setModalVisible(false)
            setScheduleMessage('');
            console.log("EVENT INTERVIEW SCHEDULED-----------------------");
                Analytics.logEvent('interview_scheduled', {
                  id: 45,
                  description: 'Interview scheduled',
                });
        }
    }

    const blockEmployer = () => {
        const blockRequest = {
            UserId: selectedUser.UserId,
            roomId: selectRoomId,
            senderId: userId,
            message: "",
            date: moment().format('L'),
            time: moment().format('LTS'),
            fileType: 5,
        }
        console.log('blockEmployee', blockRequest);
        ws.emit('blockEmployee', blockRequest)

        const matchUnmatchRequest = {
            userId: userType == 1 ? userId : selectedUser.UserId,
            companyId: userType == 2 ? userId : selectedUser.UserId,
            postId: selectedUser.post_id,
            // isMatch: 0,
        }
        const request = {
            UserId: userId,
            blockedUserId: selectedUser.UserId,
        }
        console.log("blockRequest", request);
        dispatch(matchUnmatchEmployeAction(matchUnmatchRequest))
        dispatch(blockEmployeAction(request))

    }

    const reportEmployer = (msg) => {
        let req = {
            reportToUserId: selectedUser.UserId,
            messageContent: msg
        }
        dispatch(reportEmployeAction(req));
    };

    const matchUnmatchEmployer = () => {
        const matchUnmatchRequest = {
            userId: userType == 1 ? userId : selectedUser.UserId,
            companyId: userType == 2 ? userId : selectedUser.UserId,
            postId: selectedUser.post_id,
            // isMatch: 0,
        }
        console.log("matchUnmatchRequest", matchUnmatchRequest);
        dispatch(matchUnmatchEmployeAction(matchUnmatchRequest))
    }

    return (
        <AVSafeArea>
            <View>
                <ChatHeaderComponent
                    headerType={'seeker'}
                    onBackPress={onBackPress}
                    jobTitle={selectedUser.name}
                    activeStatus={selectedUser.online}
                    lastSeenStatus={selectedUser.last_seen}
                    companyName={'title'}
                    onMorePress={onMorePress}
                    image={selectedUser.image}
                    screenName={screenName}
                    userInfo={selectedUser}
                    adjustResize={true}
                />
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? "padding" : "padding"}
                style={{ flex: 1 }}
                enabled
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -270}
            >
                <View style={{ flex: 1 }}>
                    {screenName != 'employerChat' && selectedUser.hiringManager &&
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ alignItems: 'center', alignSelf: 'center', color: '#667287', size: 12 }}>{selectedUser.hiringManager} of HR is the hiring manager for this position</Text>
                            <Divider
                                style={styles.dividerStyle}
                            />
                        </View>
                    }

                    <FlatList
                        ref={flatListRef}
                        data={allMessages}
                        style={{ marginTop: 10 }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        extraData={uiRender}
                        onContentSizeChange={() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })}
                        onLayout={() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })}
                        // ListHeaderComponent={() => listHeaderComponent()}
                        // ListEmptyComponent={listEmptyComponent}
                        inverted
                    />
                    {
                        allMessages.length == 0 &&
                        <View style={styles.emptyComponent}>
                            <Image
                                source={require("../../../assets/images/Group.png")}
                                resizeMode="contain"
                                style={{ width: 40, height: 40, marginBottom: 10 }}
                            />
                            <Text style={styles.listEmptyText}>Send a message now</Text>
                        </View>
                    }
                    {
                        loading &&
                        <ActivityIndicator size="large" color="#D3D3D3" style={{ marginBottom: 10 }} />
                    }
                    {
                        (!loading && blockChatData != 5) &&
                        <SafeAreaView>
                            <KeyboardAvoidingView>
                                <View style={styles.inputView}>
                                    <View style={{
                                        backgroundColor: 'white', flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 5,
                                        paddingHorizontal: 8,
                                        borderWidth: 1,
                                        borderRadius: 6,
                                        borderColor: colors.inputBorder,
                                        minHeight: 48
                                    }}>
                                        {
                                            screenName == 'employerChat' ?
                                                <TouchableOpacity onPress={() => { onShedulePress() }}>
                                                    <Image
                                                        source={require("../../../assets/images/calendar_vector1.png")}
                                                        resizeMode="contain"
                                                        style={{ width: 20, height: 20, marginTop: Platform.OS == 'ios' ? -4 : 2, marginLeft: 5 }}
                                                    />
                                                </TouchableOpacity>
                                                : null
                                        }
                                        <TouchableOpacity onPress={() => { openDocAction() }}>
                                            <Image
                                                source={require("../../../assets/images/pin_vector.png")}
                                                resizeMode="contain"
                                                style={{ width: 20, height: 20, marginTop: Platform.OS == 'ios' ? -4 : 2, marginLeft: 5 }}
                                            />
                                        </TouchableOpacity >


                                        <TextInput
                                            style={styles.textInput}
                                            placeholder='Send a message'
                                            placeholderTextColor="#78849E"
                                            multiline
                                            // textAlignVertical='top'
                                            value={value}
                                            onChangeText={setValue}
                                        />
                                        <TouchableOpacity style={{ borderLeftWidth: value.trim().length > 0 ? 1 : 0, borderColor: colors.accent, paddingLeft: 15, paddingRight: 8, paddingVertical: 4 }} onPress={() => { sendMessage() }}>
                                            <Image
                                                source={require("../../../assets/images/send_vector.png")}
                                                resizeMode="contain"
                                                style={{ width: 20, height: 20, marginRight: 0, tintColor: value.trim().length > 0 ? colors.accent : colors.iconClr }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    }
                    {
                        (!loading && blockChatData == 5) &&
                        <View style={styles.blockChatView}>
                            <Text style={{ textAlign: "center", marginBottom: 10 }}>
                                Chat is Blocked
                            </Text>
                        </View>
                    }
                </View>
            </KeyboardAvoidingView>
            <ActionSheet
                ref={documentActionSheet}
                title={"Please choose"}
                options={["Upload Image", "Upload PDF", "Upload Document", "Cancel"]}
                cancelButtonIndex={3}
                onPress={onSelectActionSheet}
            />
            <ActionSheet
                ref={downloadPdfActionSheet}
                title={"Please choose"}
                options={["Download Document", "Cancel"]}
                cancelButtonIndex={1}
                onPress={onSelectDownloadPdfActionSheet}
            />
            <ActionSheet
                ref={imageActionSheet}
                title={"Please choose"}
                options={["Open Image", "Cancel"]}
                cancelButtonIndex={1}
                onPress={onSelectImageActionSheet}
            />

            {/* Image ZoomIn ZoomOut Modal */}
            <Modal
                visible={showImageViewer}
                onRequestClose={() => { setShowImageViewer(false), setImageUrl([]) }}
                transparent={true}
                style={{ width: '93%', height: 500 }}
            >
                <ImageViewer
                    enableSwipeDown
                    imageUrls={imageUrls}
                    renderIndicator={() => null}
                    saveToLocalByLongPress={true}
                    useNativeDriver
                    onSwipeDown={() => {
                        setShowImageViewer(false)
                        setImageUrl([])
                    }}
                />
            </Modal>

            <BottomActionSheet
                ref={moreBs}
                footerHeight={10}
            >
                <View style={{ justifyContent: "center", alignItems: "flex-start", paddingHorizontal: 20 }}>
                    <Text style={styles.yourlanguages}>More</Text>
                </View>

                <View height={160} backgroundColor="white" paddingHorizontal={20}>

                    {
                        screenName == 'employerChat' ?
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { matchUnmatchEmployer() }}>
                                <Image
                                    source={images.close_blue_vector}
                                    style={styles.unMatchImg}
                                    resizeMode="contain"
                                />
                                <Text style={styles.unMatchText}>Unmatch this user</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { matchUnmatchEmployer() }}>
                                <Image
                                    source={images.close_blue_vector}
                                    style={styles.unMatchImg}
                                    resizeMode="contain"
                                />
                                <Text style={styles.unMatchText}>Unmatch this employer</Text>
                            </TouchableOpacity>
                    }

                    <View style={styles.dividerLine} />

                    {
                        screenName == 'employerChat' ?
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { blockChatData != 5 ? blockEmployer() : null }}>
                                <Image
                                    source={images.block_user}
                                    style={styles.unMatchImg}
                                    resizeMode="contain"
                                />
                                <Text style={styles.unMatchText}>{blockChatData != 5 ? 'Block this user' : 'Blocked user'}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => { blockChatData != 5 ? blockEmployer() : null }}>
                                <Image
                                    source={images.block_user}
                                    style={styles.unMatchImg}
                                    resizeMode="contain"
                                />
                                <Text style={styles.unMatchText}>{blockChatData != 5 ? 'Block this employer' : 'Blocked employer'}</Text>
                            </TouchableOpacity>
                    }

                    <View style={styles.dividerLine} />

                    {
                        screenName == 'employerChat' ?
                            <TouchableOpacity onPress={() => onReportPress()}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image
                                        source={images.report}
                                        style={styles.unMatchImg}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.unMatchText}>Report this user</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => onReportPress()}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image
                                        source={images.report}
                                        style={styles.unMatchImg}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.unMatchText}>Report this employer</Text>
                                </View>
                            </TouchableOpacity>
                    }

                </View>
            </BottomActionSheet>

            <BottomActionSheet
                ref={openShedule}
                headerAlwaysVisible
                footerAlwaysVisible
            >
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={styles.interview}>Schedule an interview</Text>
                        <TouchableOpacity onPress={() => {
                            if (selectNewDateTime == '') {
                                Alert.alert('Please select date & time');
                            } else if (scheduleMessage == '') {
                                Alert.alert('Please enter schedule message');
                            } else {
                                Alert.alert(
                                    "Are you sure you want to schedule this interview",
                                    "",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => {

                                            }
                                        },
                                        {
                                            text: "Ok",
                                            onPress: () => {
                                                scheduleSend()
                                            }
                                        },
                                    ]
                                );
                            }
                        }} >
                            <Text style={styles.sendButton}>Send</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={{ fontSize: 16, color: '#667287' }}>
                        Ipsum libero enim eros eget aliquet.
                    </Text> */}
                </View>

                <View height={440} backgroundColor="white" paddingHorizontal={20}>
                    <View style={{ height: 51, backgroundColor: '#F3F6FF', borderRadius: 8, marginTop: 30, padding: 16, flexDirection: "row" ,justifyContent: 'space-between'}}>
                        <Text style={{ color: '#25324D', fontWeight: 'bold', fontSize: 15 }}>Schedule:</Text>
                        <View style={{ marginLeft: 50, flexDirection: "row", justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => {

                                setShowDateTime(Platform.OS === 'ios');
                                const currentDate = date;
                                setDate(currentDate);
                                setSelectNewDateTime(currentDate);
                                openDateTimePicker()
                            }}>
                                <Text style={{ color: '#25324D', fontSize: 15}}>{selectNewDateTime == '' ? ' Select Date & Time' :moment(selectNewDateTime).format("MMM D, YYYY    HH:mm")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{alignSelf:'center'}}>
                        <DatePicker date={date}
                                    value={selectNewDateTime}
                                    onDateChange={onChangeDate}
                                    locale={'en_GB'}
                                    mode="datetime"
                                    is24hourSource={'locale'}
                                    minimumDate={new Date(todayCurrentYear, todayCurrentMonth, todayCurrentDate)}
                                    style={{ height: 180 }}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 20, height: 1, backgroundColor: 'lightgray', marginTop: 20 }} />
                    <Text style={{ fontSize: 16, color: '#667287', marginTop: 10 }}>Message</Text>
                    <View style={styles.textAreaContainer} >
                        <TextInput
                            style={styles.textArea}
                            underlineColorAndroid="transparent"
                            placeholder=""
                            placeholderTextColor="#999"
                            numberOfLines={10}
                            textAlignVertical="top"
                            multiline={true}
                            value={scheduleMessage}
                            onChangeText={(value) => setScheduleMessage(value)}
                        />
                    </View>
                </View>
            </BottomActionSheet>

            <BottomActionSheet
                ref={reportBs}
                headerAlwaysVisible
                footerAlwaysVisible
            >
                <View style={{ justifyContent: "center", alignItems: "flex-start", paddingHorizontal: 20 }}>
                    <Text style={styles.reportTxt}>Report</Text>
                    <Text style={{ fontStyle: "normal", fontWeight: "normal", fontSize: 16, lineHeight: 19, color: '#667287', marginTop: 5 }}>{selectedUser.name}</Text>
                </View>

                <View height={260} backgroundColor="white" paddingHorizontal={20}>

                    <TouchableOpacity style={[styles.reportBsView, { marginTop: 20, flexDirection: "row" }]} onPress={() => reportEmployer('Fake profile/spam')}>
                        <Text style={styles.reportText}>Fake profile/spam</Text>
                        <Image
                            source={images.right_arrow}
                            style={styles.nextImg}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.reportBsView} onPress={() => reportEmployer('Inappropriate messages')}>
                        <Text style={styles.reportText}>Inappropriate messages</Text>
                        <Image
                            source={images.right_arrow}
                            style={styles.nextImg}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.reportBsView} onPress={() => reportEmployer('Inapproprate photo')}>
                        <Text style={styles.reportText}>Inapproprate photo</Text>
                        <Image
                            source={images.right_arrow}
                            style={styles.nextImg}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.reportBsView} onPress={() => reportEmployer('Inapproprate profile')}>
                        <Text style={styles.reportText}>Inapproprate profile</Text>
                        <Image
                            source={images.right_arrow}
                            style={styles.nextImg}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                    <TouchableOpacity style={styles.reportBsView} onPress={() => reportEmployer('Offline behavior')}>
                        <Text style={styles.reportText}>Offline behavior</Text>
                        <Image
                            source={images.right_arrow}
                            style={styles.nextImg}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <View style={styles.dividerLine} />

                </View>
            </BottomActionSheet>
        </AVSafeArea>
    )
}

export default FrontEndDeveloperScreen;

const styles = StyleSheet.create({

    imgComment: {
        width: 33,
        height: 33,
        alignSelf: 'center'
    },
    text1: {
        fontStyle: "normal",
        fontSize: 14,
        lineHeight: 14,
        fontWeight: Platform.OS == 'android' ? 'bold' : "400",
        lineHeight: 16,
        textAlign: "center",
        color: '#667287',
    },
    txt1View: {
        width: width,
        height: 32,
        alignSelf: 'center',
        borderColor: '#CAD0DC',
        borderWidth: 1,
        backgroundColor: '#F9FAFF',
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    imgBack: {
        top: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgGoogle: {
        width: 35,
        height: 35,
    },
    imgActive: {
        width: 12,
        height: 12,
        top: '70%',
        left: '65%'
    },
    text: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16
    },
    text1: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 12,
        lineHeight: 14
    },
    imgMenu: {
        width: 28,
        height: 28,

    },
    inputText: {
        width: 320,
        height: 44,
        borderWidth: 0.5,
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        alignItems: "center",
        borderColor: '#cecece',
        paddingLeft: 30,
    },
    imgPin: {
        position: 'absolute',
        width: 9,
        height: 17,
        bottom: '2%',
        left: '-5%',
    },
    imgSend: {
        width: 18,
        height: 16,
        // top: '5%'
    },
    textMore: {
        fontWeight: "bold",
        fontSize: 22,
        lineHeight: 26,
        color: '#25324D',
        padding: 10
    },
    imgClose: {
        width: 19,
        height: 19,
        left: 8
    },
    text2: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 16,
        lineHeight: 19,
        left: 15,
        alignSelf: 'center'
    },
    text3: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 16,
        lineHeight: 19,
        left: 15,
        alignSelf: 'center'
    },
    imgBlock: {
        width: 20,
        height: 19,
        left: 8
    },
    imgReport: {
        width: 20,
        height: 19,
        left: 8
    },
    textTwitter: {
        fontWeight: "normal",
        fontSize: 16,
        lineHeight: 19,
        color: '#667287',
        padding: 10
    },
    text4: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 16,
        lineHeight: 19,
        alignSelf: 'center',
        color: '#25324D'
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderColor: 'rgb(224,227,227)',
        borderTopWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        zIndex: 100,
        backgroundColor: '#FAFAFA',

    },
    blockChatView: {
        borderColor: 'rgb(224,227,227)',
        borderTopWidth: 1,
        paddingTop: 10,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'white',
    },
    textInput: {
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'flex-end',
        maxHeight: 100,
        width: Platform.OS === 'android' ? '73%' : '74%',
        marginTop: Platform.OS === 'android' ? 2 : -2,
        paddingVertical: Platform.OS === 'android' ? 0 : 5,
        fontSize: 16
    },
    myMessage: {
        flexDirection: 'row',
        backgroundColor: '#386BD4',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingLeft: 12,
        paddingBottom: 10,
        maxWidth: '80%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    senderMessage: {
        flexDirection: 'row',
        backgroundColor: '#FFFF',
        borderWidth: 0.8,
        borderColor: 'lightgray',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        paddingLeft: 12,
        paddingBottom: 10,
        maxWidth: '80%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
    },
    pdfMyMessage: {
        flexDirection: 'row',
        backgroundColor: '#386BD4',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    pdfSenderMessage: {
        flexDirection: 'row',
        backgroundColor: '#FFFF',
        borderWidth: 0.8,
        borderColor: 'lightgray',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imageMyMessage: {
        flexDirection: 'row',
        backgroundColor: '#386BD4',
        borderRadius: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imageSenderMessage: {
        flexDirection: 'row',
        backgroundColor: '#FFFF',
        borderWidth: 0.8,
        borderColor: 'lightgray',
        borderRadius: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        width: '100%',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    imageSenderStyle: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    imageMyStyle: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    itemTimeMy: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
        paddingRight: 8,
    },
    itemTimeMessageSender: {
        fontSize: 12,
        color: '#9CA6B9',
        paddingRight: 8,
    },
    itemTimeSender: {
        fontSize: 12,
        color: '#9CA6B9',
        paddingTop: 2,
    },
    emptyComponent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        top: '40%',
        position: 'absolute'
    },
    listEmptyText: {
        marginBottom: '50%',
        fontSize: 15,
    },
    yourlanguages: {
        color: colors.primary,
        paddingTop: 5,
        marginBottom: 20,
        fontSize: 24,
        fontWeight: "bold",
    },
    unMatchText: {
        fontStyle: "normal",
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 16,
        lineHeight: 19,
        color: "#25324D",
        marginLeft: 10
    },
    unMatchImg: {
        width: 18,
        height: 18
    },
    dividerLine: {
        width: width,
        height: 1,
        backgroundColor: colors.grey,
        marginVertical: 15,
        alignSelf: "center"
    },
    nextImg: {
        width: 6,
        height: 12
    },
    reportText: {
        fontStyle: "normal",
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 16,
        lineHeight: 19,
        color: "#25324D"
    },
    reportBsView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    reportTxt: {
        color: colors.primary,
        paddingTop: 5,
        fontSize: 24,
        fontWeight: "bold",
    },
    acceptTxt: {
        fontStyle: "normal",
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 17,
        color: '#8692AC'
    },
    dividerView: {
        width: WP('80'),
        height: 1,
        backgroundColor: colors.grey,
        marginVertical: 10,
        alignSelf: "center"
    },
    acceptDeclineView: {
        width: WP('80'),
        flexDirection: "row"
    },
    declineView: {
        width: '49%',
        alignItems: "center"
    },
    letUsKnowTxt: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
        color: "#667287",
        marginLeft: 10
    },
    cmntImg: {
        height: 14,
        width: 14
    },
    dateTimeTxt: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
        color: "#667287",
        marginLeft: 10
    },
    youInvitedTxt: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 19,
        color: "#25324D",
        marginTop: 5,
        marginBottom: 10
    },
    sendButton: {
        color: '#4C97E6',
        marginBottom: 20,
        fontSize: 16,
        fontWeight: Platform.OS == 'android' ? 'bold' : "500",
        marginLeft: 10,
    },
    interview: {
        color: colors.primary,
        paddingTop: 5,
        fontSize: 24,
        fontWeight: "bold",
    },
    textAreaContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 5,
        marginTop: 10,
        borderRadius: 10,
    },
    textArea: {
        height: 100,
        justifyContent: "flex-start",
        color: '#000000',
    },
    scheduleInterviewMainHeading: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "700",
        fontSize: 16,
        lineHeight: 19,
        color: '#25324D',
        paddingTop: '5%',
    },
    scheduleDateTime: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "400",
        fontSize: 12,
        lineHeight: 24,
        color: '#667287',
        paddingLeft: '3%',
        width: '95%',
    },
    text3: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16,
        color: '#667287',
        paddingRight: '15%'
    },
    text4: {
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        fontSize: 14,
        lineHeight: 16,
        color: '#667287',
        paddingLeft: '15%'
    },
    img1: {
        width: 14,
        height: 14,

    },
    img2: {
        width: 13,
        height: 13,
    },
    scheduleSenderView: {
        backgroundColor: '#FFFF',
        borderWidth: 0.8,
        borderColor: 'lightgray',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        maxWidth: '80%',
        // alignItems: 'flex-start',
        // flexWrap: 'wrap',
    },
    scheduleMyView: {
        backgroundColor: '#FFFF',
        borderWidth: 0.8,
        borderColor: 'lightgray',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingLeft: 10,
        paddingRight: 15,
        paddingBottom: 10,
        maxWidth: '80%',
        // alignItems: 'flex-start',
        // flexWrap: 'wrap',
    },
    acceptTextStyle: {
        fontSize: 14,
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        color: '#219653',
        lineHeight: 16,
    },
    acceptImage: {
        height: 15,
        width: 15,
        marginLeft: 6,
    },
    declineTextStyle: {
        fontSize: 14,
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        color: '#E24E57',
        lineHeight: 16,
    },
    declineImage: {
        height: 15,
        width: 15,
        marginLeft: 6,
    },
    pendingTextStyle: {
        fontSize: 14,
        fontWeight: Platform.OS == 'android' ? 'bold' : "600",
        color: 'black',
        lineHeight: 16,
    },
    dividerStyle: {
        width: '100%',
        height: 1,
        borderColor: colors.disabledColor,
        marginTop: 10
    }
})
