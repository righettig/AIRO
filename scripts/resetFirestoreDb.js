const admin = require('firebase-admin');
const serviceAccount = require('../config/airo-44ca7-firebase-adminsdk-etd4u-7107dcb929.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const users = {
  'giacomo_free@airo.com': {
    password: 'q1w2e3',
    role: 'standard',
    profile: {
      uid: '', // To be set after creating the user
      accountType: 'free',
      creditCardDetails: null,
      email: 'giacomo_free@airo.com',
      firstName: '',
      lastName: '',
    },
  },
  'giacomo_pro@airo.com': {
    password: 'q1w2e3',
    role: 'standard',
    profile: {
      uid: '', // To be set after creating the user
      accountType: 'pro',
      creditCardDetails: '4012 8888 8888 1881',
      email: 'giacomo_pro@airo.com',
      firstName: '',
      lastName: '',
    },
  },
};

async function resetFirestore() {
  try {
    // Delete all existing users
    const listUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      const userRecords = result.users.map(userRecord => userRecord.uid);
      if (userRecords.length > 0) {
        await admin.auth().deleteUsers(userRecords);
        console.log(`Deleted ${userRecords.length} users.`);
      }
      if (result.pageToken) {
        return listUsers(result.pageToken);
      }
    };
    await listUsers();

    // Delete all documents from userRoles and profiles
    const userRolesRef = db.collection('userRoles');
    const profilesRef = db.collection('profiles');

    const userRolesSnapshot = await userRolesRef.get();
    userRolesSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    const profilesSnapshot = await profilesRef.get();
    profilesSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    // Create specified users
    for (const [email, userData] of Object.entries(users)) {
      // Create a user with a specified password and add to Firestore
      const userRecord = await admin.auth().createUser({
        email,
        password: userData.password,
      });
      const uid = userRecord.uid;

      // Update the user data in Firestore
      users[email].profile.uid = uid;
      await db.collection('userRoles').doc(email).set({ role: userData.role });
      await db.collection('profiles').doc(uid).set(userData.profile);
    }

    console.log('Firestore has been reset successfully.');

  } catch (error) {
    console.error('Error resetting Firestore:', error);
  }
}

resetFirestore();
