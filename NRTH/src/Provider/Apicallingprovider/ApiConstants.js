// export const ApiConstants = {
//     //----- Application Base Url ------//
//    const baseURL = 'https://trustme.host/app/webservice/',

//     //----- Application End Url ------//
//     LoginUrl: baseURL+'v1/employees'
// }
//--------------------------- Config Provider Start -----------------------
class baseURLProvider {
    baseURL = 'https://api.nrth.co.uk/';
    // baseURL = 'https://stage.trulinco.com:3012/';
    dayExcerciseId = '65b78ed401b49aa9207c0607' // client server 65b78ed401b49aa9207c0607 // company server 65546cc0ffd2467438396664
    //baseURL = 'http://192.168.1.15:3012/'
    LoginUrl = this.baseURL + 'customer/login';
    SignUpUrl = this.baseURL + 'create/customers';
    HomeLevelUrl = this.baseURL + 'get/getAllLevelWithExercisesType';
    LevelListUrl = this.baseURL + 'get/getAllActiveModel';
    ChallengeListUrl = this.baseURL + 'getLevelExerciseTypesWithDetailByLevelId';
    SendMagicLinkUrl = this.baseURL + 'customer/generateMagicLink';
    ForgotPsswordUrl = this.baseURL + 'customer/forgotCustomerPassword';
    UpdatePasswordUrl = this.baseURL + 'customer/updatePassword';
    VerifytokenUrl = this.baseURL + 'verifyMagicLink';
    AddExercisesUrl = this.baseURL + 'create/challenges';
    customersProfile = this.baseURL + 'update/customersProfile';

    GetExerciseListUrl = this.baseURL + 'challenges/getCreatedChallengeByCustomerId';
    CompleteStatusSendUrl = this.baseURL + 'challenges/setInProcessOfCustomerChallenges';
    DailyExerciseListUrl = this.baseURL + 'challenges/getTodayProcessOrRunningChallengeByCustomerId';
    DailyExerciseCardClickUrl = this.baseURL + 'challenges/startChallengeByChallengeId';
    StartChallengeUrl = this.baseURL + 'challenges/startTodayChallengeByChallengeId';

    SetTimeChallengeUrl = this.baseURL + 'challenges/setAlertTimeByChallengeId';
    RemoveTimeChallengeUrl = this.baseURL + 'challenges/removeAlertTimeByChallengeId';
    AddToGalleryUrl = this.baseURL + 'challenges/addToGallery';
    DeleteChallenge = this.baseURL + 'delete/challenges/';

    ClaimBadgeChallengeUrl = this.baseURL + 'userBadges/claimForBadge';
    SaveBadgeChallengeUrl = this.baseURL + 'userBadges/setCompleteUserBadge';
    GetVideoChallengeUrl = this.baseURL + 'customerDayWiseExercises/getVideoUrlsByChallengeId';

    GetProfileBadgeUrl = this.baseURL + 'challenges/getChalangeByCustomerAndExercise';
    GetTodayBadgeUrl = this.baseURL + 'challenges/getTodayCompletedChallenge';
    CheckUserStatus = this.baseURL + 'get/customersbyid/';

    GetBadgeDetailsUrl = this.baseURL + 'challenges/getTodayProcessOrRunningChallengeByChallengeId';
    GetPackageIsExpairedUrl = this.baseURL + 'assignPackages/getPackageIsExpier';
    SubscriptionPlanListUrl = this.baseURL + 'packages/getAllDisplayActiveModel';
    PaymentHistoryListUrl= this.baseURL + 'customer/getAssignPackageByCustomerId';
    AddToGalleryWithoutVideoUrl= this.baseURL + 'challenges/addToGalleryWithoutVideo';

    // Image Load Url
    ImageLoadBaseUrl = "https://stage.trulinco.com/fitness-api/"
    // ImageLoadBaseUrl = "https://stage.trulinco.com/nrth-fitness-api/"
}
export const appBaseUrl = new baseURLProvider();




