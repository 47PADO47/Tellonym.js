import { HeadersInit } from 'undici';

type ClassOptions = {
    token?: string;
    debug?: boolean;
};

interface ClassUser extends UserProfile {
    email: string,
    lang: string,
    mainLanguage: number,
    pageId: string,
    twitterUsername: null | string,
    instagramUsername: null | string,
    isEmailNotificationsEnabled: boolean,
    emailPollingType: number,
    createdAt: string,
    isSafetyCodeSet: boolean,
    twitterId: null | number,
    instagramId: null | number,
    theme: string,
    isSearchable: boolean,
    adfreeUntil: string,
    lastActiveAt: string,
    occupation: number,
    pushNotificationToken: null | string,
    isPushNotificationsEnabled: boolean,
    isPushNotificationsEnabledSystem: boolean,
    isPushNotificationsTellEnabled: boolean,
    isPushNotificationsAnswerEnabled: boolean,
    isPushNotificationsLikedEnabled: boolean,
    isPushNotificationsAnonymousSubscriptionEnabled: boolean,
    isPushNotificationsPublicSubscriptionEnabled: boolean,
    isPushNotificationsFriendCreatedPostEnabled: boolean,
    isPushNotificationsUserTaggedEnabled: boolean,
    isPushNotificationsMessageEnabled: boolean,
    phonePrefix: null | string,
    phoneNumber: null | string,
    isTellsOnlyFromRegistered: boolean,
    isAllowedToModerate: boolean,
    hasAllowedEmails: boolean,
    hasAllowedSearchByPhone: boolean,
    hasAllowedShowActivity: boolean,
    isUnder16: boolean,
    parentalEmail: null | string,
    safetyLevelSexHarass: number,
    safetyLevelInsult: number,
    safetyLevelSpam: number,
    hasPassword: boolean,
    isTwitterConnected: boolean,
    isPreciseBirthdate: boolean,
    gender: string,
    birthdate: null | string,
    hasAllowedFeaturing: boolean,
    hasAllowedShowAge: boolean,
    hasAllowedSearchByLocation: boolean,
    isVerificationRecommended: boolean,
    isSecureAccountRecommended: boolean,
    tgt: {},
    isAppleConnected: boolean,
    isGoogleConnected: boolean,
    isSnapchatConnected: boolean,
    availableBadges: number[],
    premiumUntil: string,
    isPremium: boolean,
    pointsKarma: number,
    purchaserId: string,
    adExpId: string,
    config: UserConfig,
    info: unknown,
};

type avatar = null | `${string}_${string}.jpg`;

type Headers = {
    "Content-Type": "application/json";
    "Accept": "application/json";
    "User-Agent": string;
    "tellonym-client": string;
    [key: string]: string;
}

type FetchOptions = {
    path?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: string;
    customHeaders?: HeadersInit;
    customHost?: string;
    json?: boolean;
}

type FetchResponse = {
    status: number;
    data: any;
}

type User = {
    type?: number;
    id: number;
    avatarFileName: avatar;
    statusEmoji: number;
    isVerified: boolean;
    username: string;
    displayName: string;
};

type UserLink = {
    id: number,
    status: number,
    type: number,
    link: string
}

type UserConfig = {
    hasFeedAds: boolean,
    shouldUploadContacts: boolean,
    resetContactsAt: string,
    hasResultAds: boolean,
    hasTellsAds: boolean,
    isAvatarClickable: boolean
}

type UserAvatar = {
    avatarFileName: avatar,
    position: number
}

interface UserProfile extends User {
    aboutMe: string;
    location: string;
    anonymousFollowerCount: number;
    answerCount: number;
    answers: Answer[] | tellAd[];
    avatars: UserAvatar[];
    badge: number;
    followerCount: number;
    followingCount: number;
    followNotificationType: number;
    isAbleToChat: boolean;
    likesCount: number;
    linkData: UserLink[];
    pinnedPosts: Answer[];
    tellCount: number;
    tintColor: number;
};

interface Profile extends UserProfile {
    countryCode: string;
    isActive: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
    isFollowed: boolean;
    isFollowedBy: boolean;
};

interface suggestedPerson extends User {
    userId: number,
    aboutMe: string,
    isActive: boolean,
    isFollowed: boolean,
    isFromContactBook: boolean,
    isFollowing: boolean
}

type sender = {} | {
    id: number,
    username: string,
    avatarFileName: avatar,
    isVerified: boolean
};

type likes = {
    count: number,
    isLiked: boolean,
    isLikedBySender: boolean,
    previewUsers: unknown[]
}

interface tellUser extends User {
    isFollowed: boolean,
    isFollowedBy: boolean,
    isAbleToChat: boolean
}

