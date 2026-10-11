import { Suspense } from 'react';
import EmotionQuiz from '@/app/components/EmotionQuiz';

export default function QuizPage() {
    return (
        <Suspense>
            <EmotionQuiz basePath="/trial/emotion" />
        </Suspense>
    );
}
