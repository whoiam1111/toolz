import { Suspense } from 'react';
import EmotionQuiz from '@/app/components/EmotionQuiz';

export default function BookQuizPage() {
    return (
        <Suspense>
            <EmotionQuiz basePath="/trial/emotion/book" />
        </Suspense>
    );
}
