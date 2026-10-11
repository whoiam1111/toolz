import DrawingResult from '@/app/components/DrawingResult';

export default function LifeGraphResultsPage() {
    return (
        <DrawingResult table="lifegraphs" bucket="lifegraph" title="인생그래프 검사 결과" aspectClass="aspect-[1.414/1]" />
    );
}