type mediaUrl = `https://tms.tellonym.me/${string}/${string}.jpg`

type tellMedia = {
    isNSFW: boolean,
    thumbSmallUrl: `${mediaUrl}:thumb-small`,
    thubUrl: `${mediaUrl}:thumb`,
    type: number,
    url: mediaUrl,
}

type baseTell = {
    id: number,
    type: number | string,
    createdAt: string,
    sender: sender,
    tell: string,
    senderStatus: string | number,
}

interface Answer extends baseTell {
    answer: string,
    isCurrentUserTellSender: boolean,
    isLiked: boolean,
    likes: likes,
    likesCount: number,
    pointsKarma: number,
    media: tellMedia[],
    userId: number,
};

interface feedElement extends baseTell {
    origin: string,
    answer: string,
    likesCount: number,
    likes: likes,
    isLiked: boolean,
    user: tellUser,
    isCurrentUserTellSender: boolean,
    media: tellMedia[],
    sortId: number | string,
};

interface tell extends baseTell {
    isFromTellonym: boolean,
    isFromCommunity: boolean,
    isWelcomeTell: boolean,
    isSeen: boolean,
    senderHint: number,
    isInappropriate: boolean,
    pointsKarma: number,
    sortId: number | string,
};

type tellAd = {
    adType: string,
    adId: string,
    adSizes: number[][],
    apsSlots: appSlot[],
    loadOffset: number,
    prebidAdId: string,
    shouldLoadLazily: boolean,
    shouldUseHoc: boolean,
    adPosition: number,
    hasUnlimited: boolean,
    id: string,
    type: "AD" | string,
    adExpId: string,
    targeting: {[key: string]: number},
    uid: string
}

type appSlot = {
    id: string,
    size: number[]
}

type chatResponse = {
    unreadCount: number,
    chats: Chat[]
}

interface sentTell extends baseTell {
    sortId: number | string;
    user: tellUser;
    tellId?: number,
    answer?: string,
    likesCount?: number,
    likes?: likes,
    isCurrentUserTellSender?: boolean,
    media?: tellMedia[],
}

interface suggestedContact extends User {
    userId: number,
    cbName: string,
    aboutMe: string,
    isFollowed: boolean,
    isActive: boolean,
    instagramLink?: string;
    twitterLink?: string;
}

interface searchHistoryUser extends User {
    visitedUserId: number;
    isActive: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
    isFollowing: boolean;
    instagramLink?: string;
    twitterLink?: string;
};

type checkUpdatesResponse = {
    newestFeedId: number,
    newestNotificationId: number | null,
    newestTellId: number | null,
    notificationsSortId: number | null,
    feedSortId: number,
    tellsSortId: number | null,
    newMatchItemsAmount: number,
    newLikedByItemsAmount: number,
    newestAnsweredSentTellId: number | null,
    unreadCount: number,
    newestMessageId: null | number,
};

interface ChatUser extends User {
    isAbleToChat: boolean;
    isActive: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
    isFollowedBy: boolean;
};

type Chat = {
    id: number,
    lastMessage: Message,
    partecipants: ChatUser[],
}

interface Message {
    chatId: number;
    content: string;
    id: number;
    isSeen: boolean;
    time: string;
    type: number;
    userId: number;
}

interface Follower extends User {
    isActive: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
    isFollowed: boolean;
    isFollowedBy: boolean;
    aboutMe: string;
}

type Emoji = {
    emoji: number;
    type: number;
    id: number;
    isOwned: boolean;
}

type answerMedia = {
    isNSFW: boolean,
    fileName: string,
    type?: number,
}

interface searchResultsUser extends User {
    isActive: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
    isFollowing: boolean;
}

type chanllengeEmoji = {
    emoji: number;
    current: number;
    goal: number;
    isAchieved: boolean;
}

type blockedUser = {
    aboutMe: string;
    avatarFileName: avatar;
    displayName: string;
    id: number;
    isVerified: boolean;
    username: string;
}

type blocklistElement = {
    createdAt: string;
    id: number;
    tel: string;
    type: number;
    tellId: number;
    user: blockedUser;
}

export {
    ClassOptions,
    ClassUser,
    Headers,
    FetchOptions,
    FetchResponse,
    avatar,
    suggestedPerson,
    feedElement,
    tell,
    tellAd,
    chatResponse,
    sentTell,
    suggestedContact,
    searchHistoryUser,
    checkUpdatesResponse,
    Profile,
    Answer,
    ChatUser,
    Message,
    Follower,
    Emoji,
    answerMedia,
    searchResultsUser,
    chanllengeEmoji,
    blocklistElement,
}