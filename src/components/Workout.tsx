import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, CheckCircle2, Timer, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';
import { workoutPhases } from '../data/workoutPlan';
import { exercises } from '../data/exercises';
import { toast } from 'sonner';
import { saveWorkoutSet } from '../lib/firebase-utils';
import { auth } from '../firebase';
import { format } from 'date-fns';

export default function Workout({ user }: { user: any }) {
  const { t, i18n } = useTranslation();
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showDeload, setShowDeload] = useState(false);
  
  const [setInputs, setSetInputs] = useState<Record<string, {weight: string, reps: string}>>({});

  const [deloadAnswers, setDeloadAnswers] = useState({
    q1: false, q2: false, q3: false, q4: false, q5: false
  });

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      toast.success(i18n.language === 'ar' ? 'انتهى وقت الراحة!' : 'Rest time is over!');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, i18n.language]);

  // Default timer is 3.5 minutes (210 seconds)
  const startTimer = (seconds: number = 210) => {
    setTimer(seconds);
    setIsTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleInputChange = (exName: string, setIdx: number, field: 'weight'|'reps', value: string) => {
    const key = `${exName}-${setIdx}`;
    setSetInputs(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { weight: '', reps: '' }),
        [field]: value
      }
    }));
  };

  const handleDeloadSubmit = () => {
    const yesCount = Object.values(deloadAnswers).filter(Boolean).length;
    if (yesCount >= 3) {
      toast.error(i18n.language === 'ar' ? 'يجب أخذ أسبوع ديلود (راحة إيجابية)!' : 'You must take a Deload week!');
    } else {
      toast.success(i18n.language === 'ar' ? 'استمر، ابدأ الدورة التدريبية التالية!' : 'Keep going, start the next microcycle!');
    }
    setShowDeload(false);
  };

  if (showDeload) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle />
              {i18n.language === 'ar' ? 'فحص الديلود (Deload Checker)' : 'Deload Checker'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-zinc-500">
              {i18n.language === 'ar' 
                ? 'أجب عن الأسئلة التالية لتحديد ما إذا كنت بحاجة إلى راحة إيجابية (ديلود):' 
                : 'Answer the following questions to determine if you need a deload:'}
            </p>
            
            <div className="space-y-4">
              {[
                { id: 'q1', textAr: 'هل تفتقد الرغبة في الذهاب للصالة؟', textEn: 'Do you lack the motivation to go to the gym?' },
                { id: 'q2', textAr: 'هل جودة نومك أسوأ من المعتاد؟', textEn: 'Is your sleep quality worse than usual?' },
                { id: 'q3', textAr: 'هل أوزانك أو عداتك في تناقص؟', textEn: 'Are your weights or reps decreasing?' },
                { id: 'q4', textAr: 'هل تشعر بضغط عصبي (Stress) أعلى من الطبيعي؟', textEn: 'Do you feel higher stress levels than normal?' },
                { id: 'q5', textAr: 'هل تشعر بآلام في المفاصل أو الجسم أكثر من المعتاد؟', textEn: 'Do you feel more joint or body aches than usual?' },
              ].map((q) => (
                <div key={q.id} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={q.id} 
                    checked={deloadAnswers[q.id as keyof typeof deloadAnswers]}
                    onCheckedChange={(c) => setDeloadAnswers({...deloadAnswers, [q.id]: !!c})}
                  />
                  <Label htmlFor={q.id} className="text-base cursor-pointer">
                    {i18n.language === 'ar' ? q.textAr : q.textEn}
                  </Label>
                </div>
              ))}
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleDeloadSubmit}>
              {i18n.language === 'ar' ? 'تحليل النتيجة' : 'Analyze Result'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activePhase) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{i18n.language === 'ar' ? 'النظام التدريبي (Tansheef)' : 'Training Program (Tansheef)'}</h2>
            <p className="text-zinc-500 text-sm mt-1">{i18n.language === 'ar' ? 'نظام 9 أيام للمايكروسايكل' : '9-Day Microcycle System'}</p>
          </div>
          <Button variant="outline" onClick={() => setShowDeload(true)} className="text-orange-600 border-orange-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {i18n.language === 'ar' ? 'فحص الديلود' : 'Deload Checker'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workoutPhases.map((phase, idx) => (
            <Card key={phase.id} className={`cursor-pointer hover:border-orange-500 transition-all border-t-4 ${phase.borderColor}`} onClick={() => setActivePhase(phase.id)}>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${phase.color} bg-opacity-10 flex items-center justify-center ${phase.textColor}`}>
                  <span className="text-2xl font-bold">{idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{i18n.language === 'ar' ? phase.nameAr : phase.nameEn}</h3>
                  <p className="text-zinc-500 text-sm">3 {i18n.language === 'ar' ? 'أيام' : 'Days'}</p>
                </div>
                <Button variant="ghost" className={`w-full ${phase.textColor} hover:${phase.color} hover:text-white`}>
                  {i18n.language === 'ar' ? 'عرض الأيام' : 'View Days'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const phase = workoutPhases.find(p => p.id === activePhase);

  if (!activeDay) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setActivePhase(null)}>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Button>
          <h2 className="text-2xl font-bold">{i18n.language === 'ar' ? phase?.nameAr : phase?.nameEn}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phase?.days.map(day => (
            <Card key={day.id} className="cursor-pointer hover:border-orange-500 transition-colors" onClick={() => setActiveDay(day.id)}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    {i18n.language === 'ar' ? day.nameAr : day.nameEn}
                  </h3>
                  <p className="text-zinc-500 text-sm">{day.exercises.length} {i18n.language === 'ar' ? 'تمارين' : 'Exercises'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Play className="w-5 h-5 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const day = phase?.days.find(d => d.id === activeDay);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setActiveDay(null)}>
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{i18n.language === 'ar' ? day?.nameAr : day?.nameEn}</h2>
          <p className="text-sm text-zinc-500">{i18n.language === 'ar' ? phase?.nameAr : phase?.nameEn}</p>
        </div>
      </div>

      {isTimerActive && (
        <div className="sticky top-20 z-40 bg-zinc-900 text-white p-4 rounded-xl shadow-xl flex items-center justify-between mb-6 border border-zinc-800">
          <div className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-orange-500 animate-pulse" />
            <div>
              <p className="text-sm text-zinc-400">{i18n.language === 'ar' ? 'وقت الراحة' : 'Rest Timer'}</p>
              <p className="text-2xl font-mono font-bold">{formatTime(timer)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setTimer(t => t + 30)} className="text-zinc-900">+30s</Button>
            <Button variant="outline" size="sm" onClick={() => setIsTimerActive(false)} className="text-zinc-900">
              {i18n.language === 'ar' ? 'تخطي' : 'Skip'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {day?.exercises.map((ex, idx) => {
          const exerciseDetails = exercises.find(e => e.nameEn.toLowerCase().includes(ex.nameEn.toLowerCase()) || ex.nameEn.toLowerCase().includes(e.nameEn.toLowerCase()));
          
          return (
          <Card key={idx} className={`overflow-hidden ${ex.isSuperset ? 'border-l-4 border-l-orange-500' : ''}`}>
            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  {ex.isSuperset && <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1 block">Superset</span>}
                  <CardTitle className="text-lg">{i18n.language === 'ar' ? ex.nameAr : ex.nameEn}</CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger nativeButton={true} render={
                    <Button variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20">
                      <Play className="w-5 h-5" />
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{i18n.language === 'ar' ? ex.nameAr : ex.nameEn}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mt-4 relative">
                      {exerciseDetails?.videoUrl ? (
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={exerciseDetails.videoUrl} 
                          title={ex.nameEn} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center bg-zinc-100 dark:bg-zinc-800">
                          <Play className="w-12 h-12 mb-2 opacity-20" />
                          <p className="font-medium mb-4">{i18n.language === 'ar' ? 'الفيديو غير متوفر' : 'Video not available'}</p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <a 
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.nameEn + ' exercise tutorial')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              {i18n.language === 'ar' ? 'ابحث في يوتيوب' : 'Search YouTube'}
                            </a>
                            <a 
                              href={`https://www.google.com/search?q=${encodeURIComponent(ex.nameEn + ' exercise form tutorial video')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                              {i18n.language === 'ar' ? 'ابحث في جوجل' : 'Search Google'}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {exerciseDetails && (
                      <div className="mt-4 space-y-4 max-h-[30vh] overflow-y-auto pr-2">
                        <div>
                          <h4 className="font-semibold text-sm mb-1 text-orange-600 dark:text-orange-500">
                            {i18n.language === 'ar' ? 'طريقة الأداء:' : 'Instructions:'}
                          </h4>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {i18n.language === 'ar' ? exerciseDetails.instructionsAr : exerciseDetails.instructionsEn}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-sm mb-1 text-orange-600 dark:text-orange-500">
                            {i18n.language === 'ar' ? 'نصائح هامة:' : 'Pro Tips:'}
                          </h4>
                          <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                            {(i18n.language === 'ar' ? exerciseDetails.tipsAr : exerciseDetails.tipsEn).map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {exerciseDetails.alternatives && exerciseDetails.alternatives.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 text-orange-600 dark:text-orange-500">
                              {i18n.language === 'ar' ? 'البدائل المقترحة:' : 'Alternatives:'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {exerciseDetails.alternatives.map(altId => {
                                const altEx = exercises.find(e => e.id === altId);
                                return altEx ? <span key={altId} className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">{i18n.language === 'ar' ? altEx.nameAr : altEx.nameEn}</span> : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-zinc-500">{set.type}</span>
                        <span className="text-sm font-bold">{setIdx + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{i18n.language === 'ar' ? 'الهدف' : 'Target'}: {set.reps}</p>
                        <p className="text-xs text-zinc-500">{i18n.language === 'ar' ? 'السابق: --' : 'Prev: --'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex-1 sm:w-24">
                        <Label className="text-xs text-zinc-500 mb-1 block">{i18n.language === 'ar' ? 'الوزن' : 'Weight'}</Label>
                        <Input type="number" placeholder="kg" className="h-9" value={setInputs[`${ex.nameEn}-${setIdx}`]?.weight || ''} onChange={(e) => handleInputChange(ex.nameEn, setIdx, 'weight', e.target.value)} />
                      </div>
                      <div className="flex-1 sm:w-24">
                        <Label className="text-xs text-zinc-500 mb-1 block">{i18n.language === 'ar' ? 'العدات' : 'Reps'}</Label>
                        <Input type="number" placeholder="reps" className="h-9" value={setInputs[`${ex.nameEn}-${setIdx}`]?.reps || ''} onChange={(e) => handleInputChange(ex.nameEn, setIdx, 'reps', e.target.value)} />
                      </div>
                      <Button 
                        size="icon" 
                        className="h-9 w-9 mt-5 bg-zinc-200 hover:bg-orange-500 hover:text-white text-zinc-600 transition-colors"
                        onClick={async () => {
                          const data = setInputs[`${ex.nameEn}-${setIdx}`];
                          if (!data?.weight || !data?.reps) {
                            toast.error(i18n.language === 'ar' ? 'أدخل الوزن والعدات أولاً' : 'Enter weight and reps first');
                            return;
                          }
                          await saveWorkoutSet({
                            uid: user.uid,
                            date: format(new Date(), 'yyyy-MM-dd'),
                            exerciseName: ex.nameEn,
                            setIndex: setIdx,
                            weight: Number(data.weight),
                            reps: Number(data.reps),
                            phase: activePhase,
                            day: activeDay
                          }, auth);
                          toast.success(i18n.language === 'ar' ? 'تم تسجيل المجموعة' : 'Set logged');
                          // 210 seconds = 3.5 minutes
                          startTimer(ex.isSuperset ? 0 : 210);
                        }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
