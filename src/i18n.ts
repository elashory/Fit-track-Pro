import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "FitTrack Pro",
      "dashboard": "Dashboard",
      "tracker": "Tracker",
      "exercises": "Exercises",
      "login": "Login with Google",
      "logout": "Logout",
      "level": "Level",
      "xp": "XP",
      "weight": "Weight (kg)",
      "protein": "Protein (g)",
      "carbs": "Carbs (g)",
      "fats": "Fats (g)",
      "waist": "Waist (cm)",
      "waist_belly_button": "Waist at Belly Button (cm)",
      "r_arm": "Right Arm (cm)",
      "l_arm": "Left Arm (cm)",
      "r_leg": "Right Leg (cm)",
      "l_leg": "Left Leg (cm)",
      "save": "Save Log",
      "date": "Date",
      "macros": "Macros",
      "measurements": "Measurements",
      "no_data": "No data available yet.",
      "exercise_library": "Exercise Guide",
      "search_exercises": "Search exercises...",
      "sources": "Sources",
      "video_demo": "Video Demonstration",
      "3d_model": "3D Model",
      "close": "Close",
      "log_saved": "Log saved successfully!",
      "error_saving": "Error saving log.",
      "welcome_back": "Welcome back, {{name}}!",
      "gamification_message": "Keep logging to level up!",
      "instructions": "Instructions",
      "tips": "Tips",
      "instructions_and_tips": "Instructions & Tips",
      "workout": "Workout",
      "alternatives": "Alternatives",
      "exercise_progress": "Exercise Progress",
      "avg_weight": "Avg Weight"
    }
  },
  ar: {
    translation: {
      "app_title": "فيت تراك برو",
      "dashboard": "لوحة القيادة",
      "tracker": "المتتبع",
      "exercises": "التمارين",
      "login": "تسجيل الدخول بجوجل",
      "logout": "تسجيل الخروج",
      "level": "المستوى",
      "xp": "نقاط الخبرة",
      "weight": "الوزن (كجم)",
      "protein": "بروتين (جم)",
      "carbs": "كربوهيدرات (جم)",
      "fats": "دهون (جم)",
      "waist": "الخصر (سم)",
      "waist_belly_button": "الخصر عند السرة (سم)",
      "r_arm": "الذراع الأيمن (سم)",
      "l_arm": "الذراع الأيسر (سم)",
      "r_leg": "الساق اليمنى (سم)",
      "l_leg": "الساق اليسرى (سم)",
      "save": "حفظ السجل",
      "date": "التاريخ",
      "macros": "العناصر الغذائية",
      "measurements": "القياسات",
      "no_data": "لا توجد بيانات متاحة بعد.",
      "exercise_library": "دليل التمارين",
      "search_exercises": "ابحث عن التمارين...",
      "sources": "المصادر",
      "video_demo": "فيديو توضيحي",
      "3d_model": "نموذج ثلاثي الأبعاد",
      "close": "إغلاق",
      "log_saved": "تم حفظ السجل بنجاح!",
      "error_saving": "خطأ في حفظ السجل.",
      "welcome_back": "مرحباً بعودتك، {{name}}!",
      "gamification_message": "استمر في التسجيل لرفع مستواك!",
      "instructions": "التعليمات",
      "tips": "النصائح",
      "instructions_and_tips": "التعليمات والنصائح",
      "workout": "التمرين",
      "alternatives": "البدائل المقترحة",
      "exercise_progress": "تطور الأوزان في التمارين",
      "avg_weight": "متوسط الوزن"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // Default language is Arabic as requested
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
