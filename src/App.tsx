import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, createUserProfile } from './lib/firebase-utils';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Globe, Dumbbell, LayoutDashboard, Activity, Play } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import Exercises from './components/Exercises';
import Workout from './components/Workout';

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let userProfile = await getUserProfile(currentUser.uid, auth);
        if (!userProfile) {
          await createUserProfile(currentUser, auth);
          userProfile = await getUserProfile(currentUser.uid, auth);
        }
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      <nav className="border-b bg-white dark:bg-zinc-900 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 text-orange-600">
            <Activity className="w-6 h-6" />
            {t('app_title')}
          </Link>
          {user && (
            <div className="hidden md:flex gap-4">
              <Link to="/" className="hover:text-orange-600 flex items-center gap-1"><LayoutDashboard className="w-4 h-4"/> {t('dashboard')}</Link>
              <Link to="/workout" className="hover:text-orange-600 flex items-center gap-1"><Play className="w-4 h-4"/> {t('workout')}</Link>
              <Link to="/tracker" className="hover:text-orange-600 flex items-center gap-1"><Activity className="w-4 h-4"/> {t('tracker')}</Link>
              <Link to="/exercises" className="hover:text-orange-600 flex items-center gap-1"><Dumbbell className="w-4 h-4"/> {t('exercises')}</Link>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="w-5 h-5" />
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              {profile && (
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="font-bold text-orange-600">{t('level')} {profile.level}</span>
                  <span className="text-zinc-500">{profile.xp} {t('xp')}</span>
                </div>
              )}
              <Button variant="outline" onClick={handleLogout}>{t('logout')}</Button>
            </div>
          ) : (
            <Button onClick={handleLogin}>{t('login')}</Button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Activity className="w-24 h-24 text-orange-600 mb-6" />
            <h1 className="text-4xl font-bold mb-4">{t('app_title')}</h1>
            <p className="text-xl text-zinc-500 mb-8 max-w-md">
              {i18n.language === 'ar' ? 'تتبع تمارينك، سجل قياساتك، وارتقِ بمستواك في تجربة تفاعلية ممتعة.' : 'Track your workouts, log your measurements, and level up in a fun interactive experience.'}
            </p>
            <Button size="lg" onClick={handleLogin}>{t('login')}</Button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard user={user} profile={profile} />} />
            <Route path="/workout" element={<Workout user={user} />} />
            <Route path="/tracker" element={<Tracker user={user} onLogSaved={() => {
              // Refresh profile to update XP
              getUserProfile(user.uid, auth).then(setProfile);
            }} />} />
            <Route path="/exercises" element={<Exercises />} />
          </Routes>
        )}
      </main>

      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-zinc-900 flex justify-around p-3 z-50">
          <Link to="/" className="flex flex-col items-center text-xs hover:text-orange-600"><LayoutDashboard className="w-5 h-5 mb-1"/> {t('dashboard')}</Link>
          <Link to="/workout" className="flex flex-col items-center text-xs hover:text-orange-600"><Play className="w-5 h-5 mb-1"/> {t('workout')}</Link>
          <Link to="/tracker" className="flex flex-col items-center text-xs hover:text-orange-600"><Activity className="w-5 h-5 mb-1"/> {t('tracker')}</Link>
          <Link to="/exercises" className="flex flex-col items-center text-xs hover:text-orange-600"><Dumbbell className="w-5 h-5 mb-1"/> {t('exercises')}</Link>
        </div>
      )}
      <Toaster />
    </div>
  );
}
