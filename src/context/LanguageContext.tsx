import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'hg';

type TranslationDict = Record<string, { en: string; hi: string; hg: string }>;

const translations: TranslationDict = {
  // Brand & nav
  brand_tagline: { en: 'Ghaziabad Pilot', hi: 'गाज़ियाबाद पायलट', hg: 'Ghaziabad Pilot' },
  nav_home: { en: 'Home', hi: 'होम', hg: 'Home' },
  nav_board: { en: 'Board', hi: 'बोर्ड', hg: 'Board' },
  nav_donor: { en: 'Donor', hi: 'दाता', hg: 'Donor' },
  nav_ngo: { en: 'NGO', hi: 'एनजीओ', hg: 'NGO' },
  nav_volunteer: { en: 'My Tasks', hi: 'मेरे कार्य', hg: 'Mere Tasks' },
  nav_admin: { en: 'Admin', hi: 'एडमिन', hg: 'Admin' },
  nav_logout: { en: 'Logout', hi: 'लॉगआउट', hg: 'Logout' },
  nav_login: { en: 'Login', hi: 'लॉगिन', hg: 'Login' },

  // Theme
  theme_light: { en: 'Switch to dark mode', hi: 'डार्क मोड पर जाएं', hg: 'Dark mode on karein' },
  theme_dark: { en: 'Switch to light mode', hi: 'लाइट मोड पर जाएं', hg: 'Light mode on karein' },

  // Login page
  login_title: { en: 'Welcome to Food Bridge', hi: 'फूड ब्रिज में आपका स्वागत है', hg: 'Food Bridge mein swagat hai' },
  login_subtitle: { en: 'Select your role to continue', hi: 'जारी रखने के लिए अपनी भूमिका चुनें', hg: 'Apna role select karein' },
  login_donor: { en: 'Donor', hi: 'दाता', hg: 'Donor' },
  login_donor_desc: { en: 'Caterer, banquet hall, event planner, hostel mess', hi: 'केटरर, बैंक्वेट हॉल, इवेंट प्लानर, हॉस्टल मेस', hg: 'Caterer, banquet, event planner, hostel mess' },
  login_ngo: { en: 'NGO / Receiver', hi: 'एनजीओ / रिसीवर', hg: 'NGO / Receiver' },
  login_ngo_desc: { en: 'Orphanage, shelter, food bank', hi: 'अनाथालय, शेल्टर, फूड बैंक', hg: 'Orphanage, shelter, food bank' },
  login_volunteer: { en: 'Volunteer', hi: 'वॉलंटियर', hg: 'Volunteer' },
  login_volunteer_desc: { en: 'Pickup and delivery helper', hi: 'पिकअप और डिलीवरी सहायक', hg: 'Pickup aur delivery helper' },
  login_volunteer_note: { en: 'You can log in only if a donor or NGO has added your number as a helper', hi: 'आप केवल तभी लॉगिन कर सकते हैं जब किसी दाता या एनजीओ ने आपका नंबर सहायक के रूप में जोड़ा हो', hg: 'Tabhi login kar sakte ho jab kisi donor ya NGO ne aapka number helper ke roop mein add kiya ho' },

  // Login form steps
  login_step1: { en: 'Enter your phone number', hi: 'अपना फोन नंबर दर्ज करें', hg: 'Phone number daalein' },
  login_phone_placeholder: { en: '10-digit mobile number', hi: '10 अंकों का मोबाइल नंबर', hg: '10 digit ka mobile number' },
  login_send_otp: { en: 'Send OTP', hi: 'OTP भेजें', hg: 'OTP bhejein' },
  login_step2: { en: 'Enter the OTP', hi: 'OTP दर्ज करें', hg: 'OTP daalein' },
  login_otp_placeholder: { en: '6-digit OTP', hi: '6 अंकों का OTP', hg: '6 digit OTP' },
  login_otp_hint: { en: 'Use 123456 for demo', hi: 'डेमो के लिए 123456 का उपयोग करें', hg: 'Demo ke liye 123456 use karein' },
  login_verify: { en: 'Verify & Login', hi: 'वेरिफाई और लॉगिन', hg: 'Verify & Login' },
  login_resend_otp: { en: 'Resend OTP', hi: 'OTP दोबारा भेजें', hg: 'OTP dobara bhejein' },
  login_back: { en: 'Back', hi: 'वापस', hg: 'Wapas' },
  login_invalid_otp: { en: 'Invalid OTP. Use 123456.', hi: 'गलत OTP। 123456 का उपयोग करें।', hg: 'Galat OTP. 123456 try karein.' },
  login_invalid_phone: { en: 'Enter a valid 10-digit phone number', hi: 'मान्य 10 अंकों का फोन नंबर दर्ज करें', hg: 'Sahi 10 digit phone number daalein' },
  login_volunteer_not_added: { en: 'This number has not been added as a helper by any donor or NGO. Please ask them to add you first.', hi: 'यह नंबर किसी दाता या एनजीओ द्वारा सहायक के रूप में नहीं जोड़ा गया है। कृपया उनसे आपको जोड़ने के लिए कहें।', hg: 'Ye number kisi donor ya NGO ne helper ke roop mein nahi add kiya hai. Unse pehle aapko add karne ko kahein.' },
  login_admin_otp_hint: { en: 'Use 1234 for demo', hi: 'डेमो के लिए 1234 का उपयोग करें', hg: 'Demo ke liye 1234 use karein' },

  // Verification
  verify_title: { en: 'Complete your profile', hi: 'अपनी प्रोफ़ाइल पूरी करें', hg: 'Profile complete karein' },
  verify_subtitle: { en: 'A few more details to create your account', hi: 'अकाउंट बनाने के लिए कुछ और जानकारी', hg: 'Account banane ke liye thoda aur data' },
  verify_name: { en: 'Name', hi: 'नाम', hg: 'Naam' },
  verify_name_placeholder: { en: 'Your full name', hi: 'आपका पूरा नाम', hg: 'Aapka poora naam' },
  verify_area: { en: 'Area', hi: 'क्षेत्र', hg: 'Area' },
  verify_area_placeholder: { en: 'Indirapuram, Vaishali, etc.', hi: 'इंदिरापुरम, वैशाली, आदि', hg: 'Indirapuram, Vaishali, etc.' },
  verify_org_name: { en: 'Organization name', hi: 'संस्था का नाम', hg: 'Organization ka naam' },
  verify_org_type: { en: 'Organization type', hi: 'संस्था का प्रकार', hg: 'Organization type' },
  verify_reg_number: { en: 'Registration number', hi: 'रजिस्ट्रेशन नंबर', hg: 'Registration number' },
  verify_reg_hint: { en: 'Admin will verify before you can claim listings', hi: 'एडमिन क्लेम करने से पहले वेरिफाई करेगा', hg: 'Admin verify karne ke baad claim kar sakte hain' },
  verify_submit: { en: 'Create account', hi: 'अकाउंट बनाएं', hg: 'Account banayein' },
  verify_donor_type_caterer: { en: 'Caterer', hi: 'केटरर', hg: 'Caterer' },
  verify_donor_type_banquet: { en: 'Banquet Hall', hi: 'बैंक्वेट हॉल', hg: 'Banquet Hall' },
  verify_donor_type_event: { en: 'Event Planner', hi: 'इवेंट प्लानर', hg: 'Event Planner' },
  verify_donor_type_mess: { en: 'Hostel / College Mess', hi: 'हॉस्टल / कॉलेज मेस', hg: 'Hostel / College Mess' },
  verify_ngo_type_orphanage: { en: 'Orphanage', hi: 'अनाथालय', hg: 'Orphanage' },
  verify_ngo_type_shelter: { en: 'Shelter', hi: 'शेल्टर', hg: 'Shelter' },
  verify_ngo_type_foodbank: { en: 'Food Bank', hi: 'फूड बैंक', hg: 'Food Bank' },

  // Home page
  home_pilot_badge: { en: 'Ghaziabad Pilot Live', hi: 'गाज़ियाबाद पायलट लाइव', hg: 'Ghaziabad Pilot Live' },
  home_hero_line1: { en: 'Rescued food,', hi: 'बचाया हुआ खाना,', hg: 'Bacha hua khana,' },
  home_hero_line2: { en: 'reaches those in need.', hi: 'ज़रूरतमंदों तक पहुंचता है।', hg: 'zarooratmandon tak pohchta hai.' },
  home_hero_desc: { en: 'Food Bridge connects professional donors (caterers, banquet halls, hostel mess) with verified NGOs — so surplus cooked food is not wasted and reaches those who need it.', hi: 'फूड ब्रिज प्रोफेशनल दाताओं (केटरर, बैंक्वेट, हॉस्टल मेस) को वेरिफाइड एनजीओ से जोड़ता है — ताकि बचा हुआ खाना बर्बाद न हो और ज़रूरतमंदों तक पहुंचे।', hg: 'Food Bridge professional donors (caterers, banquet, hostel mess) ko verified NGOs se connect karta hai — taaki bacha hua khana waste na ho aur zarooratmandon tak pohche.' },
  home_btn_donor: { en: 'I am a Donor', hi: 'मैं दाता हूँ', hg: 'Main Donor hoon' },
  home_btn_ngo: { en: 'I am an NGO', hi: 'मैं एनजीओ हूँ', hg: 'Main NGO hoon' },
  home_btn_board: { en: 'View live board', hi: 'लाइव बोर्ड देखें', hg: 'Live board dekhein' },
  home_impact_title: { en: 'Today\'s impact', hi: 'आज का प्रभाव', hg: 'Aaj ka impact' },
  home_impact_meals: { en: 'Meals rescued', hi: 'भोजन बचाया', hg: 'Meals rescued' },
  home_impact_live: { en: 'Live listings', hi: 'लाइव लिस्टिंग', hg: 'Live listings' },
  home_impact_pickups: { en: 'Pickups done', hi: 'पिकअप पूर्ण', hg: 'Pickups done' },
  home_impact_ngos: { en: 'Active NGOs', hi: 'सक्रिय एनजीओ', hg: 'Active NGOs' },
  home_how_title: { en: 'How it works', hi: 'कैसे काम करता है', hg: 'Kaise kaam karta hai' },
  home_how_sub: { en: 'Food is rescued in 4 simple steps', hi: '4 आसान कदम में खाना बचाया जाता है', hg: '4 simple steps mein khana bachaya jata hai' },
  home_step1_title: { en: 'Post surplus', hi: 'सरप्लस पोस्ट करें', hg: 'Surplus post karein' },
  home_step1_desc: { en: 'A donor posts "about 80 meals will be left this evening." It starts as a forecast and switches to ready when they press the button.', hi: 'दाता "आज शाम लगभग 80 भोजन बचेगा" पोस्ट करता है। यह फोरकास्ट के रूप में शुरू होता है और बटन दबाने पर रेडी हो जाता है।', hg: 'Donor "aaj shaam ~80 log ka khana bachega" post karta hai. Forecast se start, ready hone par button dabaye.' },
  home_step2_title: { en: 'Smart match', hi: 'स्मार्ट मैच', hg: 'Smart match' },
  home_step2_desc: { en: 'The best NGO is suggested based on food type, quantity, and area. Incompatible food is never suggested.', hi: 'खाने के प्रकार, मात्रा और क्षेत्र के आधार पर सर्वश्रेष्ठ एनजीओ सुझाया जाता है। असंगत खाना कभी सुझाया नहीं जाता।', hg: 'Food type, quantity aur area ke hisab se best NGO suggest hota hai. Galat food kabhi suggest nahi hota.' },
  home_step3_title: { en: 'Claim & handover code', hi: 'क्लेम और हैंडओवर कोड', hg: 'Claim & handover code' },
  home_step3_desc: { en: 'A verified NGO claims the listing. A 4-digit handover code confirms the pickup — both sides have proof.', hi: 'वेरिफाइड एनजीओ लिस्टिंग क्लेम करता है। 4-अंक का हैंडओवर कोड पिकअप की पुष्टि करता है — दोनों पक्षों के पास प्रमाण है।', hg: 'Verified NGO claim karta hai. 4-digit handover code pickup par confirm karta hai — dono ke paas proof.' },
  home_step4_title: { en: 'Food delivered', hi: 'खाना पहुंचाया गया', hg: 'Khana pohoch gaya' },
  home_step4_desc: { en: 'The NGO picks up the food and the impact counter increases. "You saved meals for 600 people this month."', hi: 'एनजीओ खाना ले जाता है और प्रभाव काउंटर बढ़ता है। "आपने इस महीने 600 लोगों का खाना बचाया।"', hg: 'NGO khana le jata hai, impact counter badhta hai. "Is mahine aapne 600 logon ka khana bachaya."' },
  home_safety_title: { en: 'Safety first', hi: 'सुरक्षा पहले', hg: 'Safety pehle' },
  home_safety_desc: { en: 'Donor confirms two checkboxes — food is fresh, covered, and not kept outside more than 4 hours.', hi: 'दाता दो चेकबॉक्स की पुष्टि करता है — खाना ताज़ा, ढका हुआ, और 4 घंटे से अधिक बाहर नहीं रखा।', hg: 'Donor do checkboxes tick karta hai — fresh, covered aur 4 ghante se zyada bahar nahi.' },
  home_countdown_title: { en: 'Safe-time countdown', hi: 'सेफ-टाइम काउंटडाउन', hg: 'Safe-time countdown' },
  home_countdown_desc: { en: 'Every listing has a live timer — "Safe for 2h 10m." When time runs out, the listing closes.', hi: 'हर लिस्टिंग पर लाइव टाइमर — "2h 10m के लिए सेफ।" समय खत्म होने पर लिस्टिंग बंद।', hg: 'Har listing pe live timer — "Safe for 2h 10m". Time khatam, listing band.' },
  home_verified_title: { en: 'Verified NGOs only', hi: 'केवल वेरिफाइड एनजीओ', hg: 'Verified NGOs only' },
  home_verified_desc: { en: 'Only verified NGOs can claim. Phone numbers are visible only after a claim is made.', hi: 'केवल वेरिफाइड एनजीओ क्लेम कर सकते हैं। फोन नंबर क्लेम के बाद ही दिखते हैं।', hg: 'Sirf verified NGOs claim kar sakte hain. Phone number claim ke baad hi dikhta hai.' },
  home_cta_title: { en: 'Start today', hi: 'आज ही शुरू करें', hg: 'Aaj hi shuruaat karein' },
  home_cta_desc: { en: 'Don\'t waste surplus food. Post a listing and make a difference.', hi: 'बचा हुआ खाना बर्बाद न करें। एक लिस्टिंग पोस्ट करें और फर्क लाएं।', hg: 'Surplus khana waste mat karo. Ek listing post karo aur farq laao.' },
  home_cta_donor: { en: 'Become a Donor', hi: 'दाता बनें', hg: 'Donor banein' },
  home_cta_board: { en: 'View board', hi: 'बोर्ड देखें', hg: 'Board dekhein' },

  // Board
  board_title: { en: 'Live Board', hi: 'लाइव बोर्ड', hg: 'Live Board' },
  board_sub: { en: 'All surplus listings with status, countdown, and match suggestions.', hi: 'सभी सरप्लस लिस्टिंग — स्टेटस, काउंटडाउन, और मैच सुझाव के साथ।', hg: 'Saare surplus listings — status, countdown aur match ke saath.' },
  board_search: { en: 'Search by area, donor, or food...', hi: 'क्षेत्र, दाता, या खाना से खोजें...', hg: 'Area, donor ya food se search karein...' },
  board_filter_all: { en: 'All', hi: 'सभी', hg: 'All' },
  board_filter_forecast: { en: 'Forecast', hi: 'फोरकास्ट', hg: 'Forecast' },
  board_filter_ready: { en: 'Ready', hi: 'रेडी', hg: 'Ready' },
  board_filter_claimed: { en: 'Claimed', hi: 'क्लेम्ड', hg: 'Claimed' },
  board_filter_all_food: { en: 'All food', hi: 'सभी खाना', hg: 'All food' },
  board_no_listings: { en: 'No listings found', hi: 'कोई लिस्टिंग नहीं मिली', hg: 'Koi listing nahi mili' },
  board_no_listings_sub: { en: 'Change filters or check back later.', hi: 'फिल्टर बदलें या बाद में जांचें।', hg: 'Filter badalein ya thodi der baad check karein.' },
  board_claim: { en: 'Claim', hi: 'क्लेम करें', hg: 'Claim karein' },
  board_claim_confirm: { en: 'Confirm claim', hi: 'क्लेम कन्फर्म करें', hg: 'Claim confirm karein' },
  board_claim_cancel: { en: 'Cancel', hi: 'रद्द करें', hg: 'Cancel' },
  board_claim_reminder: { en: 'Pick up within 30 minutes, otherwise the listing will be released.', hi: '30 मिनट के भीतर पिकअप करें, अन्यथा लिस्टिंग रिलीज़ हो जाएगी।', hg: '30 minute ke andar pickup karein, warna listing release ho jayegi.' },
  board_forecast_hint: { en: 'Forecast — claiming opens when the donor marks it as ready', hi: 'फोरकास्ट — दाता द्वारा रेडी चिह्नित करने पर क्लेम खुलेगा', hg: 'Forecast hai — donor "Ready" dabane par claim khulega' },
  board_expired: { en: 'Time expired — listing closed', hi: 'समय समाप्त — लिस्टिंग बंद', hg: 'Time khatam — listing band' },
  board_best_match: { en: 'Best match suggestions', hi: 'सर्वश्रेष्ठ मैच सुझाव', hg: 'Best match suggestions' },

  // Common
  food_veg: { en: 'Veg', hi: 'वेज', hg: 'Veg' },
  food_nonveg: { en: 'Non-Veg', hi: 'नॉन-वेज', hg: 'Non-Veg' },
  food_dry: { en: 'Dry / Packaged', hi: 'ड्राई / पैक्ड', hg: 'Dry / Packaged' },
  status_forecast: { en: 'Forecast', hi: 'फोरकास्ट', hg: 'Aaj bachega' },
  status_ready: { en: 'Ready', hi: 'रेडी', hg: 'Ready hai' },
  status_claimed: { en: 'Claimed', hi: 'क्लेम्ड', hg: 'Claimed' },
  status_completed: { en: 'Completed', hi: 'पूर्ण', hg: 'Complete' },
  status_expired: { en: 'Expired', hi: 'समय समाप्त', hg: 'Time khatam' },
  status_noshow: { en: 'No-show', hi: 'नो-शो', hg: 'No-show' },
  safe_for: { en: 'Safe for', hi: 'सेफ', hg: 'Safe for' },
  time_khatam: { en: 'Expired', hi: 'समय समाप्त', hg: 'Time khatam' },
  disclaimer: { en: 'Food Bridge only connects donors and NGOs. Food safety is the donor\'s responsibility.', hi: 'फूड ब्रिज केवल दाता और एनजीओ को जोड़ता है। खाने की सुरक्षा दाता की ज़िम्मेदारी है।', hg: 'Food Bridge sirf connection karata hai. Khane ki safety donor ki zimmedari hai.' },
  ngo_pickup: { en: 'NGO pickup', hi: 'एनजीओ पिकअप', hg: 'NGO pickup' },
  donor_drop: { en: 'Donor drop (3-5 km)', hi: 'दाता ड्रॉप (3-5 किमी)', hg: 'Donor drop (3-5 km)' },
  helper_pickup: { en: 'Helper pickup', hi: 'सहायक पिकअप', hg: 'Helper pickup' },
  people: { en: 'people', hi: 'लोग', hg: 'log' },
  people_ka: { en: 'meals for', hi: 'के लिए भोजन', hg: 'log ka' },

  // Donor page
  donor_dashboard: { en: 'Donor Dashboard', hi: 'दाता डैशबोर्ड', hg: 'Donor Dashboard' },
  donor_reliability: { en: 'Reliability', hi: 'विश्वसनीयता', hg: 'Reliability' },
  donor_meals: { en: 'Meals rescued', hi: 'भोजन बचाया', hg: 'Meals rescued' },
  donor_monthly: { en: 'This month you saved', hi: 'इस महीने आपने बचाया', hg: 'Is mahine aapne bachaya' },
  donor_monthly2: { en: 'meals. Keep it up!', hi: 'भोजन। ऐसे ही जारी रखें!', hg: 'logon ka khana. Keep it up!' },
  donor_quick_title: { en: 'Quick Listing', hi: 'क्विक लिस्टिंग', hg: 'Quick Listing' },
  donor_quick_sub: { en: 'Just type and AI fills the form — review required before posting', hi: 'बस टाइप करें और AI फॉर्म भर देगा — पोस्ट करने से पहले समीक्षा आवश्यक', hg: 'Bas likhiye, AI form bhar dega — review zaroori hai' },
  donor_quick_placeholder: { en: 'e.g. 80 veg meals left, safe for 3 hours, Indirapuram', hi: 'जैसे 80 वेज भोजन बचे, 3 घंटे सेफ, इंदिरापुरम', hg: 'aaj 80 log ka veg khana bacha, 3 ghante safe, Indirapuram' },
  donor_quick_btn: { en: 'Fill form with AI', hi: 'AI से फॉर्म भरें', hg: 'AI se form bharayein' },
  donor_quick_loading: { en: 'AI is processing...', hi: 'AI प्रोसेस कर रहा है...', hg: 'AI soch raha hai...' },
  donor_quick_note: { en: 'AI only fills the form. Safety is decided by the donor.', hi: 'AI केवल फॉर्म भरता है। सुरक्षा दाता द्वारा तय होती है।', hg: 'AI sirf form fill karta hai. Safety donor ka decision hai.' },
  donor_form_title: { en: 'Listing details', hi: 'लिस्टिंग विवरण', hg: 'Listing details' },
  donor_food_type: { en: 'Food type', hi: 'खाने का प्रकार', hg: 'Food type' },
  donor_qty: { en: 'How many people?', hi: 'कितने लोगों के लिए?', hg: 'Kitne log ka khana?' },
  donor_food_desc: { en: 'What food?', hi: 'खाना क्या है?', hg: 'Khana kya hai?' },
  donor_food_desc_ph: { en: 'e.g. Rice, dal, vegetables, roti', hi: 'जैसे चावल, दाल, सब्ज़ी, रोटी', hg: 'Daal, chawal, sabzi, roti' },
  donor_status: { en: 'Status', hi: 'स्टेटस', hg: 'Status' },
  donor_status_forecast: { en: 'Forecast', hi: 'फोरकास्ट', hg: 'Aaj bachega' },
  donor_status_ready: { en: 'Ready now', hi: 'अभी रेडी', hg: 'Ready hai' },
  donor_safe_hours: { en: 'Safe for how many hours?', hi: 'कितने घंटे सेफ?', hg: 'Safe kitne ghante?' },
  donor_area: { en: 'Area', hi: 'क्षेत्र', hg: 'Area' },
  donor_pickup_method: { en: 'Pickup method', hi: 'पिकअप तरीका', hg: 'Pickup method' },
  donor_pickup_window: { en: 'Pickup window', hi: 'पिकअप समय', hg: 'Pickup window' },
  donor_pickup_window_ph: { en: 'e.g. After 6 PM', hi: 'जैसे शाम 6 बजे के बाद', hg: 'Shaam 6 PM ke baad' },
  donor_assign_helper: { en: 'Assign helper', hi: 'सहायक असाइन करें', hg: 'Helper assign karein' },
  donor_select_helper: { en: 'Select a helper', hi: 'सहायक चुनें', hg: 'Helper select karein' },
  donor_no_helper: { en: 'No helpers added yet', hi: 'अभी कोई सहायक नहीं जोड़ा गया', hg: 'Abhi koi helper nahi hai' },
  donor_check1: { en: 'Food was made today, is covered, and is fresh.', hi: 'खाना आज बना है, ढका हुआ है, और ताज़ा है।', hg: 'Khana aaj bana hai, covered hai aur fresh hai.' },
  donor_check2: { en: 'Food has not been outside more than 4 hours and is not leftover from anyone\'s plate.', hi: 'खाना 4 घंटे से अधिक बाहर नहीं रखा और किसी की प्लेट से बचा हुआ नहीं है।', hg: 'Khana 4 ghante se zyada bahar nahi rakha aur kisi ki plate se bacha hua nahi hai.' },
  donor_post: { en: 'Post listing', hi: 'लिस्टिंग पोस्ट करें', hg: 'Listing post karein' },
  donor_my_listings: { en: 'My listings', hi: 'मेरी लिस्टिंग', hg: 'Meri listings' },
  donor_mark_ready: { en: 'Mark as ready', hi: 'रेडी चिह्नित करें', hg: 'Khana ready hai' },
  donor_show_code: { en: 'Show handover code', hi: 'हैंडओवर कोड दिखाएं', hg: 'Handover code dekhein' },
  donor_hide_code: { en: 'Hide code', hi: 'कोड छुपाएं', hg: 'Code chupayein' },
  donor_handover_code: { en: 'Handover Code', hi: 'हैंडओवर कोड', hg: 'Handover Code' },
  donor_handover_note: { en: 'Give this code to the NGO/helper at pickup. Delivery is confirmed only after the code is entered.', hi: 'पिकअप पर इस कोड को एनजीओ/सहायक को दें। कोड दर्ज करने के बाद ही डिलीवरी की पुष्टि होती है।', hg: 'Pickup par NGO/helper ko ye code dena hai. Code enter hone par hi delivery confirm hogi.' },
  donor_success: { en: 'Listing posted! It is now live on the board.', hi: 'लिस्टिंग पोस्ट हो गई! यह अब बोर्ड पर लाइव है।', hg: 'Listing post ho gayi! Board par live hai.' },
  donor_ai_done: { en: 'AI filled the form! Please review and edit before posting.', hi: 'AI ने फॉर्म भर दिया! कृपया पोस्ट करने से पहले समीक्षा करें।', hg: 'AI ne form bhar diya! Review karke edit karein, phir post karein.' },
  donor_no_listings: { en: 'No listings yet.', hi: 'अभी कोई लिस्टिंग नहीं है।', hg: 'Abhi koi listing nahi hai.' },
  donor_form_error: { en: 'Please fill all fields.', hi: 'कृपया सभी फ़ील्ड भरें।', hg: 'Saare fields bhariye.' },
  donor_safety_error: { en: 'Both safety checkboxes must be checked.', hi: 'दोनों सुरक्षा चेकबॉक्स टिक करना आवश्यक है।', hg: 'Dono safety checkboxes tick karna zaroori hai.' },

  // Team section
  team_title: { en: 'My Team', hi: 'मेरी टीम', hg: 'My Team' },
  team_sub: { en: 'Add helpers who can do pickups for you', hi: 'सहायक जोड़ें जो आपके लिए पिकअप कर सकें', hg: 'Helpers add karein jo aapke liye pickup kar sakein' },
  team_add_helper: { en: 'Add Helper', hi: 'सहायक जोड़ें', hg: 'Add Helper' },
  team_helper_name: { en: 'Helper name', hi: 'सहायक का नाम', hg: 'Helper ka naam' },
  team_helper_phone: { en: 'Helper phone', hi: 'सहायक का फोन', hg: 'Helper ka phone' },
  team_add: { en: 'Add', hi: 'जोड़ें', hg: 'Add' },
  team_no_helpers: { en: 'No helpers added yet. Add one to enable helper pickups.', hi: 'अभी कोई सहायक नहीं है। सहायक पिकअप के लिए एक जोड़ें।', hg: 'Abhi koi helper nahi. Helper pickup ke liye add karein.' },
  team_helper_added: { en: 'Helper added! They can now log in as a volunteer.', hi: 'सहायक जोड़ा गया! वे अब वॉलंटियर के रूप में लॉगिन कर सकते हैं।', hg: 'Helper add ho gaya! Ab ye volunteer ke roop mein login kar sakta hai.' },

  // NGO page
  ngo_dashboard: { en: 'NGO Dashboard', hi: 'एनजीओ डैशबोर्ड', hg: 'NGO Dashboard' },
  ngo_verified: { en: 'Verified', hi: 'वेरिफाइड', hg: 'Verified' },
  ngo_pending_verification: { en: 'Pending verification', hi: 'वेरिफिकेशन लंबित', hg: 'Verification pending' },
  ngo_meals_received: { en: 'Meals received', hi: 'भोजन प्राप्त', hg: 'Meals received' },
  ngo_needs_title: { en: 'Today\'s needs', hi: 'आज की ज़रूरतें', hg: 'Aaj ki needs' },
  ngo_needs_people: { en: 'How many people?', hi: 'कितने लोगों के लिए?', hg: 'Kitne log ke liye?' },
  ngo_food_pref: { en: 'Food preference', hi: 'खाना पसंद', hg: 'Food preference' },
  ngo_pickup_window: { en: 'Pickup window', hi: 'पिकअप समय', hg: 'Pickup window' },
  ngo_needs_submit: { en: 'Update needs', hi: 'ज़रूरतें अपडेट करें', hg: 'Needs update karein' },
  ngo_needs_done: { en: 'Needs updated! Donors can see them now.', hi: 'ज़रूरतें अपडेट हो गई! दाता अब देख सकते हैं।', hg: 'Needs update ho gayi! Donors ko dikh rahi hai.' },
  ngo_handover_title: { en: 'Confirm handover', hi: 'हैंडओवर कन्फर्म करें', hg: 'Handover confirm' },
  ngo_handover_desc: { en: 'Enter the 4-digit code from the donor at pickup to confirm delivery.', hi: 'पिकअप पर दाता से 4-अंक का कोड लें और डिलीवरी की पुष्टि करें।', hg: 'Pickup par donor se 4-digit code lo aur confirm karein.' },
  ngo_handover_code_label: { en: '4-digit handover code', hi: '4-अंक का हैंडओवर कोड', hg: '4-digit handover code' },
  ngo_handover_confirm: { en: 'Confirm', hi: 'कन्फर्म करें', hg: 'Confirm karein' },
  ngo_handover_success: { en: 'Handover confirmed! Delivery complete.', hi: 'हैंडओवर कन्फर्म! डिलीवरी पूर्ण।', hg: 'Handover confirm! Delivery complete.' },
  ngo_handover_error: { en: 'Wrong code. Try again.', hi: 'गलत कोड। दोबारा कोशिश करें।', hg: 'Galat code. Dobara try karein.' },
  ngo_noshow_reminder: { en: 'Pick up within 30 minutes, otherwise the listing will be released and the next NGO will be alerted.', hi: '30 मिनट के भीतर पिकअप करें, अन्यथा लिस्टिंग रिलीज़ हो जाएगी और अगले एनजीओ को अलर्ट जाएगा।', hg: '30 minute ke andar pickup karein, warna listing release ho jayegi aur next NGO ko alert jayega.' },
  ngo_claimed_title: { en: 'Claimed pickups', hi: 'क्लेम किए पिकअप', hg: 'Claimed pickups' },
  ngo_no_claims: { en: 'No claimed pickups yet.', hi: 'अभी कोई क्लेम पिकअप नहीं है।', hg: 'Abhi koi claimed pickup nahi hai.' },
  ngo_no_claims_sub: { en: 'Claim a listing from the board.', hi: 'बोर्ड से एक लिस्टिंग क्लेम करें।', hg: 'Board se listing claim karein.' },
  ngo_monthly: { en: 'This month you received', hi: 'इस महीने आपको प्राप्त हुए', hg: 'Is mahine aapne receive kiya' },
  ngo_monthly2: { en: 'meals. Your people got fed!', hi: 'भोजन। आपके लोगों को खाना मिला!', hg: 'meals. Aapke logon ko khana mila!' },

  // Volunteer page
  volunteer_dashboard: { en: 'My Tasks', hi: 'मेरे कार्य', hg: 'Mere Tasks' },
  volunteer_sub: { en: 'Pickups assigned to you', hi: 'आपको असाइन किए गए पिकअप', hg: 'Aapko assigned pickups' },
  volunteer_no_tasks: { en: 'No tasks assigned to you yet.', hi: 'अभी आपको कोई कार्य असाइन नहीं किया गया।', hg: 'Abhi koi task assigned nahi hai.' },
  volunteer_no_tasks_sub: { en: 'When a donor or NGO assigns you a pickup, it will appear here.', hi: 'जब कोई दाता या एनजीओ आपको पिकअप असाइन करेगा, यह यहां दिखेगा।', hg: 'Jab donor ya NGO aapko pickup assign karega, yahan dikhega.' },
  volunteer_donor_phone: { en: 'Donor phone', hi: 'दाता फोन', hg: 'Donor phone' },
  volunteer_ngo_phone: { en: 'NGO phone', hi: 'एनजीओ फोन', hg: 'NGO phone' },
  volunteer_pickup_from: { en: 'Pickup from', hi: 'पिकअप स्थान', hg: 'Pickup from' },
  volunteer_deliver_to: { en: 'Deliver to', hi: 'डिलीवरी स्थान', hg: 'Deliver to' },
  volunteer_task_status: { en: 'Status', hi: 'स्थिति', hg: 'Status' },

  // Admin
  admin_title: { en: 'Admin Panel', hi: 'एडमिन पैनल', hg: 'Admin Panel' },
  admin_sub: { en: 'Monitor everything — NGOs, donors, helpers, listings.', hi: 'सब कुछ मॉनिटर करें — एनजीओ, दाता, सहायक, लिस्टिंग।', hg: 'Sab monitor karein — NGOs, donors, helpers, listings.' },
  admin_tab_overview: { en: 'Overview', hi: 'ओवरव्यू', hg: 'Overview' },
  admin_tab_ngos: { en: 'NGOs', hi: 'एनजीओ', hg: 'NGOs' },
  admin_tab_donors: { en: 'Donors', hi: 'दाता', hg: 'Donors' },
  admin_tab_listings: { en: 'Listings', hi: 'लिस्टिंग', hg: 'Listings' },
  admin_tab_helpers: { en: 'Helpers', hi: 'सहायक', hg: 'Helpers' },
  admin_total_donors: { en: 'Total donors', hi: 'कुल दाता', hg: 'Total donors' },
  admin_total_ngos: { en: 'Total NGOs', hi: 'कुल एनजीओ', hg: 'Total NGOs' },
  admin_active: { en: 'Active listings', hi: 'सक्रिय लिस्टिंग', hg: 'Active listings' },
  admin_pending: { en: 'Pending approvals', hi: 'लंबित स्वीकृतियां', hg: 'Pending approvals' },
  admin_queue: { en: 'Approval queue', hi: 'स्वीकृति कतार', hg: 'Approval queue' },
  admin_approve: { en: 'Approve', hi: 'स्वीकृत करें', hg: 'Approve' },
  admin_reject: { en: 'Reject', hi: 'अस्वीकृत करें', hg: 'Reject' },
  admin_pending_ver: { en: 'Pending verification', hi: 'वेरिफिकेशन लंबित', hg: 'Pending verification' },
  admin_verified_ngos: { en: 'Verified NGOs', hi: 'वेरिफाइड एनजीओ', hg: 'Verified NGOs' },
  admin_recent: { en: 'Recent listings', hi: 'हाल की लिस्टिंग', hg: 'Recent listings' },
  admin_reassign: { en: 'Reassign', hi: 'पुनः असाइन करें', hg: 'Reassign' },
  admin_helpers_list: { en: 'Helpers', hi: 'सहायक', hg: 'Helpers' },
  admin_helper_owner: { en: 'Team owner', hi: 'टीम स्वामी', hg: 'Team owner' },
  admin_no_helpers: { en: 'No helpers added yet.', hi: 'अभी कोई सहायक नहीं जोड़ा गया।', hg: 'Abhi koi helper nahi hai.' },

  // Footer
  footer_desc: { en: 'Rescuing surplus food and delivering it to NGOs and shelters. Ghaziabad pilot — connecting professional donors and verified NGOs. Food safety is the donor\'s responsibility.', hi: 'बचे हुए खाना को बचाकर एनजीओ और शेल्टर तक पहुंचाना। गाज़ियाबाद पायलट — प्रोफेशनल दाताओं और वेरिफाइड एनजीओ को जोड़ना। खाने की सुरक्षा दाता की ज़िम्मेदारी है।', hg: 'Surplus khana bachakar NGO aur shelter tak pohochana. Ghaziabad pilot — professional donors aur verified NGOs ko connect karna. Safety donor ki zimmedari hai.' },
  footer_contact: { en: 'Contact', hi: 'संपर्क', hg: 'Contact' },
  footer_important: { en: 'Important', hi: 'महत्वपूर्ण', hg: 'Important' },
  footer_safety: { en: 'Food Bridge only connects donors and NGOs', hi: 'फूड ब्रिज केवल दाता और एनजीओ को जोड़ता है', hg: 'Food Bridge sirf connection karata hai' },
  footer_safety2: { en: 'Safety is the donor\'s responsibility', hi: 'सुरक्षा दाता की ज़िम्मेदारी है', hg: 'Safety donor ki zimmedari hai' },
  footer_sameday: { en: 'Same-day fresh food only', hi: 'केवल सेम-डे ताज़ा खाना', hg: 'Sirf same-day fresh food' },
  footer_made: { en: 'Made with care for Ghaziabad. Food Bridge © 2025.', hi: 'गाज़ियाबाद के लिए प्रेम से बनाया गया। फूड ब्रिज © 2025।', hg: 'Ghaziabad ke liye care se banaya. Food Bridge © 2025.' },
};

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('fb-lang');
    return (saved === 'en' || saved === 'hi' || saved === 'hg') ? saved : 'en';
  });

  const setLangPersist = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('fb-lang', newLang);
  };

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangPersist, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
