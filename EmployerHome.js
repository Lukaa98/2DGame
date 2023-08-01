import React, {
  createRef,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
  ImageBackground,
  BackHandler,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import colors from "../../../../assets/color";
import { AVCard } from "../../../components/Common/Card";
import { AVIcon } from "../../../components/Common/Icons";
import { HP, WP } from "../../../utils/helper/responsive";
import { AVGradientButton } from "../../../components/Common/GradientButton";
import { AVSkillsCard } from "./SkillsCard";
import { JobExperienceCard } from "./JobExperienceCard";
import Timeline from "../../../components/Common/EducationTimeline";
import { AVSocialIcon } from "../../../components/Common/SocialIcon";
import { CompanyDetail } from "./CompanyDetailView";
import Carousel from "react-native-carousel-control";
import CarouselNew from "react-native-anchor-carousel";
import briefcaseSvg from "../../../svgAssets/briefcase.svg";
import moneyBagSvg from "../../../svgAssets/moneyBag.svg";
import badgeSvg from "../../../svgAssets/badge.svg";
import { pushNotifEmailStatusSeekerAction } from "../../../components/actions/SeekerSettingsActions/GetPushNotifSeekerSettingAction";
import { images } from "../../../../assets/images";
import {
  filTersList,
  salaryList,
  jobTypesList,
  citiesList,
  educationList,
  skillsList,
  socialMediaList,
  pastWorkOptions,
  referencesOptions,
  workAuthorizationOptions,
  militaryVeteranOptions,
  noShowsOptions,
  bgCheckOptions,
  drugTestOptions,
} from "./filtersList";
import { useSelector, useDispatch } from "react-redux";
import {
  getEmployeesListAction,
  getEmployeesListRes,
} from "../../../components/actions/EmployerHomeActions/GetEmployeesListAction";
import AsyncStorage from "@react-native-community/async-storage";
import {
  filterSeekersAction,
  filterSeekersRes,
} from "../../../components/actions/FilterActions/FilterSeekersAction";
import {
  likeDislikeJobAction,
  likeDislikeJobRes,
} from "../../../components/actions/SeekerHomeActions/LikeDislikeJobAction";
import moment from "moment";
import { viewAllPostedJobsAction } from "../../../components/actions/CompanyPostedJobsActions/ViewAllJobsAction";
import SocketIOClient from "socket.io-client";
import { PERMISSIONS, check, request, RESULTS } from "react-native-permissions";
import firebase from "react-native-firebase";
import { pauseBlurAccountStatusAction } from "../../../components/actions/SeekerSettingsActions/PauseBlurAccountStatusAction";
import { BASE_URL } from "../../../components/constants/api";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  rearrangeLanguages,
  convertNumberToMoneyFormat,
} from "../../../utils/Utils";
import EmployerFilter from "../EmployeeFilterScreens/EmployerFilter";
import { SvgXml, SvgUri } from "react-native-svg";
import { RadiantBlurModal } from "./RadiantBlurModal";
import { ViewPastWork } from "./ViewPastWork";
import { AVDivider } from "../../../components/Common/Divider";
import HomeHeader from "../../../components/Common/HomeHeader";
import AboutUserTag from "../../../components/Common/AboutUserTag";
import NoInternet from "../../../components/Common/NoInternet";
import LikeDislikeFrame from "../../../components/Common/LikeDislikeFrame";
import NoResults from "../../../components/Common/NoResults";
import CircleScheduleView from "../../../components/Common/CircleScheduleView";
import UserProfileCard from "./UserProfileCard";
let Analytics = firebase.analytics();

const INTERVAL_SECS = 120000;

const { width, height } = Dimensions.get("window");

