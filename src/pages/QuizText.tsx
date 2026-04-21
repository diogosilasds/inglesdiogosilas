import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TEXTS } from "@/data/texts";
import { generateForText } from "@/features/quiz/engine/quizGenerator";
import { QuizRunner } from "@/features/quiz/QuizRunner";

export default function QuizText() {
  const { id } = useParams();
  const navigate = useNavigate();
  const text = TEXTS.find((t) => String(t.id) === String(id));

  const questions = useMemo(() => {
    if (!text) return [];
    return generateForText(text);
  }, [text]);

  if (!text) {
    return <div className="p-6">Texto não encontrado.</div>;
  }

  const idx = TEXTS.findIndex((t) => t.id === text.id);
  const next = TEXTS[idx + 1]?.id;

  return (
    <QuizRunner
      questions={questions}
      textId={text.id}
      nextTextId={next}
      onExit={() => navigate(`/texto/${text.id}`)}
    />
  );
}
