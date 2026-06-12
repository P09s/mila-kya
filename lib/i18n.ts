// ─────────────────────────────────────────────────────────────────────────────
// MilaKya — i18n dictionary
// Languages: 'hinglish' (default) | 'en' | 'hi'
// Usage:  const { t } = useLanguage()
//         t('home.subtitle')
//         t('home.itemCount', { count: 5 })   → interpolation
//         t('search.deleteBtn', 3)             → count shorthand
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = 'hinglish' | 'en' | 'hi'

// Interpolation: {{count}}, {{name}}, {{n}} etc.
export type Vars = Record<string, string | number>
export const DICT = {

  // ── Common ────────────────────────────────────────────────────────────────
  'common.loading':         { hinglish: 'Loading...', en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.cancel':          { hinglish: 'Cancel', en: 'Cancel', hi: 'रद्द करें' },
  'common.confirm':         { hinglish: 'Confirm', en: 'Confirm', hi: 'पुष्टि करें' },
  'common.back':            { hinglish: 'Wapas', en: 'Back', hi: 'वापस' },
  'common.next':            { hinglish: 'Aage badho', en: 'Next', hi: 'आगे बढ़ें' },
  'common.done':            { hinglish: 'Ho gaya', en: 'Done', hi: 'हो गया' },
  'common.save':            { hinglish: 'Save karo', en: 'Save', hi: 'सहेजें' },
  'common.delete':          { hinglish: 'Delete karo', en: 'Delete', hi: 'हटाएं' },
  'common.add':             { hinglish: 'Add karo', en: 'Add', hi: 'जोड़ें' },
  'common.yes':             { hinglish: 'Haan', en: 'Yes', hi: 'हाँ' },
  'common.no':              { hinglish: 'Nahi', en: 'No', hi: 'नहीं' },
  'common.optional':        { hinglish: 'optional', en: 'optional', hi: 'वैकल्पिक' },
  'common.comingSoon':      { hinglish: 'Jald', en: 'Soon', hi: 'जल्द' },
  'common.waitKaro':        { hinglish: 'Wait karo...', en: 'Please wait...', hi: 'प्रतीक्षा करें...' },
  'common.stepOf':          { hinglish: 'Step {{current}} of {{total}}', en: 'Step {{current}} of {{total}}', hi: 'चरण {{current}} / {{total}}' },
  'common.items':           { hinglish: '{{count}} items', en: '{{count}} items', hi: '{{count}} चीज़ें' },

  // ── Missing from Scan, Search, and Common ─────────────────────────────────
  'common.other':           { hinglish: 'Other', en: 'Other', hi: 'अन्य' },
  'common.ai':              { hinglish: 'AI', en: 'AI', hi: 'AI' },
  'scan.results.qty':       { hinglish: 'Qty: {{qty}}', en: 'Qty: {{qty}}', hi: 'मात्रा: {{qty}}' },
  'scan.results.addFull':   { hinglish: 'Poori detail ke saath add karo', en: 'Add with full details', hi: 'पूरी जानकारी के साथ जोड़ें' },
  'search.chip.passport':   { hinglish: 'Passport', en: 'Passport', hi: 'पासपोर्ट' },
  'search.chip.jewellery':  { hinglish: 'Jewellery', en: 'Jewellery', hi: 'गहने' },
  'search.chip.medicine':   { hinglish: 'Medicine', en: 'Medicine', hi: 'दवाइयां' },
  'search.chip.documents':  { hinglish: 'Documents', en: 'Documents', hi: 'दस्तावेज़' },
  'search.chip.clothes':    { hinglish: 'Clothes', en: 'Clothes', hi: 'कपड़े' },
  'share.title':            { hinglish: 'MilaKya — Meri cheezein', en: 'MilaKya — My items', hi: 'मिलाक्या — मेरी चीज़ें' },

  // ── Tab bar ───────────────────────────────────────────────────────────────
  'tabs.home':    { hinglish: 'Home',     en: 'Home',    hi: 'होम'    },
  'tabs.search':  { hinglish: 'Dhoondo',  en: 'Search',  hi: 'खोजें'  },
  'tabs.scan':    { hinglish: 'Scan',     en: 'Scan',    hi: 'स्कैन'  },
  'tabs.homes':   { hinglish: 'Ghar',     en: 'Homes',   hi: 'घर'     },
  'tabs.profile': { hinglish: 'Profile',  en: 'Profile', hi: 'प्रोफ़ाइल' },

  // ── Home screen ───────────────────────────────────────────────────────────
  'home.title':             { hinglish: 'MilaKya', en: 'MilaKya', hi: 'मिलाक्या' },
  'home.subtitle':          { hinglish: 'Apna saman, apni jagah', en: 'Your stuff, on its place', hi: 'अपना सामान, अपनी जगह' },
  'home.activeLabel':       { hinglish: 'Ab yahan hain', en: 'Currently here', hi: 'अभी यहाँ हैं' },
  'home.itemsSaved':        { hinglish: '{{count}} cheezein saved', en: '{{count}} items saved', hi: '{{count}} चीज़ें सहेजी हैं' },
  'home.yourItems':         { hinglish: 'Aapki cheezein', en: 'Your items', hi: 'आपकी चीज़ें' },
  'home.viewAll':           { hinglish: 'Sab dekho', en: 'View all', hi: 'सब देखें' },
  'home.empty':             { hinglish: 'Koi cheez nahi mili. FAB se add karo!', en: 'No items yet. Tap + to add!', hi: 'कोई चीज़ नहीं मिली। + से जोड़ें!' },
  'home.viewMore':          { hinglish: '{{count}} aur cheezein dekho', en: 'View {{count}} more items', hi: '{{count}} और चीज़ें देखें' },
  'home.myHomes':           { hinglish: 'Mere ghar', en: 'My homes', hi: 'मेरे घर' },
  'home.addHome':           { hinglish: 'Add', en: 'Add', hi: 'जोड़ें' },
  'home.moreItems':         { hinglish: 'aur cheezein dekho', en: 'more items', hi: 'और चीज़ें देखें' },
  'ghar.subtitle':          { hinglish: 'Sab jagah ek jagah', en: 'All your places', hi: 'सब जगह एक जगह' },
  'ghar.goHere':            { hinglish: 'Yahan jao', en: 'Go here', hi: 'यहाँ जाओ' },
  'ghar.no':                { hinglish: 'Nahi', en: 'No', hi: 'नहीं' },
  'ghar.yes':               { hinglish: 'Haan', en: 'Yes', hi: 'हाँ' },
  'ghar.addNew':            { hinglish: 'Naya ghar jodon', en: 'Add new home', hi: 'नया घर जोड़ें' },
  'ghar.addHint':           { hinglish: 'PG, Office, Storage...', en: 'PG, Office, Storage...', hi: 'PG, ऑफिस, स्टोरेज...' },

  // ── Search screen ─────────────────────────────────────────────────────────
  'search.title':           { hinglish: 'Dhoondo', en: 'Search', hi: 'खोजें' },
  'search.subtitle':        { hinglish: 'Koi bhi cheez, kisi bhi ghar mein', en: 'Any item, in any home', hi: 'कोई भी चीज़, किसी भी घर में' },
  'search.placeholder':     { hinglish: 'Passport, blue bag, Diwali suit...', en: 'Passport, blue bag, saree...', hi: 'पासपोर्ट, नीला बैग, साड़ी...' },
  'search.quickLabel':      { hinglish: 'Jaldi dhoondo', en: 'Quick search', hi: 'जल्दी खोजें' },
  'search.results':         { hinglish: '"{{query}}" ke results', en: 'Results for "{{query}}"', hi: '"{{query}}" के परिणाम' },
  'search.allItems':        { hinglish: 'Sabhi cheezein', en: 'All items', hi: 'सभी चीज़ें' },
  'search.aiLoading':       { hinglish: 'AI...', en: 'AI...', hi: 'AI...' },
  'search.select':          { hinglish: 'Select', en: 'Select', hi: 'चुनें' },
  'search.selectAll':       { hinglish: 'Sab chuno', en: 'Select all', hi: 'सब चुनें' },
  'search.deselectAll':     { hinglish: 'Sab hata', en: 'Deselect all', hi: 'सब हटाएं' },
  'search.emptyQuery':      { hinglish: 'Nahi mila!', en: 'Nothing found!', hi: 'नहीं मिला!' },
  'search.emptyQuerySub':   { hinglish: 'Kya aap kisi aur ghar mein rakhna bhool gaye?', en: 'Maybe it\'s in another home?', hi: 'क्या आप किसी और घर में रखना भूल गए?' },
  'search.emptyAll':        { hinglish: 'Abhi koi cheez nahi hai', en: 'No items yet', hi: 'अभी कोई चीज़ नहीं है' },
  'search.emptyAllSub':     { hinglish: 'Home screen par + se cheez add karo', en: 'Add items using + on the Home screen', hi: 'होम स्क्रीन पर + से चीज़ जोड़ें' },
  'search.deleteBtn':       { hinglish: '{{count}} delete karo', en: 'Delete {{count}}', hi: '{{count}} हटाएं' },

  // ── Scan screen ───────────────────────────────────────────────────────────
  'scan.title':             { hinglish: 'Scan karo', en: 'Scan', hi: 'स्कैन करें' },
  'scan.subtitle':          { hinglish: 'Photo ya diary — AI samjhega', en: 'Photo or list — AI will understand', hi: 'फोटो या डायरी — AI समझेगा' },
  'scan.camera.title':      { hinglish: 'Saman ki photo lo', en: 'Take a photo', hi: 'सामान की फोटो लें' },
  'scan.camera.sub':        { hinglish: 'Ek saath kai cheezein detect karega', en: 'Detects multiple items at once', hi: 'एक साथ कई चीज़ें पहचानेगा' },
  'scan.camera.btn':        { hinglish: 'Camera kholein', en: 'Open camera', hi: 'कैमरा खोलें' },
  'scan.camera.scanning':   { hinglish: 'Scan ho raha hai...', en: 'Scanning...', hi: 'स्कैन हो रहा है...' },
  'scan.diary.title':       { hinglish: 'Diary / List scan karo', en: 'Scan diary / list', hi: 'डायरी / सूची स्कैन करें' },
  'scan.diary.sub':         { hinglish: 'Haath se likhi list — Hindi aur English dono', en: 'Handwritten list — Hindi or English', hi: 'हाथ से लिखी सूची — हिंदी या अंग्रेजी' },
  'scan.diary.tip':         { hinglish: 'Achhi roshni, no blur, poora page frame mein. Table format (Room | Almirah | Item) mein ho toh AI jagah khud assign karega.', en: 'Good lighting, no blur, full page in frame. Table format (Room | Shelf | Item) lets AI assign locations automatically.', hi: 'अच्छी रोशनी, बिना धुंधला, पूरा पेज फ्रेम में। टेबल फॉर्मेट में हो तो AI जगह खुद assign करेगा।' },
  'scan.diary.btn':         { hinglish: 'Diary Scan karo', en: 'Scan diary', hi: 'डायरी स्कैन करें' },
  'scan.diary.scanning':    { hinglish: 'Scan ho raha hai...', en: 'Scanning...', hi: 'स्कैन हो रहा है...' },
  'scan.manual.placeholder':{ hinglish: 'Ya manually type karo', en: 'Or type manually', hi: 'या मैन्युअल टाइप करें' },
  'scan.manual.btn':        { hinglish: 'Quick Add', en: 'Quick Add', hi: 'जल्दी जोड़ें' },
  'scan.error.photo':       { hinglish: 'Yeh diary ya list lagti hai. Photo scan ke liye kisi cheez ki photo lo.', en: 'This looks like a diary/list. For photo scan, take a photo of objects.', hi: 'यह डायरी जैसी लगती है। फोटो स्कैन के लिए चीज़ों की फोटो लें।' },
  'scan.error.diary':       { hinglish: 'Yeh photo lagti hai, diary nahi. Haath se likhi list ki photo lo.', en: 'This looks like a photo, not a diary. Take a photo of a handwritten list.', hi: 'यह फोटो लगती है, डायरी नहीं। हाथ से लिखी सूची की फोटो लें।' },
  'scan.error.rateLimit':   { hinglish: 'Thoda ruko, 1 minute baad dobara try karo.', en: 'Please wait and try again in 1 minute.', hi: 'थोड़ा रुकें, 1 मिनट बाद फिर कोशिश करें।' },
  'scan.error.generic':     { hinglish: 'Scan failed. Dobara try karo.', en: 'Scan failed. Please try again.', hi: 'स्कैन विफल। फिर कोशिश करें।' },
  'scan.results.photo':     { hinglish: '{{count}} cheez mili', en: '{{count}} items found', hi: '{{count}} चीज़ें मिलीं' },
  'scan.results.diary':     { hinglish: '{{count}} items mili', en: '{{count}} items found', hi: '{{count}} चीज़ें मिलीं' },
  'scan.results.empty':     { hinglish: 'Kuch detect nahi hua. Dobara try karo.', en: 'Nothing detected. Try again.', hi: 'कुछ नहीं मिला। फिर कोशिश करें।' },
  'scan.results.addBtn':    { hinglish: '{{count}} cheez add karo', en: 'Add {{count}} items', hi: '{{count}} चीज़ें जोड़ें' },
  'scan.results.where':     { hinglish: 'Kahan rakhein?', en: 'Where to place?', hi: 'कहाँ रखें?' },
  'scan.results.roomPH':    { hinglish: '-- Room select karo --', en: '-- Select a room --', hi: '-- कमरा चुनें --' },
  'scan.results.none':      { hinglish: 'Kuch detect nahi hua. Dobara try karo.', en: 'Nothing detected. Please try again.', hi: 'कुछ पहचाना नहीं गया। फिर कोशिश करें।' },
  'scan.results.selectAll': { hinglish: 'Select all', en: 'Select all', hi: 'सब चुनें' },
  'scan.results.deselectAll':{ hinglish: 'Deselect all', en: 'Deselect all', hi: 'सब हटाएं' },
  'scan.results.selected':  { hinglish: '{{count}} selected', en: '{{count}} selected', hi: '{{count}} चुने गए' },
  'scan.results.tapToSelect':{ hinglish: 'Tap to select', en: 'Tap to select', hi: 'टैप करके चुनें' },
  'scan.location.title':    { hinglish: 'Kahan rakhein? ({{count}} items)', en: 'Where to save? ({{count}} items)', hi: 'कहाँ रखें? ({{count}} चीज़ें)' },
  'scan.location.roomPlaceholder': { hinglish: '-- Room select karo (optional) --', en: '-- Select room (optional) --', hi: '-- कमरा चुनें (वैकल्पिक) --' },
  'scan.location.addBtn':   { hinglish: '{{count}} cheez add karo', en: 'Add {{count}} items', hi: '{{count}} चीज़ें जोड़ें' },
  'scan.location.adding':   { hinglish: 'Adding...', en: 'Adding...', hi: 'जोड़ा जा रहा है...' },
  'scan.confidence':        { hinglish: '{{pct}}% sure', en: '{{pct}}% sure', hi: '{{pct}}% सही' },

  // ── Ghar screen ───────────────────────────────────────────────────────────
  'ghar.title':             { hinglish: 'Mere Ghar', en: 'My Homes', hi: 'मेरे घर' },
  'ghar.activeTag':         { hinglish: 'Ab yahan hain', en: 'Currently here', hi: 'अभी यहाँ हैं' },
  'ghar.noCity':            { hinglish: 'No city', en: 'No city', hi: 'कोई शहर नहीं' },
  'ghar.deleteYes':         { hinglish: 'Haan', en: 'Yes', hi: 'हाँ' },
  'ghar.deleteNo':          { hinglish: 'Nahi', en: 'No', hi: 'नहीं' },
  'ghar.addNewSub':         { hinglish: 'PG, Office, Storage...', en: 'PG, Office, Storage...', hi: 'PG, ऑफिस, स्टोरेज...' },

  // ── Onboarding wizard ─────────────────────────────────────────────────────
  'onboard.lang.title':     { hinglish: 'Bhasha chunein', en: 'Choose your language', hi: 'भाषा चुनें' },
  'onboard.lang.sub':       { hinglish: 'Baad mein Profile mein change kar sakte hain', en: 'You can change this later in Profile', hi: 'बाद में प्रोफ़ाइल में बदल सकते हैं' },
  'onboard.step1.label':    { hinglish: 'Step 1 of 3', en: 'Step 1 of 3', hi: 'चरण 1 / 3' },
  'onboard.step1.title':    { hinglish: 'Pehla ghar banao', en: 'Set up your first home', hi: 'पहला घर बनाएं' },
  'onboard.step1.sub':      { hinglish: 'Kahan rehte ho? Ghar, PG, hostel — jo bhi ho.', en: 'Where do you live? Home, PG, hostel — anything.', hi: 'कहाँ रहते हो? घर, PG, हॉस्टल — जो भी हो।' },
  'onboard.step1.quickSel': { hinglish: 'Quick select karo', en: 'Quick select', hi: 'जल्दी चुनें' },
  'onboard.step1.nameLabel':{ hinglish: 'Naam *', en: 'Name *', hi: 'नाम *' },
  'onboard.step1.namePH':   { hinglish: 'Ghar, PG, Sasural...', en: 'Home, PG, In-laws...', hi: 'घर, PG, ससुराल...' },
  'onboard.step1.iconLabel':{ hinglish: 'Icon', en: 'Icon', hi: 'आइकन' },
  'onboard.step1.cityLabel':{ hinglish: 'City (optional)', en: 'City (optional)', hi: 'शहर (वैकल्पिक)' },
  'onboard.step1.cityPH':   { hinglish: 'Delhi, Jaipur, Lucknow...', en: 'Delhi, Mumbai, Chennai...', hi: 'दिल्ली, जयपुर, लखनऊ...' },
  'onboard.step2.label':    { hinglish: 'Step 2 of 3', en: 'Step 2 of 3', hi: 'चरण 2 / 3' },
  'onboard.step2.title':    { hinglish: 'Rooms add karo', en: 'Add rooms', hi: 'कमरे जोड़ें' },
  'onboard.step2.sub':      { hinglish: '{{name}} mein kaun kaun se rooms hain?', en: 'Which rooms does {{name}} have?', hi: '{{name}} में कौन से कमरे हैं?' },
  'onboard.step2.tapSel':   { hinglish: 'Tap karke select karo', en: 'Tap to select', hi: 'टैप करके चुनें' },
  'onboard.step2.custom':   { hinglish: 'Ya khud likho', en: 'Or add your own', hi: 'या खुद लिखें' },
  'onboard.step2.customPH': { hinglish: 'Terrace, Balcony, Pooja room...', en: 'Terrace, Balcony, Puja room...', hi: 'छत, बालकनी, पूजा घर...' },
  'onboard.step3.label':    { hinglish: 'Step 3 of 3', en: 'Step 3 of 3', hi: 'चरण 3 / 3' },
  'onboard.step3.title':    { hinglish: 'Sab theek hai?', en: 'Everything looks good?', hi: 'सब ठीक है?' },
  'onboard.step3.sub':      { hinglish: 'Ek baar check karo, phir shuru karte hain!', en: 'Review and then let\'s get started!', hi: 'एक बार देखें, फिर शुरू करते हैं!' },
  'onboard.step3.rooms':    { hinglish: '{{count}} Rooms', en: '{{count}} Rooms', hi: '{{count}} कमरे' },
  'onboard.finish.loading': { hinglish: 'Setting up...', en: 'Setting up...', hi: 'तैयार हो रहा है...' },
  'onboard.finish.btn':     { hinglish: 'Shuru karo', en: 'Let\'s go!', hi: 'शुरू करें' },
  'onboard.done.msg':       { hinglish: 'Sab ready hai!', en: 'All set!', hi: 'सब तैयार है!' },
  'onboard.done.sub':       { hinglish: '{{name}} set up ho gaya', en: '{{name}} is set up', hi: '{{name}} सेट हो गया' },

  // ── Profile screen ────────────────────────────────────────────────────────
  'profile.title':          { hinglish: 'Profile', en: 'Profile', hi: 'प्रोफ़ाइल' },
  'profile.subtitle':       { hinglish: 'Aapka account', en: 'Your account', hi: 'आपका खाता' },
  'profile.loginGoogle':    { hinglish: 'Google se login kiya', en: 'Signed in with Google', hi: 'Google से लॉगिन किया' },
  'profile.loginEmail':     { hinglish: 'Email se login kiya', en: 'Signed in with Email', hi: 'Email से लॉगिन किया' },
  'profile.loggedIn':       { hinglish: 'Logged in', en: 'Logged in', hi: 'लॉगिन हुए' },
  'profile.stats.homes':    { hinglish: 'Ghars', en: 'Homes', hi: 'घर' },
  'profile.stats.items':    { hinglish: 'Items', en: 'Items', hi: 'चीज़ें' },
  'profile.stats.important':{ hinglish: 'Important', en: 'Important', hi: 'महत्वपूर्ण' },
  'profile.darkMode':       { hinglish: 'Dark Mode', en: 'Dark Mode', hi: 'डार्क मोड' },
  'profile.lightMode':      { hinglish: 'Light Mode', en: 'Light Mode', hi: 'लाइट मोड' },
  'profile.language':       { hinglish: 'Bhasha (Language)', en: 'Language', hi: 'भाषा' },
  'profile.familySharing':  { hinglish: 'Family Sharing', en: 'Family Sharing', hi: 'परिवार शेयरिंग' },
  'profile.export':         { hinglish: 'Export Inventory', en: 'Export Inventory', hi: 'इन्वेंटरी एक्सपोर्ट' },
  'profile.signOut':        { hinglish: 'Sign Out', en: 'Sign Out', hi: 'साइन आउट' },
  'profile.deleteAccount':  { hinglish: 'Delete Account', en: 'Delete Account', hi: 'खाता हटाएं' },
  'profile.footer':         { hinglish: 'MilaKya v1.0 · Bharat ke liye 🇮🇳', en: 'MilaKya v1.0 · Made for India 🇮🇳', hi: 'MilaKya v1.0 · भारत के लिए 🇮🇳' },
  'profile.comingSoonToast':{ hinglish: 'Jald aayega — Phase 2!', en: 'Coming soon — Phase 2!', hi: 'जल्द आएगा — Phase 2!' },
  'profile.signout.title':  { hinglish: 'Sign out karo?', en: 'Sign out?', hi: 'साइन आउट करें?' },
  'profile.signout.body':   { hinglish: 'Aap sign out ho jayenge. Dobara login karke wapas aa sakte hain.', en: 'You will be signed out. You can sign back in anytime.', hi: 'आप साइन आउट हो जाएंगे। दोबारा लॉगिन करके वापस आ सकते हैं।' },
  'profile.signout.confirm':{ hinglish: 'Haan, sign out karo', en: 'Yes, sign out', hi: 'हाँ, साइन आउट करें' },
  'profile.signout.cancel': { hinglish: 'Nahi, wapas jao', en: 'No, go back', hi: 'नहीं, वापस जाएं' },
  'profile.delete.title':   { hinglish: 'Account delete karo?', en: 'Delete account?', hi: 'खाता हटाएं?' },
  'profile.delete.body':    { hinglish: 'Yeh action undo nahi ho sakta. Aapke saare ghar, rooms, aur items hamesha ke liye delete ho jayenge.', en: 'This cannot be undone. All your homes, rooms, and items will be permanently deleted.', hi: 'यह वापस नहीं होगा। आपके सभी घर, कमरे और चीज़ें हमेशा के लिए हट जाएंगी।' },
  'profile.delete.confirm': { hinglish: 'Haan, delete karo', en: 'Yes, delete', hi: 'हाँ, हटाएं' },
  'profile.error':          { hinglish: 'Kuch gadbad ho gayi. Dobara try karo.', en: 'Something went wrong. Please try again.', hi: 'कुछ गड़बड़ हो गई। फिर कोशिश करें।' },

  // ── Language picker labels ────────────────────────────────────────────────
  'lang.hinglish':          { hinglish: 'Hinglish', en: 'Hinglish', hi: 'हिंग्लिश' },
  'lang.hinglish.sub':      { hinglish: 'Roman Hindi + English', en: 'Roman Hindi + English', hi: 'रोमन हिंदी + अंग्रेजी' },
  'lang.en':                { hinglish: 'English', en: 'English', hi: 'अंग्रेज़ी' },
  'lang.en.sub':            { hinglish: 'Full English', en: 'Full English', hi: 'पूर्ण अंग्रेज़ी' },
  'lang.hi':                { hinglish: 'हिंदी', en: 'Hindi', hi: 'हिंदी' },
  'lang.hi.sub':            { hinglish: 'Poori Hindi mein', en: 'Full Hindi', hi: 'पूर्ण हिंदी में' },
  'lang.sheet.title':       { hinglish: 'Bhasha chunein', en: 'Choose language', hi: 'भाषा चुनें' },

  // ── Action confirmations ──────────────────────────────────────────────────
  'ack.deleted.one':        { hinglish: 'Delete ho gayi', en: 'Item deleted', hi: 'हटा दिया गया' },
  'ack.deleted.many':       { hinglish: '{{count}} cheezein delete ho gayi', en: '{{count}} items deleted', hi: '{{count}} चीज़ें हटा दी गईं' },
  'ack.added.one':          { hinglish: 'Cheez add ho gayi', en: 'Item added', hi: 'चीज़ जोड़ी गई' },
  'ack.added.many':         { hinglish: '{{count}} cheezein add ho gayi', en: '{{count}} items added', hi: '{{count}} चीज़ें जोड़ी गईं' },
  'ack.important':          { hinglish: 'Important mark ho gayi', en: 'Marked as important', hi: 'महत्वपूर्ण चिह्नित की गई' },
  'ack.unimportant':        { hinglish: 'Important se hata diya', en: 'Removed from important', hi: 'महत्वपूर्ण से हटाया गया' },
  'ack.saved':              { hinglish: 'Save ho gaya', en: 'Saved', hi: 'सहेजा गया' },
  'ack.shared':             { hinglish: 'Share ho gaya!', en: 'Shared!', hi: 'शेयर हो गया!' },
  'ack.home_added':         { hinglish: 'Naya ghar add ho gaya', en: 'New home added', hi: 'नया घर जोड़ा गया' },
  'ack.room_added':         { hinglish: 'Room add ho gaya', en: 'Room added', hi: 'कमरा जोड़ा गया' },
  'ack.scan_added.one':     { hinglish: 'Cheez scan se add ho gayi', en: 'Item added from scan', hi: 'स्कैन से चीज़ जोड़ी गई' },
  'ack.scan_added.many':    { hinglish: '{{count}} cheezein scan se add ho gayi', en: '{{count}} items added from scan', hi: '{{count}} चीज़ें स्कैन से जोड़ी गईं' },
  'ack.diary_added.one':    { hinglish: 'Cheez diary se add ho gayi', en: 'Item added from diary', hi: 'डायरी से चीज़ जोड़ी गई' },
  'ack.diary_added.many':   { hinglish: '{{count}} cheezein diary se add ho gayi', en: '{{count}} items added from diary', hi: '{{count}} चीज़ें डायरी से जोड़ी गईं' },
  
  // ── Walkthrough ───────────────────────────────────────────────────────────
  'walkthrough.skip':             { hinglish: 'Skip', en: 'Skip', hi: 'छोड़ें' },
  'walkthrough.understood':       { hinglish: 'Samjha', en: 'Got it', hi: 'समझ गया' },
  'walkthrough.start':            { hinglish: 'Shuru karo!', en: 'Let\'s go!', hi: 'शुरू करें!' },
  'walkthrough.step1.tab':        { hinglish: 'Ghar tab', en: 'Homes tab', hi: 'घर टैब' },
  'walkthrough.step1.title':      { hinglish: 'Pehle apna ghar dekho', en: 'View your homes first', hi: 'पहले अपना घर देखें' },
  'walkthrough.step1.body':       { hinglish: '"Ghar" tab mein aapke saare locations hain. Orange card aapka active ghar hai — jahan aap abhi hain.', en: 'The "Homes" tab lists all your locations. The orange card is your active home — where you currently are.', hi: '"घर" टैब में आपके सभी स्थान हैं। नारंगी कार्ड आपका सक्रिय घर है — जहाँ आप अभी हैं।' },
  'walkthrough.step2.tab':        { hinglish: 'Ghar tab', en: 'Homes tab', hi: 'घर टैब' },
  'walkthrough.step2.title':      { hinglish: 'Naya ghar jodon', en: 'Add a new home', hi: 'नया घर जोड़ें' },
  'walkthrough.step2.body':       { hinglish: 'PG, Maika, Sasural, Office — jitne chahein add karo. "Yahan jao" se active ghar switch karo.', en: 'Add a PG, Office, or Storage as you like. Tap "Go here" to switch your active home.', hi: 'PG, मायका, ससुराल, ऑफिस — जितने चाहें जोड़ें। "यहाँ जाओ" से अपना घर बदलें।' },
  'walkthrough.step3.tab':        { hinglish: 'Scan tab', en: 'Scan tab', hi: 'स्कैन टैब' },
  'walkthrough.step3.title':      { hinglish: 'Photo se saman add karo', en: 'Add items using photos', hi: 'फोटो से सामान जोड़ें' },
  'walkthrough.step3.body':       { hinglish: '"Camera kholein" dabao — AI ek photo mein kai cheezein detect karta hai. Checkboxes se select karo, bulk add!', en: 'Tap "Open camera" — AI detects multiple items in a photo. Select the checkboxes to bulk add!', hi: '"कैमरा खोलें" दबाएं — AI एक फोटो में कई चीज़ें पहचानता है। चेकबॉक्स चुनें और एक साथ जोड़ें!' },
  'walkthrough.step4.tab':        { hinglish: 'Scan tab', en: 'Scan tab', hi: 'स्कैन टैब' },
  'walkthrough.step4.title':      { hinglish: 'Diary ya list bhi scan hoti hai', en: 'Scan your handwritten lists', hi: 'डायरी या लिस्ट भी स्कैन होती है' },
  'walkthrough.step4.body':       { hinglish: 'Haath se likhi list ki photo lo — Hindi aur English dono mein. AI items khud parse kar dega.', en: 'Take a photo of a handwritten list — in Hindi or English. AI will parse the items for you.', hi: 'हाथ से लिखी लिस्ट की फोटो लें — हिंदी या अंग्रेजी। AI चीज़ों को खुद समझ लेगा।' },
  'walkthrough.step5.tab':        { hinglish: 'Scan tab', en: 'Scan tab', hi: 'स्कैन टैब' },
  'walkthrough.step5.title':      { hinglish: 'Ya manually type karo', en: 'Or type manually', hi: 'या मैन्युअल रूप से टाइप करें' },
  'walkthrough.step5.body':       { hinglish: '"Quick Add" row se naam, room, category — sab detail ke saath add karo. Voice input bhi hai!', en: 'Use the "Quick Add" section to manually input details. Voice input is also supported!', hi: '"जल्दी जोड़ें" सेक्शन से मैन्युअल रूप से विवरण भरें। वॉयस इनपुट भी उपलब्ध है!' },
  'walkthrough.step6.tab':        { hinglish: 'Home tab', en: 'Home tab', hi: 'होम टैब' },
  'walkthrough.step6.title':      { hinglish: 'Active ghar ka dashboard', en: 'Active home dashboard', hi: 'सक्रिय घर का डैशबोर्ड' },
  'walkthrough.step6.body':       { hinglish: 'Yahan aapke current ghar ki info dikhti hai — kitni cheezein hain, aur ghar ka naam.', en: 'Here you see the details of your current home — the total items and home name.', hi: 'यहाँ आपके वर्तमान घर की जानकारी दिखती है — कितनी चीज़ें हैं, और घर का नाम।' },
  'walkthrough.step7.tab':        { hinglish: 'Home tab', en: 'Home tab', hi: 'होम टैब' },
  'walkthrough.step7.title':      { hinglish: 'Item card se kya kya hoga', en: 'What you can do with item cards', hi: 'आइटम कार्ड से क्या-क्या होगा' },
  'walkthrough.step7.body':       { hinglish: 'Tap → details + edit. Star → important mark. WhatsApp → family ko location bhejo. Location change → dusre ghar move karo.', en: 'Tap → details + edit. Star → mark important. WhatsApp → share location with family. Location change → move to another home.', hi: 'टैप → विवरण और संपादन। स्टार → महत्वपूर्ण। WhatsApp → परिवार को स्थान भेजें। लोकेशन बदलें → दूसरे घर ले जाएं।' },
  'walkthrough.step8.tab':        { hinglish: 'Search tab', en: 'Search tab', hi: 'खोज टैब' },
  'walkthrough.step8.title':      { hinglish: 'Kuch bhi dhoondhon', en: 'Search for anything', hi: 'कुछ भी खोजें' },
  'walkthrough.step8.body':       { hinglish: 'Hindi ya English — "dawaai kahan hai?" likho. AI saare gharon mein dhoondega. Quick chips se common items instantly milein.', en: 'Type in Hindi or English — like "where is the medicine?". AI searches across all homes. Quick chips find common items instantly.', hi: 'हिंदी या अंग्रेजी — "दवाई कहाँ है?" लिखें। AI सभी घरों में खोजेगा। क्विक चिप्स से सामान्य चीज़ें तुरंत पाएं।' },
  'walkthrough.step9.tab':        { hinglish: 'Profile tab', en: 'Profile tab', hi: 'प्रोफ़ाइल टैब' },
  'walkthrough.step9.title':      { hinglish: 'Aapka profile', en: 'Your profile', hi: 'आपकी प्रोफ़ाइल' },
  'walkthrough.step9.body':       { hinglish: 'Dark mode, Family Sharing (jald!), Export Inventory — sab yahan. Summary bhi: kitne ghar, items, important cheezein.', en: 'Dark mode, Family Sharing (soon!), and Export Inventory are all here. Plus a quick summary of your items and homes.', hi: 'डार्क मोड, परिवार शेयरिंग (जल्द!), और इन्वेंटरी एक्सपोर्ट यहाँ हैं। साथ ही आपके घरों और चीज़ों का विवरण।' },

  // ── Detail & Action Sheets ────────────────────────────────────────────────
  'detail.title':                 { hinglish: 'Item Details', en: 'Item Details', hi: 'आइटम विवरण' },
  'detail.currentLoc':            { hinglish: 'Ab kahan hai', en: 'Currently at', hi: 'अब कहाँ है' },
  'detail.noHome':                { hinglish: 'No home', en: 'No home', hi: 'कोई घर नहीं' },
  'detail.note':                  { hinglish: 'Note', en: 'Note', hi: 'नोट' },
  'detail.moveBtn':               { hinglish: 'Location change karo', en: 'Change location', hi: 'जगह बदलें' },
  'detail.newLoc':                { hinglish: 'Naya location chuno', en: 'Choose new location', hi: 'नई जगह चुनें' },
  'detail.roomPh':                { hinglish: '-- Room select karo --', en: '-- Select a room --', hi: '-- कमरा चुनें --' },
  'detail.saveMove':              { hinglish: '✓ Move karo', en: '✓ Move item', hi: '✓ ले जाएं' },
  'detail.whatsapp':              { hinglish: 'WhatsApp', en: 'WhatsApp', hi: 'व्हाट्सएप' },
  'detail.whatsapp.msg':          { hinglish: '📍 *{{name}}* rakha hai:\n🏠 {{location}}{{notes}}{{important}}\n\n🗓 Added: {{date}}\n\n_MilaKya se bheja — milakya.app_', en: '📍 *{{name}}* is stored at:\n🏠 {{location}}{{notes}}{{important}}\n\n🗓 Added: {{date}}\n\n_Sent from MilaKya — milakya.app_', hi: '📍 *{{name}}* यहाँ रखा है:\n🏠 {{location}}{{notes}}{{important}}\n\n🗓 जोड़ा गया: {{date}}\n\n_MilaKya से भेजा — milakya.app_' },
  'detail.whatsapp.important':    { hinglish: '\n⭐ Important item', en: '\n⭐ Important item', hi: '\n⭐ महत्वपूर्ण चीज़' },
  'detail.whatsapp.note':         { hinglish: '\n📝 Note: {{note}}', en: '\n📝 Note: {{note}}', hi: '\n📝 नोट: {{note}}' },

  'homeDetail.rooms':             { hinglish: 'Rooms / Jagah', en: 'Rooms / Spaces', hi: 'कमरे / जगह' },
  'homeDetail.addRoom':           { hinglish: 'Add Room', en: 'Add Room', hi: 'कमरा जोड़ें' },
  'homeDetail.roomPh':            { hinglish: 'Bedroom, Kitchen, Almirah...', en: 'Bedroom, Kitchen, Shelf...', hi: 'बेडरूम, रसोई, अलमारी...' },
  'homeDetail.empty':             { hinglish: 'Koi room nahi hai. Abhi add karo!', en: 'No rooms yet. Add one now!', hi: 'कोई कमरा नहीं है। अभी जोड़ें!' },
  'homeDetail.deleteConfirm':     { hinglish: 'Is room ko delete karo?', en: 'Delete this room?', hi: 'क्या इस कमरे को हटाएं?' },

  'addHome.title':                { hinglish: 'Naya ghar jodon', en: 'Add new home', hi: 'नया घर जोड़ें' },
  'addHome.quickSel':             { hinglish: 'Quick select', en: 'Quick select', hi: 'जल्दी चुनें' },
  'addHome.name':                 { hinglish: 'Ghar ka naam *', en: 'Home name *', hi: 'घर का नाम *' },
  'addHome.namePh':               { hinglish: 'Ghar, PG, Sasural...', en: 'Home, PG, In-laws...', hi: 'घर, PG, ससुराल...' },
  'addHome.icon':                 { hinglish: 'Icon', en: 'Icon', hi: 'आइकन' },
  'addHome.city':                 { hinglish: 'City (optional)', en: 'City (optional)', hi: 'शहर (वैकल्पिक)' },
  'addHome.cityPh':               { hinglish: 'Delhi, Lucknow, Jaipur...', en: 'Delhi, Mumbai, Chennai...', hi: 'दिल्ली, मुंबई, चेन्नई...' },
  'addHome.btn':                  { hinglish: 'Ghar Add karo', en: 'Add Home', hi: 'घर जोड़ें' },
  'addHome.adding':               { hinglish: 'Adding...', en: 'Adding...', hi: 'जोड़ा जा रहा है...' },

  'quickAdd.title':               { hinglish: 'Cheez add karo', en: 'Add item', hi: 'चीज़ जोड़ें' },
  'quickAdd.what':                { hinglish: 'Kya rakha hai? *', en: 'What is it? *', hi: 'क्या रखा है? *' },
  'quickAdd.whatPh':              { hinglish: 'Passport, Blue bag, Diwali suit...', en: 'Passport, Blue bag, Saree...', hi: 'पासपोर्ट, नीला बैग, साड़ी...' },
  'quickAdd.voiceTitle':          { hinglish: 'Bol ke add karo', en: 'Add using voice', hi: 'बोल कर जोड़ें' },
  'quickAdd.icon':                { hinglish: 'Icon', en: 'Icon', hi: 'आइकन' },
  'quickAdd.category':            { hinglish: 'Category', en: 'Category', hi: 'श्रेणी' },
  'quickAdd.where':               { hinglish: 'Kahan rakha hai?', en: 'Where is it?', hi: 'कहाँ रखा है?' },
  'quickAdd.room':                { hinglish: 'Room / jagah', en: 'Room / place', hi: 'कमरा / जगह' },
  'quickAdd.roomPh':              { hinglish: '-- Select room --', en: '-- Select room --', hi: '-- कमरा चुनें --' },
  'quickAdd.subLoc':              { hinglish: 'Sub-location (optional)', en: 'Sub-location (optional)', hi: 'सटीक जगह (वैकल्पिक)' },
  'quickAdd.subLocPh':            { hinglish: 'Top shelf, left drawer, inside bag...', en: 'Top shelf, left drawer, inside bag...', hi: 'ऊपर की शेल्फ, बाईं दराज, बैग के अंदर...' },
  'quickAdd.notes':               { hinglish: 'Notes (optional)', en: 'Notes (optional)', hi: 'नोट्स (वैकल्पिक)' },
  'quickAdd.notesPh':             { hinglish: 'Koi bhi note...', en: 'Any notes...', hi: 'कोई भी नोट...' },
  'quickAdd.imp':                 { hinglish: 'Important mark karo', en: 'Mark as important', hi: 'महत्वपूर्ण चिह्नित करें' },
  'quickAdd.impSub':              { hinglish: 'Passport, jewellery, medicine etc.', en: 'Passport, jewellery, medicine etc.', hi: 'पासपोर्ट, गहने, दवाइयां आदि' },
  'quickAdd.save':                { hinglish: 'Save karo', en: 'Save item', hi: 'सहेजें' },
  'quickAdd.saving':              { hinglish: 'Saving...', en: 'Saving...', hi: 'सहेजा जा रहा है...' },

  // ── Presets ───────────────────────────────────────────────────────────────
  'preset.home.ghar':             { hinglish: 'Ghar', en: 'Home', hi: 'घर' },
  'preset.home.pg':               { hinglish: 'PG / Hostel', en: 'PG / Hostel', hi: 'PG / हॉस्टल' },
  'preset.home.maika':            { hinglish: 'Maika', en: 'Parents\' Home', hi: 'मायका' },
  'preset.home.sasural':          { hinglish: 'Sasural', en: 'In-laws', hi: 'ससुराल' },
  'preset.home.office':           { hinglish: 'Office', en: 'Office', hi: 'ऑफ़िस' },
  'preset.home.storage':          { hinglish: 'Storage', en: 'Storage', hi: 'स्टोरेज' },
  'preset.home.warehouse':        { hinglish: 'Warehouse', en: 'Warehouse', hi: 'गोदाम' },
  'preset.home.farmhouse':        { hinglish: 'Farmhouse', en: 'Farmhouse', hi: 'फार्महाउस' },

  'preset.room.bedroom':          { hinglish: 'Bedroom', en: 'Bedroom', hi: 'बेडरूम' },
  'preset.room.kitchen':          { hinglish: 'Kitchen', en: 'Kitchen', hi: 'रसोई' },
  'preset.room.living':           { hinglish: 'Living Room', en: 'Living Room', hi: 'लिविंग रूम' },
  'preset.room.bathroom':         { hinglish: 'Bathroom', en: 'Bathroom', hi: 'बाथरूम' },
  'preset.room.study':            { hinglish: 'Study Room', en: 'Study Room', hi: 'स्टडी रूम' },
  'preset.room.store':            { hinglish: 'Store Room', en: 'Store Room', hi: 'स्टोर रूम' },

  'preset.item.box':              { hinglish: 'Box / Other', en: 'Box / Other', hi: 'डिब्बा / अन्य' },
  'preset.item.clothing':         { hinglish: 'Clothing', en: 'Clothing', hi: 'कपड़े' },
  'preset.item.docs':             { hinglish: 'Documents', en: 'Documents', hi: 'दस्तावेज़' },
  'preset.item.meds':             { hinglish: 'Medicine', en: 'Medicine', hi: 'दवाइयां' },
  'preset.item.jewel':            { hinglish: 'Jewellery', en: 'Jewellery', hi: 'गहने' },
  'preset.item.elec':             { hinglish: 'Electronics', en: 'Electronics', hi: 'इलेक्ट्रॉनिक्स' },
  'preset.item.keys':             { hinglish: 'Keys', en: 'Keys', hi: 'चाबियाँ' },
  'preset.item.books':            { hinglish: 'Books', en: 'Books', hi: 'किताबें' },
  'preset.item.bag':              { hinglish: 'Bag', en: 'Bag', hi: 'बैग' },
  'preset.item.food':             { hinglish: 'Food / Tiffin', en: 'Food / Tiffin', hi: 'खाना / टिफिन' },
  'preset.item.toys':             { hinglish: 'Toys', en: 'Toys', hi: 'खिलौने' },

  // ── FAB & ItemCard ────────────────────────────────────────────────────────
  'fab.quickAdd':           { hinglish: 'Quick add item', en: 'Quick add item', hi: 'जल्दी चीज़ जोड़ें' },
  'itemCard.unknownLoc':    { hinglish: 'Location unknown', en: 'Location unknown', hi: 'जगह मालूम नहीं' },
  'itemCard.shareWhatsapp': { hinglish: 'Share on WhatsApp', en: 'Share on WhatsApp', hi: 'WhatsApp पर शेयर करें' },
  'itemCard.removeImp':     { hinglish: 'Remove important', en: 'Remove important', hi: 'महत्वपूर्ण से हटाएं' },
  'itemCard.markImp':       { hinglish: 'Mark important', en: 'Mark important', hi: 'महत्वपूर्ण चिह्नित करें' },
  'itemCard.whatsapp.msg':  { 
    hinglish: '📍 *{{name}}* rakha hai:\n{{location}}\n\nMilaKya se bheja', 
    en: '📍 *{{name}}* is stored at:\n{{location}}\n\nSent from MilaKya', 
    hi: '📍 *{{name}}* यहाँ रखा है:\n{{location}}\n\nMilaKya से भेजा' 
  },

} satisfies Record<string, Record<Lang, string>>

export type DictKey = keyof typeof DICT

// ─── Resolve a key to a string with optional interpolation ───────────────────
export function resolve(
  key: DictKey,
  lang: Lang,
  varsOrCount?: Vars | number,
): string {
  const entry = DICT[key]
  if (!entry) return key
  let str = entry[lang] ?? entry['hinglish'] ?? key

  if (varsOrCount === undefined) return str

  const vars: Vars =
    typeof varsOrCount === 'number' ? { count: varsOrCount } : varsOrCount

  // Replace {{varName}} placeholders
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`
  )
}