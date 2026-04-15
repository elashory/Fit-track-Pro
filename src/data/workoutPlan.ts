export const workoutPhases = [
  {
    id: 'strength',
    nameEn: 'Strength',
    nameAr: 'القوة (Strength)',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    days: [
      {
        id: 's_d1',
        nameEn: 'Day #1: Legs',
        nameAr: 'اليوم الأول: أرجل',
        exercises: [
          { nameEn: 'Lying Leg Curl', nameAr: 'رفرفة أرجل خلفي نائم', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
          { nameEn: 'Seated Calf Raises', nameAr: 'سمانة جالس', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Barbell Squat', nameAr: 'سكوات بالبار', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'Barbell Romanian Deadlift', nameAr: 'رفعة مميتة رومانية', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
          { nameEn: 'Adductors', nameAr: 'ضم الساقين (جهاز)', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Abductors', nameAr: 'فتح الساقين (جهاز)', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
        ]
      },
      {
        id: 's_d2',
        nameEn: 'Day #2: Push',
        nameAr: 'اليوم الثاني: دفع',
        exercises: [
          { nameEn: 'Incline DB Press', nameAr: 'ضغط دمبل عالي', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'DB Shoulder Press', nameAr: 'ضغط كتف دمبل', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'Decline Press Machine', nameAr: 'ضغط جهاز سفلي', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'Chest Supported Lateral Raise', nameAr: 'رفرفة جانبي مع استناد الصدر', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
          { nameEn: 'Overhead Cable Tricep Ext.', nameAr: 'ترايسبس كابل فوق الرأس', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
        ]
      },
      {
        id: 's_d3',
        nameEn: 'Day #3: Pull',
        nameAr: 'اليوم الثالث: سحب',
        exercises: [
          { nameEn: 'Cable Low Lat Row', nameAr: 'سحب أرضي ضيق', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'Pronated Grip Lat Pulldown', nameAr: 'سحب عالي قبضة واسعة', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'Deadlift', nameAr: 'رفعة مميتة', sets: [{ type: 'TS', reps: '6-10' }, { type: 'BF', reps: '6-10' }] },
          { nameEn: 'CS Upper Back Row Machine', nameAr: 'تجديف جهاز للظهر العلوي', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
          { nameEn: 'DB Upright Row (single arm) SS Shrugs', nameAr: 'سحب عمودي دمبل + شراغز', isSuperset: true, sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
          { nameEn: 'Machine Preacher Curl', nameAr: 'بايسبس ارتكاز جهاز', sets: [{ type: 'TS', reps: '8-12' }, { type: 'BF', reps: '8-12' }] },
        ]
      }
    ]
  },
  {
    id: 'hypertrophy',
    nameEn: 'Hypertrophy',
    nameAr: 'الضخامة (Hypertrophy)',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    days: [
      {
        id: 'h_d1',
        nameEn: 'Day #1: Legs',
        nameAr: 'اليوم الأول: أرجل',
        exercises: [
          { nameEn: 'Seated Leg Curl', nameAr: 'رفرفة أرجل خلفي جالس', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Leg Press Machine', nameAr: 'مكبس أرجل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Bulgarian Split Squat', nameAr: 'سكوات بلغاري', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Barbell Romanian Deadlift', nameAr: 'رفعة مميتة رومانية', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Leg Extension', nameAr: 'رفرفة أرجل أمامي', sets: [{ type: 'TS', reps: '12-15' }, { type: 'BF', reps: '12-15' }] },
          { nameEn: 'Standing Calf raises', nameAr: 'سمانة واقف', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
        ]
      },
      {
        id: 'h_d2',
        nameEn: 'Day #2: Chest & Arms',
        nameAr: 'اليوم الثاني: صدر وذراعين',
        exercises: [
          { nameEn: 'Incline Machine Press', nameAr: 'ضغط جهاز عالي', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'Machine Flat Press', nameAr: 'ضغط جهاز مستوي', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'High To Low Cable Fly (Decline)', nameAr: 'تفتيح كابل من أعلى لأسفل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Low To High Cable Fly (Incline)', nameAr: 'تفتيح كابل من أسفل لأعلى', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Tricep Cable Kickback', nameAr: 'ترايسبس كيك باك كابل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Machine Preacher Curl', nameAr: 'بايسبس ارتكاز جهاز', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Overhead Tricep Cable Ext.', nameAr: 'ترايسبس كابل فوق الرأس', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'DB Incline Curl', nameAr: 'بايسبس دمبل على مقعد مائل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'DB Hammer Curl', nameAr: 'بايسبس شاكوش دمبل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
        ]
      },
      {
        id: 'h_d3',
        nameEn: 'Day #3: Shoulders & Back',
        nameAr: 'اليوم الثالث: أكتاف وظهر',
        exercises: [
          { nameEn: 'Cable Lat Pull-down', nameAr: 'سحب عالي كابل', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'Shoulder Press Machine', nameAr: 'ضغط كتف جهاز', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'CS Upper Back Row Machine', nameAr: 'تجديف جهاز للظهر العلوي', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'CS Low Lat Back Row Machine', nameAr: 'تجديف جهاز للمجانص', sets: [{ type: 'TS', reps: '10-12' }, { type: 'BF', reps: '10-12' }] },
          { nameEn: 'Machine Lateral Raises', nameAr: 'رفرفة جانبي جهاز', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Reverse Pec Dec (rear delt)', nameAr: 'فراشة كتف خلفي', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Single Arm DB Upright Row', nameAr: 'سحب عمودي دمبل ذراع واحد', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'DB Front Raise', nameAr: 'رفرفة أمامي دمبل', sets: [{ type: 'TS', reps: '10-15' }, { type: 'BF', reps: '10-15' }] },
          { nameEn: 'Cable Straight Arm Pull-Over', nameAr: 'سحب كابل ذراع مستقيم', sets: [{ type: 'TS', reps: '10-20' }, { type: 'BF', reps: '10-20' }] },
        ]
      }
    ]
  },
  {
    id: 'metabolic',
    nameEn: 'Metabolic Fatigue',
    nameAr: 'الإجهاد الأيضي (Metabolic)',
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    days: [
      {
        id: 'm_d1',
        nameEn: 'Day #1: Legs',
        nameAr: 'اليوم الأول: أرجل',
        exercises: [
          { nameEn: 'Adduction SS Abduction', nameAr: 'ضم + فتح الساقين', isSuperset: true, sets: [{ type: 'TS/1', reps: '15-20' }, { type: 'BF/2', reps: '15-20' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Glute Kickback Machine', nameAr: 'رفس خلفي جهاز', sets: [{ type: 'TS/1', reps: '10-15' }, { type: 'BF/2', reps: '10-15' }, { type: 'BF/3', reps: '10-15' }] },
          { nameEn: 'Leg Extension', nameAr: 'رفرفة أمامي', sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Seated Hamstring Curl', nameAr: 'رفرفة خلفي جالس', sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Leg Press (Wide then Narrow)', nameAr: 'مكبس أرجل (واسع ثم ضيق)', sets: [{ type: 'TS/1', reps: '12-15 ea' }, { type: 'BF/2', reps: '12-15' }, { type: 'BF/3', reps: '12-15' }] },
          { nameEn: 'Walking Lunges (each leg)', nameAr: 'طعن متحرك', sets: [{ type: 'TS/1', reps: '10-15' }, { type: 'BF/2', reps: '10-15' }, { type: 'BF/3', reps: '12-15' }] },
          { nameEn: 'DB Romanian Deadlift', nameAr: 'رفعة مميتة رومانية دمبل', sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Standing Calf raises', nameAr: 'سمانة واقف', sets: [{ type: 'TS/1', reps: 'Fail' }, { type: 'BF/2', reps: 'Fail' }, { type: 'BF/3', reps: 'Fail' }] },
        ]
      },
      {
        id: 'm_d2',
        nameEn: 'Day #2: Chest & Back',
        nameAr: 'اليوم الثاني: صدر وظهر',
        exercises: [
          { nameEn: 'Chest Fly SS Rear Delt Flies', nameAr: 'تفتيح صدر + تفتيح كتف خلفي', isSuperset: true, sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Machine Flat Press SS Machine Row', nameAr: 'ضغط مستوي جهاز + تجديف جهاز', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-12' }] },
          { nameEn: 'D-Handle Lat-Pulldown SS Incline Machine Press', nameAr: 'سحب عالي + ضغط عالي جهاز', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-15' }] },
          { nameEn: 'Low Row Machine SS Dips/ Decline press', nameAr: 'سحب أرضي + متوازي/ضغط سفلي', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-15' }] },
          { nameEn: 'Low to High Chest Fly SS Cable Lat Pull-Over', nameAr: 'تفتيح سفلي + سحب كابل للظهر', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-15' }] },
        ]
      },
      {
        id: 'm_d3',
        nameEn: 'Day #3: Shoulders & Arms',
        nameAr: 'اليوم الثالث: أكتاف وذراعين',
        exercises: [
          { nameEn: 'Cable Lateral Raises', nameAr: 'رفرفة جانبي كابل', sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'DB Arnold Press', nameAr: 'ضغط أرنولد دمبل', sets: [{ type: 'TS/1', reps: '20' }, { type: 'BF/2', reps: '15' }, { type: 'BF/3', reps: '12' }] },
          { nameEn: 'Front Raise SS Lateral Raise SS Rear Pulls', nameAr: 'أمامي + جانبي + خلفي (Giant Set)', isSuperset: true, sets: [{ type: 'TS/1', reps: '15ea' }, { type: 'BF/2', reps: '15ea' }, { type: 'BF/3', reps: '15ea' }] },
          { nameEn: 'Tricep Kickbacks SS Spider Curls', nameAr: 'كيك باك + سبايدر كيرل', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-12' }] },
          { nameEn: 'Reverse Curls SS Tricep Pushdowns', nameAr: 'بايسبس عكسي + ترايسبس سحب', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-15' }] },
          { nameEn: 'Incline Curl SS Over-Head Extension', nameAr: 'بايسبس مائل + ترايسبس فوق الرأس', isSuperset: true, sets: [{ type: 'TS/1', reps: '12-20' }, { type: 'BF/2', reps: '12-20' }, { type: 'BF/3', reps: '10-15' }] },
        ]
      }
    ]
  }
];
