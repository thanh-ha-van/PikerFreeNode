let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


/**
 * Triggers when a user gets a new message
 */

exports.sendMessNotification = functions.database.ref('/notifications/messages/{pushId}')
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

            // delete node after send the mess;
            var adaRef = admin.database().ref('/notifications/messages/{pushId}');
            adaRef.remove()
                .then(function () {
                    console.log("Remove succeeded.")
                })
                .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                });
        });
    });

/**
 * Triggers when a user gets a new follower
 */
exports.sendFollowerNotification = functions.database.ref('/notifications/followers/{pushId}')
    .onWrite(event => {
        const message = event.data.current.val();
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
                    title: "You have new follower!",
                    body: sender.displayName + " is following you",
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

            // delete node after send the mess;
            var adaRef = admin.database().ref('/notifications/followers/{pushId}');
            adaRef.remove()
                .then(function () {
                    console.log("Remove succeeded.")
                })
                .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                });
            adaRef = null;
            console.log("Just set the node to null")
        });
    });

/**
 * Triggers when a user send request to a post
 */
exports.sendPostRequestNotification = functions.database.ref('/notifications/requesting/{pushId}')
    .onWrite(event => {

        const post = event.data.current.val(); // 
        const senderUid = post.from;
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

            // delete node after send the mess;
            var adaRef = admin.database().ref('/notifications/requesting/{pushId}');
            adaRef.remove()
                .then(function () {
                    console.log("Remove succeeded.")
                })
                .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                });
            adaRef = null;
            console.log("Just set the node to null")
        });
    });
/**
 * Triggers when user who being followed post new post.
 */
exports.setNewPostNotification = functions.database.ref('/notifications/newPost/{pushId}')
    .onWrite(event => {

        const post = event.data.current.val(); // 
        const senderUid = post.re;
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
                    title: sender.displayName + " have a new post",
                    body: "The user that you are following have new post",
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

            // delete node after send the mess;
            var adaRef = admin.database().ref('/notifications/newPost/{pushId}');
            adaRef.remove()
                .then(function () {
                    console.log("Remove succeeded.")
                })
                .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                });
            adaRef = null;
            console.log("Just set the node to null")
        });
    });

/**
 * Triggers when user go granted post notification
 */
exports.setNewPostNotification = functions.database.ref('/notifications/granted/{pushId}')
    .onWrite(event => {

        const post = event.data.current.val(); // 
        const senderUid = post.re;
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
                    body: "The post that you sent request had been granted to you",
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });

            // delete node after send the mess;
            var adaRef = admin.database().ref('/notifications/granted/{pushId}');
            adaRef.remove()
                .then(function () {
                    console.log("Remove succeeded.")
                })
                .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                });
            adaRef = null;
            console.log("Just set the node to null")
        });
    });

