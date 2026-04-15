import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveDailyLog, getDailyLog, deleteDailyLog } from '../lib/firebase-utils';
import { auth } from '../firebase';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function Tracker({ user, onLogSaved }: { user: any, onLogSaved: () => void }) {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [isExistingLog, setIsExistingLog] = useState(false);
  
  const defaultFormData = {
    weight: '',
    protein: '',
    carbs: '',
    fats: '',
    waist: '',
    waistBellyButton: '',
    rArm: '',
    lArm: '',
    rLeg: '',
    lLeg: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const log = await getDailyLog(user.uid, date, auth);
        if (log) {
          setIsExistingLog(true);
          const newFormData: any = { ...defaultFormData };
          Object.keys(defaultFormData).forEach(key => {
            if (log[key] !== undefined) {
              newFormData[key] = log[key].toString();
            }
          });
          setFormData(newFormData);
        } else {
          setIsExistingLog(false);
          setFormData(defaultFormData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [date, user.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!window.confirm(i18n.language === 'ar' ? 'هل أنت متأكد من حذف هذا السجل؟' : 'Are you sure you want to delete this log?')) return;
    
    setLoading(true);
    try {
      await deleteDailyLog(user.uid, date, auth);
      toast.success(i18n.language === 'ar' ? 'تم حذف السجل' : 'Log deleted');
      setIsExistingLog(false);
      setFormData(defaultFormData);
      onLogSaved();
    } catch (error) {
      toast.error(i18n.language === 'ar' ? 'حدث خطأ أثناء الحذف' : 'Error deleting log');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const logData: any = {
        uid: user.uid,
        date: date,
      };
      
      // Convert to numbers
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData] !== '') {
          logData[key] = Number(formData[key as keyof typeof formData]);
        }
      });

      await saveDailyLog(logData, auth);
      toast.success(t('log_saved'));
      setIsExistingLog(true);
      onLogSaved();
    } catch (error) {
      toast.error(t('error_saving'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('tracker')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>{t('date')}</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <Tabs defaultValue="macros" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="macros">{t('macros')}</TabsTrigger>
                <TabsTrigger value="measurements">{t('measurements')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="macros" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('weight')}</Label>
                    <Input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('protein')}</Label>
                    <Input type="number" name="protein" value={formData.protein} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('carbs')}</Label>
                    <Input type="number" name="carbs" value={formData.carbs} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('fats')}</Label>
                    <Input type="number" name="fats" value={formData.fats} onChange={handleChange} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="measurements" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('waist')}</Label>
                    <Input type="number" step="0.1" name="waist" value={formData.waist} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('waist_belly_button')}</Label>
                    <Input type="number" step="0.1" name="waistBellyButton" value={formData.waistBellyButton} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('r_arm')}</Label>
                    <Input type="number" step="0.1" name="rArm" value={formData.rArm} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('l_arm')}</Label>
                    <Input type="number" step="0.1" name="lArm" value={formData.lArm} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('r_leg')}</Label>
                    <Input type="number" step="0.1" name="rLeg" value={formData.rLeg} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('l_leg')}</Label>
                    <Input type="number" step="0.1" name="lLeg" value={formData.lLeg} onChange={handleChange} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? '...' : (isExistingLog ? (i18n.language === 'ar' ? 'تحديث السجل' : 'Update Log') : t('save'))}
              </Button>
              {isExistingLog && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {i18n.language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
