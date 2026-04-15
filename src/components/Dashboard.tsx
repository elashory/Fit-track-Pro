import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getUserLogs, getWorkoutLogs, updateUserProfile } from '../lib/firebase-utils';
import { auth } from '../firebase';
import { Trophy, Activity, Target, Dumbbell, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Dashboard({ user, profile }: { user: any, profile: any }) {
  const { t, i18n } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [averages, setAverages] = useState({ weight: 0, carbs: 0, protein: 0, fats: 0 });
  const [prevAverages, setPrevAverages] = useState({ weight: 0, carbs: 0, protein: 0, fats: 0 });
  const [goal, setGoal] = useState<string>(profile?.goal || 'maintain');

  useEffect(() => {
    if (profile?.goal) {
      setGoal(profile.goal);
    }
  }, [profile]);

  const handleGoalChange = async (newGoal: string) => {
    setGoal(newGoal);
    try {
      await updateUserProfile(user.uid, { goal: newGoal }, auth);
      toast.success(i18n.language === 'ar' ? 'تم تحديث الهدف' : 'Goal updated');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserLogs(user.uid, auth).then(data => {
        if (data) {
          // Sort by date ascending
          const sorted = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setLogs(sorted);
          
          // Calculate 7-day averages
          const last7 = sorted.slice(-7);
          const prev7 = sorted.slice(-14, -7);

          if (last7.length > 0) {
            const sum = last7.reduce((acc, curr) => ({
              weight: acc.weight + (curr.weight || 0),
              carbs: acc.carbs + (curr.carbs || 0),
              protein: acc.protein + (curr.protein || 0),
              fats: acc.fats + (curr.fats || 0),
            }), { weight: 0, carbs: 0, protein: 0, fats: 0 });
            
            setAverages({
              weight: sum.weight / last7.length,
              carbs: sum.carbs / last7.length,
              protein: sum.protein / last7.length,
              fats: sum.fats / last7.length,
            });
          }

          if (prev7.length > 0) {
            const sumPrev = prev7.reduce((acc, curr) => ({
              weight: acc.weight + (curr.weight || 0),
              carbs: acc.carbs + (curr.carbs || 0),
              protein: acc.protein + (curr.protein || 0),
              fats: acc.fats + (curr.fats || 0),
            }), { weight: 0, carbs: 0, protein: 0, fats: 0 });
            
            setPrevAverages({
              weight: sumPrev.weight / prev7.length,
              carbs: sumPrev.carbs / prev7.length,
              protein: sumPrev.protein / prev7.length,
              fats: sumPrev.fats / prev7.length,
            });
          }
        }
      });
      
      getWorkoutLogs(user.uid, auth).then(data => {
        if (data) {
          setWorkoutLogs(data);
          const uniqueEx = Array.from(new Set(data.map(d => d.exerciseName)));
          if (uniqueEx.length > 0) setSelectedExercise(uniqueEx[0] as string);
        }
      });
    }
  }, [user]);

  // Process data for selected exercise
  const exerciseChartData = useMemo(() => {
    if (!selectedExercise || workoutLogs.length === 0) return [];
    const filtered = workoutLogs.filter(log => log.exerciseName === selectedExercise);
    
    // Group by date
    const grouped = filtered.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = { sum: 0, count: 0 };
      acc[curr.date].sum += curr.weight;
      acc[curr.date].count += 1;
      return acc;
    }, {} as Record<string, {sum: number, count: number}>);

    return Object.keys(grouped).sort().map(date => ({
      date: format(new Date(date), 'MMM dd'),
      avgWeight: Math.round((grouped[date].sum / grouped[date].count) * 10) / 10
    }));
  }, [selectedExercise, workoutLogs]);

  const xpProgress = profile ? (profile.xp / (profile.level * 100)) * 100 : 0;

  const renderTrendArrow = (current: number, previous: number, isWeight: boolean = false) => {
    if (!previous || current === previous) return <Minus className="w-4 h-4 text-zinc-400 inline ml-1" />;
    
    const isUp = current > previous;
    let colorClass = "text-zinc-500";

    if (isWeight) {
      if (goal === 'lose_weight') {
        colorClass = isUp ? "text-red-500" : "text-green-500";
      } else if (goal === 'gain_muscle') {
        colorClass = isUp ? "text-green-500" : "text-red-500";
      } else {
        colorClass = isUp ? "text-orange-500" : "text-blue-500";
      }
    } else {
      // For macros, just show trend without strict good/bad colors, or use neutral colors
      colorClass = isUp ? "text-orange-500" : "text-blue-500";
    }

    return isUp ? 
      <TrendingUp className={`w-4 h-4 inline ml-1 ${colorClass}`} /> : 
      <TrendingDown className={`w-4 h-4 inline ml-1 ${colorClass}`} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t('welcome_back').replace('{{name}}', profile?.displayName || user?.email?.split('@')[0])}</h2>
          <p className="text-zinc-500">{t('gamification_message')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 md:col-span-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-orange-100 text-sm font-medium uppercase tracking-wider">{t('level')} {profile?.level || 1}</p>
                <h3 className="text-3xl font-bold">{profile?.xp || 0} / {(profile?.level || 1) * 100} {t('xp')}</h3>
              </div>
              <Target className="w-12 h-12 opacity-50" />
            </div>
            <Progress value={xpProgress} className="h-2 bg-black/20" />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Activity className="w-5 h-5" /> 
              {i18n.language === 'ar' ? 'متوسط آخر 7 أيام' : '7-Day Averages'}
            </CardTitle>
            <div className="w-40">
              <Select value={goal} onValueChange={handleGoalChange}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={i18n.language === 'ar' ? 'الهدف' : 'Goal'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">{i18n.language === 'ar' ? 'خسارة الوزن' : 'Lose Weight'}</SelectItem>
                  <SelectItem value="gain_muscle">{i18n.language === 'ar' ? 'زيادة العضلات' : 'Gain Muscle'}</SelectItem>
                  <SelectItem value="maintain">{i18n.language === 'ar' ? 'المحافظة' : 'Maintain'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">{t('weight')}</p>
                <p className="text-2xl font-bold flex items-center justify-center">
                  {averages.weight.toFixed(1)}
                  {renderTrendArrow(averages.weight, prevAverages.weight, true)}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">{t('carbs')}</p>
                <p className="text-2xl font-bold flex items-center justify-center">
                  {averages.carbs.toFixed(0)}
                  {renderTrendArrow(averages.carbs, prevAverages.carbs)}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">{t('protein')}</p>
                <p className="text-2xl font-bold flex items-center justify-center">
                  {averages.protein.toFixed(0)}
                  {renderTrendArrow(averages.protein, prevAverages.protein)}
                </p>
              </div>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
                <p className="text-sm text-zinc-500 mb-1">{t('fats')}</p>
                <p className="text-2xl font-bold flex items-center justify-center">
                  {averages.fats.toFixed(0)}
                  {renderTrendArrow(averages.fats, prevAverages.fats)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-orange-600"/> {t('weight')} vs {t('carbs')}</CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <div className="h-[300px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={logs} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickMargin={10} />
                    <YAxis yAxisId="left" stroke="#ea580c" fontSize={12} domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="weight" name={t('weight')} stroke="#ea580c" strokeWidth={3} dot={{ r: 4, fill: '#ea580c' }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="carbs" name={t('carbs')} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-zinc-400 border-2 border-dashed rounded-xl">
                {t('no_data')}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              {t('exercise_progress')}
            </CardTitle>
            {workoutLogs.length > 0 && (
              <select 
                className="p-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {Array.from(new Set(workoutLogs.map(d => d.exerciseName))).map(ex => (
                  <option key={ex as string} value={ex as string}>{ex as string}</option>
                ))}
              </select>
            )}
          </CardHeader>
          <CardContent>
            {workoutLogs.length > 0 ? (
              <div className="h-[300px] w-full mt-4" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={exerciseChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#ea580c" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="avgWeight" name={t('avg_weight')} stroke="#ea580c" strokeWidth={3} dot={{ r: 4, fill: '#ea580c' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <Dumbbell className="w-12 h-12 mb-4 opacity-20" />
                <p>{i18n.language === 'ar' ? 'قم بتسجيل تمارينك لرؤية تقدمك هنا' : 'Log your workouts to see progress here'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