const jobsList = [
  {
    key: "001",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
  {
    key: "002",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
  {
    key: "003",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
  {
    key: "004",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
  {
    key: "005",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
  {
    key: "006",
    jobTitle: "UI/UX Designer",
    jobImg: images.google,
    isSelected: false,
  },
];

const jobTypeText = {
  0: "Full-time",
  1: "Part-time",
  2: "Commission",
  3: "Temp",
  4: "Contract",
  5: "Internship",
};

export const svgUris = {
  Spanish: "https://avda-awsbucket.s3.amazonaws.com/1667982243926",
  "Spanish; Castilian": "https://avda-awsbucket.s3.amazonaws.com/1667982243926",
  Chinese: "https://avda-awsbucket.s3.amazonaws.com/1667982482908",
  Bengali: "https://avda-awsbucket.s3.amazonaws.com/1667982660930",
  French: "https://avda-awsbucket.s3.amazonaws.com/1667982796352",
  German: "https://avda-awsbucket.s3.amazonaws.com/1667982889670",
  Russian: "https://avda-awsbucket.s3.amazonaws.com/1667982959244",
  Korean: "https://avda-awsbucket.s3.amazonaws.com/1667983018371",
  Hebrew: "https://avda-awsbucket.s3.amazonaws.com/1667983106799",
  Italian: "https://avda-awsbucket.s3.amazonaws.com/1667983172912",
  Latin: "https://avda-awsbucket.s3.amazonaws.com/1667983265466",
  Portuguese: "https://avda-awsbucket.s3.amazonaws.com/1667983332895",
  Arabic: "https://avda-awsbucket.s3.amazonaws.com/1667983408166",
  "Arabic; Language": "https://avda-awsbucket.s3.amazonaws.com/1667983408166",
  Japanese: "https://avda-awsbucket.s3.amazonaws.com/1667983481088",
  Ukrainian: "https://avda-awsbucket.s3.amazonaws.com/1667983556299",
  Yiddish: "https://avda-awsbucket.s3.amazonaws.com/1667983651569",
  Hindi: "https://avda-awsbucket.s3.amazonaws.com/1667983774832",
  Punjabi: "https://avda-awsbucket.s3.amazonaws.com/1667983774832",
  Javanese: "https://avda-awsbucket.s3.amazonaws.com/1667984027768",
  Vietnamese: "https://avda-awsbucket.s3.amazonaws.com/1667984200872",
  Turkish: "https://avda-awsbucket.s3.amazonaws.com/1667984253563",
  Polish: "https://avda-awsbucket.s3.amazonaws.com/1667984291103",
  Thai: "https://avda-awsbucket.s3.amazonaws.com/1667984354405",
  Tagalog: "https://avda-awsbucket.s3.amazonaws.com/1667984458819",
  Flemish: "https://avda-awsbucket.s3.amazonaws.com/1667984522747",
  Finnish: "https://avda-awsbucket.s3.amazonaws.com/1667984648166",
  Swedish: "https://avda-awsbucket.s3.amazonaws.com/1667984706016",
  Urdu: "https://avda-awsbucket.s3.amazonaws.com/1667984734353",
  Tamil: "https://avda-awsbucket.s3.amazonaws.com/1667983774832",
  Telugu: "https://avda-awsbucket.s3.amazonaws.com/1667983774832",
  Nepali: "https://avda-awsbucket.s3.amazonaws.com/1667984850617",
  English: "https://avda-awsbucket.s3.amazonaws.com/1667984916868",
};

let tempArray = [];

var ws = null;
ws = SocketIOClient("https://api.avda.pineappleworkshop.com", {
  transports: ["websocket"],
  jsonp: false,
});

export const EmployerHomeScreen = ({ navigation, ...props }) => {
  const dispatch = useDispatch();
  const carouselRefNew = useRef(null);
  // const swiper = createRef();
  const flatListRef = useRef();
  const toastDisplayRef = createRef();
  const [isConnected, setIsConnected] = useState(true);
  const [seeMore, setSeeMore] = useState(false);
  const [socialIcon, setSocialIcon] = useState(true);
  const [sliderOneChanging, setSliderOneChanging] = useState(false);
  const [sliderOneValue, setSliderOneValue] = useState([5]);
  const [displayJobsList, setDisplayJobsList] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [checked, setChecked] = useState(false);
  const [dealBreakerSwitch, setDealBreakerSwitch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredArray, setFilteredArray] = useState([]);
  const [clickedFilterId, setClickedFilterId] = useState("");
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [showSelectedIndustries, setShowSelectedIndustries] = useState(false);
  const [availabilities, setAvailabilities] = useState([]);
  const [workValue, setWorkValue] = useState("");
  const [clickedCityName, setClickedCityName] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [showMoreSkills, setShowMoreSkills] = useState("");
  const [currentExpCard, setCurrentExpCard] = useState(0);
  const [allPostedJobs, setAllPostedJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFilteredIndex, setCurrentFilteredIndex] = useState(0);
  const [rendNoMoreCards, setRenderNoMoreCards] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);
  const [filteredIndustriesArray, setFilteredIndustriesArray] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState([]);
  const [hoursAvailable, setHoursAvailable] = useState("");
  const [range, setRange] = useState("");
  const [expYears, setExpYears] = useState([]);
  const [filteredLanguagesArray, setFilteredLanguagesArray] = useState([]);
  const [jobTitlesSuggestionList, setJobTitlesSuggestionList] = useState([]);
  const [skillsSuggestionList, setSkillsSuggestionList] = useState([]);
  const [industriesSuggestionList, setIndustriesSuggestionList] = useState([]);
  const [filtersApiResult, setFiltersApiResult] = useState([]);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [companyData, setCompanyData] = useState("");
  const [isApplied, setIsApplied] = useState(0);
  const [certSuggestList, setCertSuggestionList] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [isTopJobSelected, setIsTopJobSelected] = useState(false);
  const [topJobTitle, setTopJobTitle] = useState(false);
  const [topJobId, setTopJobId] = useState("");
  const [employeJobPost, setEmployeJobPost] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isBackPressed, setIsBackPressed] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [islocalSetFilter, setIslocalSetFilter] = useState(false);
  const getEmployeesList = useSelector(
    (state) => state.getEmployeesListRes.getEmployeesListData
  );
  const allPostedJobsData = useSelector(
    (state) => state.viewAllJobsRes.viewAllCompanyPostedJobsData
  );
  const getJobTitlesRedux = useSelector(
    (state) => state.getJobTitlesRes.getJobTitlesData
  );
  const getIndustriesRedux = useSelector(
    (state) => state.getIndustriesRes.getIndustriesData
  );
  const getServerSkillsListRedux = useSelector(
    (state) => state.getJobSkillsRes.getJobSkillsData
  );
  const filterSeekersData = useSelector(
    (state) => state.filterSeekersRes.filterSeekersData
  );
  const likeDislikeData = useSelector(
    (state) => state.likeDislikeJobRes.likeDislikeJobData
  );
  const getCertificatesRedux = useSelector(
    (state) => state.getIndustriesCertificateRes.getIndustriesCertificateData
  );
  const fetchingEmployeesList = useSelector(
    (state) => state.getEmployeesListRes.isLoading
  );
  const isFetchingAllPostedJobs = useSelector(
    (state) => state.viewAllJobsRes.isLoading
  );
  const filterSeekersLoading = useSelector(
    (state) => state.filterSeekersRes.isLoading
  );

  const [userId, setUserId] = useState(null);
  const [pagee, setPagee] = useState(1);

  const [isHomeScreen, setIsHomeScreen] = useState(true);
  const [isJobBoardScreen, setIsJobBoardScreen] = useState(false);
  const [isCompanyDetailsModalShow, setIsCompanyDetailsModalShow] =
    useState(false);
  const [isPastWorkDetailsModalShow, setIsPastWorkDetailsModalShow] =
    useState(false);
  const [pastWorksData, setPastWorksData] = useState([]);
  const [pastWorkUrlsData, setPastWorkUrlsData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setIsFiltersApplied(global.filterApplied);
      setIsPastWorkDetailsModalShow(global.modalValue === true ? true : false);
    }, [])
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    getUserId();
    callSettingsApis();
    fetchUserType();
    dispatch(viewAllPostedJobsAction());

    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to go exit app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    ws.on("activeOnlineStatus", (msg) => {});

    ws.on("activeTimeStatus", (msg) => {});
    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (islocalSetFilter) {
      updateFilterCheck();
    }
  }, [islocalSetFilter]);

  const saveFilterLocal = async () => {
    let obj = {
      selectedJobTitles,
      selectedIndustries,
      selectedSalary,
      jobTypesList,
      hoursAvailable,
      workValue,
      range,
      educationList,
      expYears,
      selectedSkills,
      selectedCertifications,
      drugTestOptions,
      pastWorkOptions,
      referencesOptions,
      militaryVeteranOptions,
      workAuthorizationOptions,
      noShowsOptions,
      bgCheckOptions,
      socialMediaList,
      filTersList,
      filteredLanguagesArray,
      selectedLanguages,
    };
    const userId = await AsyncStorage.getItem("@user_id");
    let jobID = topJobId || "";
    let asKey = "@employer_filter" + userId + "_" + jobID;
    await AsyncStorage.setItem(asKey, JSON.stringify(obj));
  };
  const removeFromLocalFilter = async () => {
    const userId = await AsyncStorage.getItem("@user_id");
    let jobID = topJobId || "";
    let asKey = "@employer_filter" + userId + "_" + jobID;
    await AsyncStorage.setItem(asKey, "");
  };
  const getFilterLocal = async (selectedJobID) => {
    const userId = await AsyncStorage.getItem("@user_id");
    let jobID = selectedJobID || "";
    let asKey = "@employer_filter" + userId + "_" + jobID;
    const employer_filter = await AsyncStorage.getItem(asKey);
    let lList = [];
    if (employer_filter) {
      let saveObj = JSON.parse(employer_filter);
      setSelectedJobTitles(saveObj.selectedJobTitles);
      setSelectedIndustries(saveObj.selectedIndustries);
      setSelectedSalary(saveObj.selectedSalary);
      lList = saveObj.selectedLanguages;
      setSelectedLanguages(saveObj.selectedLanguages);
      saveObj.selectedSalary.map((item, idx) => {
        salaryList[idx] = item;
      });
      saveObj.jobTypesList.map((item, idx) => {
        jobTypesList[idx]["isSelected"] = item.isSelected;
      });
      setWorkValue(saveObj.workValue);
      setRange(saveObj.range);
      saveObj.educationList.map((item, idx) => {
        educationList[idx]["isSelected"] = item.isSelected;
      });
      saveObj.socialMediaList.map((item, idx) => {
        socialMediaList[idx]["isSelected"] = item.isSelected;
      });
      setExpYears(saveObj.expYears);
      saveObj.selectedSkills.map((item, idx) => {
        skillsList[idx]["isSelected"] = item.isSelected;
      });
      setSelectedSkills(saveObj.selectedSkills);
      setSelectedCertifications(saveObj.selectedCertifications);

      saveObj.drugTestOptions.map((item, idx) => {
        drugTestOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.pastWorkOptions.map((item, idx) => {
        pastWorkOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.workAuthorizationOptions.map((item, idx) => {
        workAuthorizationOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.referencesOptions.map((item, idx) => {
        referencesOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.militaryVeteranOptions.map((item, idx) => {
        militaryVeteranOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.noShowsOptions.map((item, idx) => {
        noShowsOptions[idx]["isSelected"] = item.isSelected;
      });
      saveObj.bgCheckOptions.map((item, idx) => {
        bgCheckOptions[idx]["isSelected"] = item.isSelected;
      });
      setHoursAvailable(saveObj.hoursAvailable);

      saveObj.filTersList.map((item, idx) => {
        filTersList[idx]["dealBreaker"] = item.dealBreaker;
        filTersList[idx]["openToAll"] = item.openToAll;
      });

      setIslocalSetFilter(true);
    } else {
      setIslocalSetFilter(false);
    }
    getLanguagesListApi(lList);
  };
  const getLanguagesListApi = async (preLang) => {
    let selLang = preLang.map(({ name }) => name);
    const userToken = await AsyncStorage.getItem("@user_login_token");
    fetch(BASE_URL + "/api/users/getLanguages", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: userToken,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.messge) {
          let tmpArray = [];
          let newArrangedLangArray = rearrangeLanguages(json.messge);
          newArrangedLangArray.map((item, index) => {
            let tmpObj = {};
            let key = "00" + index + 1;
            tmpObj["name"] = item?.name;
            tmpObj["key"] = key;
            tmpObj["isSelected"] = selLang.includes(item?.name) ? true : false;
            tmpArray.push(tmpObj);
          });
          setLanguagesList(tmpArray);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const callSettingsApis = async () => {
    dispatch(pauseBlurAccountStatusAction());
    dispatch(pushNotifEmailStatusSeekerAction());
  };

  const getUserId = async () => {
    const fetchedUserId = await AsyncStorage.getItem("@user_id");
    setUserId(fetchedUserId);
  };

  useEffect(() => {
    if (userId !== null && userId !== undefined) {
      // by me
      ws.emit("online", { UserId: userId });

      var now = new Date();
      let d = Date.now();
      d = new Date(d);
      let Times = d.toLocaleTimeString();
      let month = d.getMonth() + 1;
      let Dates = d.getFullYear() + "-" + month + "-" + d.getDate();
      let DateTime = Dates + " " + Times;
      const request = {
        UserId: Number(userId),
        time: DateTime,
      };
      // ws.emit('activeOnlineStatus', request);

      ws.emit("activeTimeStatus", request);
      const intervalId = setInterval(() => {
        // ws.emit('activeOnlineStatus', request);
        ws.emit("activeTimeStatus", request);
      }, INTERVAL_SECS);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  useEffect(() => {
    if (
      likeDislikeData !== "" &&
      likeDislikeData !== null &&
      likeDislikeData !== undefined
    ) {
      if (likeDislikeData && likeDislikeData?.user?.isposterstatus === 1) {
        setIsFocus(true);
        toastDisplayRef.current?.show("Job applied!", DURATION.LENGTH_SHORT);
        setIsApplied(1);
        setTimeout(() => {
          if (isFiltersApplied) {
            let tmpFar = filtersApiResult;
            tmpFar.splice(currentFilteredIndex, 1);
            setFiltersApiResult(tmpFar);
          } else {
            let tmpemployeesList = employeesList;
            tmpemployeesList.splice(currentIndex, 1);
            setEmployeesList(tmpemployeesList);
          }
          jumpToIndex("useEffect", true);
          setIsApplied(0);
        }, 1000);
        if (likeDislikeData.isMatched == 1) {
          navigation.navigate("MatchScreenSeeker", {
            userData: likeDislikeData.profileDetails,
            from: "employer",
            likeData: likeDislikeData,
          });
        }
      } else if (likeDislikeData.isposterstatus === 0) {
        setIsFocus(false);
      }
      dispatch(likeDislikeJobRes(""));
    }
  }, [likeDislikeData]);

  useEffect(() => {
    if (
      allPostedJobsData !== "" &&
      allPostedJobsData !== null &&
      allPostedJobsData !== undefined
    ) {
      setEmployeJobPost(allPostedJobsData);
    }
  }, [allPostedJobsData]);

  useEffect(() => {
    if (
      getEmployeesList !== null &&
      getEmployeesList !== undefined &&
      getEmployeesList !== ""
    ) {
      let empList = sortJobsByDate(getEmployeesList);
      setRenderNoMoreCards(empList.length === 0);
      setEmployeesList(empList);
      if (
        empList.length > 0 &&
        empList[0].AppliedJobs &&
        empList[0].AppliedJobs.length > 0
      ) {
        var tmpApplyJobs = empList[0].AppliedJobs.filter(function (el) {
          return el.companyId == userId;
        });
        // setIsApplied(tmpApplyJobs.length > 0 ? tmpApplyJobs[0].isposterstatus : 0);
      } else {
        // setIsApplied(0);
      }
      setCurrentIndex(0);
      dispatch(getEmployeesListRes(""));
    }
  }, [getEmployeesList]);

  useEffect(() => {
    if (
      allPostedJobsData !== null &&
      allPostedJobsData !== undefined &&
      allPostedJobsData !== ""
    ) {
      tempArray = [...allPostedJobsData];
      tempArray.unshift({
        name: "Add Job",
      });
      setAllPostedJobs(tempArray);
      if (tempArray.length > 1) {
        setSelectedJob(tempArray[1], tempArray);
      } else {
        dispatch(getEmployeesListAction("", ""));
      }
    }
  }, [allPostedJobsData]);

  useEffect(() => {
    if (
      getJobTitlesRedux !== "" &&
      getJobTitlesRedux !== null &&
      getJobTitlesRedux !== undefined
    ) {
      setFilteredArray(getJobTitlesRedux);
      let tempArr = [...getJobTitlesRedux];
      setJobTitlesSuggestionList(tempArr.slice(0, 30));
    }
  }, [getJobTitlesRedux]);

  useEffect(() => {
    if (
      getServerSkillsListRedux !== "" &&
      getServerSkillsListRedux !== null &&
      getServerSkillsListRedux !== undefined
    ) {
      let tempArr = [...getServerSkillsListRedux];
      setSkillsSuggestionList(tempArr.slice(0, 30));
    }
  }, [getServerSkillsListRedux]);

  useEffect(() => {
    if (
      getIndustriesRedux !== "" &&
      getIndustriesRedux !== null &&
      getIndustriesRedux !== undefined
    ) {
      let tempArr = [...getIndustriesRedux];
      setIndustriesSuggestionList(tempArr.slice(0, 30));
    }
  }, [getIndustriesRedux]);

  // ----- Get Filter Apply Data
  useEffect(() => {
    if (
      filterSeekersData !== "" &&
      filterSeekersData !== null &&
      filterSeekersData !== undefined
    ) {
      let empList = sortJobsByDate(filterSeekersData);
      // setIsFiltersApplied(true);
      if (empList.length > 0) {
        setFiltersApiResult([]);
        // setIsApplied(empList[0].isposterstatus);
      }
      setFiltersApiResult(empList);
      setCurrentFilteredIndex(0);
      setRenderNoMoreCards(empList.length === 0);
      dispatch(filterSeekersRes(""));
    }
  }, [filterSeekersData]);

  useEffect(() => {
    if (
      getCertificatesRedux !== null &&
      getCertificatesRedux !== "" &&
      getCertificatesRedux !== undefined
    ) {
      if (getCertificatesRedux.length > 0) {
        var certificateList = [];
        for (let item of getCertificatesRedux) {
          certificateList.push({ name: item.certification, isSelected: false });
        }
        setCertSuggestionList(certificateList.slice(0, 30));
      }
    }
  }, [getCertificatesRedux]);

  const fetchUserType = async () => {
    var userType = await AsyncStorage.getItem("@user_type");
    var tempUesrType = await AsyncStorage.getItem("@temp_user_type");
    if ((userType == 0 || userType) && tempUesrType) {
      userType = tempUesrType;
      await AsyncStorage.setItem("@user_type", tempUesrType);
      await AsyncStorage.removeItem("@temp_user_type");
    }
    var emp_tutorial_viewed = await AsyncStorage.getItem(
      "@emp_tutorial_viewed"
    );
    if (!emp_tutorial_viewed) {
      await AsyncStorage.setItem("@emp_tutorial_viewed", "viewed");
      navigation.navigate("TutorialEmployerScreen");
      Analytics.logEvent("job_provider_tutorial_start", {
        id: 47,
        description: "Job provider tutorial start",
      });
    }
  };

  const handleSocialIcon = () => {
    setSocialIcon(false);
  };

  const sectionTitle = (title, onPress) => {
    return (
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <View flex={1}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: colors.accentDark,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    );
  };

  const openEmail = (emailId) => {
    Linking.openURL(`mailto:${emailId}`);
  };

  const openDialpad = (phone) => {
    let number = "";
    if (Platform.OS === "ios") {
      number = `telprompt:${phone}`;
    } else {
      number = `tel:${phone}`;
    }
    Linking.openURL(number);
  };

  const onToggleSwitch = () => {
    setIsHomeScreen(!isHomeScreen);
    setIsJobBoardScreen(!isJobBoardScreen);
  };

  const onViewPastWork = async (pastWorks, pastWorkUrls) => {
    setPastWorksData(pastWorks);
    setPastWorkUrlsData(pastWorkUrls);
    setIsPastWorkDetailsModalShow(!isPastWorkDetailsModalShow);
    // navigation.navigate('ViewPastWorkScreen', { viewPastWork: item.PastWorks, viewPastworkUrls: item.PastWorkUrls }
  };

  const onExpandPress = async (item) => {
    setCompanyData(item);
    setIsCompanyDetailsModalShow(!isCompanyDetailsModalShow);
  };

  const handleLike = async () => {
    // setIsFocus(!isFocus);
    const companyId = await AsyncStorage.getItem("@user_id");
    const item =
      isFiltersApplied || isTopJobSelected
        ? filtersApiResult[currentFilteredIndex]
        : employeesList[currentIndex];
    if (isFiltersApplied || isTopJobSelected) {
      filtersApiResult[currentFilteredIndex]["isLiked"] = true;
    } else {
      employeesList[currentIndex]["isLiked"] = true;
    }
    const request = {
      userId: item.Profile.UserId,
      companyId: companyId,
      // post_id: item.Profile.id,
      post_id: topJobId ? topJobId : "0",
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:MM:SS"),
    };
    dispatch(likeDislikeJobAction(request, "employer", "like"));
  };

  const handleDisLike = async () => {
    // setIsFocus(!isFocus);
    const companyId = await AsyncStorage.getItem("@user_id");
    const item =
      isFiltersApplied || isTopJobSelected
        ? filtersApiResult[currentFilteredIndex]
        : employeesList[currentIndex];
    const request = {
      userId: item.Profile.UserId,
      companyId: companyId,
      // post_id: item.Profile.id,
      post_id: topJobId ? topJobId : "0",
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:MM:SS"),
    };
    dispatch(likeDislikeJobAction(request, "employer", "dislike"));
    onPressDeclineJob();
    flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0 });
    Analytics.logEvent("job_provider_rejects_candidate", {
      id: 27,
      description: "Job provider rejects candidate",
    });
  };

  const updateFilterCheck = () => {
    //Check selected filters

    let jobType = "";
    let titlesArr = [];
    let skillsArr = [];
    let education = [];
    let salaryArr = [];
    let langArr = [];
    let workAuth = null;
    let drugTest = null;
    let bgCheck = null;
    let militaryVet = null;
    let certArr = [];
    let pastIndustryArr = [];
    let noShow = "";
    let pastWork = "";
    let socialMedia = [];
    let ref = "";

    //Data for job titles
    for (let item of selectedJobTitles) {
      titlesArr.push(item.suggestion);
    }
    //Data for job type
    for (let item of jobTypesList) {
      if (item.isSelected) {
        if (item.name.includes("Full-time")) {
          jobType = "0";
        } else if (item.name.includes("Part-time")) {
          jobType = "1";
        } else if (item.name.includes("Commission")) {
          jobType = "2";
        } else if (item.name.includes("Temp")) {
          jobType = "3";
        } else if (item.name.includes("Contract")) {
          jobType = "4";
        } else if (item.name.includes("Internship")) {
          jobType = "5";
        }
        break;
      }
    }
    //Data for skills
    for (let item of selectedSkills) {
      skillsArr.push(item.skill_name);
    }
    //Data for education
    for (let item of educationList) {
      let name = item.name;
      if (item.isSelected) {
        if (item.name === "Bachelor's Degree") {
          name = "Bachelors Degree";
        } else if (item.name === "Master's Degree") {
          name = "Masters Degree";
        }
        education.push(name);

        // break;
      }
    }
    //Data for availability
    let tempAvailArr = [...availabilities];
    if (tempAvailArr.length > 0 && tempAvailArr[0] === undefined) {
      tempAvailArr.shift();
    }
    //Data for salary
    let tempSalArr = [...selectedSalary];
    for (let i = 0; i < tempSalArr.length; i++) {
      if (
        tempSalArr[i].isSelected &&
        tempSalArr[i].salaryFrom.length > 0 &&
        tempSalArr[i].salaryTo.length > 0
      ) {
        const itemToPush = {
          type: i,
          start: Number(tempSalArr[i].salaryFrom),
          end: Number(tempSalArr[i].salaryTo),
        };
        salaryArr.push(itemToPush);
      }
    }
    //Data for work authorization
    for (let item of workAuthorizationOptions) {
      if (item.isSelected) {
        workAuth = item.name;
      }
    }
    //Data for drug test
    for (let item of drugTestOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          drugTest = true;
        } else if (item.name === "No") {
          drugTest = false;
        }
      }
    }
    //Data for bg check
    for (let item of bgCheckOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          bgCheck = "Yes";
        } else if (item.name === "No") {
          bgCheck = "No";
        }
      }
    }
    //Data for military veteran
    for (let item of militaryVeteranOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          militaryVet = "Yes";
        } else if (item.name === "No") {
          militaryVet = "No";
        }
      }
    }
    //Data for certification
    for (let item of selectedCertifications) {
      certArr.push(item.name);
    }
    //Data for past industry
    for (let item of selectedIndustries) {
      pastIndustryArr.push(item.industries);
    }
    //Data for past work
    for (let item of pastWorkOptions) {
      if (item.isSelected) {
        pastWork = item.name;
        break;
      }
    }
    //Data for no show
    for (let item of noShowsOptions) {
      if (item.isSelected) {
        noShow = item.name;
        break;
      }
    }
    //Data for social media
    for (let item of socialMediaList) {
      if (item.isSelected) {
        socialMedia.push(item.name);
      }
    }
    //Data for ref
    for (let item of referencesOptions) {
      if (item.isSelected) {
        ref = item.name;
        break;
      }
    }
    //Data for languages
    for (let item of selectedLanguages) {
      langArr.push(item.name);
    }

    if (titlesArr.length > 0) {
      filTersList[1].isSelected = true;
    } else {
      filTersList[1].isSelected = false;
    }
    if (jobType.length > 0) {
      filTersList[4].isSelected = true;
    } else {
      filTersList[4].isSelected = false;
    }
    if (hoursAvailable.length > 0) {
      filTersList[6].isSelected = true;
    } else {
      filTersList[6].isSelected = false;
    }
    if (workValue.length > 0) {
      filTersList[7].isSelected = true;
    } else {
      filTersList[7].isSelected = false;
    }
    if (expYears.length > 0) {
      filTersList[12].isSelected = true;
    } else {
      filTersList[12].isSelected = false;
    }
    if (skillsArr.length > 0) {
      filTersList[13].isSelected = true;
    } else {
      filTersList[13].isSelected = false;
    }
    if (certArr.length > 0) {
      filTersList[14].isSelected = true;
    } else {
      filTersList[14].isSelected = false;
    }
    if (education.length > 0) {
      filTersList[11].isSelected = true;
    } else {
      filTersList[11].isSelected = false;
    }
    if (tempAvailArr.length > 0) {
      filTersList[5].isSelected = true;
    } else {
      filTersList[5].isSelected = false;
    }
    if (salaryArr.length > 0) {
      filTersList[3].isSelected = true;
    } else {
      filTersList[3].isSelected = false;
    }
    if (workAuth !== null) {
      filTersList[19].isSelected = true;
    } else {
      filTersList[19].isSelected = false;
    }
    if (drugTest !== null) {
      filTersList[23].isSelected = true;
    } else {
      filTersList[23].isSelected = false;
    }
    if (bgCheck !== null) {
      filTersList[22].isSelected = true;
    } else {
      filTersList[22].isSelected = false;
    }
    if (militaryVet !== null) {
      filTersList[20].isSelected = true;
    } else {
      filTersList[20].isSelected = false;
    }
    if (range.length > 0) {
      filTersList[9].isSelected = true;
    } else {
      filTersList[9].isSelected = false;
    }
    if (pastWork.length > 0) {
      filTersList[16].isSelected = true;
    } else {
      filTersList[16].isSelected = false;
    }
    if (socialMedia.length > 0) {
      filTersList[17].isSelected = true;
    } else {
      filTersList[17].isSelected = false;
    }
    if (noShow.length > 0) {
      filTersList[21].isSelected = true;
    } else {
      filTersList[21].isSelected = false;
    }
    if (pastIndustryArr.length > 0) {
      filTersList[2].isSelected = true;
    } else {
      filTersList[2].isSelected = false;
    }
    if (ref.length > 0) {
      filTersList[18].isSelected = true;
    } else {
      filTersList[18].isSelected = false;
    }

    setIsDataChanged(!isDataChanged);
  };

  const setLocalSelectedJob = async (clickedJob) => {
    await AsyncStorage.setItem("@localSelectedJob", JSON.stringify(clickedJob));
  };

  const setSelectedJob = (clickedJob, tempArray) => {
    let selectedJobt = clickedJob.title;
    let selectedJobID = clickedJob.id;
    setLocalSelectedJob(clickedJob);
    for (let jobItem of tempArray) {
      if (jobItem.id === clickedJob.id) {
        jobItem.isSelected = true;
      } else {
        jobItem.isSelected = false;
      }
    }
    setTopJobTitle(selectedJobt);
    setTopJobId(selectedJobID);
    getFilterLocal(selectedJobID);
    setEmployeesList([]);
    dispatch(getEmployeesListAction(currentPage, selectedJobt, selectedJobID));
    onPressCancelFilterPopup(true);
    setIsDataChanged(!isDataChanged);
  };

  const getCompanyInitials = (name) => {
    if (name) {
      const splittedString = name.split(" ");
      let newString = "";
      if (splittedString.length > 1) {
        for (let splittedItem of splittedString) {
          newString += splittedItem[0] ? splittedItem[0] : "";
          break;
        }
      } else {
        newString = splittedString.length > 0 ? name.substring(0, 1) : "";
      }
      return newString.toUpperCase();
    }
  };

  const jumpToBackIndex = (from) => {
    setIsLoading(true);
    setIsBackPressed(true);
    try {
      if (isFiltersApplied || isTopJobSelected) {
        let newIndex = currentFilteredIndex > 0 ? currentFilteredIndex - 1 : 0;
        if (rendNoMoreCards) {
          newIndex = currentFilteredIndex;
          dispatch(getEmployeesListAction(currentPage, topJobTitle, topJobId));
        }
        if (currentFilteredIndex == 0) {
          onPressDone();
        }
        setRenderNoMoreCards(false);
        setCurrentFilteredIndex(newIndex);
        if (filtersApiResult.length > 0) {
          // setIsApplied(filtersApiResult[newIndex].isposterstatus);
        }
        flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0 });
      } else {
        setRenderNoMoreCards(false);
        let newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        if (rendNoMoreCards) {
          newIndex = currentIndex;
        }
        if (currentIndex == 0) {
          dispatch(getEmployeesListAction("", topJobTitle, topJobId));
        }
        setCurrentIndex(newIndex);
        if (
          employeesList.length > 0 &&
          employeesList[newIndex].AppliedJobs &&
          employeesList[newIndex].AppliedJobs.length > 0
        ) {
          // setIsApplied(employeesList[newIndex].AppliedJobs[0].isposterstatus);
        }

        flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0 });
      }

      setIsLoading(false);
      setIsBackPressed(false);
    } catch (e) {
      setIsLoading(false);
      setIsBackPressed(false);
    }
  };

  const jumpToIndex = (from, isFromLike) => {
    setIsLoading(true);
    setIsBackPressed(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    if (isFiltersApplied || isTopJobSelected) {
      if (from === "other" && !isApplied) {
        if (!isFromLike) {
          filtersApiResult[currentFilteredIndex]["isDeclined"] = true;
        }
      }
      if (isFromLike && currentFilteredIndex > filtersApiResult.length - 1) {
        setRenderNoMoreCards(true);
        setCurrentFilteredIndex(filtersApiResult.length);
      } else if (
        currentFilteredIndex >= filtersApiResult.length - 1 &&
        !isFromLike
      ) {
        setRenderNoMoreCards(true);
        setCurrentFilteredIndex(filtersApiResult.length - 1);
      } else {
        const newIndex = isFromLike
          ? currentFilteredIndex
          : currentFilteredIndex + 1;
        setCurrentFilteredIndex(newIndex);
        if (filtersApiResult.length > 0) {
          // setIsApplied(filtersApiResult[newIndex].isposterstatus);
        }
        flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0 });
      }
    } else {
      if (isFromLike && currentIndex > employeesList.length - 1) {
        setRenderNoMoreCards(true);
        setCurrentIndex(employeesList.length);
      } else if (currentIndex >= employeesList.length - 1 && !isFromLike) {
        setRenderNoMoreCards(true);
        if (!isFromLike) {
          employeesList[currentIndex]["isDeclined"] = true;
        }
        setCurrentIndex(employeesList.length - 1);
        // const newPage = currentPage + 1;
        // setCurrentPage(newPage);
        // dispatch(getEmployeesListAction(newPage,topJobTitle));
      } else {
        if (from === "other") {
          if (isApplied) {
            toastDisplayRef.current?.show(
              "Already applied!",
              DURATION.LENGTH_SHORT
            );
          } else {
            if (!isFromLike) {
              employeesList[currentIndex]["isDeclined"] = true;
            }
            toastDisplayRef.current?.show(
              "Job declined!",
              DURATION.LENGTH_SHORT
            );
          }
        }
        const newIndex = isFromLike ? currentIndex : currentIndex + 1;
        setCurrentIndex(newIndex);
        if (
          employeesList.length > 0 &&
          employeesList[newIndex].AppliedJobs &&
          employeesList[newIndex].AppliedJobs.length > 0
        ) {
          // setIsApplied(employeesList[newIndex].AppliedJobs[0].isposterstatus);
        }
        flatListRef.current?.scrollToIndex({ index: 0, viewPosition: 0 });
      }
    }
  };

  const onPressCancelFilterPopup = (isFromJobSel) => {
    setLocalFilterReq("");
    setCertSuggestionList([]);
    setSelectedJobTitles([]);
    setSelectedIndustries([]);
    //Clear salary data
    for (let salItem of salaryList) {
      if (salItem.isSelected) {
        salItem.isSelected = false;
        salItem.salaryFrom = "";
        salItem.salaryTo = "";
      }
    }
    setSelectedSalary([]);
    // setRenderNoMoreCards(false);
    setRenderNoMoreCards(employeesList.length === 0);
    //Clear job types
    for (let item of jobTypesList) {
      item.isSelected = false;
    }
    setAvailabilities([]);
    setHoursAvailable("");
    setWorkValue("");
    setRange("");
    //Clear education
    for (let item of educationList) {
      item.isSelected = false;
    }
    setExpYears([]);
    setSelectedSkills([]);
    setSelectedCertifications([]);
    //Clear past work
    for (let item of pastWorkOptions) {
      item.isSelected = false;
    }
    //Clear social media
    for (let item of socialMediaList) {
      item.isSelected = false;
    }
    //Clear work auth
    for (let item of workAuthorizationOptions) {
      item.isSelected = false;
    }
    //Clear military veteran
    for (let item of militaryVeteranOptions) {
      item.isSelected = false;
    }
    //Clear no shows
    for (let item of noShowsOptions) {
      item.isSelected = false;
    }
    //Clear bg options
    for (let item of bgCheckOptions) {
      item.isSelected = false;
    }
    //Clear drug test
    for (let item of drugTestOptions) {
      item.isSelected = false;
    }
    //Clear references
    for (let item of referencesOptions) {
      if (item.isSelected) {
        item.isSelected = false;
      }
    }
    //Clear languages
    for (let item of languagesList) {
      if (item.isSelected) {
        item.isSelected = false;
      }
    }
    //Clear filters icon
    for (let item of filTersList) {
      item.isSelected = false;
      item.dealBreaker = false;
      item.openToAll = false;
      item.dealBreaker = false;
    }
    setChecked(false);

    setIsFiltersApplied(false);
    setFiltersApiResult([]);
    if (!isFromJobSel) {
      removeFromLocalFilter();
    }
  };

  const onPressDone = () => {
    saveFilterLocal();
    setIsFiltersApplied(true);

    let jobType = "";
    let titlesArr = [];
    let skillsArr = [];
    let education = [];
    let salaryArr = [];
    let workAuth = null;
    let langArr = [];
    let drugTest = null;
    let bgCheck = null;
    let militaryVet = null;
    let certArr = [];
    let pastIndustryArr = [];
    let noShow = "";
    let pastWork = "";
    let socialMedia = [];
    let ref = "";
    let isOpenToAllApplied = false;
    let isDealBreakerSelected = false;

    //Check if open to all selected
    for (let item of filTersList) {
      if (item.openToAll === true) {
        isOpenToAllApplied = true;
        break;
      }
    }

    //Check if deal-breaker is selected
    for (let item of filTersList) {
      if (item.dealBreaker === true) {
        isDealBreakerSelected = true;
        break;
      }
    }

    //Data for job titles
    for (let item of selectedJobTitles) {
      titlesArr.push(item.suggestion);
    }
    //Data for job type
    for (let item of jobTypesList) {
      if (item.isSelected) {
        if (item.name.includes("Full-time")) {
          jobType = "0";
        } else if (item.name.includes("Part-time")) {
          jobType = "1";
        } else if (item.name.includes("Commission")) {
          jobType = "2";
        } else if (item.name.includes("Temp")) {
          jobType = "3";
        } else if (item.name.includes("Contract")) {
          jobType = "4";
        } else if (item.name.includes("Internship")) {
          jobType = "5";
        }
        break;
      }
    }
    //Data for skills
    for (let item of selectedSkills) {
      skillsArr.push(item.skill_name);
    }
    //Data for education
    for (let item of educationList) {
      let name = item.name;
      if (item.isSelected) {
        if (item.name === "Bachelor's degree") {
          name = "Bachelors Degree";
        } else if (item.name === "Master's degree") {
          name = "Masters Degree";
        }
        education.push(name);
        // break;
      }
    }
    //Data for availability
    let tempAvailArr = [...availabilities];
    if (tempAvailArr.length > 0 && tempAvailArr[0] === undefined) {
      tempAvailArr.shift();
    }
    //Data for salary
    let tempSalArr = [...selectedSalary];
    for (let i = 0; i < tempSalArr.length; i++) {
      if (
        tempSalArr[i].isSelected &&
        tempSalArr[i].salaryFrom.length > 0 &&
        tempSalArr[i].salaryTo.length > 0
      ) {
        // if(tempSalArr[i].salaryFrom.length > 0 && tempSalArr[i].salaryFrom.length > 0){
        const itemToPush = {
          type: i,
          start: Number(tempSalArr[i].salaryFrom),
          end: Number(tempSalArr[i].salaryTo),
        };
        salaryArr.push(itemToPush);
        // } else {
        //   alert("Please input salary type correctly!");
        //   break;
        // }
      }
    }
    //Data for work authorization
    for (let item of workAuthorizationOptions) {
      if (item.isSelected) {
        workAuth = item.name;
      }
    }
    //Data for drug test
    for (let item of drugTestOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          drugTest = "Yes";
        } else if (item.name === "No") {
          drugTest = "No";
        }
      }
    }
    //Data for bg check
    for (let item of bgCheckOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          bgCheck = "Yes";
        } else if (item.name === "No") {
          bgCheck = "No";
        }
      }
    }
    //Data for military veteran
    for (let item of militaryVeteranOptions) {
      if (item.isSelected) {
        if (item.name === "Yes") {
          militaryVet = "Yes";
        } else if (item.name === "No") {
          militaryVet = "No";
        }
      }
    }
    //Data for certification
    for (let item of selectedCertifications) {
      certArr.push(item.name);
    }
    //Data for past industry
    for (let item of selectedIndustries) {
      pastIndustryArr.push(item.industries);
    }
    //Data for past work
    for (let item of pastWorkOptions) {
      if (item.isSelected) {
        pastWork = item.name;
        break;
      }
    }
    //Data for no show
    for (let item of noShowsOptions) {
      if (item.isSelected) {
        noShow = item.name;
        break;
      }
    }
    //Data for social media
    for (let item of socialMediaList) {
      if (item.isSelected) {
        socialMedia.push(item.name);
      }
    }
    //Data for ref
    for (let item of referencesOptions) {
      if (item.isSelected) {
        ref = item.name;
        break;
      }
    }
    //Data for languages
    for (let item of selectedLanguages) {
      langArr.push(item.name);
    }

    if (
      titlesArr.length > 0 ||
      jobType.length > 0 ||
      hoursAvailable.length > 0 ||
      workValue.length > 0 ||
      expYears.length > 0 ||
      skillsArr.length > 0 ||
      certArr.length > 0 ||
      education.length > 0 ||
      tempAvailArr.length > 0 ||
      langArr.length > 0 ||
      salaryArr.length > 0 ||
      workAuth !== null ||
      drugTest !== null ||
      bgCheck !== null ||
      militaryVet !== null ||
      range.length > 0 ||
      pastWork.length > 0 ||
      socialMedia.length > 0 ||
      noShow.length > 0 ||
      pastIndustryArr.length > 0 ||
      ref.length > 0
    ) {
      let request;
      if (isDealBreakerSelected) {
        request = {
          title: filTersList[1].dealBreaker ? titlesArr : [],
          job_type: filTersList[4].dealBreaker ? jobType : "",
          job_id: topJobId ? topJobId : "0",
          hours_available:
            filTersList[6].dealBreaker && hoursAvailable.length > 0
              ? hoursAvailable[0]
              : "",
          workRemotely:
            filTersList[7].dealBreaker && workValue.length > 0
              ? workValue === "1"
                ? "Yes"
                : "No"
              : "",
          experience:
            filTersList[12].dealBreaker && expYears.length > 0 ? expYears : "",
          skills: filTersList[13].dealBreaker ? skillsArr : [],
          certification: filTersList[14].dealBreaker ? certArr : [],
          school: filTersList[11].dealBreaker ? education : [],
          availability: filTersList[5].dealBreaker ? tempAvailArr : [],
          salary: filTersList[3].dealBreaker ? salaryArr : [],
          workAuthorization: filTersList[19].dealBreaker ? workAuth : null,
          drug_test: filTersList[23].dealBreaker ? drugTest : null,
          background_check: filTersList[22].dealBreaker ? bgCheck : null,
          military_veteran: filTersList[20].dealBreaker ? militaryVet : null,
          range:
            filTersList[9].dealBreaker && range.length > 0
              ? range[0].toString()
              : "",
          Pastwork: filTersList[16].dealBreaker ? pastWork : "", //String
          Socialmedia: filTersList[17].dealBreaker ? socialMedia : [], //String
          Noshows: filTersList[21].dealBreaker ? noShow : "", //String
          Pastindustry: filTersList[2].dealBreaker ? pastIndustryArr : [],
          References: filTersList[18].dealBreaker ? ref : "",
          // languages: filTersList[24].dealBreaker ? langArr : [],
        };
      } else {
        request = {
          title: titlesArr,
          job_id: topJobId ? topJobId : "0",
          job_type: jobType,
          hours_available: hoursAvailable.length > 0 ? hoursAvailable[0] : "",
          workRemotely:
            workValue.length > 0 ? (workValue === "1" ? "Yes" : "No") : "",
          experience: expYears.length > 0 ? expYears : "",
          skills: skillsArr,
          certification: certArr,
          school: education,
          availability: tempAvailArr,
          salary: salaryArr,
          workAuthorization: workAuth,
          drug_test: drugTest,
          background_check: bgCheck,
          military_veteran: militaryVet,
          range: range.length > 0 ? range[0].toString() : "",
          Pastwork: pastWork, //String
          Socialmedia: socialMedia, //String
          Noshows: noShow, //String
          Pastindustry: pastIndustryArr,
          References: ref,
          // languages: langArr,
        };
      }
      setLocalFilterReq(JSON.stringify(request));
      dispatch(filterSeekersAction(request));
    } else if (isOpenToAllApplied) {
      let request = {
        title: "",
        job_id: topJobId ? topJobId : "0",
        job_type: "",
        hours_available: "",
        workRemotely: "",
        experience: "",
        skills: [],
        certification: [],
        school: "",
        availability: [],
        salary: [],
        workAuthorization: "",
        drug_test: "",
        background_check: "",
        military_veteran: "",
        range: "",
        Pastwork: "", //String
        Socialmedia: "", //String
        Noshows: "", //String
        Pastindustry: [],
        References: "",
      };
      setLocalFilterReq(JSON.stringify(request));
      dispatch(filterSeekersAction(request));
    } else {
      // alert('Please select atleast one filter!');
      onPressCancelFilterPopup();
    }
  };
  const setLocalFilterReq = async (req) => {
    await AsyncStorage.setItem("@localFilterReq", req);
  };
  const onPressDeclineJob = () => {
    if ((isFiltersApplied || isTopJobSelected) && filtersApiResult.length > 0) {
      jumpToIndex("other");
    } else if (employeesList && employeesList.length > 0) {
      jumpToIndex("other");
    }
  };

  const onPressLike = () => {
    if ((isFiltersApplied || isTopJobSelected) && filtersApiResult.length > 0) {
      handleLike();
    } else if (employeesList && employeesList.length > 0) {
      handleLike();
    }
    Analytics.logEvent("job_provider_likes_candidate", {
      id: 26,
      description: "job provider likes candidate",
    });
  };
  const sortJobsByDate = (array) => {
    let sortedAy = array.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sortedAy;
  };

  if (rendNoMoreCards) {
    setPagee(pagee + 1);
    dispatch(getEmployeesListAction(currentPage, topJobTitle, topJobId, pagee));
    setRenderNoMoreCards(false);
  }

  const screenIsFocus = useIsFocused();
  const [statusbar, setStatusbar] = useState("dark-content");
  useEffect(() => {
    if (screenIsFocus) {
      setStatusbar("dark-content");
    } else {
      setStatusbar("light-content");
    }
  }, [screenIsFocus]);
  const switchJob = (item, allPostedJobs) => {
    setSelectedJob(item, allPostedJobs);
    setDisplayJobsList(false);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFF" />
      <View style={{ flex: 1, opacity: 1, backgroundColor: colors.bg }}>
        <HomeHeader
          activeAVDA={isHomeScreen}
          onToggleSwitch={onToggleSwitch}
          onPressBackIcon={() => {
            if (!isBackPressed) {
              jumpToBackIndex();
            }
          }}
          onPressFilterIcon={() =>
            navigation.navigate("EmployerFilter", { jobId: topJobId })
          }
          leadingComponent={
            <TouchableOpacity
              onPress={() => setDisplayJobsList(!displayJobsList)}
            >
              {displayJobsList ? (
                <Image
                  source={images.addJobOpen}
                  style={{ width: 30, height: 30 }}
                />
              ) : (
                <Image
                  source={images.addJob}
                  style={{ width: 30, height: 30 }}
                />
              )}
            </TouchableOpacity>
          }
        />
        {!isConnected ? (
          <NoInternet />
        ) : (
          <>
            {/*Job Post List*/}
            {displayJobsList ? (
              <View paddingBottom={15} style={styles.postedJobModel}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={false}
                  style={{ marginHorizontal: 10 }}
                  data={allPostedJobs}
                  keyExtractor={(item, index) => "" + index}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ marginTop: 5 }}>
                        {index !== 0 ? (
                          <View>
                            <TouchableOpacity
                              onPress={() => switchJob(item, allPostedJobs)}
                            >
                              <View
                                style={[
                                  styles.postedJobList,
                                  {
                                    backgroundColor: item?.isSelected
                                      ? colors.bg
                                      : "white",
                                  },
                                ]}
                              >
                                <Text style={styles.jobTitleTxt}>
                                  {item?.title}
                                </Text>
                                {item.isSelected && (
                                  <Image
                                    source={require("../../../../assets/images/ImageSelect.png")}
                                    style={{ width: 12, height: 14 }}
                                  />
                                )}
                              </View>
                            </TouchableOpacity>
                            {item.isSelected && (
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    setDisplayJobsList(false);
                                    navigation.navigate("EditJobStepOne", {
                                      jobItemToEdit: item,
                                    });
                                  }}
                                  style={styles.editJobTitle}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      color: colors.or,
                                    }}
                                  >
                                    Edit job
                                  </Text>
                                </TouchableOpacity>
                                <AVDivider />
                              </View>
                            )}
                          </View>
                        ) : null}
                      </View>
                    );
                  }}
                />

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PostJobSteps", {
                      prevScreen: "CompanyProfile",
                    })
                  }
                >
                  <View
                    paddingRight={5}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 12,
                    }}
                  >
                    <View style={{}}>
                      <Image
                        source={require("../../../../assets/images/Vector.png")}
                        style={{
                          width: 16,
                          height: 13,
                          marginTop: 8,
                          marginRight: 4,
                        }}
                      />
                    </View>
                    <Text style={styles.addJobTxt}>Add a new job</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}

            {rendNoMoreCards ? (
              <NoResults
                title={"That's Everyone!"}
                subtitle={
                  "You've seen all the people nearby. Change your\n filters or check later."
                }
                buttonText={"Change my filters"}
                onPress={() => {
                  navigation.navigate("EmployerFilter", { jobId: topJobId });
                }}
              />
            ) : (
                isFiltersApplied || isTopJobSelected
                  ? filtersApiResult.length === 0
                  : jobsList.length === 0
              ) ? (
              <>
                {filterSeekersLoading ? (
                  <View
                    flex={1}
                    backgroundColor={colors.bg}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text style={{ textAlign: "center", marginTop: 15 }}>
                      Please wait… Profiles as per applied{"\n"} filters are
                      loading
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EmployerFilter", {
                          jobId: topJobId,
                        })
                      }
                    >
                      <View
                        style={{
                          width: 150,
                          height: 40,
                          borderRadius: 30,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: colors.grey,
                          marginTop: 20,
                        }}
                      >
                        <Text style={{ fontWeight: "bold" }}>
                          Change my filters
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <NoResults
                    title={"That's Everyone"}
                    subtitle={
                      "You've seen all the people nearby. Change your\n filters or check later. "
                    }
                    buttonText={"Change my filters"}
                    onPress={() =>
                      navigation.navigate("EmployerFilter", {
                        jobId: topJobId,
                      })
                    }
                  />
                )}
              </>
            ) : (
              <FlatList
                ref={flatListRef}
                // style={{ marginHorizontal: 10 }}
                data={
                  isFiltersApplied || isTopJobSelected
                    ? filtersApiResult
                    : employeesList
                }
                extraData={currentIndex || currentFilteredIndex}
                // horizontal
                keyExtractor={(item, index) => "" + index}
                ItemSeparatorComponent={() => {
                  return <View style={styles.itemSeperator}></View>;
                }}
                renderItem={({ item, index }) => {
                  let indexToMatch =
                    isFiltersApplied || isTopJobSelected
                      ? currentFilteredIndex
                      : currentIndex;
                  let socialLink = {};
                  if (item.UserSocialMedia && item.UserSocialMedia[0]) {
                    let UserSocialMedia = Array.isArray(
                      item.UserSocialMedia[0].socialMedia
                    )
                      ? item.UserSocialMedia[0].socialMedia
                      : [];
                    UserSocialMedia.map((item) => {
                      socialLink[item.name] = item.url;
                    });
                  }
                  var timeC = moment(item.last_seen).format("hh:mm:ss A");
                  var dateC = moment(item.last_seen).format("MM/DD/YYYY");
                  return indexToMatch === index ? (
                    <View>
                      {item.noShowCount > 0 && (
                        <View
                          style={{
                            backgroundColor: "#ffffff20",
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            top: 14,
                            right: 15,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 12,
                          }}
                        >
                          <Image
                            source={images.noSHow}
                            resizeMode="contain"
                            alignSelf="center"
                            style={{ height: 7, width: 7, marginRight: 4 }}
                          />
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 9,
                              color: colors.white,
                              textAlign: "center",
                              fontWeight:
                                Platform.OS == "android" ? "bold" : "600",
                            }}
                          >
                            {`No show (${item.noShowCount})`}
                          </Text>
                        </View>
                      )}

                      {/*Employer Details*/}
                      <View style={styles.mainContainer}>
                        <UserProfileCard item={item} />

                        <View marginTop={HP("2")}>
                          {/*BIO*/}
                          {item?.Profile && item?.Profile.bio ? (
                            <View alignItems="center" paddingHorizontal={20}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "400",
                                  color: "#2A3246",
                                  lineHeight: 20,
                                }}
                              >
                                {item?.Profile?.bio}
                              </Text>
                            </View>
                          ) : (
                            <View></View>
                          )}

                          {/*JobType - Salary - Experience*/}
                          <View
                            width="100%"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            marginTop={20}
                          >
                            <AboutUserTag
                              source={briefcaseSvg}
                              value={
                                jobTypeText[
                                  item?.AdditionalWorkInformation?.jobType
                                ] || ""
                              }
                            />
                            <AboutUserTag
                              source={moneyBagSvg}
                              value={
                                "$" +
                                convertNumberToMoneyFormat(
                                  item?.AdditionalWorkInformation?.startRange
                                ) +
                                " - $" +
                                convertNumberToMoneyFormat(
                                  item?.AdditionalWorkInformation?.endRange
                                )
                              }
                            />
                            <AboutUserTag
                              source={badgeSvg}
                              value={
                                item.experience > 0
                                  ? `${item.experience} ${
                                      item.experience === 1 ? "Yr" : "Yrs"
                                    } Exp`
                                  : "Fresher"
                              }
                            />
                          </View>

                          {/*View Past Work*/}
                          <View paddingHorizontal={55} marginTop={30}>
                            <AVGradientButton
                              icon={false}
                              label={"View Past Work"}
                              onPress={() =>
                                onViewPastWork(
                                  item?.PastWorks,
                                  item?.PastWorkUrls
                                )
                              }
                            />
                          </View>

                          {/*Top-Skill-Carousel*/}
                          {item.JobSeekerSkills &&
                            item.JobSeekerSkills.length > 0 && (
                              <View
                                marginTop={30}
                                marginBottom={0}
                                alignItems="center"
                              >
                                {sectionTitle("My Skills", () =>
                                  navigation.navigate("EditSkillsSeeker")
                                )}
                              </View>
                            )}
                          {item.JobSeekerSkills &&
                          item.JobSeekerSkills.length > 0 ? (
                            <View
                              style={{
                                height: 210,
                                alignSelf: "center",
                                width: width - 20,
                                alignItems: "center",
                              }}
                            >
                              <CarouselNew
                                bounces={false}
                                style={{ flex: 1 }}
                                keyExtractor={(item, index) => index.toString()}
                                data={item.JobSeekerSkills.sort(
                                  (a, b) => a.position - b.position
                                )}
                                initialIndex={
                                  item.JobSeekerSkills.length > 1 ? 2 : 0
                                }
                                renderItem={({ item, index }) => {
                                  return item.name === "Filler" ? (
                                    <View height={150} width={110} />
                                  ) : (
                                    <AVCard
                                      key={index}
                                      alignItems="center"
                                      justifyContent="center"
                                      height={150}
                                      shadowColor={"#0000FF"}
                                      elevation={10}
                                    >
                                      <AVSkillsCard
                                        num={item.experience}
                                        yearFs={14}
                                        field={item?.name}
                                        cardHeight={80}
                                        fs={12}
                                      />
                                    </AVCard>
                                  );
                                }}
                                itemWidth={WP("33")}
                                // itemWidth={width - 290}
                                containerWidth={width}
                                separatorWidth={5}
                                inActiveOpacity={1}
                                ref={carouselRefNew}
                                inActiveScale={
                                  item.JobSeekerSkills.length > 3 ? 0.8 : 1
                                }
                              />
                            </View>
                          ) : null}

                          {item.Experiences && item.Experiences.length > 0 ? (
                            <View marginTop={20} marginBottom={15}>
                              {sectionTitle("Job Experience", () =>
                                navigation.navigate("EditJobExperience")
                              )}
                            </View>
                          ) : null}

                          {item.Experiences && item.Experiences.length > 0 ? (
                            <Carousel
                              pageWidth={WP("60")}
                              // paddingHorizontal={-20}
                              currentPage={currentExpCard}
                              onPageChange={(idx) => setCurrentExpCard(idx)}
                              swipeThreshold={0.1}
                            >
                              {item.Experiences.map((expItem, index) => {
                                return (
                                  <JobExperienceCard
                                    key={index}
                                    cardIndex={index}
                                    skillsArray={expItem.skills.split(",")}
                                    onEmailPress={openEmail}
                                    onPhonePress={openDialpad}
                                    onExpandPress={() => onExpandPress(expItem)}
                                    onMorePress={(index) =>
                                      setShowMoreSkills(
                                        showMoreSkills === index ? "" : index
                                      )
                                    }
                                    showMoreSkills={showMoreSkills}
                                    companyName={expItem.companyName}
                                    designation={expItem.jobTitle}
                                    companyInitials={
                                      expItem.companyName
                                        ? getCompanyInitials(
                                            expItem.companyName
                                          )
                                        : " "
                                    }
                                    description={expItem.description}
                                    location={
                                      expItem.city + "," + expItem.state
                                    }
                                    startDate={
                                      expItem.startDate
                                        ? moment(expItem.startDate).format(
                                            "MM"
                                          ) +
                                          "." +
                                          moment(expItem.startDate).format("YY")
                                        : "--"
                                    }
                                    endDate={
                                      expItem.endDate
                                        ? moment(expItem.endDate).format("MM") +
                                          "." +
                                          moment(expItem.endDate).format("YY")
                                        : "Current"
                                    }
                                    jobRefs={expItem.JobReferences || {}}
                                    industry={expItem.industry}
                                  />
                                );
                              })}
                            </Carousel>
                          ) : null}
                        </View>

                        {/*Education-Language-Certification*/}
                        {!item.Certifications &&
                        item.Certifications.length !== 0 &&
                        !item.Education &&
                        item.Education.length !== 0 ? null : (
                          <AVCard marginTop={30} padding={20} borderRadius={20}>
                            {/*Education*/}
                            <View
                              backgroundColor={"#F3F6FF"}
                              padding={
                                item.Education && item.Education.length > 0
                                  ? 20
                                  : 0
                              }
                              borderRadius={14}
                            >
                              {item.Education && item.Education.length > 0
                                ? sectionTitle("Education", () =>
                                    navigation.navigate("EditEducationSeeker")
                                  )
                                : null}
                              {item.Education && item.Education.length > 0 ? (
                                <Timeline
                                  data={item.Education}
                                  innerCircle={"dot"}
                                  dotColor={colors.accentDark}
                                  dotSize={8}
                                  circleSize={14}
                                  circleColor={"#DBE1FB"}
                                  lineColor={colors.accentDark}
                                  lineWidth={5}
                                  showTime={false}
                                  circleStyle={{
                                    marginTop:
                                      Platform.OS === "android" ? 3 : 2,
                                  }}
                                  renderDetail={(item, index) => (
                                    <View>
                                      <Text
                                        style={{
                                          color: colors.primary,
                                          fontSize: 16,
                                          fontWeight: "700",
                                        }}
                                      >
                                        {item.school}
                                      </Text>
                                      <Text
                                        style={{
                                          color: "#8692AC",
                                          fontWeight: "500",
                                          fontSize: 12,
                                          marginTop: 5,
                                        }}
                                      >
                                        {item.degree}
                                      </Text>
                                    </View>
                                  )}
                                  eventContainerStyle={{ marginVertical: 20 }}
                                  detailContainerStyle={{ marginTop: -32 }}
                                  listViewStyle={{
                                    marginTop: 20,
                                  }}
                                />
                              ) : null}
                            </View>

                            {item.Profile?.nativeLanguage ? (
                              <View marginTop={20}>
                                {sectionTitle("Languages")}
                              </View>
                            ) : null}

                            {item?.Profile?.nativeLanguage ? (
                              <View
                                key={index}
                                backgroundColor={"#F3F6FF"}
                                padding={15}
                                borderRadius={14}
                                marginTop={16}
                              >
                                <View
                                  flexDirection="row"
                                  flexWrap="wrap"
                                  style={{ justifyContent: "space-around" }}
                                >
                                  {item?.Profile?.nativeLanguage
                                    .split(",")
                                    .map((language, index) => {
                                      return (
                                        <View
                                          key={index}
                                          flexDirection="row"
                                          alignItems="center"
                                          width="40%"
                                          marginVertical={6}
                                        >
                                          <View marginRight={10}>
                                            <SvgUri
                                              uri={
                                                svgUris[language] ||
                                                svgUris["English"]
                                              }
                                              width="20"
                                            />
                                          </View>

                                          <Text
                                            style={{
                                              fontSize: 12,
                                              color: colors.primary,
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {language}
                                          </Text>
                                        </View>
                                      );
                                    })}
                                  {item?.Profile?.nativeLanguage.split(",")
                                    .length %
                                    2 !=
                                    0 && (
                                    <View width="40%" marginVertical={6} />
                                  )}
                                </View>
                              </View>
                            ) : null}

                            {item.Certifications &&
                            item.Certifications.length > 0 ? (
                              <View marginTop={20}>
                                {sectionTitle("Certifications & Licenses", () =>
                                  navigation.navigate(
                                    "EditCertificationsLicenses"
                                  )
                                )}
                              </View>
                            ) : null}

                            {item.Certifications &&
                            item.Certifications.length > 0
                              ? item.Certifications.map((certItem, index) => {
                                  return (
                                    <View
                                      key={index}
                                      backgroundColor={"#F3F6FF"}
                                      padding={20}
                                      borderRadius={14}
                                      marginTop={16}
                                    >
                                      <TouchableOpacity
                                        onPress={() =>
                                          navigation.navigate("WebViewScreen", {
                                            url: {
                                              docType:
                                                certItem.docType || "image",
                                              docImage: certItem.fileUrl,
                                            },
                                            showScreen: "Past",
                                          })
                                        }
                                      >
                                        <View
                                          alignItems="center"
                                          justifyContent="center"
                                          borderRadius={8}
                                          style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                          }}
                                        >
                                          <View style={{ width: "90%" }}>
                                            <Text
                                              style={{
                                                fontSize: 16,
                                                fontWeight: "700",
                                                color: colors.primary,
                                              }}
                                              numberOfLines={2}
                                            >
                                              {certItem.name}
                                            </Text>
                                          </View>
                                          <Image
                                            source={require("../../../../assets/images/eye.png")}
                                            style={{ width: 21, height: 16 }}
                                          />
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  );
                                })
                              : null}
                          </AVCard>
                        )}

                        {/*SocialMedia*/}
                        <View marginTop={30}>
                          {sectionTitle("Social Media", () => {})}
                        </View>

                        <View
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          paddingHorizontal={40}
                          marginTop={19}
                        >
                          <AVSocialIcon
                            height={60}
                            width={60}
                            // deleteIcon={socialLink.facebook ? true : false}
                            iconName={"fa/facebook"}
                            name={"Facebook"}
                            onPress={() =>
                              socialLink.facebook
                                ? Linking.openURL(
                                    socialLink.facebook.includes("http")
                                      ? socialLink.facebook
                                      : "http://" + socialLink.facebook
                                  )
                                : null
                            }
                            bgClr={
                              socialLink.facebook
                                ? colors.facebookBg
                                : colors.disabledColor
                            }
                            onClosePress={() => handleSocialIcon("facebook")}
                            instaLG={true}
                            instaActive={
                              socialLink.facebook
                                ? require("../../../../assets/images/ic-facebook.png")
                                : require("../../../../assets/images/ic-facebook-unfilled.png")
                            }
                          />
                          <AVSocialIcon
                            height={60}
                            width={60}
                            instaLG={true}
                            // deleteIcon={socialLink.instagram ? true : false}
                            bgClr={
                              socialLink.instagram
                                ? "#8a3ab9"
                                : colors.disabledColor
                            }
                            iconName={"fa/instagram"}
                            name={"Instagram"}
                            onPress={() =>
                              socialLink.instagram
                                ? Linking.openURL(
                                    socialLink.instagram.includes("http")
                                      ? socialLink.instagram
                                      : "http://" + socialLink.instagram
                                  )
                                : null
                            }
                            onClosePress={() => handleSocialIcon("instagram")}
                            instaActive={
                              socialLink.instagram
                                ? require("../../../../assets/images/ic-instagram.png")
                                : require("../../../../assets/images/ic-instagram-unfilled.png")
                            }
                          />

                          <AVSocialIcon
                            height={60}
                            width={60}
                            // deleteIcon={socialLink.linkedin ? true : false}
                            bgClr={
                              socialLink.linkedin
                                ? colors.linkedinBg
                                : colors.disabledColor
                            }
                            iconName={"fa/linkedin"}
                            name={"LinkedIn"}
                            onPress={() =>
                              socialLink.linkedin
                                ? Linking.openURL(
                                    socialLink.linkedin.includes("http")
                                      ? socialLink.linkedin
                                      : "http://" + socialLink.linkedin
                                  )
                                : null
                            }
                            onClosePress={() => handleSocialIcon("linkedin")}
                            instaLG={true}
                            instaActive={
                              socialLink.linkedin
                                ? require("../../../../assets/images/ic-linkedin.png")
                                : require("../../../../assets/images/ic-linkedin-unfilled.png")
                            }
                          />
                          <AVSocialIcon
                            height={60}
                            width={60}
                            // deleteIcon={socialLink.twitter ? true : false}
                            bgClr={
                              socialLink.twitter
                                ? colors.twitterBg
                                : colors.disabledColor
                            }
                            iconName={"fa/twitter"}
                            name={"Twitter"}
                            onPress={() =>
                              socialLink.twitter
                                ? Linking.openURL(
                                    socialLink.twitter.includes("http")
                                      ? socialLink.twitter
                                      : "http://" + socialLink.twitter
                                  )
                                : null
                            }
                            onClosePress={() => handleSocialIcon("twitter")}
                            instaActive={
                              socialLink.twitter
                                ? require("../../../../assets/images/ic-twitter.png")
                                : require("../../../../assets/images/ic-twitter-unfilled.png")
                            }
                            onPress={() =>
                              socialLink.twitter
                                ? Linking.openURL(
                                    socialLink.twitter.includes("http")
                                      ? socialLink.twitter
                                      : "http://" + socialLink.twitter
                                  )
                                : null
                            }
                          />
                        </View>

                        {/*Schedule*/}
                        <View marginTop={30}>
                          {sectionTitle("Preferred Schedule", () => {})}
                        </View>
                        {item.AdditionalWorkInformation?.types_of_schedule &&
                        item.AdditionalWorkInformation?.types_of_schedule
                          .length > 0 ? (
                          <View marginTop={20} paddingHorizontal={25}>
                            {item.AdditionalWorkInformation?.types_of_schedule.map(
                              (item, index) => {
                                return seeMore ? (
                                  <CircleScheduleView
                                    item={item}
                                    index={index}
                                  />
                                ) : index <= 2 ? (
                                  <CircleScheduleView
                                    item={item}
                                    index={index}
                                  />
                                ) : null;
                              }
                            )}
                          </View>
                        ) : null}

                        <View
                          marginTop={30}
                          marginHorizontal={30}
                          flexDirection="row"
                          alignItems="center"
                          paddingBottom={50}
                        >
                          <View
                            style={{
                              height: 1,
                              flex: 1,
                              backgroundColor: colors.inputBorder,
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => setSeeMore(!seeMore)}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              flex: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: colors.accentDark,
                                fontWeight: "bold",
                              }}
                            >
                              {seeMore ? "See Less" : "See More"}
                            </Text>
                            <AVIcon
                              icon={{
                                name: seeMore
                                  ? "fh/chevron-up"
                                  : "fh/chevron-down",
                                size: 20,
                                color: colors.accentDark,
                              }}
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              height: 1,
                              flex: 1,
                              backgroundColor: colors.inputBorder,
                            }}
                          />
                        </View>
                      </View>
                      {/*</LinearGradient>*/}
                    </View>
                  ) : null;
                }}
              />
            )}

            {rendNoMoreCards ? null : (
              <LikeDislikeFrame
                isApplied={isApplied}
                handleLike={() => onPressLike()}
                handleDisLike={() => handleDisLike()}
              />
            )}
          </>
        )}
      </View>

      {/*----------- Past Work Details --------- */}
      <RadiantBlurModal isShow={isPastWorkDetailsModalShow}>
        <ViewPastWork
          pastWork={pastWorksData}
          pastWorkUrls={pastWorkUrlsData}
          navigation={navigation}
          onCancel={() =>
            setIsPastWorkDetailsModalShow(!isPastWorkDetailsModalShow)
          }
        />
      </RadiantBlurModal>

      {/*----------- Company Details --------- */}
      <RadiantBlurModal isShow={isCompanyDetailsModalShow}>
        <CompanyDetail
          companyName={companyData?.companyName}
          designation={companyData?.jobTitle}
          description={companyData?.description}
          location={companyData?.city + "," + companyData?.state}
          startDate={
            companyData.startDate
              ? moment(companyData.startDate).format("MM") +
                "." +
                moment(companyData.startDate).format("YY")
              : "--"
          }
          endDate={
            companyData.endDate
              ? moment(companyData.endDate).format("MM") +
                "." +
                moment(companyData.endDate).format("YY")
              : "Current"
          }
          jobRefs={companyData?.JobReferences || []}
          industry={companyData?.industry}
          skillsArray={companyData?.skills?.split(",")}
          onEmailPress={openEmail}
          onPhonePress={openDialpad}
          onCancel={() =>
            setIsCompanyDetailsModalShow(!isCompanyDetailsModalShow)
          }
        />
      </RadiantBlurModal>

      {isLoading ||
      fetchingEmployeesList ||
      isFetchingAllPostedJobs ||
      filterSeekersLoading ? (
        <View style={styles.indicMainView}>
          <ActivityIndicator size="large" color="#D3D3D3" />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    marginTop: Platform.OS == "android" ? 16 : 14,
  },
  keyBoardAware: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  schTypeTxt: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "bold",
  },
  socialMedTxt: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
  },
  socMedDone: {
    color: colors.accentDark,
    fontWeight: "bold",
  },

  itemSeperator: {
    width: width,
    height: 0.5,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
  },

  postedJobModel: {
    position: "absolute",
    top: 80,
    zIndex: 1,
    backgroundColor: "white",
    width: WP(55),
    marginLeft: 20,
    borderRadius: 10,
    elevation: 20,
    shadowColor: "rgba(58, 121, 244, 0.15)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 3,
    shadowRadius: 10,
  },
  addJobTxt: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 16,
    color: colors.accent,
    marginTop: 10,
  },
  postedJobList: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 5,
    alignItems: "center",
    // marginTop: 8
  },
  jobTitleTxt: {
    fontWeight: "400",
    fontSize: 13,
    color: colors.primary,
  },
  editJobTitle: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.accent,
    padding: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
  },
  content: {
    // flex: 1,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  card: {
    width: width,
    height: height,
    backgroundColor: "transparent",
    borderRadius: 5,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    // marginTop:150,
    paddingBottom: width / 3,
  },
  label: {
    lineHeight: 400,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  red: {
    width: 75,
    height: 75,
    backgroundColor: "#fff",
    borderRadius: 75,
    borderWidth: 6,
    borderColor: "#fd267d",
  },
  indicMainView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
