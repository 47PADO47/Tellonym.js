import { fetch, HeadersInit, RequestInit, Response } from 'undici'
import { parse, join } from 'path';
import { Answer, avatar, chatResponse, ChatUser, checkUpdatesResponse, ClassOptions, ClassUser, feedElement, FetchOptions, FetchResponse, Headers, Profile, searchHistoryUser, Message, sentTell, suggestedContact, suggestedPerson, tell, tellAd, Follower, Emoji, answerMedia, searchResultsUser, chanllengeEmoji, blocklistElement } from './types';

class Tellonym {
    #token: string;
    public authorized: boolean = false;

    public user?: ClassUser;
    public debug: boolean = false;

    #baseUrl: (host: string) => string;
    #headers: Headers;
    constructor({ token, debug = false }: ClassOptions = {}) {
        this.#token = token || "";
        this.authorized = false;

        this.user = undefined;
        this.debug = debug;

        this.#baseUrl = (host: string = 'api') => `https://${host}.tellonym.me/`;
        this.#headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.8`,
            "tellonym-client": "web:3.28.7"
        };
    }

    async login(token: string = this.#token) {
        if (this.authorized) return this.#error("Already logged in ❌");

        if (!token) return this.#error("Token not set ❌");

        this.#token = token;
        this.authorized = true;
        const data = await this.getAccountInfo();

        if (!data?.id || !data.username) {
            this.#token = "";
            this.authorized = false;
            return this.#error("Failed to login (no data, id or username) ❌");
        };

        this.#token = token;
        this.authorized = true;
        this.user = data;

        this.#log(`Successfully logged in as "${data.username}" ✅`);
        return this.user;
    }

    /**
     * Logs out from Tellonym
     * @returns {boolean} true if logged out, false if already logged out
     */
    logout(): boolean {
        if (!this.authorized) {
            this.#error("Already logged out ❌");
            return false;
        }

        this.authorized = false;
        this.#token = "";

        this.user = undefined;
        this.#log("Successfully logged out ✅");
        return !this.authorized;
    }

    async getAccountInfo() {
        const data: void | ClassUser = await this.#fetch({
            path: 'accounts/myself/',
        });
        if (!data) return this.#error("Failed to get account info ❌");
        return data;
    }

    async getPeopleSuggestions() {
        const data: void | {peopleSuggestions?: suggestedPerson[]} = await this.#fetch({
            path: 'suggestions/people/',
        });
        if (!data || !data.peopleSuggestions) return this.#error("Failed to get people suggestions ❌");
        return data.peopleSuggestions;
    };

    async getFriendsSuggestions() {
        const data: void | {friends?: unknown[]} = await this.#fetch({
            path: 'suggestions/friends/',
        });
        if (!data || !data.friends) return this.#error("Failed to get friends suggestions ❌");
        return data.friends;
    };

    async getAnnouncements() {
        const data: void | {announcements?: unknown[]} = await this.#fetch({
            path: 'announcements/',
        });
        if (!data || !data.announcements) return this.#error("Failed to get announcements ❌");
        return data.announcements;
    };

    async getNotifications() {
        const data: void | {notifications?: unknown[]} = await this.#fetch({
            path: 'notifications/',
        });
        if (!data || !data.notifications) return this.#error("Failed to get notifications ❌");
        return data.notifications;
    };

    async getFeedList() {
        const data: void | {feed?: feedElement[]} = await this.#fetch({
            path: 'feed/list/',
        });
        if (!data || !data.feed) return this.#error("Failed to get feed ❌");
        return data.feed;
    }

    async getTells(olderThanId?: number) {
        const data: void | {tells?: tell[] | tellAd[]} = await this.#fetch({
            path: `tells${olderThanId ? `/olderthanid/${olderThanId}?oldestId=${olderThanId}` : "/"}`,
        });
        if (!data || !data.tells) return this.#error("Failed to get tells ❌");
        return data.tells;
    };

    async getFeedFeatured() {
        const data: void | {feedFeatured?: feedElement[]} = await this.#fetch({
            path: 'feed/featured/',
        });
        if (!data || !data.feedFeatured) return this.#error("Failed to get feed ❌");
        return data.feedFeatured;
    };

    async getTrendingPosts() {
        const data = await this.#fetch({
            path: 'posts/trending/',
        });
        if (!data) return this.#error("Failed to get trending posts ❌");
        return data;
    };

    async getChats() {
        const data: void | chatResponse = await this.#fetch({
            path: 'chats/',
            customHost: 'chat-api',
        });
        if (!data || !data.chats) return this.#error("Failed to get chats ❌");
        return data.chats;
    };

    async getCommunityRecivedTells() {
        const data: void | {tells?: tell[] | tellAd[]} = await this.#fetch({
            path: 'communities/tells/received',
        });
        if (!data || !data.tells) return this.#error("Failed to get community recived tells ❌");
        return data.tells;
    }

    async getSentTells() {
        const data: void | {sentTells?: sentTell[]} = await this.#fetch({
            path: 'senttells',
        });
        if (!data || !data.sentTells) return this.#error("Failed to get community sent tells ❌");
        return data.sentTells;
    };

    async getContactsSuggestions() {
        const data: void | {contactsSuggestions?: suggestedContact[]} = await this.#fetch({
            path: 'suggestions/contacts/',
        });
        if (!data || !data.contactsSuggestions) return this.#error("Failed to get contacts suggestions ❌");
        return data.contactsSuggestions;
    };

    async getSearchHistory() {
        const data: void | {searchHistory?: searchHistoryUser[]} = await this.#fetch({
            path: 'search/history/',
        });
        if (!data || !data.searchHistory) return this.#error("Failed to get search history ❌");
        return data.searchHistory;
    };

    async checkUpdates() {
        const data: void | checkUpdatesResponse = await this.#fetch({
            path: 'check/updates/',
        });
        if (!data) return this.#error("Failed to check updates ❌");
        return data;
    };

    async resetPassword(email: string) {
        const response = await fetch(`${this.#baseUrl}/accounts/forgotpassword`, {
            method: 'POST',
            body: JSON.stringify({
                email,
            }),
        });
        if (!response.ok) return this.#error("Failed to reset password ❌");
        return true;
    };

    async destroyToken() {
        const response = await fetch(`${this.#baseUrl}/tokens/destroy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.#token}`,
            },
        });
        if (!response.ok) return this.#error("Failed to destroy token ❌");
        return this.logout();
    };
    
    async getAvatarURL(userAvatar: avatar | {
        id: number | string;
        hash: string;
    }) {
        return `${this.#baseUrl('userimg')}lg-v2/${typeof userAvatar === 'string' ? userAvatar : `${userAvatar?.id}_${userAvatar?.hash}`}`;
    };

    async getProfileByName(username: string) {
        const data: void | Profile = await this.#fetch({
            path: `profiles/name/${username}/`,
        });
        if (!data) return this.#error("Failed to get profile ❌");
        return data;
    }

    async getProfileByID(id: number | string) {
        const data: void | Profile = await this.#fetch({
            path: `profiles/id/${id}/`,
        });
        if (!data) return this.#error("Failed to get profile ❌");
        return data;
    }

    async getAnswers(userId: string | number, oldestMessageId: string | number) {
        const data: void | {answers?: Answer[]} = await this.#fetch({
            path: `answers/${userId}?oldestId=${oldestMessageId}/`,
        });
        if (!data || !data.answers) return this.#error("Failed to get answers ❌");
        return data.answers;
    }

    async getChatSuggestions() {
        const data: void | ChatUser[] = await this.#fetch({
            path: 'chat/suggestions',
            customHost: 'chat-api',
        });
        if (!data) return this.#error("Failed to get chat suggestions ❌");
        return data;
    };

    async sendMessage(userId: number, content: string) {
        const data: void | {data?: Message}= await this.#fetch({
            path: `chat/send`,
            customHost: 'chat-api',
            method: 'POST',
            body: JSON.stringify({
                userId,
                content,
                type: 1,
            }),
        });
        if (!data || !data.data) return this.#error("Failed to send message ❌");
        return data.data;
    }

    async readChat(chatId: number, time: Date) {
        const timeSeen = time.getTime();
        const response = await fetch(`${this.#baseUrl('chat-api')}/chat/seen`, {
            method: 'POST',
            body: JSON.stringify({
                chatId,
                timeSeen,
            }),
            headers: {
                'Authorization': `Bearer ${this.#token}`,
            },
        });
        if (!response.ok) return this.#error("Failed to read chat ❌");
        return true;
    }

    async getMessages(userId: number) {
        const data: void | {messages?: Message[]} = await this.#fetch({
            path: `chat/messages?userId=${userId}`,
            customHost: 'chat-api',
        });
        if (!data || !data.messages) return this.#error("Failed to get messages ❌");
        return data.messages;
    };

    async followUser(userId: number, isFollowingAnonymous: boolean = false) {
        const data = await this.#fetch({
            path: `followings/create`,
            method: 'POST',
            body: JSON.stringify({
                userId,
                isFollowingAnonymous,
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to follow user ❌");
        return data === '"ok"';
    };

    async unfollowUser(userId: number) {
        const data = await this.#fetch({
            path: `followings/destroy`,
            method: 'POST',
            body: JSON.stringify({
                userId,
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to unfollow user ❌");
        return data === '"ok"';
    };

    async getMyFollowers() {
        const data: void | {followers?: Follower[]} = await this.#fetch({
            path: `followers/list`,
        });
        if (!data || !data.followers) return this.#error("Failed to get followers ❌");
        return data.followers;
    }

    async getMyFollowings() {
        const data: void | {followings?: Follower[]} = await this.#fetch({
            path: `followings/list`,
        });
        if (!data || !data.followings) return this.#error("Failed to get following ❌");
        return data.followings;
    }

    async getFollowingsById(userId: string | number) {
        const data: void | {followings?: Follower[]} = await this.#fetch({
            path: `followings/id/${userId}`,
        });
        if (!data || !data.followings) return this.#error("Failed to get following ❌");
        return data.followings;
    };

    async getFollowersById(userId: string | number) {
        const data: void | {followers?: Follower[]} = await this.#fetch({
            path: `followers/id/${userId}`,
        });
        if (!data || !data.followers) return this.#error("Failed to get followers ❌");
        return data.followers;
    };

    async getFollowingsByName(username: string) {
        const data: void | {followings?: Follower[]} = await this.#fetch({
            path: `followings/name/${username}`,
        });
        if (!data || !data.followings) return this.#error("Failed to get following ❌");
        return data.followings;
    };

    async getFollowersByName(username: string) {
        const data: void | {followers?: Follower[]} = await this.#fetch({
            path: `followers/name/${username}`,
        });
        if (!data || !data.followers) return this.#error("Failed to get followers ❌");
        return data.followers;
    };

    async getFollowingCommunities(userId: string | number) {
        const data: void | {communities?: unknown[]} = await this.#fetch({
            path: `communities/followings?userId=${userId}`,
        });
        if (!data || !data.communities) return this.#error("Failed to get following communities ❌");
        return data.communities;
    };

    async setNotificationsForUser(userId: string | number, enabled: boolean) {
        const data = await this.#fetch({
            path: `followings/notifications`,
            method: 'POST',
            body: JSON.stringify({
                userId,
                notification: this.boolToInt(enabled),
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to set notifications ❌");
        return data === '"ok"';
    };

    async unlockStatusEmoji(emojiId: number) {
        const data = await this.#fetch({
            path: `accounts/statusemoji/unlock`,
            method: 'POST',
            body: JSON.stringify({
                id: emojiId,
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to unlock emoji ❌");
        return data === '"ok"';
    }

    async getMyEmojis() {
        const data: void | {emojis?: Emoji[]} = await this.#fetch({
            path: `accounts/statusemoji`,
        });
        if (!data || !data.emojis) return this.#error("Failed to get emojis ❌");
        return data.emojis;
    }

    async createPost(content: string) {
        const data: void | {post?: tell} = await this.#fetch({
            path: `posts/create`,
            method: 'POST',
            body: JSON.stringify({
                content,
            }),
        });
        if (!data || !data.post) return this.#error("Failed to create post ❌");
        return data.post;
    }

    async sendTell(userId: number, content: string, anonymous: boolean = true, postId?: number, delayInMinutes?: number) {
        const opts = {
            userId,
            tell: content,
            contentType: 'CUSTOM',
            senderStatus: anonymous ? 2 : 0,
        } as {[key: string]: string | number | boolean};

        if (postId) opts.referalId = postId;
        if (delayInMinutes) opts.delayInMinutes = delayInMinutes;

        await this.#fetch({
            path: `tells/create`,
            method: 'POST',
            body: JSON.stringify(opts),
            json: false,
        });
    }

    async answerTell(tellId: number, answer: string, media?: answerMedia, isCurrentUser: boolean = false) {
        const data: void | {answer: Answer} = await this.#fetch({
            path: `answers/create`,
            method: 'POST',
            body: JSON.stringify({
                tellId,
                answer,
                isCurrentUser,
            }),
        });
        if (!data || !data.answer) return this.#error("Failed to answer tell ❌");
        return data.answer;
    };

    async pinPost(postId: number) {
        await this.#fetch({
            path: `posts/id/${postId}/pin`,
            method: 'POST',
            body: JSON.stringify({
                postId,
            }),
            json: false,
        });
    }

    async deleteSenderStatus(answerId: number) {
        await this.#fetch({
            path: `answers/id/${answerId}/senderStatus`,
            method: 'DELETE',
            body: JSON.stringify({
                answerId,
            }),
            json: false,
        });
    }

    async deletePost(postId: number) {
        await this.#fetch({
            path: `posts/${postId}`,
            method: 'DELETE',
            body: JSON.stringify({
                postId,
            }),
            json: false,
        });
    }

    async likeAnswer(answerId: number) {
        const data = await this.#fetch({
            path: `likes/create`,
            method: 'POST',
            body: JSON.stringify({
                answerId,
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to like answer ❌");
        return data === '"ok"';
    }

    async unlikeAnswer(answerId: number) {
        const data = await this.#fetch({
            path: `likes/destroy`,
            method: 'POST',
            body: JSON.stringify({
                answerId,
            }),
            json: false,
        });
        if (!data) return this.#error("Failed to unlike answer ❌");
        return data === '"ok"';
    }

    async getFeedIds() {
        const data: void | {feed?: number[]} = await this.#fetch({
            path: `feed/ids`,
        });
        if (!data || !data.feed) return this.#error("Failed to get feed ids ❌");
        return data.feed;
    }

    async getNotificationsIds() {
        const data: void | {notifications?: number[]} = await this.#fetch({
            path: `notifications/ids`,
        });
        if (!data || !data.notifications) return this.#error("Failed to get notifications ids ❌");
        return data.notifications;
    };

    async getEmojisChallengesProgress() {
        const data: void | {achievableEmojis?: chanllengeEmoji[]} = await this.#fetch({
            path: `accounts/challenges/statusemoji`,
        });
        if (!data || !data.achievableEmojis) return this.#error("Failed to get emoji challenges ❌");
        return data.achievableEmojis;
    }

    async getBlocks() {
        const data: void | {blocks?: blocklistElement[]} = await this.#fetch({
            path: `blocks/list`,
        });
        if (!data || !data.blocks) return this.#error("Failed to get blocks ❌");
        return data.blocks;
    }

    async getExperiments() {
        const data: void | {active?: unknown} = await this.#fetch({
            path: `info/experiments`,
        });
        if (!data || !data.active) return this.#error("Failed to get experiments ❌");
        return data.active;
    };

    async getAccountBadwords() {
        const data: void | {badwords?: unknown[]} = await this.#fetch({
            path: `accounts/settings/badwords `,
        });
        if (!data || !data.badwords) return this.#error("Failed to get settings badwords ❌");
        return data.badwords;
    }

    async updateAccountBadwords(badwords: string[]) {
        await this.#fetch({
            path: `accounts/settings/badwords`,
            method: 'PUT',
            body: JSON.stringify({
                badwords,
            }),
            json: false,
        });
    }

    async blockUser(userId: number) {
        await this.#fetch({
            path: `blocks/create`,
            method: 'POST',
            body: JSON.stringify({
                profileId: userId,
            }),
            json: false,
        });
    };

    async unblockUser(userId: number) {
        await this.#fetch({
            path: `blocks/destroy`,
            method: 'POST',
            body: JSON.stringify({
                profileId: userId,
            }),
            json: false,
        });
    }

    async createReport(msgId: number, msgType: 'tell' | 'answer', reason: number) {
        const opts = {
            reason,
        } as {[key: string]: number};

        if (msgType === 'tell') opts['tellId'] = msgId;
        else opts['answerId'] = msgId;

        await this.#fetch({
            path: `reports/create`,
            method: 'POST',
            body: JSON.stringify(opts),
            json: false,
        });
    }

    async deleteReport(msgId: number, msgType: 'tell' | 'answer') {
        await this.#fetch({
            path: `reports/destroy`,
            method: 'POST',
            body: JSON.stringify({
                [msgType === 'tell' ? 'tellId' : 'answerId']: msgId,
            }),
            json: false,
        });
    }

    boolToInt(bool: boolean) {
        return bool ? 1 : 0;
    };

    /**
     * @private Fetch data from the server and the specified endpoint, then returns it
     * @param {string} path api path
     * @param {string} [method] http method
     * @param {string} [body] body to send
     * @param {object} [customHeaders] additional headers to send
     * @param {object} [customHost] custom host to concat to base url
     * @param {boolean} [json] if the data should be parsed to json
     * @returns {Promise<any>} the response
     */
    async #fetch<TResponse>({
        path = "/",
        method = "GET",
        body = "",
        customHeaders = {},
        customHost = "api",
        json = true,
    }: FetchOptions = {}): Promise<TResponse | void> {
        if (!this.authorized) return this.#error("Not logged in ❌");

        const headers: HeadersInit = Object.assign(this.#headers, { "Authorization": `Bearer ${this.#token}`, ...customHeaders });
        const options: RequestInit = {
            method: method.toUpperCase(),
            headers,
        };
        if (body && method !== "GET") options.body = body;

        const response: Response = await fetch(`${this.#baseUrl(customHost)}${path}`, options);

        const res = {
            status: response.status,
            data: json ? await response.json().catch(() => {
                return this.#error("Failed to parse JSON ❌")
            }) : await response.text().catch(() => {
                return this.#error("Failed to parse Text ❌")
            }),
        } as FetchResponse;

        if (res.data?.err) {
            const { err } = res.data;
            return this.#error(`An error happened: ${err.msg ?? "Unknown Error"} (${err.code ?? "??"}) ❌`);
        }

        if (res.status !== 200) return this.#error(`The server returned a status different from 200 (${res.status}) ❌`);

        return res.data;
    }

    async searchUsers(search: string) {
        const data: void | {results?: searchResultsUser[]} = await this.#fetch({
            path: `search/users?searchString=${search}&term=${search}`,
        });
        if (!data || !data.results) return this.#error("Failed to search users ❌");
        return data.results;
    }

    #error(msg: string) {
        this.#log(msg);
        return Promise.reject(msg);
    }

    /**
     * @private Logs whatever provided
     * @param  {any[]} args arguments to log
     * @returns {void} log in the console
     */
    #log(...args: any[]): void {
        if (this.debug) return console.log(`\x1b[35m[TELLONYM]\x1b[0m`, ...args);
    }
}

export default Tellonym;