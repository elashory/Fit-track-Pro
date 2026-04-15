import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { exercises } from '../data/exercises';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Play, Box, Info, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import '@google/model-viewer';

const ModelViewerWrapper = ({ src, alt }: { src: string, alt: string }) => {
  const [modelExists, setModelExists] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(src, { method: 'HEAD' })
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (!res.ok || (contentType && contentType.includes('text/html'))) {
          setModelExists(false);
        } else {
          setModelExists(true);
        }
      })
      .catch(() => setModelExists(false));
  }, [src]);

  if (modelExists === null) {
    return <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 animate-pulse">Loading...</div>;
  }

  if (!modelExists) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-6 text-center bg-zinc-100 dark:bg-zinc-900 z-0">
        <Box className="w-12 h-12 mb-2 opacity-50" />
        <p className="font-medium">3D Model Not Found</p>
        <p className="text-sm mt-1">Please upload <b>{src}</b> to the public folder.</p>
        <p className="text-xs mt-2 text-zinc-400" dir="rtl">يرجى رفع ملف الـ 3D المتحرك الخاص بالتمرين في المجلد المحدد.</p>
      </div>
    );
  }

  return (
    /* @ts-ignore */
    <model-viewer 
      src={src} 
      alt={alt} 
      auto-rotate 
      camera-controls 
      autoplay
      animation-name="*"
      style={{ width: '100%', height: '100%', zIndex: 10 }}
      shadow-intensity="1"
    ></model-viewer>
  );
};

export default function Exercises() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredExercises = exercises.filter(ex => 
    ex.nameEn.toLowerCase().includes(search.toLowerCase()) || 
    ex.nameAr.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t('exercise_library')}</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder={t('search_exercises')} 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(exercise => (
          <div key={exercise.id}>
            <Dialog>
              <DialogTrigger render={<Card className="cursor-pointer hover:border-orange-500 transition-colors group" />} nativeButton={false}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-orange-600 transition-colors">
                      {i18n.language === 'ar' ? exercise.nameAr : exercise.nameEn}
                    </h3>
                    <p className="text-sm text-zinc-500">{exercise.category}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                </CardContent>
              </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {i18n.language === 'ar' ? exercise.nameAr : exercise.nameEn}
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="video" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="video" className="flex items-center gap-2"><Play className="w-4 h-4"/> {t('video_demo')}</TabsTrigger>
                  <TabsTrigger value="3d" className="flex items-center gap-2"><Box className="w-4 h-4"/> {t('3d_model')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="video" className="mt-4">
                  <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={exercise.videoUrl} 
                      title={exercise.nameEn} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </TabsContent>
                
                <TabsContent value="3d" className="mt-4">
                  <div className="aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative">
                    <ModelViewerWrapper src={exercise.model3dUrl} alt={exercise.nameEn} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5 text-orange-600" />
                    {t('instructions')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {i18n.language === 'ar' ? exercise.instructionsAr : exercise.instructionsEn}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    {t('tips')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-300">
                    {(i18n.language === 'ar' ? exercise.tipsAr : exercise.tipsEn).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">{t('sources')}</h4>
                  <ul className="space-y-2">
                    {exercise.sources.map((source, idx) => (
                      <li key={idx}>
                        <a href={source} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline flex items-center gap-1 text-sm">
                          <ExternalLink className="w-3 h-3" />
                          {new URL(source).hostname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
