const client = stitch.Stitch.initializeDefaultAppClient(
  "applicationdaedalus-exblf"
);

async function init({ resetUser } = {}) {
  console.error(`FAKE DB`);
  return { client: null, db: null };

  const db = await (async function connect() {
    try {
      return client
        .getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
        .db("daedalus");
    } catch (e) {
      // console.error(`mo: failed to connect`);
      return null;
    }
  })();

  if (resetUser) await client.auth.logout();

  // const credential = new stitch.UserApiKeyCredential(
  //   "Xefn75B4Ca18DSPkJo54fwjkrYvTVPH7aQ3JqVhk6h3UNkA2HyImJ9UtFo0KUwXK"
  // );
  const credential = new stitch.AnonymousCredential();

  await (async function logIn() {
    // try {
    const authId = await client.auth.loginWithCredential(credential);
    // console.warn(`mo: successfully logged in with id:`, authId);
    return authId;
    // } catch (e) {
    //   // console.error(`mo: failed to log in`);
    //   return null;
    // }
  })();

  const { geo } = await client.callFunction("function_ip", ["hi"]);

  return { client, db, geo };
}

const postPersona = async ({ client, db }, persona) => {
  console.error(`FAKE DB`);
  return {
    geo: {
      city: "Vancouver",
      continent_code: "NA",
      continent_name: "North America",
      country_code: "CA",
      country_name: "Canada",
      ip: "199.116.241.77",
      latitude: 49.282,
      location: {
        calling_code: "1",
        capital: "Ottawa",
        country_flag: "http://assets.ipapi.com/flags/ca.svg",
        country_flag_emoji: "🇨🇦",
        country_flag_emoji_unicode: "U+1F1E8 U+1F1E6",
        geoname_id: 6173331,
        is_eu: false,
        languages: [
          { code: "en", name: "English", native: "English" },
          { code: "fr", name: "French", native: "Français" }
        ],
        longitude: -123.1103,
        region_code: "BC",
        region_name: "British Columbia",
        type: "ipv4",
        zip: "V6B"
      },
      ip: "199.116.241.77",
      owner_id: "5ce9da063d75d14a7263b03e"
    }
  };

  // try {
  await db.collection("persona").insertOne({
    owner_id: client.auth.user.id,
    persona,
    d: new Date()
  });
  // console.warn(`mo: successfully registered persona "${persona}"`);
  // } catch (e) {
  //   console.error(e);
  //   // console.error(`mo: failed to register persona "${persona}"`);
  //   return null;
  // }
};

export { init, postPersona };
