let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * Triggers when a user gets a new message
 */

exports.sendMess = functions.database.ref('/notifications/messages/{pushId}')
    .onWrite(event => {
        const message = event.data.current.val();
        const senderUid = message.from;
        const receiverUid = message.to;
        const promises = [];

        if (senderUid == receiverUid) {
            //if sender is receiver, don't send notification
            promises.push(event.data.current.ref.remove());
            return Promise.all(promises);
        }

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getSenderUidPromise]).then(results => {
            const instanceId = results[0].val();
            const sender = results[1];
            console.log('notifying ' + receiverUid + ' about ' + message.body + ' from ' + senderUid);

            const payload = {
                notification: {
                    title: "New message from: " + sender.displayName,
                    body: message.body,
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

        });
    });

/**
 * Triggers when a user gets a new follower
 */
exports.sendFollower = functions.database.ref('/notifications/followers/{pushId}')
    .onWrite(event => {

        const message = event.data.current.val();
        const senderUid = message.from;
        const receiverUid = message.to;
        const promises = [];

        if (senderUid == receiverUid) {
            //if sender is receiver, don't send notification
            promises.push(event.data.current.ref.remove());
            return Promise.all(promises);
        }

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getSenderUidPromise]).then(results => {
            const instanceId = results[0].val();
            const sender = results[1];
            console.log('notifying ' + receiverUid + ' about ' + message.body + ' from ' + senderUid);

            const payload = {
                notification: {
                    title: "You have a new follower!",
                    body: sender.displayName + " is following you"
                },
                data: {
                    type: "2", // 3 mean follower notification
                    dataID: message.body,
                    body: "User" + sender.displayName + " is following yous."
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

        });
    });

/**
 * Triggers when a user send request to a post
 */
exports.sendPostRequest = functions.database.ref('/notifications/requesting/{pushId}')
    .onWrite(event => {

        const message = event.data.current.val(); // 
        const senderUid = message.from;
        const receiverUid = message.to;
        const promises = [];

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getSenderUidPromise]).then(results => {

            const instanceId = results[0].val();
            const sender = results[1];
            console.log('notifying ' + receiverUid + ' about ' + message.body + ' from ' + senderUid);

            const payload = {
                notification: {

                    title: "Your post got new request",
                    body: sender.displayName + " send you a request",
                },
                data: {
                    type: "3", // 3 mean request notification
                    dataID: message.body,
                    body: "Your post got new request from" + sender.displayName
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {

                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

        });
    });
/**
 * Triggers when user who being followed post new post.
 */
exports.sendNewPost = functions.database.ref('/notifications/newPost/{pushId}')
    .onWrite(event => {

        const message = event.data.current.val(); // 
        const senderUid = message.from;
        const receiverUid = message.to;
        const promises = [];

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getSenderUidPromise]).then(results => {

            const instanceId = results[0].val();
            const sender = results[1];
            console.log('notifying ' + receiverUid + ' about ' + message.body + ' from ' + senderUid);

            const payload = {
                notification: {
                    title: sender.displayName + " have a new post.",
                    body: "The user that you are following have new post. Click to view this post.",
                },
                data: {

                    type: "4",
                    dataID: message.body,
                    body: "User" + sender.displayName + " have new post."
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });
        });
    });

/**
 * Triggers when user go granted post notification
 */
exports.sendGranted = functions.database.ref('/notifications/granted/{pushId}')
    .onWrite(event => {

        const message = event.data.current.val(); // 
        const senderUid = message.from;
        const receiverUid = message.to;
        const promises = [];

        const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getSenderUidPromise = admin.auth().getUser(senderUid);

        return Promise.all([getInstanceIdPromise, getSenderUidPromise]).then(results => {

            const instanceId = results[0].val();
            const sender = results[1];
            console.log('notifying ' + receiverUid + ' about ' + message.body + ' from ' + senderUid);

            const payload = {
                notification: {

                    title: sender.displayName + " granted you",
                    body: "The post that you sent request had been granted to you. Click to view this post.",
                },
                data: {
                    type: "5", // 4 mean granted post notification
                    dataID: message.body,
                    body: "User" + sender.displayName + " granted you at post " + message.body
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

        });
    });

// Cut off time. Child nodes older than this will be deleted.
const CUT_OFF_TIME = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds.

/**
 * This database triggered function will check for child nodes that are older than the
 * cut-off time. Each child needs to have a `timestamp` attribute.
 */
exports.deleteOldItems = functions.database.ref('/notifications/{categoryId}/{pushId}')
    .onWrite(event => {
      const ref = event.data.ref.parent; // reference to the items
      const now = Date.now();
      const cutoff = now - CUT_OFF_TIME;
      const oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
      return oldItemsQuery.once('value').then(snapshot => {
        // create a map with all children that need to be removed
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = null;
        });
        // execute all updates in one go and return the result to end the function
        return ref.update(updates);
      });
    });